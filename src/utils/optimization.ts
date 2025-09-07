/**
 * Advanced Mathematical Optimization for Food Waste Minimization
 * Based on Integer Linear Programming (ILP) principles
 */

import { InventoryItem, Recipe, OptimizationResult } from '../types';

export interface OptimizationConstraints {
  minTotalServings: number;
  maxDistinctDishes: number;
  targetCalories: number;
  minProtein: number;
}

export interface OptimizationVariables {
  // x_r: レシピrの作成回数（整数変数）
  recipeServings: Map<string, number>;
  // w_i: 食材iの残り量（廃棄量）
  wasteAmounts: Map<string, number>;
  // y_r: レシピrを作るかどうか（バイナリ変数）
  recipeBinary: Map<string, boolean>;
}

/**
 * 廃棄重み計算関数
 * weight = 1 + 4 / max(days_left, 1)
 */
export function calculateWasteWeight(daysLeft: number): number {
  return 1 + 4 / Math.max(daysLeft, 1);
}

/**
 * 線形計画法ベースの最適化（簡易実装）
 * 目的関数: minimize Σ(weight_i × w_i) + ε × Σ(x_r)
 */
export class FoodWasteOptimizer {
  private inventory: InventoryItem[];
  private recipes: Recipe[];
  private constraints: OptimizationConstraints;

  constructor(inventory: InventoryItem[], recipes: Recipe[], constraints: OptimizationConstraints) {
    this.inventory = inventory;
    this.recipes = recipes;
    this.constraints = constraints;
  }

  /**
   * メイン最適化関数
   * Branch and Bound風の探索を簡易実装
   */
  optimize(): OptimizationResult {
    // 1. 実行可能レシピのフィルタリング
    const feasibleRecipes = this.getFeasibleRecipes();
    
    // 2. 初期解の生成（貪欲法）
    let bestSolution = this.greedySolution(feasibleRecipes);
    let bestObjective = this.evaluateObjective(bestSolution);

    // 3. 局所探索による改善
    const improvedSolution = this.localSearch(bestSolution, feasibleRecipes);
    const improvedObjective = this.evaluateObjective(improvedSolution);

    if (improvedObjective < bestObjective) {
      bestSolution = improvedSolution;
      bestObjective = improvedObjective;
    }

    // 4. 結果の構築
    return this.buildResult(bestSolution);
  }

