// Data Store with localStorage persistence
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const STORAGE_KEYS = {
  CUSTOMERS: 'biz-grow-customers',
  REVENUES: 'biz-grow-revenues',
  EXPENSES: 'biz-grow-expenses'
};

// Initial sample data
const initialCustomers = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1-555-0123",
    company: "Acme Corporation",
    status: "active",
    acquisition_date: "2024-01-15",
    total_value: 25000,
    last_purchase_date: "2024-08-10"
  },
  {
    id: 2,
    name: "Tech Solutions Inc",
    email: "info@techsolutions.com",
    phone: "+1-555-0456",
    company: "Tech Solutions Inc",
    status: "active",
    acquisition_date: "2024-02-20",
    total_value: 18500,
    last_purchase_date: "2024-08-05"
  },
  {
    id: 3,
    name: "Global Enterprises",
    email: "sales@global.com",
    phone: "+1-555-0789",
    company: "Global Enterprises",
    status: "potential",
    acquisition_date: "2024-07-10",
    total_value: 5000,
    last_purchase_date: null
  }
];

const initialRevenues = [
  {
    id: 1,
    amount: 8500,
    source: "Software License",
    category: "licensing",
    date: "2024-08-10",
    customer_name: "Acme Corporation",
    description: "Annual software license renewal"
  },
  {
    id: 2,
    amount: 12000,
    source: "Consulting Services",
    category: "consulting",
    date: "2024-08-05",
    customer_name: "Tech Solutions Inc",
    description: "Q3 consulting project completion"
  },
  {
    id: 3,
    amount: 3200,
    source: "Product Sales",
    category: "product_sales",
    date: "2024-08-01",
    customer_name: "Global Enterprises",
    description: "Initial product purchase"
  },
  {
    id: 4,
    amount: 5500,
    source: "Subscription",
    category: "subscription",
    date: "2024-07-28",
    customer_name: "Acme Corporation",
    description: "Monthly subscription fee"
  },
  {
    id: 5,
    amount: 7800,
    source: "Service Revenue",
    category: "service_revenue",
    date: "2024-07-25",
    customer_name: "Tech Solutions Inc",
    description: "Support services"
  }
];

const initialExpenses = [
  {
    id: 1,
    amount: 2500,
    category: "software",
    vendor: "Microsoft",
    date: "2024-08-01",
    description: "Office 365 licenses",
    receipt_url: null
  },
  {
    id: 2,
    amount: 3200,
    category: "rent",
    vendor: "Property Management Co",
    date: "2024-08-01",
    description: "Monthly office rent",
    receipt_url: null
  },
  {
    id: 3,
    amount: 1200,
    category: "marketing",
    vendor: "Google Ads",
    date: "2024-07-30",
    description: "Online advertising campaign",
    receipt_url: null
  },
  {
    id: 4,
    amount: 800,
    category: "utilities",
    vendor: "Electric Company",
    date: "2024-07-28",
    description: "Monthly electricity bill",
    receipt_url: null
  },
  {
    id: 5,
    amount: 1500,
    category: "office_supplies",
    vendor: "Office Depot",
    date: "2024-07-25",
    description: "Office furniture and supplies",
    receipt_url: null
  }
];

// Utility functions
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
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

const generateId = (existingItems) => {
  return existingItems.length > 0 
    ? Math.max(...existingItems.map(item => item.id)) + 1 
    : 1;
};

// Data Store Class
class DataStore {
  constructor() {
    this.customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    this.revenues = loadFromStorage(STORAGE_KEYS.REVENUES, initialRevenues);
    this.expenses = loadFromStorage(STORAGE_KEYS.EXPENSES, initialExpenses);
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
}

// Create singleton instance
const dataStore = new DataStore();

export default dataStore;
