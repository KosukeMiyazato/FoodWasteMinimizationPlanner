import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { ChefHat, Plus, Trash2, Calendar, AlertTriangle, TrendingDown, Target, Settings, ShoppingCart } from 'lucide-react';
import InventoryManager from './components/InventoryManager';
import RecipeDatabase from './components/RecipeDatabase';
import OptimizationEngine from './components/OptimizationEngine';
import MealPlan from './components/MealPlan';
import Header from './components/Header';
import AuthModal from './components/auth/AuthModal';
import SetPasswordPage from './components/auth/SetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { InventoryItem, Recipe, OptimizationResult } from './types';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';

function MainApp() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'inventory' | 'recipes' | 'optimize' | 'plan'>('inventory');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Eggs', quantity: 10, unit: 'pieces', daysLeft: 1, category: 'dairy' },
    { id: '2', name: 'Chicken Breast', quantity: 600, unit: 'g', daysLeft: 2, category: 'meat' },
    { id: '3', name: 'Carrots', quantity: 4, unit: 'pieces', daysLeft: 5, category: 'vegetables' },
    { id: '4', name: 'Milk', quantity: 800, unit: 'ml', daysLeft: 1, category: 'dairy' },
    { id: '5', name: 'Rice', quantity: 1000, unit: 'g', daysLeft: 30, category: 'grains' },
  ]);

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Classic Omelette',
      servings: 1,
      prepTime: 10,
      ingredients: [
        { name: 'Eggs', quantity: 2, unit: 'pieces' },
        { name: 'Milk', quantity: 100, unit: 'ml' },
      ],
      category: 'breakfast',
      nutrition: { calories: 220, protein: 14, carbs: 2, fat: 18 }
    },
    {
      id: '2',
      name: 'Chicken Sauté',
      servings: 1,
      prepTime: 20,
      ingredients: [
        { name: 'Chicken Breast', quantity: 200, unit: 'g' },
        { name: 'Carrots', quantity: 1, unit: 'pieces' },
      ],
      category: 'main',
      nutrition: { calories: 280, protein: 35, carbs: 8, fat: 12 }
    },
    {
      id: '3',
      name: 'Carrot Soup',
      servings: 1,
      prepTime: 30,
      ingredients: [
        { name: 'Carrots', quantity: 2, unit: 'pieces' },
        { name: 'Milk', quantity: 200, unit: 'ml' },
      ],
      category: 'soup',
      nutrition: { calories: 150, protein: 6, carbs: 20, fat: 6 }
    },
    {
      id: '4',
      name: 'Chicken Rice Bowl',
      servings: 1,
      prepTime: 25,
      ingredients: [
        { name: 'Chicken Breast', quantity: 150, unit: 'g' },
        { name: 'Rice', quantity: 100, unit: 'g' },
        { name: 'Carrots', quantity: 1, unit: 'pieces' },
      ],
      category: 'main',
      nutrition: { calories: 420, protein: 30, carbs: 45, fat: 8 }
    }
  ]);

  const [constraints, setConstraints] = useState({
    minTotalServings: 6,
    maxDistinctDishes: 3,
    targetCalories: 2000,
    minProtein: 60,
  });

  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  // URL パラメータから認証モードを取得
  useEffect(() => {
    const authParam = searchParams.get('auth');
    if (authParam === 'login' || authParam === 'register') {
      setAuthMode(authParam);
      setShowAuthModal(true);
      // URLパラメータをクリア
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // 認証状態が変わったらモーダルを閉じる
  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthModal(false);
    }
  }, [isAuthenticated]);

  const tabs = [
    { id: 'inventory', label: t('nav.inventory'), icon: ShoppingCart },
    { id: 'recipes', label: t('nav.recipes'), icon: ChefHat },
    { id: 'optimize', label: t('nav.optimize'), icon: Target },
    { id: 'plan', label: t('nav.mealPlan'), icon: Calendar },
  ] as const;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-green-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-3 rounded-xl font-medium transition-all duration-300 text-center min-h-[60px] ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-base leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'inventory' && (
            <InventoryManager 
              inventory={inventory} 
              setInventory={setInventory} 
            />
          )}
          
          {activeTab === 'recipes' && (
            <RecipeDatabase 
              recipes={recipes} 
              setRecipes={setRecipes} 
              inventory={inventory}
            />
          )}
          
          {activeTab === 'optimize' && (
            <OptimizationEngine 
              inventory={inventory}
              recipes={recipes}
              constraints={constraints}
              setConstraints={setConstraints}
              setOptimizationResult={setOptimizationResult}
              onOptimize={() => setActiveTab('plan')}
            />
          )}
          
          {activeTab === 'plan' && (
            <MealPlan 
              optimizationResult={optimizationResult}
              inventory={inventory}
              recipes={recipes}
            />
          )}
        </div>
      </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/setup-password" element={<SetPasswordPage />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;