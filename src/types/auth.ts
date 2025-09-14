export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthToken {
  id: string;
  userId: string;
  tokenHash: string;
  purpose: 'initial_setup' | 'password_reset';
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string) => Promise<AuthResponse>;
  setPassword: (token: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
}