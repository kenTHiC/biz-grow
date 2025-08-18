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
  if (existingItems.length === 0) {
    return 1;
  }

  // Filter out items with null or invalid IDs and get valid IDs
  const validIds = existingItems
    .map(item => item.id)
    .filter(id => id !== null && id !== undefined && !isNaN(id))
    .map(id => parseInt(id));

  console.log('generateId: existingItems count:', existingItems.length);
  console.log('generateId: validIds:', validIds);

  if (validIds.length === 0) {
    console.log('generateId: No valid IDs found, starting from 1');
    return 1;
  }

  const nextId = Math.max(...validIds) + 1;
  console.log('generateId: Generated ID:', nextId);
  return nextId;
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

// Data migration function to fix null IDs
const fixNullIds = (items, itemType) => {
  console.log(`Checking ${itemType} for null IDs...`);
  let hasNullIds = false;
  let nextId = 1;

  // Find the highest valid ID first
  const validIds = items
    .map(item => item.id)
    .filter(id => id !== null && id !== undefined && !isNaN(id))
    .map(id => parseInt(id));

  if (validIds.length > 0) {
    nextId = Math.max(...validIds) + 1;
  }

  // Fix items with null IDs
  const fixedItems = items.map(item => {
    if (item.id === null || item.id === undefined || isNaN(item.id)) {
      console.log(`Fixing ${itemType} with null ID:`, item);
      hasNullIds = true;
      return { ...item, id: nextId++ };
    }
    return item;
  });

  if (hasNullIds) {
    console.log(`Fixed ${itemType} with null IDs. New data:`, fixedItems.map(i => ({ id: i.id, amount: i.amount })));
  }

  return fixedItems;
};

