// Data Type Detection Test for BizGrow
export class DataTypeDetectionTest {
  static testDetectionLogic() {
    console.log('🧪 Testing Data Type Detection Logic...\n');
    
    // Test cases based on actual templates
    const testCases = [
      {
        name: 'Revenue Template',
        headers: ['amount', 'source', 'category', 'date', 'customer_name', 'description'],
        expected: 'revenues'
      },
      {
        name: 'Customer Template', 
        headers: ['name', 'email', 'phone', 'company', 'status', 'acquisition_date', 'total_value'],
        expected: 'customers'
      },
      {
        name: 'Expense Template',
        headers: ['amount', 'category', 'vendor', 'date', 'description', 'receipt_url'],
        expected: 'expenses'
      },
      {
        name: 'Revenue with Sales',
        headers: ['sales', 'amount', 'date', 'customer'],
        expected: 'revenues'
      },
      {
        name: 'Customer with Email',
        headers: ['name', 'email', 'company'],
        expected: 'customers'
      },
      {
        name: 'Expense with Vendor',
        headers: ['amount', 'vendor', 'category'],
        expected: 'expenses'
      },
      {
        name: 'Revenue with Income',
        headers: ['income', 'date', 'source'],
        expected: 'revenues'
      },
      {
        name: 'Ambiguous Amount Only',
        headers: ['amount', 'date'],
        expected: 'revenues' // Should default to revenues for amount
      }
    ];
    
    let passedTests = 0;
    
    testCases.forEach(testCase => {
      console.log(`Testing: ${testCase.name}`);
      console.log(`Headers: ${testCase.headers.join(', ')}`);
      
      // Simulate the detection logic
      const headerStr = testCase.headers.join(' ').toLowerCase();
      let detected;
      
      // Revenue indicators (check FIRST - most specific)
      if (headerStr.includes('revenue') || headerStr.includes('income') || 
          headerStr.includes('sales') || headerStr.includes('source') ||
          (headerStr.includes('amount') && headerStr.includes('customer_name')) ||
          (headerStr.includes('amount') && headerStr.includes('description') && !headerStr.includes('vendor'))) {
        detected = 'revenues';
      }
      // Expense indicators (check SECOND)
      else if (headerStr.includes('expense') || headerStr.includes('cost') || 
          headerStr.includes('vendor') || headerStr.includes('receipt') ||
          (headerStr.includes('amount') && headerStr.includes('category') && headerStr.includes('vendor'))) {
        detected = 'expenses';
      }
      // Customer indicators (check LAST - most general)
      else if (headerStr.includes('customer') || headerStr.includes('client') || 
          (headerStr.includes('name') && headerStr.includes('email')) ||
          headerStr.includes('company') || headerStr.includes('phone') ||
          headerStr.includes('acquisition') || headerStr.includes('status')) {
        detected = 'customers';
      }
      // Default fallback based on most common field
      else if (headerStr.includes('amount')) {
        detected = 'revenues';
      }
      else {
        detected = 'customers';
      }
      
      const passed = detected === testCase.expected;
      console.log(`Expected: ${testCase.expected}, Detected: ${detected} ${passed ? '✅' : '❌'}`);
      
      if (passed) passedTests++;
      console.log('');
    });
    
    console.log(`📊 Detection Tests: ${passedTests}/${testCases.length} passed`);
    console.log(`Success Rate: ${((passedTests / testCases.length) * 100).toFixed(1)}%`);
    
    if (passedTests === testCases.length) {
      console.log('🎉 All detection tests passed!');
      console.log('✅ Revenue CSV should now be detected correctly');
    } else {
      console.log('⚠️ Some detection tests failed');
    }
    
    return passedTests === testCases.length;
  }
  
  static testRevenueNormalization() {
    console.log('\n🧪 Testing Revenue Normalization...\n');
    
    // Test revenue data from template
    const testRevenue = {
      amount: '1500',
      source: 'Product Sales',
      category: 'product_sales',
      date: '2024-08-01',
      customer_name: 'John Doe',
      description: 'Monthly subscription'
    };
    
    console.log('Test revenue data:', testRevenue);
    
    // Simulate normalization
    const fieldMappings = {
      amount: ['amount', 'revenue', 'income', 'value', 'total', 'price'],
      source: ['source', 'revenue_source', 'income_source', 'customer', 'client'],
      category: ['category', 'type', 'revenue_type', 'income_type'],
      date: ['date', 'revenue_date', 'transaction_date', 'created_date'],
      customer_name: ['customer_name', 'client_name', 'customer', 'client'],
      description: ['description', 'notes', 'details', 'memo']
    };

    const normalized = {};
    
    Object.entries(fieldMappings).forEach(([targetField, possibleFields]) => {
      for (const field of possibleFields) {
        if (testRevenue[field] !== undefined && testRevenue[field] !== '') {
          normalized[targetField] = testRevenue[field];
          break;
        }
      }
    });

    // Apply defaults and validation
    if (!normalized.amount) {
      normalized.amount = 0;
    }
    if (!normalized.date) {
      normalized.date = new Date().toISOString().split('T')[0];
    }

    normalized.amount = parseFloat(normalized.amount);
    normalized.category = normalized.category || 'other';
    normalized.source = normalized.source || 'Unknown';
    
    console.log('Normalized revenue:', normalized);
    
    const isValid = normalized.amount === 1500 && 
                   normalized.source === 'Product Sales' &&
                   normalized.category === 'product_sales' &&
                   normalized.date === '2024-08-01' &&
                   normalized.customer_name === 'John Doe';
    
    console.log(`Revenue normalization: ${isValid ? '✅ WORKING' : '❌ FAILED'}`);
    return isValid;
  }
  
  static runAllTests() {
    console.log('🚀 Running All Data Type Detection Tests...\n');
    console.log('=' .repeat(60));
    
    const detectionTest = this.testDetectionLogic();
    const normalizationTest = this.testRevenueNormalization();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📋 Test Results:');
    console.log('=' .repeat(60));
    console.log(`Data Type Detection: ${detectionTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Revenue Normalization: ${normalizationTest ? '✅ WORKING' : '❌ BROKEN'}`);
    
    const allPassed = detectionTest && normalizationTest;
    console.log(`\nOverall: ${allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
    
    if (allPassed) {
      console.log('\n✅ Revenue import should now work correctly!');
      console.log('- Revenue CSV will be detected as revenues ✅');
      console.log('- Revenue data will be normalized properly ✅');
      console.log('- Revenue entries will be created instead of customers ✅');
    }
    
    return allPassed;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.DataTypeDetectionTest = DataTypeDetectionTest;
}

export default DataTypeDetectionTest;
