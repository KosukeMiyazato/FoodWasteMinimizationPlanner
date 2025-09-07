import React from 'react';
import { Leaf, TrendingDown, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('app.title')}</h1>
              <p className="text-green-100 text-sm">{t('app.subtitle')}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-white/20 rounded-xl p-2">
              <Globe className="w-4 h-4 text-green-100" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  language === 'en' 
                    ? 'bg-white text-green-600' 
                    : 'text-green-100 hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ja')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  language === 'ja' 
                    ? 'bg-white text-green-600' 
                    : 'text-green-100 hover:bg-white/20'
                }`}
              >
                日本語
              </button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-2 text-green-100">
                <TrendingDown className="w-5 h-5" />
                <span className="text-2xl font-bold text-white">-40%</span>
              </div>
              <p className="text-green-100 text-sm">{t('header.wasteReduction')}</p>
            </div>
          </div>
          
          {/* Mobile Language Switcher */}
          <div className="md:hidden flex items-center gap-2 bg-white/20 rounded-xl p-2">
            <Globe className="w-4 h-4 text-green-100" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                language === 'en' 
                  ? 'bg-white text-green-600' 
                  : 'text-green-100 hover:bg-white/20'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ja')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                language === 'ja' 
                  ? 'bg-white text-green-600' 
                  : 'text-green-100 hover:bg-white/20'
              }`}
            >
              JP
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;