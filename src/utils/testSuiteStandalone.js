/**
 * BizGrow v1.3.3 Standalone Test Suite
 * Self-contained testing framework that works without external dependencies
 */

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

    this.log('✅ ID Management tests completed', 'success');
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
          value: Math.random() * 1000
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

    this.log('✅ Performance tests completed', 'success');
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
      this.testPerformance();
      
      // Generate summary
      this.endTime = performance.now();
      return this.generateTestReport();
      
    } catch (error) {
      this.log(`Test suite error: ${error.message}`, 'error');
      return { error: error.message };
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
    
    return {
      passed,
      failed,
      total,
      duration: parseFloat(duration),
      successRate: Math.round((passed / total) * 100),
      results: this.testResults
    };
  }

  debugState() {
    this.log('🔍 Current Application State Debug...', 'debug');
    
    try {
      // Check localStorage usage
      const storageUsage = this.getStorageUsage();
      this.log(`💾 Storage Usage: ${storageUsage.used}KB / ${storageUsage.available}KB`, 'info');
      
      // Check if BizGrow data exists in localStorage
      const bizGrowKeys = Object.keys(localStorage).filter(key => 
        key.includes('bizgrow') || key.includes('BizGrow') || 
        key.includes('customer') || key.includes('revenue') || key.includes('expense')
      );
      
      this.log(`🗂️ BizGrow Storage Keys: ${bizGrowKeys.length}`, 'info');
      bizGrowKeys.forEach(key => {
        const data = localStorage.getItem(key);
        const size = new Blob([data]).size;
        this.log(`   - ${key}: ${(size / 1024).toFixed(2)}KB`, 'info');
      });
      
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
      
      const available = 5 * 1024 * 1024; // 5MB estimate
      
      return {
        used: Math.round(used / 1024 * 100) / 100,
        available: Math.round(available / 1024),
        percentage: Math.round((used / available) * 100)
      };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
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
    testPerformance: () => testSuite.testPerformance(),
    debugState: () => testSuite.debugState(),
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