// Data migration function to ensure unique IDs (fix duplicates)
const fixDuplicateIds = (items, itemType) => {
  console.log(`Checking ${itemType} for duplicate IDs...`);
  const seen = new Set();
  let changed = false;

  // Determine next available ID
  const validIds = items
    .map(item => item.id)
    .filter(id => id !== null && id !== undefined && !isNaN(id))
    .map(id => parseInt(id));
  let nextId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;

  const fixed = items.map(item => {
    const rawId = item.id;
    const idNum = parseInt(rawId);
    if (isNaN(idNum) || seen.has(idNum)) {
      const newItem = { ...item, id: nextId++ };
      changed = true;
      console.log(`Reassigning duplicate/invalid ${itemType} ID ${rawId} -> ${newItem.id}`);
      seen.add(newItem.id);
      return newItem;
    }
    seen.add(idNum);
    return { ...item, id: idNum };
  });

  if (changed) {
    console.log(`${itemType}: Duplicate IDs fixed. IDs:`, fixed.map(i => i.id));
  }

  return fixed;
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

    // Load data and fix null/duplicate IDs
    this.customers = fixDuplicateIds(fixNullIds(loadFromStorage(STORAGE_KEYS.CUSTOMERS, []), 'customers'), 'customers');
    this.revenues = fixDuplicateIds(fixNullIds(loadFromStorage(STORAGE_KEYS.REVENUES, []), 'revenues'), 'revenues');
    this.expenses = fixDuplicateIds(fixNullIds(loadFromStorage(STORAGE_KEYS.EXPENSES, []), 'expenses'), 'expenses');

    // Save fixed data back to storage
    saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
    saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);

    // Mark user as returning after first load
    if (this.isFirstTime) {
      markUserAsReturning();
    }
  }

  // Customer methods
  getCustomers(sortBy = '-acquisition_date') {
    // Filter out any invalid customers
    const validCustomers = this.customers.filter(customer =>
      customer &&
      customer.id !== null &&
      customer.id !== undefined &&
      customer.email &&
      customer.name
    );

    let sorted = [...validCustomers];
    if (sortBy === '-acquisition_date') {
      sorted.sort((a, b) => new Date(b.acquisition_date) - new Date(a.acquisition_date));
    }
    return sorted;
  }

  getCustomer(id) {
    return this.customers.find(c => c.id === parseInt(id));
  }

  addCustomer(customerData) {
    // Check for duplicate email
    const existingCustomer = this.customers.find(c =>
      c.email.toLowerCase() === customerData.email.toLowerCase()
    );

    if (existingCustomer) {
      throw new Error(`Customer with email ${customerData.email} already exists`);
    }

    const newCustomer = {
      ...customerData,
      id: generateId(this.customers),
      acquisition_date: customerData.acquisition_date || format(new Date(), 'yyyy-MM-dd'),
      total_value: parseFloat(customerData.total_value) || 0,
      email: customerData.email.toLowerCase() // Normalize email
    };

    console.log('DataStore adding customer:', newCustomer);
    this.customers.push(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    return newCustomer;
  }

  updateCustomer(id, customerData) {
    const index = this.customers.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      const currentCustomer = this.customers[index];

      // Check for duplicate email only if email is being changed
      if (customerData.email && customerData.email.toLowerCase() !== currentCustomer.email.toLowerCase()) {
        const existingCustomer = this.customers.find(c =>
          c.email.toLowerCase() === customerData.email.toLowerCase() &&
          c.id !== parseInt(id)
        );

        if (existingCustomer) {
          throw new Error(`Customer with email ${customerData.email} already exists`);
        }
      }

      // Ensure all fields are properly updated
      const updatedCustomer = {
        ...currentCustomer,
        ...customerData,
        id: parseInt(id), // Ensure ID remains as integer
        total_value: parseFloat(customerData.total_value) || 0,
        acquisition_date: customerData.acquisition_date || currentCustomer.acquisition_date,
        email: customerData.email ? customerData.email.toLowerCase() : currentCustomer.email
      };

      console.log('DataStore updating customer:', id, updatedCustomer);
      this.customers[index] = updatedCustomer;
      saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
      console.log('Customer updated in dataStore:', this.customers[index]);
      return this.customers[index];
    }
    console.error('Customer not found for update:', id);
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
    console.log('DataStore: Attempting to delete revenue with ID:', id);
    console.log('Current revenues count:', this.revenues.length);
    console.log('Current revenues:', this.revenues.map(r => ({ id: r.id, amount: r.amount })));

    const index = this.revenues.findIndex(r => r.id === parseInt(id));
    console.log('Found revenue at index:', index);

    if (index !== -1) {
      const deleted = this.revenues.splice(index, 1)[0];
      console.log('Deleted revenue:', deleted);
      console.log('Remaining revenues count:', this.revenues.length);

      saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
      console.log('Revenue deleted and saved to storage');
      return deleted;
    }

    console.log('Revenue not found for deletion');
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
    console.log('DataStore: Attempting to delete expense with ID:', id);
    console.log('Current expenses count:', this.expenses.length);
    console.log('Current expenses:', this.expenses.map(e => ({ id: e.id, amount: e.amount })));

    const index = this.expenses.findIndex(e => e.id === parseInt(id));
    console.log('Found expense at index:', index);

    if (index !== -1) {
      const deleted = this.expenses.splice(index, 1)[0];
      console.log('Deleted expense:', deleted);
      console.log('Remaining expenses count:', this.expenses.length);

      saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
      console.log('Expense deleted and saved to storage');
      return deleted;
    }

    console.log('Expense not found for deletion');
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
        console.log('Processing customer import:', data.customers.length, 'customers');
        console.log('Sample customer data:', data.customers[0]);

        // Generate IDs properly for all customers
        let nextId = this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1;

        const importedCustomers = data.customers.map((customer, index) => {
          const processedCustomer = {
            ...customer,
            id: customer.id || nextId++, // Use sequential ID generation
            acquisition_date: customer.acquisition_date || format(new Date(), 'yyyy-MM-dd'),
            total_value: parseFloat(customer.total_value) || 0,
            email: customer.email ? customer.email.toLowerCase() : '',
            phone: customer.phone || '',
            company: customer.company || '',
            status: customer.status || 'potential'
          };

          console.log(`Processing customer ${index + 1}:`, processedCustomer);
          return processedCustomer;
        });

        if (merge) {
          // Filter out duplicates when merging (only check against existing customers, not within import)
          const existingEmails = new Set(this.customers.map(c => c.email.toLowerCase()));
          const uniqueCustomers = importedCustomers.filter((c, index) => {
            const email = c.email.toLowerCase();
            const isUnique = !existingEmails.has(email);
            if (!isUnique) {
              console.log(`Filtering duplicate customer ${index + 1}:`, c.email, '(already exists in database)');
            } else {
              console.log(`Adding unique customer ${index + 1}:`, c.email);
            }
            return isUnique;
          });
          console.log(`Merging ${uniqueCustomers.length} unique customers out of ${importedCustomers.length} imported`);
          this.customers = [...this.customers, ...uniqueCustomers];
        } else {
          console.log('Replacing all customers with imported data');
          console.log('Imported customers:', importedCustomers.map(c => ({ id: c.id, email: c.email, name: c.name })));
          this.customers = importedCustomers;
        }

        console.log('Final customer count:', this.customers.length);
      }

      // Import revenues
      if (data.revenues && Array.isArray(data.revenues)) {
        // Assign fresh unique IDs to avoid duplicates
        const existing = this.revenues;
        let nextId = existing.length ? Math.max(...existing.map(r => parseInt(r.id) || 0)) + 1 : 1;
        const importedRevenues = data.revenues.map(revenue => ({
          ...revenue,
          id: nextId++,
          date: revenue.date || format(new Date(), 'yyyy-MM-dd'),
          amount: parseFloat(revenue.amount) || 0
        }));

        if (merge) {
          this.revenues = [...this.revenues, ...importedRevenues];
        } else {
          this.revenues = importedRevenues;
        }

        console.log('Imported revenues:', this.revenues.length);
      }

      // Import expenses
      if (data.expenses && Array.isArray(data.expenses)) {
        // Assign fresh unique IDs to avoid duplicates
        const existingE = this.expenses;
        let nextEId = existingE.length ? Math.max(...existingE.map(e => parseInt(e.id) || 0)) + 1 : 1;
        const importedExpenses = data.expenses.map(expense => ({
          ...expense,
          id: nextEId++,
          date: expense.date || format(new Date(), 'yyyy-MM-dd'),
          amount: parseFloat(expense.amount) || 0
        }));

        if (merge) {
          this.expenses = [...this.expenses, ...importedExpenses];
        } else {
          this.expenses = importedExpenses;
        }

        console.log('Imported expenses:', this.expenses.length);
      }

      // Save all data to localStorage
      console.log('Saving imported data to localStorage...');
      console.log('Customers to save:', this.customers.length);
      console.log('Revenues to save:', this.revenues.length);
      console.log('Expenses to save:', this.expenses.length);

      saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
      saveToStorage(STORAGE_KEYS.REVENUES, this.revenues);
      saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);

      // Verify data was saved
      const savedCustomers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, []);
      const savedRevenues = loadFromStorage(STORAGE_KEYS.REVENUES, []);
      const savedExpenses = loadFromStorage(STORAGE_KEYS.EXPENSES, []);

      console.log('Verified saved data:');
      console.log('Customers saved:', savedCustomers.length);
      console.log('Revenues saved:', savedRevenues.length);
      console.log('Expenses saved:', savedExpenses.length);

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
