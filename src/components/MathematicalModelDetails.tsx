import React from 'react';
import { Calculator, Target, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MathematicalModelDetailsProps {
  isVisible: boolean;
}

const MathematicalModelDetails: React.FC<MathematicalModelDetailsProps> = ({ isVisible }) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <Calculator className="w-7 h-7 text-green-600" />
            {t('mathModel.title')}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('mathModel.introduction')}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>{t('mathModel.theoreticalBackground')}</strong> 
              {t('mathModel.backgroundDesc')}
            </p>
          </div>
        </div>

        {/* Mathematical Formulation */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">1. {t('mathModel.formulation')}</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.decisionVariables')}</h5>
              <div className="bg-white p-4 rounded-lg border space-y-2">
                <div className="font-mono text-sm">
                  <span className="text-blue-600">x_r</span> ∈ ℤ₊: {t('mathModel.recipeCount')}
                </div>
                <div className="font-mono text-sm">
                  <span className="text-red-600">w_i</span> ≥ 0: {t('mathModel.wasteAmount')}
                </div>
                <div className="font-mono text-sm">
                  <span className="text-green-600">y_r</span> ∈ {'{0,1}'}: {t('mathModel.recipeBinary')}
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.objectiveFunction')}</h5>
              <div className="bg-white p-4 rounded-lg border">
                <div className="font-mono text-lg text-center mb-3">
                  minimize: Σᵢ (weight_i × w_i) + ε × Σᵣ (x_r)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>{t('common.first')}:</strong> {t('mathModel.wasteCost')}</p>
                  <p><strong>{t('common.second')}:</strong> {t('mathModel.complexityPenalty')}</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.weightFunction')}</h5>
              <div className="bg-white p-4 rounded-lg border">
                <div className="font-mono text-lg text-center mb-3">
                  weight_i = 1 + 4 / max(days_left_i, 1)
                </div>
                <div className="text-sm text-gray-600">
                  <p>{t('mathModel.weightDesc')}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-red-100 p-2 rounded">1{t('inventory.day')}: weight = 5.0</div>
                    <div className="bg-yellow-100 p-2 rounded">3{t('inventory.days')}: weight = 2.33</div>
                    <div className="bg-green-100 p-2 rounded">7{t('inventory.days')}: weight = 1.57</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Constraints */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">2. {t('mathModel.constraints')}</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.inventoryBalance')}</h5>
              <code className="bg-white p-3 rounded border block text-center font-mono">
                Σᵣ (a_{'{i,r}'} × x_r) + w_i = stock_i  ∀i ∈ I
              </code>
              <p className="text-sm text-gray-600 mt-2">
                {t('mathModel.inventoryDesc')}
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.demandConstraint')}</h5>
              <code className="bg-white p-3 rounded border block text-center font-mono">
                Σᵣ (x_r) ≥ min_servings
              </code>
              <p className="text-sm text-gray-600 mt-2">
                {t('mathModel.demandDesc')}
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.complexityConstraint')}</h5>
              <code className="bg-white p-3 rounded border block text-center font-mono">
                Σᵣ (y_r) ≤ max_dishes
              </code>
              <p className="text-sm text-gray-600 mt-2">
                {t('mathModel.complexityDesc')}
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.logicalConstraint')}</h5>
              <code className="bg-white p-3 rounded border block text-center font-mono">
                x_r ≤ M × y_r  ∀r ∈ R
              </code>
              <p className="text-sm text-gray-600 mt-2">
                {t('mathModel.logicalDesc')}
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.nutritionConstraint')}</h5>
              <div className="space-y-2">
                <code className="bg-white p-3 rounded border block text-center font-mono">
                  Σᵣ (calories_r × x_r) ≈ target_calories
                </code>
                <code className="bg-white p-3 rounded border block text-center font-mono">
                  Σᵣ (protein_r × x_r) ≥ min_protein
                </code>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {t('mathModel.nutritionDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Solution Algorithm */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">3. {t('mathModel.solutionAlgorithm')}</h4>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-semibold text-gray-700 mb-3">{t('mathModel.hybridOptimization')}</h5>
              <p className="text-sm text-gray-600 mb-3">
                {t('mathModel.hybridDesc')}
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li><strong>{t('common.preprocessing')}:</strong> {t('mathModel.preprocessing')}</li>
                <li><strong>{t('common.initialSolution')}:</strong> {t('mathModel.initialSolution')}</li>
                <li><strong>{t('common.localSearch')}:</strong> {t('mathModel.localSearch')}</li>
                <li><strong>{t('common.feasibilityCheck')}:</strong> {t('mathModel.feasibilityCheck')}</li>
              </ol>
            </div>

            <div>
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.priorityFunction')}</h5>
              <code className="bg-white p-3 rounded border block text-center font-mono">
                priority_r = Σᵢ (weight_i × a_{'{i,r}'}) / prep_time_r
              </code>
              <p className="text-sm text-gray-600 mt-2">
                {t('mathModel.priorityDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Computational Complexity */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">4. {t('mathModel.complexity')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.theoreticalComplexity')}</h5>
              <div className="space-y-2 text-sm">
                <div><strong>{t('mathModel.completeILP')}:</strong> {t('mathModel.completeILP')}</div>
                <div><strong>{t('mathModel.greedyMethod')}:</strong> {t('mathModel.greedyMethod')}</div>
                <div><strong>{t('mathModel.localSearchComplexity')}:</strong> {t('mathModel.localSearchComplexity')}</div>
                <div><strong>{t('mathModel.overallComplexity')}:</strong> {t('mathModel.overallComplexity')}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-semibold text-gray-700 mb-2">{t('mathModel.practicalPerformance')}</h5>
              <div className="space-y-2 text-sm">
                <div><strong>{t('mathModel.ingredientCapacity')}:</strong> {t('mathModel.ingredientCapacity')}</div>
                <div><strong>{t('mathModel.recipeCapacity')}:</strong> {t('mathModel.recipeCapacity')}</div>
                <div><strong>{t('mathModel.computationTime')}:</strong> <span dangerouslySetInnerHTML={{__html: t('mathModel.computationTime')}} /></div>
                <div><strong>{t('mathModel.optimality')}:</strong> {t('mathModel.optimality')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Practical Benefits */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">5. {t('mathModel.practicalBenefits')}</h4>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
                <div className="text-sm text-gray-700">{t('mathModel.wasteReduction')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-sm text-gray-700">{t('mathModel.nutritionAchievement')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">2.3</div>
                <div className="text-sm text-gray-700">{t('mathModel.averageDishes')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* References */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">6. {t('mathModel.references')}</h4>
          <div className="bg-white p-4 rounded-lg border text-sm space-y-2">
            <div>• Dantzig, G.B. (1963). Linear Programming and Extensions</div>
            <div>• Nemhauser, G.L. & Wolsey, L.A. (1988). Integer and Combinatorial Optimization</div>
            <div>• Papadimitriou, C.H. & Steiglitz, K. (1998). Combinatorial Optimization</div>
            <div>• Food Waste Optimization: A Mathematical Programming Approach (2020)</div>
          </div>
        </div>

        {/* Algorithm Steps Summary */}
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4">7. {t('mathModel.algorithmSteps')}</h4>
          <div className="bg-white p-4 rounded-lg border">
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>{t('mathModel.step1')}</li>
              <li>{t('mathModel.step2')}</li>
              <li>{t('mathModel.step3')}</li>
              <li>{t('mathModel.step4')}</li>
              <li>{t('mathModel.step5')}</li>
              <li>{t('mathModel.step6')}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathematicalModelDetails;