import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

// DynamoDB クライアントの初期化
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'AuthTable';

// DynamoDB アイテムの型定義
export interface UserItem {
  PK: string; // USER#<id>
  SK: string; // META
  email: string;
  passwordHash?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface TokenItem {
  PK: string; // USER#<id>
  SK: string; // TOKEN#<uuid>
  tokenHash: string;
  purpose: 'initial_setup' | 'password_reset';
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export interface EmailIndexItem {
  email: string;
  SK: string; // USER
  userId: string;
}

// ユーザー作成
export async function createUser(user: {
  id: string;
  email: string;
  passwordHash?: string;
  isActive: boolean;
}): Promise<void> {
  const userItem: UserItem = {
    PK: `USER#${user.id}`,
    SK: 'META',
    email: user.email,
    passwordHash: user.passwordHash,
    isActive: user.isActive,
    createdAt: new Date().toISOString(),
  };

  const emailIndexItem: EmailIndexItem = {
    email: user.email,
    SK: 'USER',
    userId: user.id,
  };

  await docClient.send(new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: TABLE_NAME,
          Item: userItem,
          ConditionExpression: 'attribute_not_exists(PK)',
        },
      },
      {
        Put: {
          TableName: TABLE_NAME,
          Item: emailIndexItem,
          ConditionExpression: 'attribute_not_exists(email)',
        },
      },
    ],
  }));
}

// メールアドレスでユーザー検索
export async function getUserByEmail(email: string): Promise<UserItem | null> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email AND SK = :sk',
    ExpressionAttributeValues: {
      ':email': email,
      ':sk': 'USER',
    },
  }));

  if (!result.Items || result.Items.length === 0) {
    return null;
  }

  const emailIndexItem = result.Items[0] as EmailIndexItem;
  
  // ユーザー詳細を取得
  const userResult = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${emailIndexItem.userId}`,
      SK: 'META',
    },
  }));

  return userResult.Item as UserItem || null;
}

// ユーザーIDでユーザー取得
export async function getUserById(userId: string): Promise<UserItem | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: 'META',
    },
  }));

  return result.Item as UserItem || null;
}

// トークン作成
export async function createToken(token: {
  id: string;
  userId: string;
  tokenHash: string;
  purpose: 'initial_setup' | 'password_reset';
  expiresAt: string;
}): Promise<void> {
  const tokenItem: TokenItem = {
    PK: `USER#${token.userId}`,
    SK: `TOKEN#${token.id}`,
    tokenHash: token.tokenHash,
    purpose: token.purpose,
    expiresAt: token.expiresAt,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: tokenItem,
  }));
}

// トークン取得
export async function getToken(userId: string, tokenId: string): Promise<TokenItem | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `TOKEN#${tokenId}`,
    },
  }));

  return result.Item as TokenItem || null;
}

// パスワード設定（原子的更新）
export async function setPasswordWithToken(
  userId: string,
  tokenId: string,
  passwordHash: string
): Promise<boolean> {
  const now = new Date().toISOString();

  try {
    await docClient.send(new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: TABLE_NAME,
            Key: {
              PK: `USER#${userId}`,
              SK: 'META',
            },
            UpdateExpression: 'SET passwordHash = :passwordHash',
            ExpressionAttributeValues: {
              ':passwordHash': passwordHash,
            },
          },
        },
        {
          Update: {
            TableName: TABLE_NAME,
            Key: {
              PK: `USER#${userId}`,
              SK: `TOKEN#${tokenId}`,
            },
            UpdateExpression: 'SET usedAt = :usedAt',
            ConditionExpression: 'attribute_not_exists(usedAt) AND expiresAt > :now',
            ExpressionAttributeValues: {
              ':usedAt': now,
              ':now': now,
            },
          },
        },
      ],
    }));
    return true;
  } catch (error) {
    console.error('Failed to set password:', error);
    return false;
  }
}

// ログイン時刻更新
export async function updateLastLogin(userId: string): Promise<void> {
  await docClient.send(new TransactWriteCommand({
    TransactItems: [
      {
        Update: {
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: 'META',
          },
          UpdateExpression: 'SET lastLoginAt = :lastLoginAt',
          ExpressionAttributeValues: {
            ':lastLoginAt': new Date().toISOString(),
          },
        },
      },
    ],
  }));
}

// 古いトークンを無効化
export async function invalidateOldTokens(userId: string, purpose: string): Promise<void> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    FilterExpression: 'purpose = :purpose AND attribute_not_exists(usedAt)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'TOKEN#',
      ':purpose': purpose,
    },
  }));

  if (result.Items && result.Items.length > 0) {
    const transactItems = result.Items.map(item => ({
      Update: {
        TableName: TABLE_NAME,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        UpdateExpression: 'SET usedAt = :usedAt',
        ExpressionAttributeValues: {
          ':usedAt': new Date().toISOString(),
        },
      },
    }));

    // DynamoDBのTransactWriteは最大25アイテムまで
    for (let i = 0; i < transactItems.length; i += 25) {
      const batch = transactItems.slice(i, i + 25);
      await docClient.send(new TransactWriteCommand({
        TransactItems: batch,
      }));
    }
  }
}