import React, { useState } from 'react';
import { Plus, Clock, Users, ChefHat, Trash2, AlertCircle } from 'lucide-react';
import { Recipe, InventoryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface RecipeDatabaseProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  inventory: InventoryItem[];
}

const RecipeDatabase: React.FC<RecipeDatabaseProps> = ({ recipes, setRecipes, inventory }) => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id'>>({
    name: '',
    servings: 1,
    prepTime: 30,
    ingredients: [{ name: '', quantity: 0, unit: 'pieces' }],
    category: 'main',
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  });

  const checkIngredientAvailability = (recipe: Recipe) => {
    const availableIngredients = recipe.ingredients.filter(ingredient => {
      const inventoryItem = inventory.find(item => 
        item.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      return inventoryItem && inventoryItem.quantity >= ingredient.quantity;
    });
    
    return {
      available: availableIngredients.length,
      total: recipe.ingredients.length,
      canMake: availableIngredients.length === recipe.ingredients.length
    };
  };

  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 0, unit: 'pieces' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const addRecipe = () => {
    if (newRecipe.name.trim() && newRecipe.ingredients.some(ing => ing.name.trim())) {
      const recipe: Recipe = {
        ...newRecipe,
        id: Date.now().toString(),
        ingredients: newRecipe.ingredients.filter(ing => ing.name.trim())
      };
      setRecipes(prev => [...prev, recipe]);
      setNewRecipe({
        name: '',
        servings: 1,
        prepTime: 30,
        ingredients: [{ name: '', quantity: 0, unit: 'pieces' }],
        category: 'main',
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      });
      setShowAddForm(false);
    }
  };
  const getCategoryColor = (category: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      lunch: 'bg-blue-100 text-blue-800 border-blue-200',
      dinner: 'bg-purple-100 text-purple-800 border-purple-200',
      main: 'bg-green-100 text-green-800 border-green-200',
      soup: 'bg-orange-100 text-orange-800 border-orange-200',
      snack: 'bg-pink-100 text-pink-800 border-pink-200',
      dessert: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredRecipes = selectedCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  const categories = ['all', ...new Set(recipes.map(r => r.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('recipes.title')}</h2>
          <p className="text-gray-600 mb-4">{t('recipes.subtitle')}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 md:px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-200 text-sm md:text-base"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t('recipes.addRecipe')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </button>
          </div>
        </div>

        {/* Add Recipe Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t('recipes.addNewRecipe')}</h3>
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">{t('recipes.basicInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.recipeName')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('recipes.recipeName')}
                      value={newRecipe.name}
                      onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                      className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.servings')}
                    </label>
                    <input
                      type="number"
                      placeholder={t('recipes.servings')}
                      value={newRecipe.servings}
                      onChange={(e) => setNewRecipe({ ...newRecipe, servings: Number(e.target.value) })}
                      className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.prepTime')}
                    </label>
                    <input
                      type="number"
                      placeholder={t('recipes.prepTime')}
                      value={newRecipe.prepTime}
                      onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: Number(e.target.value) })}
                      className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inventory.category')}
                    </label>
                    <select
                      value={newRecipe.category}
                      onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value as any })}
                      className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    >
                      <option value="breakfast">{t('recipeCategory.breakfast')}</option>
                      <option value="lunch">{t('recipeCategory.lunch')}</option>
                      <option value="dinner">{t('recipeCategory.dinner')}</option>
                      <option value="main">{t('recipeCategory.main')}</option>
                      <option value="soup">{t('recipeCategory.soup')}</option>
                      <option value="snack">{t('recipeCategory.snack')}</option>
                      <option value="dessert">{t('recipeCategory.dessert')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">{t('recipes.ingredients')}</h4>
                  <button
                    onClick={addIngredient}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    {t('recipes.addIngredient')}
                  </button>
                </div>
                {/* Column Headers */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <div className="text-sm font-medium text-gray-600">{t('recipes.ingredientName')}</div>
                  <div className="text-sm font-medium text-gray-600">{t('inventory.quantity')}</div>
                  <div className="text-sm font-medium text-gray-600">{t('inventory.unit')}</div>
                  <div className="text-sm font-medium text-gray-600">{t('recipes.action')}</div>
                </div>
                <div className="space-y-2">
                  {newRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder={t('recipes.ingredientName')}
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      />
                      <input
                        type="number"
                        placeholder={t('inventory.quantity')}
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      />
                      <select
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      >
                        <option value="pieces">{t('unit.pieces')}</option>
                        <option value="g">{t('unit.g')}</option>
                        <option value="ml">{t('unit.ml')}</option>
                        <option value="cups">{t('unit.cups')}</option>
                        <option value="tbsp">{t('unit.tbsp')}</option>
                      </select>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors min-w-[44px] flex items-center justify-center"
                        disabled={newRecipe.ingredients.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">{t('recipes.nutrition')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.calories')}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newRecipe.nutrition.calories}
                      onChange={(e) => setNewRecipe({ 
                        ...newRecipe, 
                        nutrition: { ...newRecipe.nutrition, calories: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.protein')}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newRecipe.nutrition.protein}
                      onChange={(e) => setNewRecipe({ 
                        ...newRecipe, 
                        nutrition: { ...newRecipe.nutrition, protein: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.carbs')}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newRecipe.nutrition.carbs}
                      onChange={(e) => setNewRecipe({ 
                        ...newRecipe, 
                        nutrition: { ...newRecipe.nutrition, carbs: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('recipes.fat')}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newRecipe.nutrition.fat}
                      onChange={(e) => setNewRecipe({ 
                        ...newRecipe, 
                        nutrition: { ...newRecipe.nutrition, fat: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={addRecipe}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  {t('recipes.addRecipe')}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors font-medium"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex flex-wrap gap-1 md:gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize text-sm md:text-base ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? t('recipes.allRecipes') : t(`recipeCategory.${category}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const availability = checkIngredientAvailability(recipe);
          
          return (
            <div
              key={recipe.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(recipe.category)}`}>
                    {t(`recipeCategory.${recipe.category}`)}
                  </div>
                </div>
                <button
                  onClick={() => setRecipes(prev => prev.filter(r => r.id !== recipe.id))}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Recipe Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} {recipe.servings === 1 ? t('recipes.serving') : t('recipes.servings')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime} {t('recipes.min')}</span>
                  </div>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="font-semibold">{recipe.nutrition.calories}</div>
                    <div className="text-gray-500">{t('recipes.cal')}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="font-semibold">{recipe.nutrition.protein}g</div>
                    <div className="text-gray-500">{t('recipes.protein_short')}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="font-semibold">{recipe.nutrition.carbs}g</div>
                    <div className="text-gray-500">{t('recipes.carbs_short')}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="font-semibold">{recipe.nutrition.fat}g</div>
                    <div className="text-gray-500">{t('recipes.fat_short')}</div>
                  </div>
                </div>
              </div>

              {/* Ingredient Availability */}
              <div className="border-t border-gray-200 pt-4">
                <div className={`flex items-center gap-2 mb-3 ${availability.canMake ? 'text-green-700' : 'text-orange-700'}`}>
                  {availability.canMake ? (
                    <ChefHat className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">
                    {availability.available}/{availability.total} {t('recipes.ingredientsAvailable')}
                  </span>
                </div>

                <div className="space-y-1">
                  {recipe.ingredients.map((ingredient, idx) => {
                    const inventoryItem = inventory.find(item => 
                      item.name.toLowerCase() === ingredient.name.toLowerCase()
                    );
                    const hasEnough = inventoryItem && inventoryItem.quantity >= ingredient.quantity;

                    return (
                      <div
                        key={idx}
                        className={`text-sm flex justify-between ${hasEnough ? 'text-green-700' : 'text-red-600'}`}
                      >
                        <span>{ingredient.name}</span>
                        <span>{ingredient.quantity} {t(`unit.${ingredient.unit}`)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('recipes.noRecipes')}</h3>
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? t('recipes.noRecipesDesc')
              : `${t(`recipeCategory.${selectedCategory}`)}${t('recipes.noRecipesCategory')}`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeDatabase;