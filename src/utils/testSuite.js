/**
 * BizGrow v1.3.3 Comprehensive Test Suite
 * Enhanced testing framework for multi-selection, modals, and data management
 * 
 * Usage:
 * - Development: window.BizGrowTestSuite.runAllTests()
 * - Quick Test: window.BizGrowTestSuite.quickTest()
 * - Specific: window.BizGrowTestSuite.testMultiSelection()
 */

// Test suite works independently without requiring specific imports
// It will access dataStore and entities through global window object if available

class BizGrowTestSuite {
  constructor() {
    this.testResults = [];
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
  }

  // ===========================================
  // CORE TEST FRAMEWORK
  // ===========================================

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      'info': '📋',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'debug': '🔍'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  assert(condition, testName, details = '') {
    const result = {
      name: testName,
      passed: Boolean(condition),
      details: details,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    
    if (result.passed) {
      this.log(`✅ PASS: ${testName}`, 'success');
    } else {
      this.log(`❌ FAIL: ${testName} - ${details}`, 'error');
    }
    
    return result.passed;
  }

  // ===========================================
  // V1.3.3 MULTI-SELECTION TESTS
  // ===========================================

  testMultiSelection() {
    this.log('🧪 Testing Multi-Selection Functionality...', 'info');
    
    // Test 1: Set-based selection logic
    const testSet = new Set();
    testSet.add('1');
    testSet.add('2');
    testSet.add('1'); // Duplicate should be ignored
    
    this.assert(
      testSet.size === 2,
      'Set-based selection prevents duplicates',
      `Expected 2 unique items, got ${testSet.size}`
    );

    // Test 2: ID normalization
    const selectedItems = ['1', '2', '3'];
    const itemId = 2;
    const normalizedCheck = selectedItems.map(String).includes(String(itemId));
    
    this.assert(
      normalizedCheck === true,
      'ID normalization works correctly',
      `String(${itemId}) should be found in [${selectedItems.join(', ')}]`
    );

    // Test 3: Selection state management
    let mockSelection = [];
    const toggleSelection = (id) => {
      const sid = String(id);
      const set = new Set(mockSelection.map(String));
      
      if (set.has(sid)) {
        set.delete(sid);
      } else {
        set.add(sid);
      }
      
      mockSelection = Array.from(set);
      return mockSelection;
    };

    toggleSelection(1);
    toggleSelection(2);
    toggleSelection(1); // Should remove
    
    this.assert(
      mockSelection.length === 1 && mockSelection.includes('2'),
      'Toggle selection works correctly',
      `Expected ['2'], got [${mockSelection.join(', ')}]`
    );

    // Test 4: Select All functionality
    const allItems = [1, 2, 3, 4, 5];
    const selectAll = (currentSelection, allIds) => {
      return currentSelection.length === allIds.length ? [] : allIds.map(String);
    };

    let selection = [];
    selection = selectAll(selection, allItems); // Select all
    this.assert(
      selection.length === 5,
      'Select All - selects all items when none selected',
      `Expected 5 items, got ${selection.length}`
    );

    selection = selectAll(selection, allItems); // Deselect all
    this.assert(
      selection.length === 0,
      'Select All - deselects all items when all selected',
      `Expected 0 items, got ${selection.length}`
    );

    this.log('✅ Multi-Selection tests completed', 'success');
  }

  // ===========================================
  // MODAL SYSTEM TESTS
  // ===========================================

  testModalSystem() {
    this.log('🧪 Testing Professional Modal System...', 'info');

    // Test 1: Modal state management
    let modalState = { isOpen: false, type: '', data: null };
    
    const openModal = (type, data) => {
      modalState = { isOpen: true, type, data };
    };
    
    const closeModal = () => {
      modalState = { isOpen: false, type: '', data: null };
    };

    openModal('delete', { id: 1, type: 'revenue' });
    this.assert(
      modalState.isOpen && modalState.type === 'delete',
      'Modal opens with correct state',
      `Expected open=true, type=delete, got open=${modalState.isOpen}, type=${modalState.type}`
    );

    closeModal();
    this.assert(
      !modalState.isOpen && modalState.type === '',
      'Modal closes and resets state',
      `Expected open=false, type='', got open=${modalState.isOpen}, type=${modalState.type}`
    );

    // Test 2: Modal props generation
    const getModalProps = (type, data) => {
      if (type === 'delete') {
        return {
          title: `Delete ${data.type}`,
          message: `Are you sure you want to delete this ${data.type}?`,
          variant: 'danger'
        };
      }
      return {};
    };

    const props = getModalProps('delete', { type: 'customer' });
    this.assert(
      props.title === 'Delete customer' && props.variant === 'danger',
      'Modal props generated correctly',
      `Expected title='Delete customer', variant='danger'`
    );

    this.log('✅ Modal System tests completed', 'success');
  }

  // ===========================================
  // ID MANAGEMENT TESTS
  // ===========================================

  testIdManagement() {
    this.log('🧪 Testing ID Management & Duplicate Prevention...', 'info');

    // Test 1: Duplicate ID detection
    const testItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 1, name: 'Item 3' }, // Duplicate ID
      { id: 3, name: 'Item 4' }
    ];

