import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, AuthResponse } from '../types/auth';
import { loginUser, registerUser, setPassword, getCurrentUser, logoutUser } from '../utils/mockAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ページ読み込み時にローカルストレージからユーザー情報を復元
    const initAuth = () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const result = await loginUser(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
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
    logoutUser();
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