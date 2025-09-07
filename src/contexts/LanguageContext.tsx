import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'app.title': 'Food Waste Optimizer',
    'app.subtitle': 'Minimize waste, maximize nutrition',
    'header.wasteReduction': 'Avg. Waste Reduction',
    
    // Navigation
    'nav.inventory': 'Inventory',
    'nav.recipes': 'Recipes',
    'nav.optimize': 'Optimize',
    'nav.mealPlan': 'Meal Plan',
    
    // Inventory
    'inventory.title': 'Inventory Management',
    'inventory.subtitle': 'Track your ingredients and expiration dates',
    'inventory.addItem': 'Add Item',
    'inventory.addNewItem': 'Add New Item',
    'inventory.itemName': 'Item name',
    'inventory.quantity': 'Quantity',
    'inventory.unit': 'Unit',
    'inventory.category': 'Category',
    'inventory.daysLeft': 'Days left',
    'inventory.expiresIn': 'Expires in:',
    'inventory.day': 'day',
    'inventory.days': 'days',
    'inventory.urgent': 'urgent',
    'inventory.noItems': 'No items in inventory',
    'inventory.noItemsDesc': 'Add your first item to get started with optimization',
    
    // Categories
    'category.vegetables': 'Vegetables',
    'category.meat': 'Meat',
    'category.dairy': 'Dairy',
    'category.grains': 'Grains',
    'category.fruits': 'Fruits',
    'category.other': 'Other',
    
    // Units
    'unit.pieces': 'Pieces',
    'unit.g': 'Grams',
    'unit.ml': 'Milliliters',
    'unit.cups': 'Cups',
    'unit.tbsp': 'Tablespoons',
    
    // Recipe Categories
    'recipeCategory.breakfast': 'Breakfast',
    'recipeCategory.lunch': 'Lunch',
    'recipeCategory.dinner': 'Dinner',
    'recipeCategory.main': 'Main',
    'recipeCategory.soup': 'Soup',
    'recipeCategory.snack': 'Snack',
    'recipeCategory.dessert': 'Dessert',
    
    // Recipes
    'recipes.title': 'Recipe Database',
    'recipes.subtitle': 'Manage your recipes and check ingredient availability',
    'recipes.addRecipe': 'Add Recipe',
    'recipes.addNewRecipe': 'Add New Recipe',
    'recipes.recipeName': 'Recipe name',
    'recipes.servings': 'Servings',
    'recipes.prepTime': 'Prep time (min)',
    'recipes.ingredients': 'Ingredients',
    'recipes.addIngredient': 'Add Ingredient',
    'recipes.ingredientName': 'Ingredient Name',
    'recipes.action': 'Action',
    'recipes.nutrition': 'Nutrition (per serving)',
    'recipes.calories': 'Calories',
    'recipes.protein': 'Protein (g)',
    'recipes.carbs': 'Carbs (g)',
    'recipes.fat': 'Fat (g)',
    'recipes.allRecipes': 'All Recipes',
    'recipes.ingredientsAvailable': 'ingredients available',
    'recipes.serving': 'serving',
    'recipes.min': 'min',
    'recipes.cal': 'cal',
    'recipes.protein_short': 'protein',
    'recipes.carbs_short': 'carbs',
    'recipes.fat_short': 'fat',
    'recipes.noRecipes': 'No recipes found',
    'recipes.noRecipesDesc': 'Add your first recipe to get started',
    'recipes.noRecipesCategory': 'recipes available',
    
    // Optimization
    'optimize.title': 'Optimization Engine',
    'optimize.subtitle': 'Configure constraints and run waste minimization',
    'optimize.constraints': 'Optimization Constraints',
    'optimize.minServings': 'Minimum Total Servings',
    'optimize.minServingsDesc': 'Ensure adequate meal quantity',
    'optimize.maxDishes': 'Maximum Distinct Dishes',
    'optimize.maxDishesDesc': 'Control cooking complexity',
    'optimize.targetCalories': 'Target Daily Calories',
    'optimize.targetCaloriesDesc': 'Nutritional goal',
    'optimize.minProtein': 'Minimum Protein (g)',
    'optimize.minProteinDesc': 'Essential nutrient requirement',
    'optimize.runOptimization': 'Run Optimization',
    'optimize.optimizing': 'Optimizing...',
    'optimize.mathModel': 'Mathematical Model Details',
    'optimize.showMathModel': 'Show Mathematical Model Details',
    'optimize.hideMathModel': 'Hide Mathematical Model Details',
    'optimize.inventoryStatus': 'Inventory Status',
    'optimize.totalItems': 'Total Items',
    'optimize.urgentItems': 'Urgent (≤3 days)',
    'optimize.availableRecipes': 'Available Recipes',
    'optimize.goals': 'Optimization Goals',
    'optimize.minimizeWaste': 'Minimize food waste',
    'optimize.prioritizeUrgent': 'Prioritize urgent items',
    'optimize.meetNutrition': 'Meet nutrition targets',
    
    // Meal Plan
    'mealPlan.title': 'Optimized Meal Plan',
    'mealPlan.subtitle': 'Your waste-minimizing meal strategy',
    'mealPlan.efficiency': 'Efficiency',
    'mealPlan.wasteScore': 'Waste Score',
    'mealPlan.totalServings': 'Total Servings',
    'mealPlan.distinctDishes': 'Distinct Dishes',
    'mealPlan.totalCalories': 'Total Calories',
    'mealPlan.recommendedMeals': 'Recommended Meals',
    'mealPlan.nutritionSummary': 'Nutrition Summary',
    'mealPlan.wasteEstimation': 'Waste Estimation',
    'mealPlan.ingredientsNeeded': 'Ingredients needed:',
    'mealPlan.leftover': 'leftover',
    'mealPlan.perfectUtilization': 'Perfect utilization!',
    'mealPlan.allIngredientsUsed': 'All ingredients will be used',
    'mealPlan.noMealPlan': 'No meal plan generated',
    'mealPlan.noMealPlanDesc': 'Run the optimization engine to generate an optimal meal plan',
    
    // Common
    'common.add': 'Add',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'common.close': 'Close',
  },
  ja: {
    // Header
    'app.title': '食品廃棄最適化システム',
    'app.subtitle': '廃棄を最小化し、栄養を最大化',
    'header.wasteReduction': '平均廃棄削減率',
    
    // Navigation
    'nav.inventory': '在庫管理',
    'nav.recipes': 'レシピ',
    'nav.optimize': '最適化',
    'nav.mealPlan': '食事計画',
    
    // Inventory
    'inventory.title': '在庫管理',
    'inventory.subtitle': '食材と賞味期限を管理します',
    'inventory.addItem': 'アイテム追加',
    'inventory.addNewItem': '新しいアイテムを追加',
    'inventory.itemName': 'アイテム名',
    'inventory.quantity': '数量',
    'inventory.unit': '単位',
    'inventory.category': 'カテゴリ',
    'inventory.daysLeft': '残り日数',
    'inventory.expiresIn': '期限まで:',
    'inventory.day': '日',
    'inventory.days': '日',
    'inventory.urgent': '緊急',
    'inventory.noItems': '在庫がありません',
    'inventory.noItemsDesc': '最初のアイテムを追加して最適化を開始してください',
    
    // Categories
    'category.vegetables': '野菜',
    'category.meat': '肉類',
    'category.dairy': '乳製品',
    'category.grains': '穀物',
    'category.fruits': '果物',
    'category.other': 'その他',
    
    // Units
    'unit.pieces': '個',
    'unit.g': 'グラム',
    'unit.ml': 'ミリリットル',
    'unit.cups': 'カップ',
    'unit.tbsp': '大さじ',
    
    // Recipe Categories
    'recipeCategory.breakfast': '朝食',
    'recipeCategory.lunch': '昼食',
    'recipeCategory.dinner': '夕食',
    'recipeCategory.main': 'メイン',
    'recipeCategory.soup': 'スープ',
    'recipeCategory.snack': 'スナック',
    'recipeCategory.dessert': 'デザート',
    
    // Recipes
    'recipes.title': 'レシピデータベース',
    'recipes.subtitle': 'レシピを管理し、材料の在庫状況を確認します',
    'recipes.addRecipe': 'レシピ追加',
    'recipes.addNewRecipe': '新しいレシピを追加',
    'recipes.recipeName': 'レシピ名',
    'recipes.servings': '人分',
    'recipes.prepTime': '調理時間（分）',
    'recipes.ingredients': '材料',
    'recipes.addIngredient': '材料を追加',
    'recipes.ingredientName': '材料名',
    'recipes.action': '操作',
    'recipes.nutrition': '栄養成分（1人分）',
    'recipes.calories': 'カロリー',
    'recipes.protein': 'タンパク質（g）',
    'recipes.carbs': '炭水化物（g）',
    'recipes.fat': '脂質（g）',
    'recipes.allRecipes': '全レシピ',
    'recipes.ingredientsAvailable': '材料が利用可能',
    'recipes.serving': '人分',
    'recipes.min': '分',
    'recipes.cal': 'kcal',
    'recipes.protein_short': 'タンパク質',
    'recipes.carbs_short': '炭水化物',
    'recipes.fat_short': '脂質',
    'recipes.noRecipes': 'レシピが見つかりません',
    'recipes.noRecipesDesc': '最初のレシピを追加してください',
    'recipes.noRecipesCategory': 'のレシピがありません',
    
    // Optimization
    'optimize.title': '最適化エンジン',
    'optimize.subtitle': '制約を設定して廃棄最小化を実行します',
    'optimize.constraints': '最適化制約',
    'optimize.minServings': '最小総人分数',
    'optimize.minServingsDesc': '十分な食事量を確保',
    'optimize.maxDishes': '最大料理数',
    'optimize.maxDishesDesc': '調理の複雑さを制御',
    'optimize.targetCalories': '目標カロリー',
    'optimize.targetCaloriesDesc': '栄養目標',
    'optimize.minProtein': '最小タンパク質（g）',
    'optimize.minProteinDesc': '必須栄養素要件',
    'optimize.runOptimization': '最適化実行',
    'optimize.optimizing': '最適化中...',
    'optimize.mathModel': '数理モデル詳細',
    'optimize.showMathModel': '数理モデル詳細を表示',
    'optimize.hideMathModel': '数理モデル詳細を非表示',
    'optimize.inventoryStatus': '在庫状況',
    'optimize.totalItems': '総アイテム数',
    'optimize.urgentItems': '緊急（≤3日）',
    'optimize.availableRecipes': '利用可能レシピ',
    'optimize.goals': '最適化目標',
    'optimize.minimizeWaste': '食品廃棄を最小化',
    'optimize.prioritizeUrgent': '緊急アイテムを優先',
    'optimize.meetNutrition': '栄養目標を達成',
    
    // Meal Plan
    'mealPlan.title': '最適化された食事計画',
    'mealPlan.subtitle': '廃棄最小化食事戦略',
    'mealPlan.efficiency': '効率性',
    'mealPlan.wasteScore': '廃棄スコア',
    'mealPlan.totalServings': '総人分数',
    'mealPlan.distinctDishes': '料理数',
    'mealPlan.totalCalories': '総カロリー',
    'mealPlan.recommendedMeals': '推奨料理',
    'mealPlan.nutritionSummary': '栄養サマリー',
    'mealPlan.wasteEstimation': '廃棄予測',
    'mealPlan.ingredientsNeeded': '必要な材料:',
    'mealPlan.leftover': '余り',
    'mealPlan.perfectUtilization': '完全活用！',
    'mealPlan.allIngredientsUsed': 'すべての材料が使用されます',
    'mealPlan.noMealPlan': '食事計画が生成されていません',
    'mealPlan.noMealPlanDesc': '最適化エンジンを実行して最適な食事計画を生成してください',
    
    // Common
    'common.add': '追加',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.save': '保存',
    'common.close': '閉じる',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};