  /**
   * 実行可能レシピの判定
   * 制約: Σ(a_{i,r} × x_r) ≤ stock_i (各食材i)
   */
  private getFeasibleRecipes(): Recipe[] {
    return this.recipes.filter(recipe => {
      return recipe.ingredients.every(ingredient => {
        const inventoryItem = this.inventory.find(item => 
          item.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        return inventoryItem && inventoryItem.quantity >= ingredient.quantity;
      });
    });
  }

  /**
   * 貪欲解の生成
   * 優先度 = Σ(waste_weight_i × ingredient_quantity_i) / recipe_cost
   */
  private greedySolution(feasibleRecipes: Recipe[]): OptimizationVariables {
    const solution: OptimizationVariables = {
      recipeServings: new Map(),
      wasteAmounts: new Map(),
      recipeBinary: new Map()
    };

    // 残り在庫の初期化
    const remainingInventory = new Map<string, number>();
    this.inventory.forEach(item => {
      remainingInventory.set(item.name.toLowerCase(), item.quantity);
    });

    // レシピの優先度計算とソート
    const prioritizedRecipes = feasibleRecipes.map(recipe => {
      const urgencyScore = recipe.ingredients.reduce((sum, ingredient) => {
        const inventoryItem = this.inventory.find(item => 
          item.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        if (inventoryItem) {
          const wasteWeight = calculateWasteWeight(inventoryItem.daysLeft);
          return sum + (wasteWeight * ingredient.quantity);
        }
        return sum;
      }, 0);

      return { recipe, priority: urgencyScore / recipe.prepTime }; // コスト効率考慮
    }).sort((a, b) => b.priority - a.priority);

    let totalServings = 0;
    let distinctDishes = 0;

    // 貪欲選択
    for (const { recipe } of prioritizedRecipes) {
      if (distinctDishes >= this.constraints.maxDistinctDishes) break;

      // 最大作成可能回数の計算
      let maxServings = Math.floor(
        Math.min(...recipe.ingredients.map(ingredient => {
          const remaining = remainingInventory.get(ingredient.name.toLowerCase()) || 0;
          return remaining / ingredient.quantity;
        }))
      );

      if (maxServings > 0) {
        // 制約を考慮した最適回数の決定
        const targetServings = Math.min(
          maxServings,
          Math.max(1, Math.ceil((this.constraints.minTotalServings - totalServings) / 2))
        );

        // 在庫更新
        recipe.ingredients.forEach(ingredient => {
          const currentRemaining = remainingInventory.get(ingredient.name.toLowerCase()) || 0;
          remainingInventory.set(
            ingredient.name.toLowerCase(),
            currentRemaining - (ingredient.quantity * targetServings)
          );
        });

        solution.recipeServings.set(recipe.id, targetServings);
        solution.recipeBinary.set(recipe.id, true);
        totalServings += targetServings;
        distinctDishes++;
      }
    }

    // 廃棄量の計算
    this.inventory.forEach(item => {
      const remaining = remainingInventory.get(item.name.toLowerCase()) || 0;
      solution.wasteAmounts.set(item.id, remaining);
    });

    return solution;
  }

  /**
   * 局所探索による解の改善
   * 2-opt風の近傍探索
   */
  private localSearch(initialSolution: OptimizationVariables, feasibleRecipes: Recipe[]): OptimizationVariables {
    let currentSolution = this.copySolution(initialSolution);
    let improved = true;

    while (improved) {
      improved = false;
      const currentObjective = this.evaluateObjective(currentSolution);

      // レシピ間での回数調整
      for (const recipe1 of feasibleRecipes) {
        for (const recipe2 of feasibleRecipes) {
          if (recipe1.id === recipe2.id) continue;

          const servings1 = currentSolution.recipeServings.get(recipe1.id) || 0;
          const servings2 = currentSolution.recipeServings.get(recipe2.id) || 0;

          if (servings1 > 0) {
            // recipe1を1回減らし、recipe2を1回増やす
            const newSolution = this.copySolution(currentSolution);
            newSolution.recipeServings.set(recipe1.id, servings1 - 1);
            newSolution.recipeServings.set(recipe2.id, servings2 + 1);

            if (this.isFeasible(newSolution)) {
              this.updateWasteAmounts(newSolution);
              const newObjective = this.evaluateObjective(newSolution);

              if (newObjective < currentObjective) {
                currentSolution = newSolution;
                improved = true;
                break;
              }
            }
          }
        }
        if (improved) break;
      }
    }

    return currentSolution;
  }

  /**
   * 目的関数の評価
   * minimize Σ(weight_i × w_i) + ε × Σ(x_r)
   */
  private evaluateObjective(solution: OptimizationVariables): number {
    const epsilon = 1e-3;
    
    // 廃棄コスト
    let wasteScore = 0;
    this.inventory.forEach(item => {
      const wasteAmount = solution.wasteAmounts.get(item.id) || 0;
      const wasteWeight = calculateWasteWeight(item.daysLeft);
      wasteScore += wasteWeight * wasteAmount;
    });

    // 作成回数のペナルティ（タイブレーク用）
    let servingsScore = 0;
    solution.recipeServings.forEach(servings => {
      servingsScore += servings;
    });

    return wasteScore + epsilon * servingsScore;
  }

  /**
   * 制約充足性の確認
   */
  private isFeasible(solution: OptimizationVariables): boolean {
    // 在庫制約の確認
    const usedInventory = new Map<string, number>();
    
    solution.recipeServings.forEach((servings, recipeId) => {
      const recipe = this.recipes.find(r => r.id === recipeId);
      if (recipe && servings > 0) {
        recipe.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          const currentUsed = usedInventory.get(key) || 0;
          usedInventory.set(key, currentUsed + ingredient.quantity * servings);
        });
      }
    });

    for (const item of this.inventory) {
      const used = usedInventory.get(item.name.toLowerCase()) || 0;
      if (used > item.quantity) {
        return false;
      }
    }

    // 最小サービング数制約
    const totalServings = Array.from(solution.recipeServings.values()).reduce((sum, s) => sum + s, 0);
    if (totalServings < this.constraints.minTotalServings) {
      return false;
    }

    // 最大品数制約
    const distinctDishes = Array.from(solution.recipeServings.values()).filter(s => s > 0).length;
    if (distinctDishes > this.constraints.maxDistinctDishes) {
      return false;
    }

    return true;
  }

