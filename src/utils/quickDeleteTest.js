// Quick Delete Test - Run in Browser Console
export class QuickDeleteTest {
  static async createTestData() {
    console.log('🔧 Creating test data...');

    try {
      const { Revenue, Expense } = await import('../entities/all.js');

      // Create test revenues
      const testRevenues = [];
      for (let i = 1; i <= 3; i++) {
        const revenue = await Revenue.create({
          amount: 100 * i,
          source: `Test Revenue ${i}`,
          category: 'other',
          date: '2024-08-18',
          description: `Test revenue item ${i} for delete testing`,
        });
        testRevenues.push(revenue);
        console.log(`Created test revenue ${i}:`, revenue);
      }

      // Create test expenses
      const testExpenses = [];
      for (let i = 1; i <= 3; i++) {
        const expense = await Expense.create({
          amount: 50 * i,
          category: 'other',
          vendor: `Test Vendor ${i}`,
          date: '2024-08-18',
          description: `Test expense item ${i} for delete testing`,
        });
        testExpenses.push(expense);
        console.log(`Created test expense ${i}:`, expense);
      }

      console.log('✅ Test data created successfully!');
      console.log('Go to Reports page to test delete functionality');

      return { testRevenues, testExpenses };
    } catch (error) {
      console.error('Error creating test data:', error);
      return null;
    }
  }

  static async testDirectDelete() {
    console.log('🧪 Testing direct delete functionality...');

    try {
      const { Revenue } = await import('../entities/all.js');

      // Get current revenues
      const revenues = await Revenue.list();
      console.log('Current revenues:', revenues.length);

      if (revenues.length === 0) {
        console.log('No revenues to test with. Creating test data...');
        await this.createTestData();
        return;
      }

      const toDelete = revenues[0];
      console.log('Deleting revenue:', toDelete);

      const deleteResult = await Revenue.delete(toDelete.id);
      console.log('Delete result:', deleteResult);

      const afterDelete = await Revenue.list();
      console.log('Revenues after delete:', afterDelete.length);

      const success = afterDelete.length === revenues.length - 1;
      console.log(`Direct delete test: ${success ? '✅ PASSED' : '❌ FAILED'}`);

      return success;
    } catch (error) {
      console.error('Error in direct delete test:', error);
      return false;
    }
  }

  static async clearTestData() {
    console.log('🧹 Clearing test data...');

    try {
      const { Revenue, Expense } = await import('../entities/all.js');

      // Clear test revenues
      const revenues = await Revenue.list();
      const testRevenues = revenues.filter(
        r => r.source && r.source.includes('Test Revenue')
      );

      for (const revenue of testRevenues) {
        await Revenue.delete(revenue.id);
        console.log('Deleted test revenue:', revenue.id);
      }

      // Clear test expenses
      const expenses = await Expense.list();
      const testExpenses = expenses.filter(
        e => e.vendor && e.vendor.includes('Test Vendor')
      );

      for (const expense of testExpenses) {
        await Expense.delete(expense.id);
        console.log('Deleted test expense:', expense.id);
      }

      console.log('✅ Test data cleared');
    } catch (error) {
      console.error('Error clearing test data:', error);
    }
  }

  static instructions() {
    console.log(`
🧪 QUICK DELETE TEST INSTRUCTIONS:

1. Run: QuickDeleteTest.createTestData()
   - Creates 3 test revenues and 3 test expenses

2. Go to Reports page in the browser

3. Test Single Delete:
   - Click trash icon on any item
   - Check console for debug logs
   - Verify item disappears

4. Test Edit:
   - Click edit icon on any item
   - Check console for debug logs
   - Verify form opens

5. Test Bulk Delete:
   - Click "Select Multiple"
   - Check boxes for 2 items
   - Click "Delete Selected (2)"
   - Check console for debug logs
   - Verify items disappear

6. Run: QuickDeleteTest.clearTestData()
   - Removes all test data

7. Run: QuickDeleteTest.testDirectDelete()
   - Tests delete functionality directly

CONSOLE COMMANDS:
- QuickDeleteTest.createTestData()
- QuickDeleteTest.testDirectDelete()
- QuickDeleteTest.clearTestData()
- QuickDeleteTest.instructions()
    `);
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.QuickDeleteTest = QuickDeleteTest;
}

export default QuickDeleteTest;
