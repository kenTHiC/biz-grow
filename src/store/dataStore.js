// Enhanced Data Store with localStorage persistence and data management
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const STORAGE_KEYS = {
  CUSTOMERS: 'biz-grow-customers',
  REVENUES: 'biz-grow-revenues',
  EXPENSES: 'biz-grow-expenses',
  USER_SETTINGS: 'biz-grow-user-settings',
  DATA_BACKUP: 'biz-grow-data-backup',
  FIRST_TIME_USER: 'biz-grow-first-time'
};

const APP_VERSION = '1.1.0';
const DATA_VERSION = '1.0.0';



// Enhanced utility functions
const loadFromStorage = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultData;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Auto-backup critical data
    if (key !== STORAGE_KEYS.DATA_BACKUP) {
      createAutoBackup();
    }
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    throw new Error(`Failed to save data: ${error.message}`);
  }
};

const generateId = (existingItems) => {
  return existingItems.length > 0
    ? Math.max(...existingItems.map(item => item.id)) + 1
    : 1;
};

const createAutoBackup = () => {
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: DATA_VERSION,
      customers: localStorage.getItem(STORAGE_KEYS.CUSTOMERS),
      revenues: localStorage.getItem(STORAGE_KEYS.REVENUES),
      expenses: localStorage.getItem(STORAGE_KEYS.EXPENSES),
      userSettings: localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)
    };
    localStorage.setItem(STORAGE_KEYS.DATA_BACKUP, JSON.stringify(backupData));
  } catch (error) {
    console.warn('Auto-backup failed:', error);
  }
};

const isFirstTimeUser = () => {
  return !localStorage.getItem(STORAGE_KEYS.FIRST_TIME_USER);
};

const markUserAsReturning = () => {
  localStorage.setItem(STORAGE_KEYS.FIRST_TIME_USER, 'false');
};

const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (key !== STORAGE_KEYS.USER_SETTINGS) {
      localStorage.removeItem(key);
    }
  });
};

// Enhanced Data Store Class
class DataStore {
  constructor() {
    this.isFirstTime = isFirstTimeUser();
    this.userSettings = loadFromStorage(STORAGE_KEYS.USER_SETTINGS, {
      currency: 'USD',
      dateFormat: 'yyyy-MM-dd',
      theme: 'light',
      autoBackup: true
    });

    // Always start with empty arrays - no sample data
    this.customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, []);
    this.revenues = loadFromStorage(STORAGE_KEYS.REVENUES, []);
    this.expenses = loadFromStorage(STORAGE_KEYS.EXPENSES, []);

