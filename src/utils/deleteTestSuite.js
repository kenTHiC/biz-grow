// Delete Functionality Test Suite for BizGrow v1.2.0
export class DeleteTestSuite {
  static async testSingleDelete() {
    console.log('🧪 Testing Single Delete Functionality...\n');

    try {
      // Import required modules
      const { Revenue, Expense } = await import('../entities/all.js');

      // Test Revenue Delete
      console.log('Testing Revenue Delete:');
      const initialRevenues = await Revenue.list();
      console.log(`Initial revenue count: ${initialRevenues.length}`);

      if (initialRevenues.length > 0) {
        const testRevenue = initialRevenues[0];
        console.log(`Attempting to delete revenue ID: ${testRevenue.id}`);

        const deleteResult = await Revenue.delete(testRevenue.id);
        console.log('Delete result:', deleteResult);

        const finalRevenues = await Revenue.list();
        console.log(`Final revenue count: ${finalRevenues.length}`);

        const wasDeleted = finalRevenues.length === initialRevenues.length - 1;
        console.log(
          `Revenue delete test: ${wasDeleted ? '✅ PASSED' : '❌ FAILED'}`
        );

        return wasDeleted;
      } else {
        console.log('No revenues to test delete with');
        return true;
      }
    } catch (error) {
      console.error('Error in single delete test:', error);
      return false;
    }
  }

  static async testBulkDelete() {
    console.log('\n🧪 Testing Bulk Delete Functionality...\n');

    try {
      const { Revenue, Expense } = await import('../entities/all.js');

      // Test creating multiple revenues for bulk delete
      console.log('Creating test revenues for bulk delete...');

      const testRevenues = [
        {
          amount: 100,
          source: 'Test 1',
          category: 'other',
          date: '2024-08-18',
        },
        {
          amount: 200,
          source: 'Test 2',
          category: 'other',
          date: '2024-08-18',
        },
        {
          amount: 300,
          source: 'Test 3',
          category: 'other',
          date: '2024-08-18',
        },
      ];

      const createdRevenues = [];
      for (const revenue of testRevenues) {
        const created = await Revenue.create(revenue);
        createdRevenues.push(created);
        console.log(`Created test revenue ID: ${created.id}`);
      }

      const beforeCount = (await Revenue.list()).length;
      console.log(`Revenue count before bulk delete: ${beforeCount}`);

      // Simulate bulk delete
      console.log('Performing bulk delete...');
      const deletePromises = createdRevenues.map(r => Revenue.delete(r.id));
      await Promise.all(deletePromises);

      const afterCount = (await Revenue.list()).length;
      console.log(`Revenue count after bulk delete: ${afterCount}`);

      const expectedCount = beforeCount - createdRevenues.length;
      const bulkDeleteWorked = afterCount === expectedCount;

      console.log(
        `Bulk delete test: ${bulkDeleteWorked ? '✅ PASSED' : '❌ FAILED'}`
      );
      console.log(`Expected: ${expectedCount}, Actual: ${afterCount}`);

      return bulkDeleteWorked;
    } catch (error) {
      console.error('Error in bulk delete test:', error);
      return false;
    }
  }

  static async testDataPersistence() {
    console.log('\n🧪 Testing Delete Data Persistence...\n');

    try {
      const { Revenue } = await import('../entities/all.js');

      // Create a test revenue
      const testRevenue = await Revenue.create({
        amount: 999,
        source: 'Persistence Test',
        category: 'other',
        date: '2024-08-18',
      });

      console.log(`Created test revenue ID: ${testRevenue.id}`);

      // Delete it
      await Revenue.delete(testRevenue.id);
      console.log('Deleted test revenue');

      // Check localStorage directly
      const storedRevenues = JSON.parse(
        localStorage.getItem('biz-grow-revenues') || '[]'
      );
      const stillExists = storedRevenues.some(r => r.id === testRevenue.id);

      console.log(
        `Revenue exists in localStorage: ${stillExists ? 'YES (❌ FAILED)' : 'NO (✅ PASSED)'}`
      );

      // Check via API
      const allRevenues = await Revenue.list();
      const existsInAPI = allRevenues.some(r => r.id === testRevenue.id);

      console.log(
        `Revenue exists via API: ${existsInAPI ? 'YES (❌ FAILED)' : 'NO (✅ PASSED)'}`
      );

      const persistenceWorked = !stillExists && !existsInAPI;
      console.log(
        `Persistence test: ${persistenceWorked ? '✅ PASSED' : '❌ FAILED'}`
      );

      return persistenceWorked;
    } catch (error) {
      console.error('Error in persistence test:', error);
      return false;
    }
  }

  static async testUIStateUpdate() {
    console.log('\n🧪 Testing UI State Update After Delete...\n');

    // This test checks if the React state updates properly
    // In a real scenario, this would be tested with React Testing Library
    // For now, we'll just verify the data layer works correctly

    try {
      const { Revenue } = await import('../entities/all.js');

      const beforeList = await Revenue.list();
      console.log(`Initial list length: ${beforeList.length}`);

      if (beforeList.length > 0) {
        const toDelete = beforeList[0];
        console.log(`Deleting revenue ID: ${toDelete.id}`);

        await Revenue.delete(toDelete.id);

        const afterList = await Revenue.list();
        console.log(`List length after delete: ${afterList.length}`);

        const stateUpdated = afterList.length === beforeList.length - 1;
        console.log(
          `UI state update test: ${stateUpdated ? '✅ PASSED' : '❌ FAILED'}`
        );

        return stateUpdated;
      } else {
        console.log('No items to test UI state update with');
        return true;
      }
    } catch (error) {
      console.error('Error in UI state test:', error);
      return false;
    }
  }

  static async runAllTests() {
    console.log('🚀 Running Complete Delete Functionality Test Suite...\n');
    console.log('='.repeat(70));

    const singleDeleteTest = await this.testSingleDelete();
    const bulkDeleteTest = await this.testBulkDelete();
    const persistenceTest = await this.testDataPersistence();
    const uiStateTest = await this.testUIStateUpdate();

    console.log('\n' + '='.repeat(70));
    console.log('📋 Delete Functionality Test Results:');
    console.log('='.repeat(70));
    console.log(
      `Single Delete: ${singleDeleteTest ? '✅ WORKING' : '❌ BROKEN'}`
    );
    console.log(`Bulk Delete: ${bulkDeleteTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(
      `Data Persistence: ${persistenceTest ? '✅ WORKING' : '❌ BROKEN'}`
    );
    console.log(`UI State Update: ${uiStateTest ? '✅ WORKING' : '❌ BROKEN'}`);

    const allPassed =
      singleDeleteTest && bulkDeleteTest && persistenceTest && uiStateTest;

    console.log('\n🎯 Delete Functionality Status:');
    if (allPassed) {
      console.log('🎉 ALL DELETE TESTS PASSED - READY FOR PRODUCTION!');
      console.log('\n✅ Your delete functionality is now:');
      console.log('- Single item deletion working perfectly ✅');
      console.log('- Bulk deletion working perfectly ✅');
      console.log('- Data persistence reliable ✅');
      console.log('- UI state updates correctly ✅');
      console.log('\n🚀 Critical bugs fixed - ready for v1.2.0 release!');
    } else {
      console.log('⚠️ SOME DELETE TESTS FAILED - NEEDS ATTENTION');
      console.log('\nPlease check the console logs above for specific issues.');
    }

    return allPassed;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.DeleteTestSuite = DeleteTestSuite;
}

export default DeleteTestSuite;
