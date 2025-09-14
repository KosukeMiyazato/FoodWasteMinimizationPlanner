import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Key, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SetPasswordFormProps {
  token: string;
  onComplete: () => void;
}

const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ token, onComplete }) => {
  const { setPassword } = useAuth();
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // パスワード強度チェック
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(check => check);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setMessage({ type: 'error', text: 'パスワードが要件を満たしていません' });
      return;
    }

    if (!passwordsMatch) {
      setMessage({ type: 'error', text: 'パスワードが一致しません' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await setPassword(token, password);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'パスワード設定に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">パスワード設定</h2>
        <p className="text-gray-600 mt-2">アカウントのパスワードを設定してください</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新しいパスワード
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="パスワードを入力"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            パスワード確認
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="パスワードを再入力"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* パスワード要件 */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-medium text-gray-700 mb-3">パスワード要件</h4>
          <div className="space-y-2 text-sm">
            <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-500'}`}>
              {passwordChecks.length ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              8文字以上
            </div>
            <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
              {passwordChecks.uppercase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              大文字を含む
            </div>
            <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
              {passwordChecks.lowercase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              小文字を含む
            </div>
            <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-gray-500'}`}>
              {passwordChecks.number ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              数字を含む
            </div>
            <div className={`flex items-center gap-2 ${passwordChecks.special ? 'text-green-600' : 'text-gray-500'}`}>
              {passwordChecks.special ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              特殊文字を含む
            </div>
            <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
              {passwordsMatch ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              パスワードが一致
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isPasswordValid || !passwordsMatch}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Key className="w-5 h-5" />
              パスワードを設定
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SetPasswordForm;