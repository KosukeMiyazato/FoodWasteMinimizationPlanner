import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, AuthResponse } from '../types/auth';
import { loginUser, registerUser, setPassword, getCurrentUser } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ページ読み込み時にトークンから ユーザー情報を復元
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const currentUser = await getCurrentUser(token);
          if (currentUser) {
            setUser(currentUser);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const result = await loginUser(email, password);
      
      if (result.success && result.user && result.token) {
        setUser(result.user);
        localStorage.setItem('auth_token', result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'ログインに失敗しました' };
    }
  };

  const register = async (email: string): Promise<AuthResponse> => {
    try {
      return await registerUser(email);
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: '登録に失敗しました' };
    }
  };

  const setPasswordHandler = async (token: string, password: string): Promise<AuthResponse> => {
    try {
      return await setPassword(token, password);
    } catch (error) {
      console.error('Set password error:', error);
      return { success: false, message: 'パスワード設定に失敗しました' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    setPassword: setPasswordHandler,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};