import React from 'react';
import { Calendar, TrendingDown, Activity, ChefHat, AlertTriangle, CheckCircle, Utensils } from 'lucide-react';
import { OptimizationResult, InventoryItem, Recipe } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MealPlanProps {
  optimizationResult: OptimizationResult | null;
  inventory: InventoryItem[];
  recipes: Recipe[];
}

const MealPlan: React.FC<MealPlanProps> = ({ optimizationResult, inventory, recipes }) => {
  const { t } = useLanguage();

  if (!optimizationResult) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('mealPlan.noMealPlan')}</h3>
        <p className="text-gray-500">{t('mealPlan.noMealPlanDesc')}</p>
      </div>
    );
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600 bg-green-100';
    if (efficiency >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('mealPlan.title')}</h2>
            <p className="text-gray-600">{t('mealPlan.subtitle')}</p>
          </div>
          <div className={`px-4 py-2 rounded-xl font-bold ${getEfficiencyColor(optimizationResult.efficiency)}`}>
            {optimizationResult.efficiency}% {t('mealPlan.efficiency')}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-green-800 font-bold text-2xl">{optimizationResult.totalWasteScore.toFixed(1)}</p>
                <p className="text-green-600 text-sm">{t('mealPlan.wasteScore')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <Utensils className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-blue-800 font-bold text-2xl">{optimizationResult.mealPlan.reduce((sum, meal) => sum + meal.servings, 0)}</p>
                <p className="text-blue-600 text-sm">{t('mealPlan.totalServings')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-purple-800 font-bold text-2xl">{optimizationResult.mealPlan.length}</p>
                <p className="text-purple-600 text-sm">{t('mealPlan.distinctDishes')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-orange-800 font-bold text-2xl">{optimizationResult.nutritionSummary.calories}</p>
                <p className="text-orange-600 text-sm">{t('mealPlan.totalCalories')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Plan */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-green-600" />
            {t('mealPlan.recommendedMeals')}
          </h3>
          
          <div className="space-y-4">
            {optimizationResult.mealPlan.map((meal, index) => {
              const recipe = recipes.find(r => r.id === meal.recipeId);
              if (!recipe) return null;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{recipe.name}</h4>
                      <p className="text-gray-600 capitalize">{t(`recipeCategory.${recipe.category}`)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-green-600">{meal.servings}</p>
                      <p className="text-gray-500 text-sm">{t('recipes.servings')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                    <div className="text-center bg-white rounded-lg p-2">
                      <div className="font-semibold">{recipe.nutrition.calories * meal.servings}</div>
                      <div className="text-gray-500">{t('recipes.cal')}</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2">
                      <div className="font-semibold">{recipe.nutrition.protein * meal.servings}g</div>
                      <div className="text-gray-500">{t('recipes.protein_short')}</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2">
                      <div className="font-semibold">{recipe.nutrition.carbs * meal.servings}g</div>
                      <div className="text-gray-500">{t('recipes.carbs_short')}</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2">
                      <div className="font-semibold">{recipe.nutrition.fat * meal.servings}g</div>
                      <div className="text-gray-500">{t('recipes.fat_short')}</div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('mealPlan.ingredientsNeeded')}</p>
                    <div className="space-y-1">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <div key={idx} className="text-sm flex justify-between text-gray-600">
                          <span>{ingredient.name}</span>
                          <span>{ingredient.quantity * meal.servings} {t(`unit.${ingredient.unit}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Waste Analysis */}
        <div className="space-y-6">
          {/* Nutrition Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              {t('mealPlan.nutritionSummary')}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-2xl text-gray-800">{optimizationResult.nutritionSummary.calories}</p>
                <p className="text-gray-600">{t('recipes.calories')}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-2xl text-gray-800">{optimizationResult.nutritionSummary.protein}g</p>
                <p className="text-gray-600">{t('recipes.protein_short')}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-2xl text-gray-800">{optimizationResult.nutritionSummary.carbs}g</p>
                <p className="text-gray-600">{t('recipes.carbs_short')}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-2xl text-gray-800">{optimizationResult.nutritionSummary.fat}g</p>
                <p className="text-gray-600">{t('recipes.fat_short')}</p>
              </div>
            </div>
          </div>

          {/* Waste Estimation */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <TrendingDown className="w-6 h-6 text-red-600" />
              {t('mealPlan.wasteEstimation')}
            </h3>
            
            <div className="space-y-3">
              {optimizationResult.wasteEstimate.map((waste, index) => {
                const item = inventory.find(i => i.id === waste.itemId);
                if (!item || waste.leftover === 0) return null;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-800">{item.name}</p>
                        <p className="text-red-600 text-sm">{item.daysLeft} {item.daysLeft === 1 ? t('inventory.day') : t('inventory.days')} left</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-700">{waste.leftover} {t(`unit.${item.unit}`)}</p>
                      <p className="text-red-600 text-sm">{t('mealPlan.leftover')}</p>
                    </div>
                  </div>
                );
              })}
              
              {optimizationResult.wasteEstimate.every(w => w.leftover === 0) && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{t('mealPlan.perfectUtilization')}</p>
                    <p className="text-green-600 text-sm">{t('mealPlan.allIngredientsUsed')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;