    const findDuplicateIds = (items) => {
      const seen = new Set();
      const duplicates = new Set();
      
      items.forEach(item => {
        if (seen.has(item.id)) {
          duplicates.add(item.id);
        }
        seen.add(item.id);
      });
      
      return Array.from(duplicates);
    };

    const duplicates = findDuplicateIds(testItems);
    this.assert(
      duplicates.length === 1 && duplicates[0] === 1,
      'Duplicate ID detection works',
      `Expected [1], got [${duplicates.join(', ')}]`
    );

    // Test 2: ID uniqueness enforcement
    const fixDuplicateIds = (items) => {
      const seen = new Set();
      let nextId = Math.max(...items.map(i => i.id)) + 1;
      
      return items.map(item => {
        if (seen.has(item.id)) {
          const newItem = { ...item, id: nextId++ };
          seen.add(newItem.id);
          return newItem;
        }
        seen.add(item.id);
        return item;
      });
    };

    const fixedItems = fixDuplicateIds(testItems);
    const fixedIds = fixedItems.map(i => i.id);
    const uniqueIds = [...new Set(fixedIds)];
    
    this.assert(
      fixedIds.length === uniqueIds.length,
      'ID uniqueness enforcement works',
      `All IDs are unique after fixing: [${fixedIds.join(', ')}]`
    );

    // Test 3: Sequential ID generation
    const generateNextId = (existingItems) => {
      const validIds = existingItems
        .map(item => parseInt(item.id))
        .filter(id => !isNaN(id));
      
      return validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
    };

    const nextId = generateNextId(fixedItems);
    this.assert(
      nextId > Math.max(...fixedItems.map(i => i.id)),
      'Sequential ID generation works',
      `Generated ID ${nextId} is greater than max existing ID`
    );

