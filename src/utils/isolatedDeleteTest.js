// Isolated Delete Test - Test delete functionality without UI
export class IsolatedDeleteTest {
  static async testDataStoreDirectly() {
    console.log('🔬 Testing DataStore directly...\n');
    
    try {
      // Import dataStore directly
      const dataStore = (await import('../store/dataStore.js')).default;
      
      console.log('1. Initial state:');
      console.log('Revenues:', dataStore.revenues.length);
      console.log('Expenses:', dataStore.expenses.length);
      
      // Create a test revenue
      console.log('\n2. Creating test revenue...');
      const testRevenue = dataStore.addRevenue({
        amount: 999,
        source: 'Isolated Test',
        category: 'other',
        date: '2024-08-18'
      });
      console.log('Created:', testRevenue);
      console.log('Revenue count after create:', dataStore.revenues.length);
      
      // Delete the test revenue
      console.log('\n3. Deleting test revenue...');
      const deleteResult = dataStore.deleteRevenue(testRevenue.id);
      console.log('Delete result:', deleteResult);
      console.log('Revenue count after delete:', dataStore.revenues.length);
      
      // Check localStorage
      console.log('\n4. Checking localStorage...');
      const storedRevenues = JSON.parse(localStorage.getItem('biz-grow-revenues') || '[]');
      console.log('Stored revenue count:', storedRevenues.length);
      const stillInStorage = storedRevenues.some(r => r.id === testRevenue.id);
      console.log('Test revenue still in storage:', stillInStorage);
      
      const success = deleteResult !== null && !stillInStorage;
      console.log(`\nDataStore test: ${success ? '✅ PASSED' : '❌ FAILED'}`);
      
      return success;
      
    } catch (error) {
      console.error('DataStore test error:', error);
      return false;
    }
  }
  
  static async testEntityLayerDirectly() {
    console.log('\n🔬 Testing Entity Layer directly...\n');
    
    try {
      const { Revenue } = await import('../entities/all.js');
      
      console.log('1. Getting initial revenue list...');
      const initialRevenues = await Revenue.list();
      console.log('Initial count:', initialRevenues.length);
      
      // Create test revenue
      console.log('\n2. Creating test revenue via entity...');
      const testRevenue = await Revenue.create({
        amount: 888,
        source: 'Entity Test',
        category: 'other',
        date: '2024-08-18'
      });
      console.log('Created:', testRevenue);
      
      const afterCreate = await Revenue.list();
      console.log('Count after create:', afterCreate.length);
      
      // Delete test revenue
      console.log('\n3. Deleting test revenue via entity...');
      const deleteResult = await Revenue.delete(testRevenue.id);
      console.log('Delete result:', deleteResult);
      
      const afterDelete = await Revenue.list();
      console.log('Count after delete:', afterDelete.length);
      
      const success = afterDelete.length === initialRevenues.length;
      console.log(`\nEntity test: ${success ? '✅ PASSED' : '❌ FAILED'}`);
      
      return success;
      
    } catch (error) {
      console.error('Entity test error:', error);
      return false;
    }
  }
  
  static async testReportsPageLoadData() {
    console.log('\n🔬 Testing Reports page loadData function...\n');
    
    try {
      const { Revenue, Expense, Customer } = await import('../entities/all.js');
      
      console.log('1. Simulating Reports loadData...');
      const loadData = async () => {
        const [revenueData, expenseData, customerData] = await Promise.all([
          Revenue.list(),
          Expense.list(),
          Customer.list()
        ]);
        
        console.log('LoadData results:', {
          revenues: revenueData.length,
          expenses: expenseData.length,
          customers: customerData.length
        });
        
        return { revenueData, expenseData, customerData };
      };
      
      const beforeData = await loadData();
      
      if (beforeData.revenueData.length > 0) {
        console.log('\n2. Deleting first revenue...');
        const toDelete = beforeData.revenueData[0];
        console.log('Deleting revenue ID:', toDelete.id);
        
        const deleteResult = await Revenue.delete(toDelete.id);
        console.log('Delete result:', deleteResult);
        
        console.log('\n3. Reloading data...');
        const afterData = await loadData();
        
        const success = afterData.revenueData.length === beforeData.revenueData.length - 1;
        console.log(`\nLoadData test: ${success ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Before: ${beforeData.revenueData.length}, After: ${afterData.revenueData.length}`);
        
        return success;
      } else {
        console.log('No revenues to test with');
        return true;
      }
      
    } catch (error) {
      console.error('LoadData test error:', error);
      return false;
    }
  }
  
  static async testSelectionLogic() {
    console.log('\n🔬 Testing Selection Logic...\n');
    
    // Simulate the selection state management
    let selectedItems = [];
    
    const toggleItemSelection = (id) => {
      console.log(`Toggling selection for ID: ${id}`);
      console.log('Before toggle:', selectedItems);
      
      if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(itemId => itemId !== id);
      } else {
        selectedItems = [...selectedItems, id];
      }
      
      console.log('After toggle:', selectedItems);
      return selectedItems;
    };
    
    // Test selecting individual items
    console.log('1. Selecting item 1...');
    toggleItemSelection(1);
    
    console.log('2. Selecting item 2...');
    toggleItemSelection(2);
    
    console.log('3. Deselecting item 1...');
    toggleItemSelection(1);
    
    const success = selectedItems.length === 1 && selectedItems.includes(2);
    console.log(`\nSelection logic test: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('Final selection:', selectedItems);
    
    return success;
  }
  
  static async runAllTests() {
    console.log('🧪 RUNNING ISOLATED DELETE TESTS...\n');
    console.log('=' .repeat(60));
    
    const dataStoreTest = await this.testDataStoreDirectly();
    const entityTest = await this.testEntityLayerDirectly();
    const loadDataTest = await this.testReportsPageLoadData();
    const selectionTest = await this.testSelectionLogic();
    
    console.log('\n' + '=' .repeat(60));
    console.log('🔬 ISOLATED TEST RESULTS:');
    console.log('=' .repeat(60));
    console.log(`DataStore Layer: ${dataStoreTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Entity Layer: ${entityTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`LoadData Function: ${loadDataTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Selection Logic: ${selectionTest ? '✅ WORKING' : '❌ BROKEN'}`);
    
    const allPassed = dataStoreTest && entityTest && loadDataTest && selectionTest;
    
    console.log('\n🎯 DIAGNOSIS:');
    if (allPassed) {
      console.log('✅ ALL DATA LAYERS WORKING - Issue is in React UI');
      console.log('Problem areas to check:');
      console.log('- React state management');
      console.log('- Event handling');
      console.log('- Component re-rendering');
      console.log('- State synchronization');
    } else {
      console.log('❌ FOUND BROKEN DATA LAYERS');
      if (!dataStoreTest) console.log('- DataStore delete methods broken');
      if (!entityTest) console.log('- Entity layer delete methods broken');
      if (!loadDataTest) console.log('- LoadData function broken');
      if (!selectionTest) console.log('- Selection logic broken');
    }
    
    return allPassed;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.IsolatedDeleteTest = IsolatedDeleteTest;
}

export default IsolatedDeleteTest;