  /**
   * 廃棄量の更新
   */
  private updateWasteAmounts(solution: OptimizationVariables): void {
    const usedInventory = new Map<string, number>();
    
    solution.recipeServings.forEach((servings, recipeId) => {
      const recipe = this.recipes.find(r => r.id === recipeId);
      if (recipe && servings > 0) {
        recipe.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          const currentUsed = usedInventory.get(key) || 0;
          usedInventory.set(key, currentUsed + ingredient.quantity * servings);
        });
      }
    });

    this.inventory.forEach(item => {
      const used = usedInventory.get(item.name.toLowerCase()) || 0;
      const waste = Math.max(0, item.quantity - used);
      solution.wasteAmounts.set(item.id, waste);
    });
  }

  /**
   * 解のコピー
   */
  private copySolution(solution: OptimizationVariables): OptimizationVariables {
    return {
      recipeServings: new Map(solution.recipeServings),
      wasteAmounts: new Map(solution.wasteAmounts),
      recipeBinary: new Map(solution.recipeBinary)
    };
  }

  /**
   * 最終結果の構築
   */
  private buildResult(solution: OptimizationVariables): OptimizationResult {
    const mealPlan = Array.from(solution.recipeServings.entries())
      .filter(([_, servings]) => servings > 0)
      .map(([recipeId, servings]) => ({ recipeId, servings }));

    const wasteEstimate = Array.from(solution.wasteAmounts.entries())
      .map(([itemId, leftover]) => {
        const item = this.inventory.find(i => i.id === itemId);
        const wasteWeight = item ? calculateWasteWeight(item.daysLeft) : 1;
        return { itemId, leftover, wasteWeight };
      });

    const totalWasteScore = wasteEstimate.reduce((sum, waste) => 
      sum + (waste.leftover * waste.wasteWeight), 0
    );

    // 栄養計算
    const nutritionSummary = mealPlan.reduce((sum, meal) => {
      const recipe = this.recipes.find(r => r.id === meal.recipeId);
      if (recipe) {
        return {
          calories: sum.calories + (recipe.nutrition.calories * meal.servings),
          protein: sum.protein + (recipe.nutrition.protein * meal.servings),
          carbs: sum.carbs + (recipe.nutrition.carbs * meal.servings),
          fat: sum.fat + (recipe.nutrition.fat * meal.servings)
        };
      }
      return sum;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const efficiency = Math.max(0, 100 - (totalWasteScore / this.inventory.length * 10));

    return {
      mealPlan,
      wasteEstimate,
      totalWasteScore,
      nutritionSummary,
      efficiency: Math.round(efficiency)
    };
  }
}

/**
 * 数理最適化の詳細説明用クラス
 */
export class OptimizationExplainer {
  static getModelDescription(): string {
    return `
数理最適化モデル詳細:

【目的関数】
minimize: Σ(weight_i × w_i) + ε × Σ(x_r)

where:
- weight_i = 1 + 4/max(days_left_i, 1) (期限重み)
- w_i ≥ 0: 食材iの廃棄量
- x_r ≥ 0: レシピrの作成回数（整数）
- ε = 1e-3: タイブレーク用微小係数

【制約条件】
1. 在庫バランス: Σ(a_{i,r} × x_r) + w_i = stock_i ∀i
2. 最小サービング: Σ(x_r) ≥ min_servings
3. 最大品数: Σ(y_r) ≤ max_dishes
4. 論理制約: x_r ≤ M × y_r ∀r (y_r ∈ {0,1})

【解法】
1. 貪欲法による初期解生成
2. 局所探索による改善（2-opt風）
3. 制約充足性の確認
    `;
  }

  static getAlgorithmSteps(): string[] {
    return [
      "1. 実行可能レシピの抽出（在庫制約チェック）",
      "2. 優先度計算: urgency_score / prep_time",
      "3. 貪欲選択: 高優先度レシピから順次選択",
      "4. 局所探索: レシピ間での回数調整",
      "5. 制約充足性確認と解の評価",
      "6. 最適解の構築と結果出力"
    ];
  }
}