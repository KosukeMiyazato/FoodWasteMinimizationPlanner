import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Calendar, Package } from 'lucide-react';
import { InventoryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, setInventory }) => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    quantity: 0,
    unit: 'pieces',
    daysLeft: 7,
    category: 'other'
  });

  const addItem = () => {
    if (newItem.name.trim()) {
      setInventory(prev => [...prev, {
        ...newItem,
        id: Date.now().toString()
      }]);
      setNewItem({
        name: '',
        quantity: 0,
        unit: 'pieces',
        daysLeft: 7,
        category: 'other'
      });
      setShowAddForm(false);
    }
  };

  const removeItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1) return 'bg-red-100 border-red-200 text-red-800';
    if (daysLeft <= 3) return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    return 'bg-green-100 border-green-200 text-green-800';
  };

  const getUrgencyIcon = (daysLeft: number) => {
    if (daysLeft <= 1) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (daysLeft <= 3) return <Calendar className="w-4 h-4 text-yellow-500" />;
    return <Package className="w-4 h-4 text-green-500" />;
  };

  const urgentItems = inventory.filter(item => item.daysLeft <= 3).length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('inventory.title')}</h2>
            <p className="text-gray-600">{t('inventory.subtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            {urgentItems > 0 && (
              <div className="flex items-center gap-1 md:gap-2 bg-red-100 px-2 md:px-4 py-2 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium text-sm md:text-base">{urgentItems} {t('inventory.urgent')}</span>
              </div>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 md:px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-200 text-sm md:text-base"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t('inventory.addItem')}</span>
              <span className="sm:hidden">追加</span>
            </button>
          </div>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t('inventory.addNewItem')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder={t('inventory.itemName')}
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
              <input
                type="number"
                placeholder={t('inventory.quantity')}
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              >
                <option value="pieces">{t('unit.pieces')}</option>
                <option value="g">{t('unit.g')}</option>
                <option value="ml">{t('unit.ml')}</option>
                <option value="cups">{t('unit.cups')}</option>
                <option value="tbsp">{t('unit.tbsp')}</option>
              </select>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              >
                <option value="vegetables">{t('category.vegetables')}</option>
                <option value="meat">{t('category.meat')}</option>
                <option value="dairy">{t('category.dairy')}</option>
                <option value="grains">{t('category.grains')}</option>
                <option value="fruits">{t('category.fruits')}</option>
                <option value="other">{t('category.other')}</option>
              </select>
              <input
                type="number"
                placeholder={t('inventory.daysLeft')}
                value={newItem.daysLeft}
                onChange={(e) => setNewItem({ ...newItem, daysLeft: Number(e.target.value) })}
                className="px-3 md:px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={addItem}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                {t('inventory.addItem')}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors font-medium"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${getUrgencyColor(item.daysLeft)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getUrgencyIcon(item.daysLeft)}
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm opacity-75 capitalize">{t(`category.${item.category}`)}</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-lg hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{t('inventory.quantity')}:</span>
                <span>{item.quantity} {t(`unit.${item.unit}`)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t('inventory.expiresIn')}</span>
                <span className="font-semibold">
                  {item.daysLeft} {item.daysLeft === 1 ? t('inventory.day') : t('inventory.days')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {inventory.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('inventory.noItems')}</h3>
          <p className="text-gray-500">{t('inventory.noItemsDesc')}</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;