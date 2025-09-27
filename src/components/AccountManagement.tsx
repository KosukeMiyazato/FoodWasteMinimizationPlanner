import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Save, ArrowLeft, Shield, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AccountManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // パスワード強度チェック
  const passwordChecks = {
    length: passwordForm.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordForm.newPassword),
    lowercase: /[a-z]/.test(passwordForm.newPassword),
    number: /\d/.test(passwordForm.newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword),
  };

  const isPasswordValid = Object.values(passwordChecks).every(check => check);
  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword.length > 0;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword) {
      setMessage({ type: 'error', text: t('account.enterCurrentPasswordError') });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('account.newPasswordLengthError') });
      return;
    }

    if (!passwordsMatch) {
      setMessage({ type: 'error', text: t('account.passwordMismatchError') });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // モック実装：パスワード変更処理
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 実際の実装では、現在のパスワードの検証とパスワード更新を行う
      console.log('パスワード変更:', {
        userId: user?.id,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setMessage({ type: 'success', text: t('account.passwordChangeSuccess') });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      setMessage({ type: 'error', text: t('account.passwordChangeFailed') });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('account.userNotFound')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            {t('account.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{t('account.title')}</h1>
              <p className="text-green-100 text-sm">{t('account.subtitle')}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-green-100 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <User className="w-5 h-5" />
                {t('account.profile')}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Shield className="w-5 h-5" />
                {t('account.security')}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-xl mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{t('account.profileInfo')}</h2>
                  <p className="text-gray-600">{t('account.profileDesc')}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('account.userId')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('account.userIdDesc')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('account.accountCreated')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={new Date(user.createdAt).toLocaleDateString('ja-JP')}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('account.lastLogin')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={new Date(user.lastLoginAt).toLocaleString('ja-JP')}
                        disabled
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{t('account.securitySettings')}</h2>
                  <p className="text-gray-600">{t('account.securityDesc')}</p>
                </div>
              </div>

              {!isChangingPassword ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{t('account.password')}</h3>
                        <p className="text-gray-600 text-sm">{t('account.passwordLastChanged')}</p>
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-200"
                      >
                        {t('account.changePassword')}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3">{t('account.securityTips')}</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>{t('account.tip1')}</li>
                      <li>{t('account.tip2')}</li>
                      <li>{t('account.tip3')}</li>
                      <li>{t('account.tip4')}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('account.currentPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={t('account.enterCurrentPassword')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('account.newPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={t('account.enterNewPassword')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('account.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={t('account.reenterNewPassword')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* パスワード要件 */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-3">{t('account.passwordRequirements')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordChecks.length ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {t('account.minLength')}
                      </div>
                      <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordChecks.uppercase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {t('account.uppercase')}
                      </div>
                      <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordChecks.lowercase ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {t('account.lowercase')}
                      </div>
                      <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordChecks.number ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {t('account.number')}
                      </div>
                      <div className={`flex items-center gap-2 ${passwordChecks.special ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordChecks.special ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {t('account.special')}
                      </div>
                      <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordsMatch ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {t('account.passwordsMatch')}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading || !passwordForm.currentPassword || passwordForm.newPassword.length < 6 || !passwordsMatch}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {t('account.changePassword')}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setMessage(null);
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-400 transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;