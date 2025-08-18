// Comprehensive Test Suite for BizGrow v1.1.0
import DataImporter from './dataImporter';
import DataExporter from './dataExporter';
import dataStore from '../store/dataStore';

export class BizGrowTestSuite {
  constructor() {
    this.testResults = [];
    this.testData = this.generateTestData();
  }

  generateTestData() {
    return {
      customers: [
        {
          id: 1,
          name: "Test Customer 1",
          email: "test1@example.com",
          phone: "+1-555-0123",
          company: "Test Corp",
          status: "active",
          acquisition_date: "2024-01-15",
          total_value: 5000
        },
        {
          id: 2,
          name: "Test Customer 2",
          email: "test2@example.com",
          phone: "+1-555-0456",
          company: "Test Inc",
          status: "potential",
          acquisition_date: "2024-02-20",
          total_value: 3000
        }
      ],
      revenues: [
        {
          id: 1,
          amount: 1500,
          source: "Product Sales",
          category: "product_sales",
          date: "2024-08-01",
          customer_name: "Test Customer 1"
        },
        {
          id: 2,
          amount: 2000,
          source: "Consulting",
          category: "consulting",
          date: "2024-08-05",
          customer_name: "Test Customer 2"
        }
      ],
      expenses: [
        {
          id: 1,
          amount: 500,
          category: "software",
          vendor: "Software Company",
          date: "2024-08-01",
          description: "Monthly software license"
        },
        {
          id: 2,
          amount: 300,
          category: "marketing",
          vendor: "Ad Company",
          date: "2024-08-02",
          description: "Online advertising"
        }
      ]
    };
  }

  async runAllTests() {
    console.log('🧪 Starting BizGrow Test Suite...\n');
    
    // Test Export Functionality
    await this.testExportFunctionality();
    
    // Test Import Functionality
    await this.testImportFunctionality();
    
    // Test Data Store Operations
    await this.testDataStoreOperations();
    
    // Test Backup and Restore
    await this.testBackupRestore();
    
    // Test Data Validation
    await this.testDataValidation();
    
    // Test Analytics
    await this.testAnalytics();
    
    // Print Results
    this.printTestResults();
    
    return this.testResults;
  }

  async testExportFunctionality() {
    console.log('📤 Testing Export Functionality...');
    
    try {
      // Test JSON Export
      const jsonResult = await DataExporter.exportData(this.testData, 'json', {
        filename: 'test-export-json'
      });
      this.addTestResult('JSON Export', jsonResult.success, 'Export completed successfully');
      
      // Test CSV Export
      const csvResult = await DataExporter.exportData(this.testData, 'csv', {
        filename: 'test-export-csv'
      });
      this.addTestResult('CSV Export', csvResult.success, 'Export completed successfully');
      
      // Test Excel Export
      const excelResult = await DataExporter.exportData(this.testData, 'xlsx', {
        filename: 'test-export-excel'
      });
      this.addTestResult('Excel Export', excelResult.success, 'Export completed successfully');
      
      // Test Template Generation
      await DataExporter.generateTemplate('customers', 'csv');
      this.addTestResult('Template Generation', true, 'Customer template generated');
      
    } catch (error) {
      this.addTestResult('Export Functionality', false, `Export failed: ${error.message}`);
    }
  }

  async testImportFunctionality() {
    console.log('📥 Testing Import Functionality...');
    
    try {
      // Test JSON Import
      const jsonData = JSON.stringify(this.testData);
      const jsonFile = new File([jsonData], 'test.json', { type: 'application/json' });
      const jsonImport = await DataImporter.importFile(jsonFile);
      this.addTestResult('JSON Import', !!jsonImport.customers, 'JSON import successful');
      
      // Test CSV Import (simulate CSV data)
      const csvData = 'name,email,phone,company,status,acquisition_date,total_value\nTest CSV Customer,csv@test.com,555-1234,CSV Corp,active,2024-01-01,1000';
      const csvFile = new File([csvData], 'test.csv', { type: 'text/csv' });
      const csvImport = await DataImporter.importFile(csvFile);
      this.addTestResult('CSV Import', !!csvImport.customers, 'CSV import successful');
      
      // Test Import Preview
      const preview = DataImporter.generateImportPreview(this.testData);
      this.addTestResult('Import Preview', !!preview.customers, 'Import preview generated');
      
    } catch (error) {
      this.addTestResult('Import Functionality', false, `Import failed: ${error.message}`);
    }
  }