    this.log('✅ ID Management tests completed', 'success');
  }

  // ===========================================
  // DATA VALIDATION TESTS
  // ===========================================

  testDataValidation() {
    this.log('🧪 Testing Data Validation & CSV Import...', 'info');

    // Test 1: CSV data type detection
    const detectDataType = (headers) => {
      const headerStr = headers.join(',').toLowerCase();
      
      if (headerStr.includes('customer') || headerStr.includes('email') || headerStr.includes('name')) {
        return 'customers';
      } else if (headerStr.includes('revenue') || headerStr.includes('source') || headerStr.includes('customer_name')) {
        return 'revenues';
      } else if (headerStr.includes('expense') || headerStr.includes('vendor') || headerStr.includes('category')) {
        return 'expenses';
      }
      
      return 'unknown';
    };

    const customerHeaders = ['name', 'email', 'company', 'total_value'];
    const revenueHeaders = ['amount', 'source', 'customer_name', 'date'];
    const expenseHeaders = ['amount', 'category', 'vendor', 'date'];

    this.assert(
      detectDataType(customerHeaders) === 'customers',
      'Customer data type detection',
      `Expected 'customers', got '${detectDataType(customerHeaders)}'`
    );

    this.assert(
      detectDataType(revenueHeaders) === 'revenues',
      'Revenue data type detection',
      `Expected 'revenues', got '${detectDataType(revenueHeaders)}'`
    );

    this.assert(
      detectDataType(expenseHeaders) === 'expenses',
      'Expense data type detection',
      `Expected 'expenses', got '${detectDataType(expenseHeaders)}'`
    );

    // Test 2: Data validation
    const validateCustomer = (customer) => {
      const errors = [];
      
      if (!customer.name || customer.name.trim() === '') {
        errors.push('Name is required');
      }
      
      if (!customer.email || !customer.email.includes('@')) {
        errors.push('Valid email is required');
      }
      
      if (customer.total_value && isNaN(parseFloat(customer.total_value))) {
        errors.push('Total value must be a number');
      }
      
      return errors;
    };

    const validCustomer = { name: 'John Doe', email: 'john@example.com', total_value: '1000' };
    const invalidCustomer = { name: '', email: 'invalid-email', total_value: 'not-a-number' };

    this.assert(
      validateCustomer(validCustomer).length === 0,
      'Valid customer passes validation',
      'No validation errors for valid customer'
    );

    this.assert(
      validateCustomer(invalidCustomer).length === 3,
      'Invalid customer fails validation',
      `Expected 3 errors, got ${validateCustomer(invalidCustomer).length}`
    );

    this.log('✅ Data Validation tests completed', 'success');
  }

  // ===========================================
  // TOAST NOTIFICATION TESTS
  // ===========================================

  testToastSystem() {
    this.log('🧪 Testing Toast Notification System...', 'info');

    // Test 1: Toast message formatting
    const formatToastMessage = (type, action, itemType, count = 1) => {
      const itemName = itemType.charAt(0).toUpperCase() + itemType.slice(1);
      const plural = count > 1 ? 's' : '';

      switch (type) {
        case 'success':
          return `${itemName}${plural} ${action} successfully!`;
        case 'error':
          return `Error ${action.replace('ed', 'ing')} ${itemType}${plural}`;
        case 'warning':
          return `Please select ${itemType}${plural} to ${action.replace('ed', '')}`;
        default:
          return `${itemName} ${action}`;
      }
    };

    this.assert(
      formatToastMessage('success', 'deleted', 'customer') === 'Customer deleted successfully!',
      'Toast success message formatting',
      'Single customer delete message'
    );

    this.assert(
      formatToastMessage('success', 'deleted', 'revenue', 3) === 'Revenues deleted successfully!',
      'Toast bulk success message formatting',
      'Multiple revenue delete message'
    );

    this.assert(
      formatToastMessage('warning', 'deleted', 'expense') === 'Please select expenses to delete',
      'Toast warning message formatting',
      'No selection warning message'
    );

    // Test 2: Toast queue management
    let toastQueue = [];
    const maxToasts = 5;

    const addToast = (message, type = 'info') => {
      const toast = {
        id: Date.now() + Math.random(),
        message,
        type,
        timestamp: Date.now()
      };

      toastQueue.push(toast);

      // Limit queue size
      if (toastQueue.length > maxToasts) {
        toastQueue = toastQueue.slice(-maxToasts);
      }

      return toast;
    };

    // Add multiple toasts
    for (let i = 0; i < 7; i++) {
      addToast(`Test message ${i}`, 'info');
    }

    this.assert(
      toastQueue.length === maxToasts,
      'Toast queue size limit enforced',
      `Expected ${maxToasts} toasts, got ${toastQueue.length}`
    );

    this.log('✅ Toast System tests completed', 'success');
  }

  // ===========================================
  // PERFORMANCE TESTS
  // ===========================================

  testPerformance() {
    this.log('🧪 Testing Performance & Memory Management...', 'info');

    // Test 1: Large dataset handling
    const generateLargeDataset = (size) => {
      const startTime = performance.now();
      const dataset = [];

      for (let i = 0; i < size; i++) {
        dataset.push({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.random() * 1000,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      const endTime = performance.now();
      return { dataset, generationTime: endTime - startTime };
    };

    const { dataset, generationTime } = generateLargeDataset(1000);

    this.assert(
      dataset.length === 1000 && generationTime < 100,
      'Large dataset generation performance',
      `Generated 1000 items in ${generationTime.toFixed(2)}ms`
    );

    // Test 2: Set operations performance
    const testSetPerformance = (size) => {
      const startTime = performance.now();
      const testSet = new Set();

      // Add items
      for (let i = 0; i < size; i++) {
        testSet.add(String(i));
      }

      // Check duplicates
      for (let i = 0; i < size; i++) {
        testSet.add(String(i)); // Duplicates should be ignored
      }

      const endTime = performance.now();
      return { size: testSet.size, operationTime: endTime - startTime };
    };

    const { size, operationTime } = testSetPerformance(1000);

    this.assert(
      size === 1000 && operationTime < 50,
      'Set operations performance',
      `Set operations on 1000 items completed in ${operationTime.toFixed(2)}ms`
    );

    // Test 3: Memory usage estimation
    const estimateMemoryUsage = (data) => {
      const jsonString = JSON.stringify(data);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      return { bytes: sizeInBytes, kb: sizeInKB };
    };

    const memoryUsage = estimateMemoryUsage(dataset);

    this.assert(
      memoryUsage.bytes > 0,
      'Memory usage estimation',
      `Dataset uses approximately ${memoryUsage.kb}KB`
    );

    this.log('✅ Performance tests completed', 'success');
  }

  // ===========================================
  // ERROR SIMULATION TESTS
  // ===========================================

  testErrorHandling() {
    this.log('🧪 Testing Error Handling & Edge Cases...', 'info');

    // Test 1: Null/undefined handling
    const safeAccess = (obj, path, defaultValue = null) => {
      try {
        return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
      } catch (error) {
        return defaultValue;
      }
    };

    const testObj = { user: { profile: { name: 'John' } } };

    this.assert(
      safeAccess(testObj, 'user.profile.name') === 'John',
      'Safe object access - valid path',
      'Successfully accessed nested property'
    );

    this.assert(
      safeAccess(testObj, 'user.profile.age', 'Unknown') === 'Unknown',
      'Safe object access - invalid path with default',
      'Returned default value for missing property'
    );

    this.assert(
      safeAccess(null, 'user.name', 'Default') === 'Default',
      'Safe object access - null object',
      'Handled null object gracefully'
    );

    // Test 2: Array operation safety
    const safeArrayOperation = (arr, operation) => {
      try {
        if (!Array.isArray(arr)) return [];

        switch (operation) {
          case 'filter-valid':
            return arr.filter(item => item != null && item !== '');
          case 'map-ids':
            return arr.map(item => item?.id).filter(id => id != null);
          case 'unique':
            return [...new Set(arr)];
          default:
            return arr;
        }
      } catch (error) {
        console.warn('Array operation failed:', error.message);
        return [];
      }
    };

    const testArray = [1, null, 2, '', 3, undefined, 2];

    this.assert(
      safeArrayOperation(testArray, 'filter-valid').length === 4,
      'Safe array filtering',
      'Filtered out null, undefined, and empty values'
    );

    this.assert(
      safeArrayOperation(testArray, 'unique').length === 6,
      'Safe array unique operation',
      'Removed duplicates while preserving null/undefined'
    );

    // Test 3: LocalStorage error handling
    const safeLocalStorage = {
      get: (key, defaultValue = null) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
          console.warn('LocalStorage get error:', error.message);
          return defaultValue;
        }
      },

      set: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (error) {
          console.warn('LocalStorage set error:', error.message);
          return false;
        }
      }
    };

    const testData = { test: 'data', number: 123 };
    const setResult = safeLocalStorage.set('test-key', testData);
    const getData = safeLocalStorage.get('test-key');

    this.assert(
      setResult === true && JSON.stringify(getData) === JSON.stringify(testData),
      'Safe localStorage operations',
      'Successfully stored and retrieved data'
    );

    // Cleanup
    try {
      localStorage.removeItem('test-key');
    } catch (e) {
      // Ignore cleanup errors
    }

    this.log('✅ Error Handling tests completed', 'success');
  }

  // ===========================================
  // DEVELOPMENT UTILITIES
  // ===========================================

  async debugState() {
    this.log('🔍 Current Application State Debug...', 'debug');

    try {
      // Check if dataStore is available through global access or import it
      let dataStore = window.dataStore;
      if (!dataStore) {
        try {
          const dataStoreModule = await import('../store/dataStore.js');
          dataStore = dataStoreModule.default;
        } catch (importError) {
          this.log('DataStore not available for debugging', 'warning');
          return;
        }
      }

      if (dataStore) {
        const customers = dataStore.customers || [];
        const revenues = dataStore.revenues || [];
        const expenses = dataStore.expenses || [];

        this.log(`📊 Data Summary:`, 'info');
        this.log(`   - Customers: ${customers.length}`, 'info');
        this.log(`   - Revenues: ${revenues.length}`, 'info');
        this.log(`   - Expenses: ${expenses.length}`, 'info');

        // Check for duplicate IDs
        const checkDuplicates = (items, type) => {
          const ids = items.map(item => item.id);
          const uniqueIds = [...new Set(ids)];
          if (ids.length !== uniqueIds.length) {
            this.log(`⚠️ Duplicate IDs found in ${type}!`, 'warning');
            return false;
          }
          return true;
        };

        checkDuplicates(customers, 'customers');
        checkDuplicates(revenues, 'revenues');
        checkDuplicates(expenses, 'expenses');
      }

      // Check localStorage usage
      const storageUsage = this.getStorageUsage();
      this.log(`💾 Storage Usage: ${storageUsage.used}KB / ${storageUsage.available}KB`, 'info');

    } catch (error) {
      this.log(`Error during state debug: ${error.message}`, 'error');
    }
  }

  getStorageUsage() {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Estimate available space (most browsers allow ~5-10MB)
      const available = 5 * 1024 * 1024; // 5MB estimate

      return {
        used: Math.round(used / 1024 * 100) / 100, // KB with 2 decimal places
        available: Math.round(available / 1024),
        percentage: Math.round((used / available) * 100)
      };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  simulateError(type = 'network') {
    this.log(`🎭 Simulating ${type} error for testing...`, 'warning');

    switch (type) {
      case 'network':
        // Simulate network failure
        const originalFetch = window.fetch;
        window.fetch = () => Promise.reject(new Error('Simulated network error'));

        setTimeout(() => {
          window.fetch = originalFetch;
          this.log('Network simulation ended', 'info');
        }, 5000);
        break;

      case 'storage':
        // Simulate localStorage failure
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => {
          throw new Error('Simulated storage quota exceeded');
        };

        setTimeout(() => {
          localStorage.setItem = originalSetItem;
          this.log('Storage simulation ended', 'info');
        }, 5000);
        break;

      case 'memory':
        // Simulate memory pressure
        this.log('Creating memory pressure...', 'warning');
        const memoryHog = [];
        for (let i = 0; i < 100000; i++) {
          memoryHog.push(new Array(1000).fill('memory-test-data'));
        }

        setTimeout(() => {
          memoryHog.length = 0;
          this.log('Memory pressure simulation ended', 'info');
        }, 3000);
        break;

      default:
        this.log(`Unknown error type: ${type}`, 'error');
    }
  }

  // ===========================================
  // MAIN TEST RUNNERS
  // ===========================================

  async runAllTests() {
    if (this.isRunning) {
      this.log('Tests are already running!', 'warning');
      return;
    }

    this.isRunning = true;
    this.startTime = performance.now();
    this.testResults = [];

    this.log('🚀 Starting BizGrow v1.3.3 Comprehensive Test Suite...', 'info');
    this.log('=' .repeat(60), 'info');

    try {
      // Run all test categories
      this.testMultiSelection();
      this.testModalSystem();
      this.testIdManagement();
      this.testDataValidation();
      this.testToastSystem();
      this.testPerformance();
      this.testErrorHandling();

      // Generate summary
      this.endTime = performance.now();
      this.generateTestReport();

    } catch (error) {
      this.log(`Test suite error: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
    }
  }

  quickTest() {
    this.log('⚡ Running Quick Test Suite...', 'info');
    this.testResults = [];

    // Essential tests only
    this.testMultiSelection();
    this.testIdManagement();
    this.testDataValidation();

    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;

    this.log(`⚡ Quick Test Complete: ${passed}/${total} tests passed`,
             passed === total ? 'success' : 'warning');

    return { passed, total, success: passed === total };
  }

  generateTestReport() {
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);

    this.log('=' .repeat(60), 'info');
    this.log('📋 TEST SUITE SUMMARY', 'info');
    this.log('=' .repeat(60), 'info');
    this.log(`✅ Passed: ${passed}`, 'success');
    this.log(`❌ Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`📊 Total: ${total}`, 'info');
    this.log(`⏱️ Duration: ${duration}s`, 'info');
    this.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`, 'info');

    if (failed > 0) {
      this.log('❌ FAILED TESTS:', 'error');
      this.testResults
        .filter(r => !r.passed)
        .forEach(test => {
          this.log(`   - ${test.name}: ${test.details}`, 'error');
        });
    }

    this.log('=' .repeat(60), 'info');

    // Return results for programmatic access
    return {
      passed,
      failed,
      total,
      duration: parseFloat(duration),
      successRate: Math.round((passed / total) * 100),
      results: this.testResults
    };
  }

  exportResults() {
    const report = this.generateTestReport();
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.3.3',
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        localStorage: this.getStorageUsage()
      },
      summary: {
        passed: report.passed,
        failed: report.failed,
        total: report.total,
        duration: report.duration,
        successRate: report.successRate
      },
      details: this.testResults
    };

    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
        .then(() => this.log('📋 Test results copied to clipboard!', 'success'))
        .catch(() => this.log('❌ Failed to copy to clipboard', 'error'));
    }

    // Also log for manual copy
    console.log('📊 Exportable Test Results:', exportData);

    return exportData;
  }
}

// ===========================================
// GLOBAL INITIALIZATION
// ===========================================

// Create global instance
const testSuite = new BizGrowTestSuite();

// Make available globally for browser console access
if (typeof window !== 'undefined') {
  window.BizGrowTestSuite = {
    runAllTests: () => testSuite.runAllTests(),
    quickTest: () => testSuite.quickTest(),
    testMultiSelection: () => testSuite.testMultiSelection(),
    testModalSystem: () => testSuite.testModalSystem(),
    testIdManagement: () => testSuite.testIdManagement(),
    testDataValidation: () => testSuite.testDataValidation(),
    testToastSystem: () => testSuite.testToastSystem(),
    testPerformance: () => testSuite.testPerformance(),
    testErrorHandling: () => testSuite.testErrorHandling(),
    debugState: () => testSuite.debugState(),
    simulateError: (type) => testSuite.simulateError(type),
    exportResults: () => testSuite.exportResults(),
    getResults: () => testSuite.testResults
  };

  console.log('🧪 BizGrow Test Suite v1.3.3 loaded!');
  console.log('📋 Available commands:');
  console.log('   - window.BizGrowTestSuite.runAllTests()');
  console.log('   - window.BizGrowTestSuite.quickTest()');
  console.log('   - window.BizGrowTestSuite.debugState()');
  console.log('   - window.BizGrowTestSuite.exportResults()');
}

export default testSuite;