    // Mark user as returning after first load
    if (this.isFirstTime) {
      markUserAsReturning();
    }
  }

  // Customer methods
  getCustomers(sortBy = '-acquisition_date') {
    let sorted = [...this.customers];
    if (sortBy === '-acquisition_date') {
      sorted.sort((a, b) => new Date(b.acquisition_date) - new Date(a.acquisition_date));
    }
    return sorted;
  }

  getCustomer(id) {
    return this.customers.find(c => c.id === parseInt(id));
  }

  addCustomer(customerData) {
    const newCustomer = {
      ...customerData,
      id: generateId(this.customers),
      acquisition_date: customerData.acquisition_date || format(new Date(), 'yyyy-MM-dd'),
      total_value: customerData.total_value || 0
    };
    this.customers.push(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    return newCustomer;
  }

  updateCustomer(id, customerData) {
    const index = this.customers.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...customerData };
      saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
      return this.customers[index];
    }
    return null;
  }

  deleteCustomer(id) {
    const index = this.customers.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.customers.splice(index, 1)[0];
      saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
      return deleted;
    }
    return null;
  }

  // Revenue methods
  getRevenues(sortBy = '-date') {
    let sorted = [...this.revenues];
    if (sortBy === '-date') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return sorted;
  }

  addRevenue(revenueData) {
    const newRevenue = {
      ...revenueData,
      id: generateId(this.revenues),
      date: revenueData.date || format(new Date(), 'yyyy-MM-dd')
    };
    this.revenues.push(newRevenue);
    saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
    return newRevenue;
  }

  updateRevenue(id, revenueData) {
    const index = this.revenues.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      this.revenues[index] = { ...this.revenues[index], ...revenueData };
      saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
      return this.revenues[index];
    }
    return null;
  }

  deleteRevenue(id) {
    const index = this.revenues.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.revenues.splice(index, 1)[0];
      saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
      return deleted;
    }
    return null;
  }

  // Expense methods
  getExpenses(sortBy = '-date') {
    let sorted = [...this.expenses];
    if (sortBy === '-date') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return sorted;
  }

  addExpense(expenseData) {
    const newExpense = {
      ...expenseData,
      id: generateId(this.expenses),
      date: expenseData.date || format(new Date(), 'yyyy-MM-dd')
    };
    this.expenses.push(newExpense);
    saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
    return newExpense;
  }

  updateExpense(id, expenseData) {
    const index = this.expenses.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...expenseData };
      saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
      return this.expenses[index];
    }
    return null;
  }

  deleteExpense(id) {
    const index = this.expenses.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.expenses.splice(index, 1)[0];
      saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
      return deleted;
    }
    return null;
  }

  // Analytics methods
  getAnalytics(dateRange = null) {
    const filterByDate = (items, dateField = 'date') => {
      if (!dateRange?.from || !dateRange?.to) return items;
      return items.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    };

    const filteredRevenues = filterByDate(this.revenues);
    const filteredExpenses = filterByDate(this.expenses);
    const filteredCustomers = filterByDate(this.customers, 'acquisition_date');

    const totalRevenue = filteredRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      activeCustomers,
      revenues: filteredRevenues,
      expenses: filteredExpenses,
      customers: filteredCustomers
    };
  }

  // Data Management Methods
  exportAllData(format = 'json') {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: DATA_VERSION,
        appVersion: APP_VERSION,
        format: format
      },
      customers: this.customers,
      revenues: this.revenues,
      expenses: this.expenses,
      userSettings: this.userSettings
    };

    return exportData;
  }

  async importData(data, options = {}) {
    const {
      merge = false,
      validateData = true,
      createBackup = true
    } = options;

    try {
      if (createBackup) {
        this.createManualBackup();
      }

      if (validateData) {
        this.validateImportData(data);
      }

      if (!merge) {
        // Clear existing data
        this.customers = [];
        this.revenues = [];
        this.expenses = [];
      }

      // Import customers
      if (data.customers && Array.isArray(data.customers)) {
        const importedCustomers = data.customers.map(customer => ({
          ...customer,
          id: merge ? generateId([...this.customers, ...data.customers]) : customer.id || generateId(this.customers)
        }));

        if (merge) {
          this.customers = [...this.customers, ...importedCustomers];
        } else {
          this.customers = importedCustomers;
        }
      }

      // Import revenues
      if (data.revenues && Array.isArray(data.revenues)) {
        const importedRevenues = data.revenues.map(revenue => ({
          ...revenue,
          id: merge ? generateId([...this.revenues, ...data.revenues]) : revenue.id || generateId(this.revenues)
        }));

        if (merge) {
          this.revenues = [...this.revenues, ...importedRevenues];
        } else {
          this.revenues = importedRevenues;
        }
      }

      // Import expenses
      if (data.expenses && Array.isArray(data.expenses)) {
        const importedExpenses = data.expenses.map(expense => ({
          ...expense,
          id: merge ? generateId([...this.expenses, ...data.expenses]) : expense.id || generateId(this.expenses)
        }));

        if (merge) {
          this.expenses = [...this.expenses, ...importedExpenses];
        } else {
          this.expenses = importedExpenses;
        }
      }

      // Save all data
      saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
      saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
      saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);

      return {
        success: true,
        imported: {
          customers: data.customers?.length || 0,
          revenues: data.revenues?.length || 0,
          expenses: data.expenses?.length || 0
        }
      };

    } catch (error) {
      console.error('Import failed:', error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  validateImportData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Validate structure
    const validKeys = ['customers', 'revenues', 'expenses', 'metadata', 'userSettings'];
    const hasValidData = Object.keys(data).some(key =>
      validKeys.includes(key) && Array.isArray(data[key])
    );

    if (!hasValidData) {
      throw new Error('No valid data arrays found');
    }

    // Validate customers
    if (data.customers) {
      data.customers.forEach((customer, index) => {
        if (!customer.name || !customer.email) {
          throw new Error(`Customer at index ${index} missing required fields (name, email)`);
        }
      });
    }

    // Validate revenues
    if (data.revenues) {
      data.revenues.forEach((revenue, index) => {
        if (!revenue.amount || !revenue.date) {
          throw new Error(`Revenue at index ${index} missing required fields (amount, date)`);
        }
      });
    }

    // Validate expenses
    if (data.expenses) {
      data.expenses.forEach((expense, index) => {
        if (!expense.amount || !expense.date) {
          throw new Error(`Expense at index ${index} missing required fields (amount, date)`);
        }
      });
    }
  }

  createManualBackup() {
    const backupData = this.exportAllData();
    const backupKey = `${STORAGE_KEYS.DATA_BACKUP}-${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    return backupKey;
  }

  restoreFromBackup(backupKey) {
    try {
      const backupData = JSON.parse(localStorage.getItem(backupKey));
      if (!backupData) {
        throw new Error('Backup not found');
      }

      return this.importData(backupData, { merge: false, createBackup: false });
    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  clearAllUserData() {
    clearAllData();
    this.customers = [];
    this.revenues = [];
    this.expenses = [];
    this.userSettings = {
      currency: 'USD',
      dateFormat: 'yyyy-MM-dd',
      theme: 'light',
      autoBackup: true,
      showSampleData: false
    };
  }

  // User Settings Methods
  updateUserSettings(newSettings) {
    this.userSettings = { ...this.userSettings, ...newSettings };
    saveToStorage(STORAGE_KEYS.USER_SETTINGS, this.userSettings);
    return this.userSettings;
  }

  getUserSettings() {
    return this.userSettings;
  }
}

// Create singleton instance
const dataStore = new DataStore();

export default dataStore;
