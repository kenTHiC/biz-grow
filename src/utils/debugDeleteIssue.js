// Debug Delete Issue - BizGrow v1.2.0
export class DebugDeleteIssue {
  static async testDataStoreDirectly() {
    console.log('🔍 Testing DataStore Delete Methods Directly...\n');
    
    try {
      // Import dataStore directly
      const dataStore = (await import('../store/dataStore.js')).default;
      
      console.log('Current DataStore state:');
      console.log('Revenues:', dataStore.revenues.length);
      console.log('Expenses:', dataStore.expenses.length);
      
      // Test creating a revenue
      console.log('\n1. Creating test revenue...');
      const testRevenue = dataStore.addRevenue({
        amount: 999,
        source: 'Debug Test',
        category: 'other',
        date: '2024-08-18'
      });
      console.log('Created revenue:', testRevenue);
      console.log('Revenue count after create:', dataStore.revenues.length);
      
      // Test deleting the revenue
      console.log('\n2. Deleting test revenue...');
      const deleteResult = dataStore.deleteRevenue(testRevenue.id);
      console.log('Delete result:', deleteResult);
      console.log('Revenue count after delete:', dataStore.revenues.length);
      
      // Check localStorage
      console.log('\n3. Checking localStorage...');
      const storedRevenues = JSON.parse(localStorage.getItem('biz-grow-revenues') || '[]');
      console.log('Stored revenues count:', storedRevenues.length);
      console.log('Test revenue still in storage:', storedRevenues.some(r => r.id === testRevenue.id));
      
      return deleteResult !== null;
      
    } catch (error) {
      console.error('Error testing DataStore directly:', error);
      return false;
    }
  }
  
  static async testEntityLayer() {
    console.log('\n🔍 Testing Entity Layer (Revenue/Expense classes)...\n');
    
    try {
      const { Revenue, Expense } = await import('../entities/all.js');
      
      // Test Revenue entity
      console.log('1. Testing Revenue entity...');
      const initialRevenues = await Revenue.list();
      console.log('Initial revenue count:', initialRevenues.length);
      
      // Create test revenue
      const testRevenue = await Revenue.create({
        amount: 888,
        source: 'Entity Test',
        category: 'other',
        date: '2024-08-18'
      });
      console.log('Created revenue via entity:', testRevenue);
      
      const afterCreate = await Revenue.list();
      console.log('Count after create:', afterCreate.length);
      
      // Delete test revenue
      console.log('Deleting revenue via entity...');
      const deleteResult = await Revenue.delete(testRevenue.id);
      console.log('Entity delete result:', deleteResult);
      
      const afterDelete = await Revenue.list();
      console.log('Count after delete:', afterDelete.length);
      
      const entityWorking = afterDelete.length === initialRevenues.length;
      console.log(`Entity layer working: ${entityWorking ? '✅' : '❌'}`);
      
      return entityWorking;
      
    } catch (error) {
      console.error('Error testing entity layer:', error);
      return false;
    }
  }
  
  static async testReactStateIssue() {
    console.log('\n🔍 Testing React State Management Issue...\n');
    
    // This simulates what happens in the Reports component
    try {
      const { Revenue } = await import('../entities/all.js');
      
      // Simulate loadData function
      console.log('1. Simulating loadData function...');
      const loadData = async () => {
        const revenueData = await Revenue.list();
        console.log('LoadData returned:', revenueData.length, 'revenues');
        return revenueData;
      };
      
      // Simulate delete + reload cycle
      console.log('2. Simulating delete + reload cycle...');
      const beforeData = await loadData();
      
      if (beforeData.length > 0) {
        const toDelete = beforeData[0];
        console.log('Deleting revenue ID:', toDelete.id);
        
        const deleteResult = await Revenue.delete(toDelete.id);
        console.log('Delete result:', deleteResult);
        
        console.log('Reloading data...');
        const afterData = await loadData();
        
        const stateUpdateWorking = afterData.length === beforeData.length - 1;
        console.log(`State update working: ${stateUpdateWorking ? '✅' : '❌'}`);
        console.log(`Before: ${beforeData.length}, After: ${afterData.length}`);
        
        return stateUpdateWorking;
      } else {
        console.log('No data to test with');
        return true;
      }
      
    } catch (error) {
      console.error('Error testing React state:', error);
      return false;
    }
  }
  
  static async testBulkDeleteLogic() {
    console.log('\n🔍 Testing Bulk Delete Logic...\n');
    
    try {
      const { Revenue } = await import('../entities/all.js');
      
      // Create multiple test items
      console.log('1. Creating test items for bulk delete...');
      const testItems = [];
      for (let i = 1; i <= 3; i++) {
        const item = await Revenue.create({
          amount: 100 * i,
          source: `Bulk Test ${i}`,
          category: 'other',
          date: '2024-08-18'
        });
        testItems.push(item);
        console.log(`Created test item ${i}:`, item.id);
      }
      
      const beforeCount = (await Revenue.list()).length;
      console.log('Count before bulk delete:', beforeCount);
      
      // Simulate bulk delete
      console.log('2. Performing bulk delete...');
      const selectedIds = testItems.map(item => item.id);
      console.log('Selected IDs for deletion:', selectedIds);
      
      // This simulates the bulk delete logic from Reports.jsx
      const deletePromises = selectedIds.map(id => Revenue.delete(id));
      const deleteResults = await Promise.all(deletePromises);
      console.log('Bulk delete results:', deleteResults);
      
      const afterCount = (await Revenue.list()).length;
      console.log('Count after bulk delete:', afterCount);
      
      const expectedCount = beforeCount - testItems.length;
      const bulkDeleteWorking = afterCount === expectedCount;
      
      console.log(`Bulk delete working: ${bulkDeleteWorking ? '✅' : '❌'}`);
      console.log(`Expected: ${expectedCount}, Actual: ${afterCount}`);
      
      return bulkDeleteWorking;
      
    } catch (error) {
      console.error('Error testing bulk delete:', error);
      return false;
    }
  }
  
  static async runFullDiagnostic() {
    console.log('🚨 RUNNING FULL DELETE DIAGNOSTIC...\n');
    console.log('=' .repeat(60));
    
    const dataStoreTest = await this.testDataStoreDirectly();
    const entityTest = await this.testEntityLayer();
    const stateTest = await this.testReactStateIssue();
    const bulkTest = await this.testBulkDeleteLogic();
    
    console.log('\n' + '=' .repeat(60));
    console.log('🔍 DIAGNOSTIC RESULTS:');
    console.log('=' .repeat(60));
    console.log(`DataStore Layer: ${dataStoreTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Entity Layer: ${entityTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`State Management: ${stateTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Bulk Delete Logic: ${bulkTest ? '✅ WORKING' : '❌ BROKEN'}`);
    
    if (dataStoreTest && entityTest && stateTest && bulkTest) {
      console.log('\n✅ ALL LAYERS WORKING - Issue might be in UI event handling');
      console.log('Check: onClick handlers, event propagation, React rendering');
    } else {
      console.log('\n❌ FOUND BROKEN LAYERS - Issue is in the data layer');
      if (!dataStoreTest) console.log('- Fix DataStore delete methods');
      if (!entityTest) console.log('- Fix Entity layer delete methods');
      if (!stateTest) console.log('- Fix state management after delete');
      if (!bulkTest) console.log('- Fix bulk delete logic');
    }
    
    return dataStoreTest && entityTest && stateTest && bulkTest;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.DebugDeleteIssue = DebugDeleteIssue;
}

export default DebugDeleteIssue;
