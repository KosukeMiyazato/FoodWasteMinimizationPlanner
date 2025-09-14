import { User, AuthResponse } from '../types/auth';

// ローカルストレージのキー
const USERS_KEY = 'food_waste_users';
const CURRENT_USER_KEY = 'food_waste_current_user';
const PENDING_TOKENS_KEY = 'food_waste_pending_tokens';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface PendingToken {
  token: string;
  email: string;
  expiresAt: string;
}

// ユーザーデータの取得
function getUsers(): StoredUser[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// ユーザーデータの保存
function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 保留中のトークンの取得
function getPendingTokens(): PendingToken[] {
  const tokens = localStorage.getItem(PENDING_TOKENS_KEY);
  return tokens ? JSON.parse(tokens) : [];
}

// 保留中のトークンの保存
function savePendingTokens(tokens: PendingToken[]): void {
  localStorage.setItem(PENDING_TOKENS_KEY, JSON.stringify(tokens));
}

// 簡単なID生成
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// 簡単なトークン生成
function generateToken(): string {
  return Math.random().toString(36).substr(2, 32);
}

// メール送信のモック（コンソールに出力）
function mockSendEmail(email: string, token: string): void {
  const setupUrl = `${window.location.origin}/auth/setup-password?token=${token}`;
  
  console.log('='.repeat(60));
  console.log('📧 モック認証メール');
  console.log('='.repeat(60));
  console.log(`宛先: ${email}`);
  console.log(`件名: アカウント初期設定のお知らせ`);
  console.log('');
  console.log('食品廃棄最適化システムへのご登録ありがとうございます。');
  console.log('以下のリンクをクリックして、パスワードを設定してください：');
  console.log('');
  console.log(`🔗 パスワード設定リンク:`);
  console.log(setupUrl);
  console.log('');
  console.log('※ このリンクは24時間有効です');
  console.log('※ 一度のみ使用可能です');
  console.log('='.repeat(60));
  
  // ユーザーに分かりやすくするためのアラート
  alert(`認証メールをコンソールに出力しました。\n\nブラウザの開発者ツール（F12）のコンソールタブを確認して、パスワード設定リンクをクリックしてください。\n\n宛先: ${email}`);
}

// ユーザー登録
export async function registerUser(email: string): Promise<AuthResponse> {
  // 入力検証
  if (!email || !email.includes('@')) {
    return { success: false, message: '有効なメールアドレスを入力してください' };
  }

  const users = getUsers();
  
  // 既存ユーザーチェック
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return { success: false, message: 'このメールアドレスは既に登録されています' };
  }

  // トークン生成
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24時間後

  // 保留中のトークンに追加
  const pendingTokens = getPendingTokens();
  // 同じメールアドレスの古いトークンを削除
  const filteredTokens = pendingTokens.filter(t => t.email !== email);
  filteredTokens.push({ token, email, expiresAt });
  savePendingTokens(filteredTokens);

  // モックメール送信
  mockSendEmail(email, token);

  return { 
    success: true, 
    message: '登録完了メールを送信しました。ブラウザのコンソール（F12）を確認してパスワード設定リンクをクリックしてください。' 
  };
}

// パスワード設定
export async function setPassword(token: string, password: string): Promise<AuthResponse> {
  // 入力検証
  if (!token || !password) {
    return { success: false, message: 'トークンとパスワードが必要です' };
  }

  if (password.length < 6) {
    return { success: false, message: 'パスワードは6文字以上で入力してください' };
  }

  const pendingTokens = getPendingTokens();
  const tokenData = pendingTokens.find(t => t.token === token);

  if (!tokenData) {
    return { success: false, message: '無効または期限切れのリンクです' };
  }

  // 有効期限チェック
  if (new Date(tokenData.expiresAt) < new Date()) {
    return { success: false, message: '無効または期限切れのリンクです' };
  }

  const users = getUsers();
  const userId = generateId();
  const now = new Date().toISOString();

  // 新しいユーザーを作成
  const newUser: StoredUser = {
    id: userId,
    email: tokenData.email,
    password: password, // 実際のアプリではハッシュ化が必要
    createdAt: now,
  };

  users.push(newUser);
  saveUsers(users);

  // 使用済みトークンを削除
  const remainingTokens = pendingTokens.filter(t => t.token !== token);
  savePendingTokens(remainingTokens);

  return { success: true, message: 'パスワードが設定されました。ログインしてください。' };
}

// ログイン
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  // 入力検証
  if (!email || !password) {
    return { success: false, message: 'メールアドレスとパスワードを入力してください' };
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'メールアドレスまたはパスワードが正しくありません' };
  }

  // ログイン時刻を更新
  user.lastLoginAt = new Date().toISOString();
  saveUsers(users);

  // 現在のユーザーとして保存
  const currentUser: User = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  return { 
    success: true, 
    message: 'ログインしました', 
    user: currentUser 
  };
}

// 現在のユーザー取得
export function getCurrentUser(): User | null {
  const userData = localStorage.getItem(CURRENT_USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

// ログアウト
export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// トークン検証（パスワード設定ページ用）
export function validateToken(token: string): boolean {
  const pendingTokens = getPendingTokens();
  const tokenData = pendingTokens.find(t => t.token === token);
  
  if (!tokenData) return false;
  
  // 有効期限チェック
  return new Date(tokenData.expiresAt) >= new Date();
}