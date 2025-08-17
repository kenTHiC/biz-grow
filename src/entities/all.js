// Entity classes using the data store
import dataStore from '../store/dataStore.js';

// Simulate API delay for realistic UX
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export class Revenue {
  static async list(sortBy = '-date') {
    await delay();
    return dataStore.getRevenues(sortBy);
  }

  static async get(id) {
    await delay(200);
    return dataStore.getRevenues().find(r => r.id === parseInt(id));
  }

  static async create(revenueData) {
    await delay(200);
    return dataStore.addRevenue(revenueData);
  }

  static async update(id, revenueData) {
    await delay(200);
    return dataStore.updateRevenue(id, revenueData);
  }

  static async delete(id) {
    await delay(200);
    return dataStore.deleteRevenue(id);
  }
}

export class Expense {
  static async list(sortBy = '-date') {
    await delay();
    return dataStore.getExpenses(sortBy);
  }

  static async get(id) {
    await delay(200);
    return dataStore.getExpenses().find(e => e.id === parseInt(id));
  }

  static async create(expenseData) {
    await delay(200);
    return dataStore.addExpense(expenseData);
  }

  static async update(id, expenseData) {
    await delay(200);
    return dataStore.updateExpense(id, expenseData);
  }

  static async delete(id) {
    await delay(200);
    return dataStore.deleteExpense(id);
  }
}

export class Customer {
  static async list(sortBy = '-acquisition_date') {
    await delay();
    return dataStore.getCustomers(sortBy);
  }

  static async get(id) {
    await delay(200);
    return dataStore.getCustomer(id);
  }

  static async create(customerData) {
    await delay(200);
    return dataStore.addCustomer(customerData);
  }

  static async update(id, customerData) {
    await delay(200);
    return dataStore.updateCustomer(id, customerData);
  }

  static async delete(id) {
    await delay(200);
    return dataStore.deleteCustomer(id);
  }
}

// Analytics helper
export class Analytics {
  static async getAnalytics(dateRange = null) {
    await delay();
    return dataStore.getAnalytics(dateRange);
  }
}
