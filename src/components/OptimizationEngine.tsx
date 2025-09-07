import React, { useState } from 'react';
import { Target, Settings, Zap, TrendingDown, Activity, Utensils, Info, Calculator } from 'lucide-react';
import { InventoryItem, Recipe, OptimizationResult } from '../types';
import { FoodWasteOptimizer, OptimizationExplainer } from '../utils/optimization';
import { useLanguage } from '../contexts/LanguageContext';
import MathematicalModelDetails from './MathematicalModelDetails';

interface OptimizationEngineProps {
  inventory: InventoryItem[];
  recipes: Recipe[];
  constraints: {
    minTotalServings: number;
    maxDistinctDishes: number;
    targetCalories: number;
    minProtein: number;
  };
  setConstraints: React.Dispatch<React.SetStateAction<{
    minTotalServings: number;
    maxDistinctDishes: number;
    targetCalories: number;
    minProtein: number;
  }>>;
  setOptimizationResult: React.Dispatch<React.SetStateAction<OptimizationResult | null>>;
  onOptimize: () => void;
}

const OptimizationEngine: React.FC<OptimizationEngineProps> = ({
  inventory,
  recipes,
  constraints,
  setConstraints,
  setOptimizationResult,
  onOptimize
}) => {
  const { t } = useLanguage();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);

  const calculateWasteWeight = (daysLeft: number): number => {
    return 1 + 4 / Math.max(daysLeft, 1);
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use advanced mathematical optimization
    const optimizer = new FoodWasteOptimizer(inventory, recipes, constraints);
    const result = optimizer.optimize();

    setOptimizationResult(result);
    setIsOptimizing(false);
    onOptimize();
  };

  const urgentItems = inventory.filter(item => item.daysLeft <= 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('optimize.title')}</h2>
            <p className="text-gray-600">{t('optimize.subtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            {urgentItems.length > 0 && (
              <div className="bg-red-100 px-4 py-2 rounded-xl">
                <span className="text-red-700 font-medium">{urgentItems.length} {t('optimize.urgentItems')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Constraints Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">{t('optimize.constraints')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('optimize.minServings')}
                  </label>
                  <input
                    type="number"
                    value={constraints.minTotalServings || ''}
                    onChange={(e) => setConstraints(prev => ({ ...prev, minTotalServings: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('optimize.minServingsDesc')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('optimize.maxDishes')}
                  </label>
                  <input
                    type="number"
                    value={constraints.maxDistinctDishes || ''}
                    onChange={(e) => setConstraints(prev => ({ ...prev, maxDistinctDishes: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('optimize.maxDishesDesc')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('optimize.targetCalories')}
                  </label>
                  <input
                    type="number"
                    value={constraints.targetCalories || ''}
                    onChange={(e) => setConstraints(prev => ({ ...prev, targetCalories: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('optimize.targetCaloriesDesc')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('optimize.minProtein')}
                  </label>
                  <input
                    type="number"
                    value={constraints.minProtein || ''}
                    onChange={(e) => setConstraints(prev => ({ ...prev, minProtein: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('optimize.minProteinDesc')}</p>
                </div>
              </div>
            </div>

            {/* Optimization Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={runOptimization}
                disabled={isOptimizing || inventory.length === 0 || recipes.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    {t('optimize.optimizing')}
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    {t('optimize.runOptimization')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-gray-800">{t('optimize.inventoryStatus')}</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('optimize.totalItems')}</span>
                <span className="font-semibold">{inventory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('optimize.urgentItems')}</span>
                <span className="font-semibold text-red-600">{urgentItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('optimize.availableRecipes')}</span>
                <span className="font-semibold">{recipes.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-gray-800">{t('optimize.goals')}</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span>{t('optimize.minimizeWaste')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-blue-500" />
                <span>{t('optimize.prioritizeUrgent')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span>{t('optimize.meetNutrition')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mathematical Model Details */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <button
            onClick={() => setShowMathDetails(!showMathDetails)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <Calculator className="w-5 h-5" />
            {showMathDetails ? t('optimize.hideMathModel') : t('optimize.showMathModel')}
          </button>
          
        <MathematicalModelDetails isVisible={showMathDetails} />
      </div>
    </div>
  );
};

export default OptimizationEngine;