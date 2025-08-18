// Fix Null IDs Utility - Run in Browser Console
export class FixNullIds {
  static async fixAllData() {
    console.log('🔧 FIXING NULL IDS IN ALL DATA...\n');
    
    try {
      // Import dataStore to trigger the fix
      const dataStore = (await import('../store/dataStore.js')).default;
      
      console.log('DataStore loaded with fixes applied');
      console.log('Current data state:');
      console.log('Revenues:', dataStore.revenues.map(r => ({ id: r.id, amount: r.amount })));
      console.log('Expenses:', dataStore.expenses.map(e => ({ id: e.id, amount: e.amount })));
      console.log('Customers:', dataStore.customers.map(c => ({ id: c.id, name: c.name })));
      
      // Verify all IDs are valid
      const revenueIds = dataStore.revenues.map(r => r.id);
      const expenseIds = dataStore.expenses.map(e => e.id);
      const customerIds = dataStore.customers.map(c => c.id);
      
      const hasNullRevenues = revenueIds.some(id => id === null || id === undefined);
      const hasNullExpenses = expenseIds.some(id => id === null || id === undefined);
      const hasNullCustomers = customerIds.some(id => id === null || id === undefined);
      
      console.log('\nID Validation:');
      console.log(`Revenues have null IDs: ${hasNullRevenues ? '❌ YES' : '✅ NO'}`);
      console.log(`Expenses have null IDs: ${hasNullExpenses ? '❌ YES' : '✅ NO'}`);
      console.log(`Customers have null IDs: ${hasNullCustomers ? '❌ YES' : '✅ NO'}`);
      
      const allFixed = !hasNullRevenues && !hasNullExpenses && !hasNullCustomers;
      console.log(`\nAll IDs fixed: ${allFixed ? '✅ YES' : '❌ NO'}`);
      
      if (allFixed) {
        console.log('\n🎉 ALL NULL IDS HAVE BEEN FIXED!');
        console.log('✅ Selection functionality should now work correctly');
        console.log('✅ Delete functionality should now work correctly');
        console.log('✅ React key warnings should be resolved');
        console.log('\nPlease refresh the page and test again!');
      }
      
      return allFixed;
      
    } catch (error) {
      console.error('Error fixing null IDs:', error);
      return false;
    }
  }
  
  static async manuallyFixData() {
    console.log('🔧 MANUALLY FIXING DATA...\n');
    
    try {
      // Get current data from localStorage
      const revenues = JSON.parse(localStorage.getItem('biz-grow-revenues') || '[]');
      const expenses = JSON.parse(localStorage.getItem('biz-grow-expenses') || '[]');
      const customers = JSON.parse(localStorage.getItem('biz-grow-customers') || '[]');
      
      console.log('Current localStorage data:');
      console.log('Revenues:', revenues.map(r => ({ id: r.id, amount: r.amount })));
      console.log('Expenses:', expenses.map(e => ({ id: e.id, amount: e.amount })));
      console.log('Customers:', customers.map(c => ({ id: c.id, name: c.name })));
      
      // Fix revenues
      let nextRevenueId = 1;
      const fixedRevenues = revenues.map(revenue => {
        if (revenue.id === null || revenue.id === undefined || isNaN(revenue.id)) {
          console.log('Fixing revenue with null ID:', revenue);
          return { ...revenue, id: nextRevenueId++ };
        }
        return revenue;
      });
      
      // Fix expenses
      let nextExpenseId = 1;
      const fixedExpenses = expenses.map(expense => {
        if (expense.id === null || expense.id === undefined || isNaN(expense.id)) {
          console.log('Fixing expense with null ID:', expense);
          return { ...expense, id: nextExpenseId++ };
        }
        return expense;
      });
      
      // Fix customers
      let nextCustomerId = 1;
      const fixedCustomers = customers.map(customer => {
        if (customer.id === null || customer.id === undefined || isNaN(customer.id)) {
          console.log('Fixing customer with null ID:', customer);
          return { ...customer, id: nextCustomerId++ };
        }
        return customer;
      });
      
      // Save fixed data
      localStorage.setItem('biz-grow-revenues', JSON.stringify(fixedRevenues));
      localStorage.setItem('biz-grow-expenses', JSON.stringify(fixedExpenses));
      localStorage.setItem('biz-grow-customers', JSON.stringify(fixedCustomers));
      
      console.log('\n✅ Data fixed and saved to localStorage');
      console.log('Fixed revenues:', fixedRevenues.map(r => ({ id: r.id, amount: r.amount })));
      console.log('Fixed expenses:', fixedExpenses.map(e => ({ id: e.id, amount: e.amount })));
      console.log('Fixed customers:', fixedCustomers.map(c => ({ id: c.id, name: c.name })));
      
      console.log('\n🎉 MANUAL FIX COMPLETE!');
      console.log('Please refresh the page to see the changes!');
      
      return true;
      
    } catch (error) {
      console.error('Error in manual fix:', error);
      return false;
    }
  }
  
  static async clearAllData() {
    console.log('🗑️ CLEARING ALL DATA...\n');
    
    const keys = ['biz-grow-revenues', 'biz-grow-expenses', 'biz-grow-customers'];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Cleared: ${key}`);
    });
    
    console.log('\n✅ All data cleared from localStorage');
    console.log('Refresh the page to start with clean data');
  }
  
  static instructions() {
    console.log(`
🔧 NULL ID FIX INSTRUCTIONS:

PROBLEM: All items have null IDs, causing:
- Selection to select all items instead of individual ones
- Delete functionality to fail
- React key warnings

SOLUTIONS:

1. AUTOMATIC FIX (Recommended):
   FixNullIds.fixAllData()
   - Loads DataStore which automatically fixes null IDs
   - Saves fixed data to localStorage

2. MANUAL FIX:
   FixNullIds.manuallyFixData()
   - Manually fixes localStorage data
   - Assigns sequential IDs to items with null IDs

3. NUCLEAR OPTION:
   FixNullIds.clearAllData()
   - Clears all data and starts fresh
   - Use if other fixes don't work

AFTER RUNNING ANY FIX:
- Refresh the page
- Test selection (should select individual items)
- Test delete (should actually delete items)
- No more React key warnings

CONSOLE COMMANDS:
- FixNullIds.fixAllData()
- FixNullIds.manuallyFixData()
- FixNullIds.clearAllData()
- FixNullIds.instructions()
    `);
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.FixNullIds = FixNullIds;
}

export default FixNullIds;
