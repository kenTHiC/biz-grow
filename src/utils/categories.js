import categoriesConfig from '../config/categories.json';

export class CategoryManager {
  static getCategories(type) {
    return categoriesConfig[type] || {};
  }

  static getCategoryOptions(type) {
    const categories = this.getCategories(type);
    return Object.entries(categories).map(([key, config]) => ({
      value: key,
      label: config.label,
      description: config.description,
      color: config.color
    }));
  }

  static getCategoryLabel(type, key) {
    const categories = this.getCategories(type);
    return categories[key]?.label || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  static getCategoryColor(type, key) {
    const categories = this.getCategories(type);
    return categories[key]?.color || '#6b7280';
  }

  static getCategoryDescription(type, key) {
    const categories = this.getCategories(type);
    return categories[key]?.description || '';
  }

  static getDefaultCategory(type) {
    const categories = this.getCategories(type);
    const keys = Object.keys(categories);
    if (type === 'revenue') {
      return keys.includes('product_sales') ? 'product_sales' : keys[0] || 'other';
    } else {
      return keys.includes('office_supplies') ? 'office_supplies' : keys[0] || 'other';
    }
  }

  static addCustomCategory(type, key, config) {
    // This would be used for future functionality to add custom categories
    // For now, we'll just validate the structure
    if (!config.label || !config.description || !config.color) {
      throw new Error('Category config must include label, description, and color');
    }
    
    // In a real implementation, this would save to localStorage or send to API
    console.log(`Would add custom category: ${type}.${key}`, config);
    return true;
  }

  static getCategoryColorClass(type, key) {
    // Convert hex colors to Tailwind classes for consistency
    const colorMap = {
      '#3b82f6': 'bg-blue-100 text-blue-800',
      '#10b981': 'bg-green-100 text-green-800',
      '#8b5cf6': 'bg-purple-100 text-purple-800',
      '#6366f1': 'bg-indigo-100 text-indigo-800',
      '#f59e0b': 'bg-yellow-100 text-yellow-800',
      '#6b7280': 'bg-gray-100 text-gray-800',
      '#ec4899': 'bg-pink-100 text-pink-800',
      '#ef4444': 'bg-red-100 text-red-800',
      '#f97316': 'bg-orange-100 text-orange-800',
      '#84cc16': 'bg-lime-100 text-lime-800',
      '#06b6d4': 'bg-cyan-100 text-cyan-800'
    };

    const color = this.getCategoryColor(type, key);
    return colorMap[color] || 'bg-slate-100 text-slate-800';
  }

  static validateCategory(type, key) {
    const categories = this.getCategories(type);
    return Object.keys(categories).includes(key);
  }

  static getAllCategories() {
    return categoriesConfig;
  }

  static exportCategories() {
    return JSON.stringify(categoriesConfig, null, 2);
  }

  static importCategories(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      // Validate structure
      if (!imported.revenue || !imported.expense) {
        throw new Error('Invalid categories structure');
      }
      
      // In a real implementation, this would update the config
      console.log('Would import categories:', imported);
      return true;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }
}

export default CategoryManager;
