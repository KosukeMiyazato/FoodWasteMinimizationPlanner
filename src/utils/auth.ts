import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { User, AuthToken } from '../types/auth';
import {
  createUser,
  getUserByEmail,
  getUserById,
  createToken,
  getToken,
  setPasswordWithToken,
  updateLastLogin,
  invalidateOldTokens,
} from './dynamodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const HMAC_SECRET = process.env.HMAC_SECRET || 'your-hmac-secret';
const TOKEN_EXPIRY_HOURS = 24;

// メール送信設定
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// パスワードハッシュ化
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// パスワード検証
export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT トークン生成
export function generateJWT(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// JWT トークン検証
export function verifyJWT(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// 認証トークン生成
export function generateAuthToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// トークンハッシュ化
export function hashToken(token: string): string {
  return crypto.createHmac('sha256', HMAC_SECRET).update(token).digest('hex');
}

// ユーザー登録
export async function registerUser(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // 既存ユーザーチェック
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'このメールアドレスは既に登録されています' };
    }

    const userId = uuidv4();
    
    // ユーザー作成
    await createUser({
      id: userId,
      email,
      isActive: true,
    });

    // 初期設定トークン生成
    const token = generateAuthToken();
    const tokenHash = hashToken(token);
    const tokenId = uuidv4();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    await createToken({
      id: tokenId,
      userId,
      tokenHash,
      purpose: 'initial_setup',
      expiresAt,
    });

    // メール送信
    await sendInitialSetupEmail(email, token, tokenId, userId);

    return { success: true, message: '登録完了メールを送信しました。メールをご確認ください。' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: '登録に失敗しました。しばらく後でお試しください。' };
  }
}

// パスワード設定
export async function setPassword(tokenString: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    // トークンをパース
    const [userId, tokenId, token] = tokenString.split('.');
    if (!userId || !tokenId || !token) {
      return { success: false, message: '無効または期限切れのリンクです' };
    }

    // トークン検証
    const tokenHash = hashToken(token);
    const storedToken = await getToken(userId, tokenId);
    
    if (!storedToken || 
        storedToken.tokenHash !== tokenHash || 
        storedToken.usedAt || 
        new Date(storedToken.expiresAt) < new Date()) {
      return { success: false, message: '無効または期限切れのリンクです' };
    }

    // パスワードハッシュ化
    const passwordHash = await hashPassword(password);

    // 原子的更新
    const success = await setPasswordWithToken(userId, tokenId, passwordHash);
    
    if (!success) {
      return { success: false, message: '無効または期限切れのリンクです' };
    }

    // 監査ログ
    logAuthEvent('password_set', userId);

    return { success: true, message: 'パスワードが設定されました。ログインしてください。' };
  } catch (error) {
    console.error('Set password error:', error);
    return { success: false, message: 'パスワード設定に失敗しました。しばらく後でお試しください。' };
  }
}

// ログイン
export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
  try {
    const userItem = await getUserByEmail(email);
    
    if (!userItem || !userItem.passwordHash) {
      logAuthEvent('login_failed', null, { email });
      return { success: false, message: 'メールアドレスまたはパスワードが正しくありません' };
    }

    const isValidPassword = await verifyPassword(password, userItem.passwordHash);
    
    if (!isValidPassword) {
      logAuthEvent('login_failed', userItem.PK.replace('USER#', ''), { email });
      return { success: false, message: 'メールアドレスまたはパスワードが正しくありません' };
    }

    if (!userItem.isActive) {
      return { success: false, message: 'アカウントが無効化されています' };
    }

    const userId = userItem.PK.replace('USER#', '');
    
    // ログイン時刻更新
    await updateLastLogin(userId);

    // JWT生成
    const token = generateJWT(userId);

    const user: User = {
      id: userId,
      email: userItem.email,
      isActive: userItem.isActive,
      createdAt: userItem.createdAt,
      lastLoginAt: new Date().toISOString(),
    };

    // 監査ログ
    logAuthEvent('login_success', userId);

    return { success: true, message: 'ログインしました', user, token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'ログインに失敗しました。しばらく後でお試しください。' };
  }
}

// 初期設定メール送信
async function sendInitialSetupEmail(email: string, token: string, tokenId: string, userId: string): Promise<void> {
  const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/setup-password?token=${userId}.${tokenId}.${token}`;
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@example.com',
    to: email,
    subject: 'アカウント初期設定のお知らせ',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>アカウント初期設定</h2>
        <p>食品廃棄最適化システムへのご登録ありがとうございます。</p>
        <p>以下のリンクをクリックして、パスワードを設定してください：</p>
        <p><a href="${setupUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">パスワードを設定する</a></p>
        <p><strong>重要事項：</strong></p>
        <ul>
          <li>このリンクは24時間有効です</li>
          <li>一度のみ使用可能です</li>
          <li>心当たりがない場合は、このメールを破棄してください</li>
        </ul>
        <p>ご不明な点がございましたら、サポートまでお問い合わせください。</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// 監査ログ
function logAuthEvent(event: string, userId: string | null, metadata?: any): void {
  const logEntry = {
    event,
    userId,
    timestamp: new Date().toISOString(),
    metadata,
  };
  
  // 実際の実装では、CloudWatch Logs や専用のログシステムに送信
  console.log('AUTH_EVENT:', JSON.stringify(logEntry));
}

// ユーザー情報取得
export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const decoded = verifyJWT(token);
    if (!decoded) return null;

    const userItem = await getUserById(decoded.userId);
    if (!userItem) return null;

    return {
      id: decoded.userId,
      email: userItem.email,
      isActive: userItem.isActive,
      createdAt: userItem.createdAt,
      lastLoginAt: userItem.lastLoginAt,
    };
  } catch {
    return null;
  }
}