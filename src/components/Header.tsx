import React from 'react';
<<<<<<< HEAD
import { Leaf, TrendingDown, Globe, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
=======
import { TrendingDown, Globe, LogOut, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import appIcon from '../assets/app-icon.png';
>>>>>>> 4915b166d5bfbcdb712ce609e189216ecc881c70

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <img 
                src={appIcon} 
                alt="Food Waste Minimization Planner" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('app.title')}</h1>
              <p className="text-green-100 text-sm">{t('app.subtitle')}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 hover:bg-white/30 transition-colors"
              >
                <Globe className="w-4 h-4 text-green-100" />
                <span className="text-sm font-medium text-white">
                  {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
                </span>
                <ChevronDown className={`w-4 h-4 text-green-100 transition-transform ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[140px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                        language === lang.code ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* User Menu */}
            {isAuthenticated && user && (
              <button
                onClick={() => navigate('/account')}
                className="bg-white/20 rounded-full p-3 hover:bg-white/30 transition-colors"
                title={t('account.title')}
              >
                <User className="w-6 h-6 text-white" />
              </button>
            )}
            
            <div className="text-center">
              <div className="flex items-center gap-2 text-green-100">
                <TrendingDown className="w-5 h-5" />
                <span className="text-2xl font-bold text-white">-40%</span>
              </div>
              <p className="text-green-100 text-sm">{t('header.wasteReduction')}</p>
            </div>
          </div>
          
          {/* Mobile Language Switcher */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/account')}
                className="bg-white/20 rounded-xl p-2 hover:bg-white/30 transition-colors"
                title={t('account.title')}
              >
                <User className="w-4 h-4 text-green-100" />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-1 bg-white/20 rounded-xl px-2 py-1.5 hover:bg-white/30 transition-colors"
              >
                <Globe className="w-4 h-4 text-green-100" />
                <span className="text-xs font-medium text-white">
                  {currentLanguage?.flag}
                </span>
                <ChevronDown className={`w-3 h-3 text-green-100 transition-transform ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[120px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                        language === lang.code ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;