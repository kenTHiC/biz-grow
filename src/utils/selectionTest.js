// Selection Logic Test - Isolate the selection issue
export class SelectionTest {
  static testSelectionLogic() {
    console.log('🧪 Testing Selection Logic in Isolation...\n');

    // Simulate the selection state
    let selectedItems = [];

    // Simulate items
    const items = [
      { id: 1, amount: 100 },
      { id: 2, amount: 200 },
      { id: 3, amount: 300 },
    ];

    console.log('Test items:', items);
    console.log('Initial selectedItems:', selectedItems);

    // Simulate toggleItemSelection function
    const toggleItemSelection = id => {
      console.log(`\n--- Toggling selection for ID: ${id} ---`);
      console.log('Before toggle - selectedItems:', selectedItems);
      console.log('Before toggle - includes(id):', selectedItems.includes(id));

      if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(itemId => itemId !== id);
        console.log('Action: REMOVED from selection');
      } else {
        selectedItems = [...selectedItems, id];
        console.log('Action: ADDED to selection');
      }

      console.log('After toggle - selectedItems:', selectedItems);
      return selectedItems;
    };

    // Test individual selections
    console.log('\n=== Testing Individual Selections ===');

    console.log('\n1. Select item 1:');
    toggleItemSelection(1);

    console.log('\n2. Select item 2:');
    toggleItemSelection(2);

    console.log('\n3. Deselect item 1:');
    toggleItemSelection(1);

    console.log('\n4. Select item 3:');
    toggleItemSelection(3);

    console.log('\n=== Final State ===');
    console.log('Final selectedItems:', selectedItems);
    console.log('Expected: [2, 3]');

    const success =
      selectedItems.length === 2 &&
      selectedItems.includes(2) &&
      selectedItems.includes(3) &&
      !selectedItems.includes(1);

    console.log(`Selection logic test: ${success ? '✅ PASSED' : '❌ FAILED'}`);

    return success;
  }

  static testCheckboxState() {
    console.log('\n🧪 Testing Checkbox State Calculation...\n');

    const items = [
      { id: 1, amount: 100 },
      { id: 2, amount: 200 },
      { id: 3, amount: 300 },
    ];

    const selectedItems = [2]; // Only item 2 is selected

    console.log('Items:', items);
    console.log('Selected items:', selectedItems);

    // Test checkbox checked state for each item
    items.forEach(item => {
      const isChecked = selectedItems.includes(item.id);
      console.log(
        `Item ${item.id} checkbox should be: ${isChecked ? 'CHECKED' : 'UNCHECKED'}`
      );
    });

    // Expected: Item 1 = UNCHECKED, Item 2 = CHECKED, Item 3 = UNCHECKED
    const item1Correct = !selectedItems.includes(1);
    const item2Correct = selectedItems.includes(2);
    const item3Correct = !selectedItems.includes(3);

    const success = item1Correct && item2Correct && item3Correct;
    console.log(`Checkbox state test: ${success ? '✅ PASSED' : '❌ FAILED'}`);

    return success;
  }

  static testSelectAllLogic() {
    console.log('\n🧪 Testing Select All Logic...\n');

    const items = [
      { id: 1, amount: 100 },
      { id: 2, amount: 200 },
      { id: 3, amount: 300 },
    ];

    let selectedItems = [];

    const selectAllItems = () => {
      console.log('selectAllItems called');
      console.log('Current selectedItems:', selectedItems);
      console.log(
        'All item IDs:',
        items.map(i => i.id)
      );

      const allIds = items.map(item => item.id);
      const newSelection = selectedItems.length === allIds.length ? [] : allIds;

      console.log('New selection will be:', newSelection);
      selectedItems = newSelection;
      return selectedItems;
    };

    // Test 1: Select all when none selected
    console.log('\n1. Select all when none selected:');
    selectAllItems();
    console.log('Result:', selectedItems);
    console.log('Expected: [1, 2, 3]');

    // Test 2: Deselect all when all selected
    console.log('\n2. Deselect all when all selected:');
    selectAllItems();
    console.log('Result:', selectedItems);
    console.log('Expected: []');

    const success = selectedItems.length === 0;
    console.log(
      `Select all logic test: ${success ? '✅ PASSED' : '❌ FAILED'}`
    );

    return success;
  }

  static runAllTests() {
    console.log('🚀 Running All Selection Tests...\n');
    console.log('='.repeat(60));

    const selectionTest = this.testSelectionLogic();
    const checkboxTest = this.testCheckboxState();
    const selectAllTest = this.testSelectAllLogic();

    console.log('\n' + '='.repeat(60));
    console.log('📋 Selection Test Results:');
    console.log('='.repeat(60));
    console.log(
      `Individual Selection Logic: ${selectionTest ? '✅ WORKING' : '❌ BROKEN'}`
    );
    console.log(
      `Checkbox State Calculation: ${checkboxTest ? '✅ WORKING' : '❌ BROKEN'}`
    );
    console.log(
      `Select All Logic: ${selectAllTest ? '✅ WORKING' : '❌ BROKEN'}`
    );

    const allPassed = selectionTest && checkboxTest && selectAllTest;

    console.log('\n🎯 DIAGNOSIS:');
    if (allPassed) {
      console.log('✅ ALL SELECTION LOGIC WORKING IN ISOLATION');
      console.log(
        'The issue is likely in React state management or event handling'
      );
      console.log('Check for:');
      console.log('- Multiple event handlers firing');
      console.log('- React state batching issues');
      console.log('- Component re-rendering problems');
      console.log('- Event propagation issues');
    } else {
      console.log('❌ SELECTION LOGIC HAS FUNDAMENTAL ISSUES');
      if (!selectionTest) console.log('- Fix individual selection logic');
      if (!checkboxTest) console.log('- Fix checkbox state calculation');
      if (!selectAllTest) console.log('- Fix select all logic');
    }

    return allPassed;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.SelectionTest = SelectionTest;
}

export default SelectionTest;
