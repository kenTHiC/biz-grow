# 🔧 API Reference

Comprehensive API documentation for BizGrow v1.3.3 components, data models, and utility functions.

---

## 📋 Table of Contents

- [Data Store API](#-data-store-api)
- [Entity Models](#-entity-models)
- [Component APIs](#-component-apis)
- [Utility Functions](#-utility-functions)
- [Test Suite API](#-test-suite-api)

---

## 🗄️ Data Store API

### **DataStore Class**

The central data management system for BizGrow.

#### **Constructor**
```javascript
const dataStore = new DataStore();
```

#### **Version Methods**
```javascript
// Get application version
dataStore.getAppVersion()
// Returns: "1.3.3"

// Get data schema version
dataStore.getDataVersion()
// Returns: "1.0.0"

// Get comprehensive version info
dataStore.getVersionInfo()
// Returns: { app: "1.3.3", data: "1.0.0", source: "package.json" }
```

#### **Customer Methods**
```javascript
// Get all customers
dataStore.getAllCustomers()
// Returns: Customer[]

// Add new customer
dataStore.addCustomer(customerData)
// Parameters: { name, email, phone?, company?, status?, total_value?, acquisition_date? }
// Returns: Customer

// Update customer
dataStore.updateCustomer(id, updates)
// Parameters: id (string|number), updates (Partial<Customer>)
// Returns: Customer

// Delete customer
dataStore.deleteCustomer(id)
// Parameters: id (string|number)
// Returns: boolean
```

#### **Revenue Methods**
```javascript
// Get all revenues
dataStore.getAllRevenues()
// Returns: Revenue[]

// Add new revenue
dataStore.addRevenue(revenueData)
// Parameters: { amount, source, customer_name?, date?, description? }
// Returns: Revenue

// Update revenue
dataStore.updateRevenue(id, updates)
// Parameters: id (string|number), updates (Partial<Revenue>)
// Returns: Revenue

// Delete revenue
dataStore.deleteRevenue(id)
// Parameters: id (string|number)
// Returns: boolean
```

#### **Expense Methods**
```javascript
// Get all expenses
dataStore.getAllExpenses()
// Returns: Expense[]

// Add new expense
dataStore.addExpense(expenseData)
// Parameters: { amount, category, vendor?, date?, description? }
// Returns: Expense

// Update expense
dataStore.updateExpense(id, updates)
// Parameters: id (string|number), updates (Partial<Expense>)
// Returns: Expense

// Delete expense
dataStore.deleteExpense(id)
// Parameters: id (string|number)
// Returns: boolean
```

#### **Data Management Methods**
```javascript
// Import data
dataStore.importData(data, options)
// Parameters: data (object), options ({ merge: boolean })
// Returns: { success: boolean, message: string, summary: object }

// Export data
dataStore.exportData(format, options)
// Parameters: format ("json"|"csv"), options (object)
// Returns: string|object

// Clear all data
dataStore.clearAllUserData()
// Returns: void

// Backup data
dataStore.createBackup()
// Returns: { timestamp: string, data: object }

// Restore from backup
dataStore.restoreFromBackup(backupData)
// Returns: boolean
```

---

## 📊 Entity Models

### **Customer Model**
```typescript
interface Customer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'potential' | 'active' | 'inactive';
  total_value: number;
  acquisition_date: string; // ISO date string
  created_at?: string;
  updated_at?: string;
}
```

### **Revenue Model**
```typescript
interface Revenue {
  id: string | number;
  amount: number;
  source: string;
  customer_name?: string;
  date: string; // ISO date string
  description?: string;
  created_at?: string;
  updated_at?: string;
}
```

### **Expense Model**
```typescript
interface Expense {
  id: string | number;
  amount: number;
  category: string;
  vendor?: string;
  date: string; // ISO date string
  description?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

## 🧩 Component APIs

### **TestRunner Component**
```jsx
<TestRunner 
  isVisible={boolean}
  onClose={() => void}
/>
```

**Props:**
- `isVisible` (boolean): Controls dialog visibility
- `onClose` (function): Callback when dialog is closed

### **ConfirmationModal Component**
```jsx
<ConfirmationModal
  isOpen={boolean}
  onClose={() => void}
  onConfirm={() => void}
  title={string}
  message={string}
  confirmText={string}
  cancelText={string}
  variant={'default' | 'danger' | 'warning'}
  icon={ReactNode}
/>
```

### **DataManager Component**
```jsx
<DataManager
  isOpen={boolean}
  onClose={() => void}
  onDataChange={() => void}
/>
```

---

## 🛠️ Utility Functions

### **Category Management**
```javascript
import CategoryManager from './utils/categories';

// Get all categories
CategoryManager.getAllCategories()
// Returns: string[]

// Add new category
CategoryManager.addCategory(name)
// Parameters: name (string)
// Returns: boolean

// Remove category
CategoryManager.removeCategory(name)
// Parameters: name (string)
// Returns: boolean

// Get default categories
CategoryManager.getDefaultCategories()
// Returns: string[]
```

### **Data Import/Export**
```javascript
import DataImporter from './utils/dataImporter';
import DataExporter from './utils/dataExporter';

// Import CSV data
DataImporter.importCSV(csvString, options)
// Parameters: csvString (string), options (object)
// Returns: { data: object[], errors: string[] }

// Export to CSV
DataExporter.exportToCSV(data, filename)
// Parameters: data (object[]), filename (string)
// Returns: void (triggers download)

// Export to JSON
DataExporter.exportToJSON(data, filename)
// Parameters: data (object), filename (string)
// Returns: void (triggers download)
```

### **Date Utilities**
```javascript
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Format date for display
format(new Date(), 'yyyy-MM-dd')
// Returns: "2024-12-19"

// Get date range
const startDate = startOfMonth(new Date());
const endDate = endOfMonth(new Date());
```

---

## 🧪 Test Suite API

### **Global Test Suite Object**
```javascript
// Available in browser console as window.BizGrowTestSuite

// Run all tests
window.BizGrowTestSuite.runAllTests()
// Returns: Promise<TestResults>

// Run quick tests
window.BizGrowTestSuite.quickTest()
// Returns: { passed: number, total: number, success: boolean }

// Individual test categories
window.BizGrowTestSuite.testMultiSelection()
window.BizGrowTestSuite.testModalSystem()
window.BizGrowTestSuite.testIdManagement()
window.BizGrowTestSuite.testPerformance()
window.BizGrowTestSuite.testVersionSynchronization()

// Utility functions
window.BizGrowTestSuite.debugState()
window.BizGrowTestSuite.exportResults()
// Returns: TestExportData
```

### **Test Results Interface**
```typescript
interface TestResults {
  passed: number;
  failed: number;
  total: number;
  duration: number;
  successRate: number;
  results: TestResult[];
}

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
  timestamp: string;
}

interface TestExportData {
  timestamp: string;
  version: string;
  environment: {
    userAgent: string;
    url: string;
    localStorage: StorageInfo;
  };
  summary: TestResults;
  details: TestResult[];
}
```

---

## 🔄 Event System

### **Custom Events**
```javascript
// Data change events
document.addEventListener('bizgrow:dataChanged', (event) => {
  console.log('Data changed:', event.detail);
});

// Selection change events
document.addEventListener('bizgrow:selectionChanged', (event) => {
  console.log('Selection changed:', event.detail);
});

// Modal events
document.addEventListener('bizgrow:modalOpened', (event) => {
  console.log('Modal opened:', event.detail);
});
```

---

## 🔒 Error Handling

### **Error Types**
```javascript
// Data validation errors
class ValidationError extends Error {
  constructor(field, message) {
    super(`Validation error in ${field}: ${message}`);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Import/export errors
class DataError extends Error {
  constructor(operation, message) {
    super(`Data ${operation} error: ${message}`);
    this.name = 'DataError';
    this.operation = operation;
  }
}
```

### **Error Handling Patterns**
```javascript
try {
  const result = await dataStore.addCustomer(customerData);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error(`Validation failed: ${error.message}`);
  } else {
    toast.error(`Unexpected error: ${error.message}`);
  }
  throw error;
}
```

---

## 📱 React Hooks

### **Custom Hooks**
```javascript
// Test runner keyboard hook
import { useTestRunnerKeyboard } from './components/TestRunner';

function MyComponent() {
  const toggleTestRunner = () => setShowTestRunner(prev => !prev);
  useTestRunnerKeyboard(toggleTestRunner);
}

// Toast notifications
import { useToast } from './components/ui/toast';

function MyComponent() {
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast.success('Operation completed!');
  };
  
  const handleError = () => {
    toast.error('Something went wrong!');
  };
}
```

---

## 🔧 Configuration

### **Environment Variables**
```javascript
// Available in import.meta.env
const config = {
  appName: import.meta.env.VITE_APP_NAME || 'BizGrow',
  version: import.meta.env.VITE_APP_VERSION || '1.3.3',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
};
```

---

## 📞 Support

For API-related questions:
- **Documentation**: Check this reference and inline code comments
- **Examples**: See component usage in the codebase
- **Issues**: Report API bugs on [GitHub](https://github.com/kenTHiC/biz-grow/issues)
- **Community**: Ask questions in [Discord](https://discord.gg/s27WGufPgp)
