export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  daysLeft: number;
  category: 'vegetables' | 'meat' | 'dairy' | 'grains' | 'fruits' | 'other';
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  prepTime: number;
  ingredients: Ingredient[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'main' | 'soup' | 'snack' | 'dessert';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface OptimizationConstraints {
  minTotalServings: number;
  maxDistinctDishes: number;
  targetCalories: number;
  minProtein: number;
}

export interface OptimizationResult {
  mealPlan: Array<{
    recipeId: string;
    servings: number;
  }>;
  wasteEstimate: Array<{
    itemId: string;
    leftover: number;
    wasteWeight: number;
  }>;
  totalWasteScore: number;
  nutritionSummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  efficiency: number;
}