  async testDataStoreOperations() {
    console.log('🗄️ Testing Data Store Operations...');
    
    try {
      // Test data import
      const importResult = await dataStore.importData(this.testData, {
        merge: false,
        validateData: true,
        createBackup: true
      });
      this.addTestResult('Data Store Import', importResult.success, 'Data imported to store');
      
      // Test data export
      const exportData = dataStore.exportAllData();
      this.addTestResult('Data Store Export', !!exportData.customers, 'Data exported from store');
      
      // Test user settings
      const settings = dataStore.updateUserSettings({ currency: 'EUR' });
      this.addTestResult('User Settings', settings.currency === 'EUR', 'Settings updated');
      
      // Test analytics
      const analytics = dataStore.getAnalytics();
      this.addTestResult('Analytics Generation', !!analytics.totalRevenue, 'Analytics calculated');
      
    } catch (error) {
      this.addTestResult('Data Store Operations', false, `Store operations failed: ${error.message}`);
    }
  }

  async testBackupRestore() {
    console.log('💾 Testing Backup and Restore...');
    
    try {
      // Create backup
      const backupKey = dataStore.createManualBackup();
      this.addTestResult('Manual Backup', !!backupKey, 'Backup created successfully');
      
      // Clear data
      dataStore.clearAllUserData();
      const emptyData = dataStore.exportAllData();
      this.addTestResult('Data Clear', emptyData.customers.length === 0, 'Data cleared successfully');
      
      // Restore from backup
      await dataStore.restoreFromBackup(backupKey);
      const restoredData = dataStore.exportAllData();
      this.addTestResult('Data Restore', restoredData.customers.length > 0, 'Data restored successfully');
      
    } catch (error) {
      this.addTestResult('Backup/Restore', false, `Backup/restore failed: ${error.message}`);
    }
  }

  async testDataValidation() {
    console.log('✅ Testing Data Validation...');
    
    try {
      // Test valid data
      dataStore.validateImportData(this.testData);
      this.addTestResult('Valid Data Validation', true, 'Valid data passed validation');
      
      // Test invalid data
      try {
        dataStore.validateImportData({ customers: [{ name: 'Test' }] }); // Missing email
        this.addTestResult('Invalid Data Validation', false, 'Invalid data should have failed');
      } catch (validationError) {
        this.addTestResult('Invalid Data Validation', true, 'Invalid data correctly rejected');
      }
      
      // Test data normalization
      const normalizedCustomer = DataImporter.normalizeCustomer({
        customer_name: 'Test Customer',
        email_address: 'test@example.com',
        contact_phone: '555-1234'
      });
      this.addTestResult('Data Normalization', normalizedCustomer.name === 'Test Customer', 'Data normalized correctly');
      
    } catch (error) {
      this.addTestResult('Data Validation', false, `Validation failed: ${error.message}`);
    }
  }

  async testAnalytics() {
    console.log('📊 Testing Analytics...');
    
    try {
      // Import test data first
      await dataStore.importData(this.testData, { merge: false });
      
      // Test basic analytics
      const analytics = dataStore.getAnalytics();
      this.addTestResult('Basic Analytics', analytics.totalRevenue > 0, 'Revenue calculated correctly');
      this.addTestResult('Profit Calculation', analytics.netProfit !== undefined, 'Profit calculated');
      this.addTestResult('Customer Count', analytics.activeCustomers >= 0, 'Customer count calculated');
      
      // Test date range filtering
      const dateRange = {
        from: new Date('2024-08-01'),
        to: new Date('2024-08-31')
      };
      const filteredAnalytics = dataStore.getAnalytics(dateRange);
      this.addTestResult('Date Range Analytics', filteredAnalytics.totalRevenue >= 0, 'Date filtering works');
      
    } catch (error) {
      this.addTestResult('Analytics', false, `Analytics failed: ${error.message}`);
    }
  }

  addTestResult(testName, passed, message) {
    this.testResults.push({
      test: testName,
      passed,
      message,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${testName}: ${message}`);
  }

  printTestResults() {
    console.log('\n📋 Test Results Summary:');
    console.log('========================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(`  - ${result.test}: ${result.message}`);
        });
    }
    
    console.log('\n🎉 Testing Complete!');
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: (passedTests / totalTests) * 100
    };
  }

  // Quick test method for development
  static async quickTest() {
    const testSuite = new BizGrowTestSuite();
    return await testSuite.runAllTests();
  }
}

// Export for use in development
export default BizGrowTestSuite;

// Add to window for browser console testing
if (typeof window !== 'undefined') {
  window.BizGrowTestSuite = BizGrowTestSuite;
}
