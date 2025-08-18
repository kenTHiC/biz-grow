// Minimal Selection Test - Create a simple test component
import React, { useState, useEffect } from 'react';

export function MinimalSelectionTest() {
  const [selectedItems, setSelectedItems] = useState([]);
  
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
  
  useEffect(() => {
    console.log('MinimalTest - selectedItems changed:', JSON.stringify(selectedItems));
  }, [selectedItems]);
  
  const toggleSelection = (id) => {
    console.log('MinimalTest - toggleSelection called for ID:', id);
    console.log('MinimalTest - current selectedItems:', JSON.stringify(selectedItems));
    
    setSelectedItems(prev => {
      console.log('MinimalTest - inside setSelectedItems, prev:', JSON.stringify(prev));
      
      const isSelected = prev.includes(id);
      console.log('MinimalTest - isSelected:', isSelected);
      
      let newSelection;
      if (isSelected) {
        newSelection = prev.filter(itemId => itemId !== id);
        console.log('MinimalTest - removing, newSelection:', JSON.stringify(newSelection));
      } else {
        newSelection = [...prev, id];
        console.log('MinimalTest - adding, newSelection:', JSON.stringify(newSelection));
      }
      
      return newSelection;
    });
  };
  
  return (
    <div style={{ padding: '20px', border: '2px solid blue', margin: '20px' }}>
      <h3>Minimal Selection Test</h3>
      <p>Selected: {JSON.stringify(selectedItems)}</p>
      
      {items.map(item => (
        <div key={item.id} style={{ margin: '10px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              readOnly
              onClick={() => toggleSelection(item.id)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            {item.name} (ID: {item.id})
          </label>
        </div>
      ))}
      
      <button 
        onClick={() => setSelectedItems([])}
        style={{ marginTop: '10px', padding: '5px 10px' }}
      >
        Clear All
      </button>
    </div>
  );
}

// Browser console test
export class MinimalSelectionConsoleTest {
  static testReactState() {
    console.log('🧪 Testing React State Management...\n');
    
    // Simulate React useState behavior
    let currentState = [];
    
    const setState = (updater) => {
      console.log('setState called with updater function');
      const newState = typeof updater === 'function' ? updater(currentState) : updater;
      console.log('State changing from:', JSON.stringify(currentState), 'to:', JSON.stringify(newState));
      currentState = newState;
      return currentState;
    };
    
    const toggleSelection = (id) => {
      console.log(`\n--- Toggling selection for ID: ${id} ---`);
      console.log('Current state before toggle:', JSON.stringify(currentState));
      
      setState(prev => {
        console.log('Inside setState updater, prev:', JSON.stringify(prev));
        
        const isSelected = prev.includes(id);
        console.log('isSelected:', isSelected);
        
        if (isSelected) {
          const newState = prev.filter(itemId => itemId !== id);
          console.log('Removing - new state:', JSON.stringify(newState));
          return newState;
        } else {
          const newState = [...prev, id];
          console.log('Adding - new state:', JSON.stringify(newState));
          return newState;
        }
      });
      
      console.log('Final state after toggle:', JSON.stringify(currentState));
    };
    
    // Test sequence
    console.log('=== Testing Selection Sequence ===');
    
    console.log('\n1. Select item 1:');
    toggleSelection(1);
    
    console.log('\n2. Select item 2:');
    toggleSelection(2);
    
    console.log('\n3. Deselect item 1:');
    toggleSelection(1);
    
    console.log('\n=== Final Results ===');
    console.log('Final state:', JSON.stringify(currentState));
    console.log('Expected: [2]');
    
    const success = currentState.length === 1 && currentState.includes(2);
    console.log(`Test result: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    
    return success;
  }
  
  static testCheckboxState() {
    console.log('\n🧪 Testing Checkbox State Calculation...\n');
    
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const selectedItems = [2]; // Only item 2 is selected
    
    console.log('Items:', items.map(i => i.id));
    console.log('Selected items:', selectedItems);
    
    items.forEach(item => {
      const isChecked = selectedItems.includes(item.id);
      console.log(`Item ${item.id}: checked = ${isChecked}`);
    });
    
    // Expected: Item 1 = false, Item 2 = true, Item 3 = false
    const item1Correct = !selectedItems.includes(1);
    const item2Correct = selectedItems.includes(2);
    const item3Correct = !selectedItems.includes(3);
    
    const success = item1Correct && item2Correct && item3Correct;
    console.log(`Checkbox state test: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    
    return success;
  }
  
  static runAllTests() {
    console.log('🚀 Running Minimal Selection Tests...\n');
    console.log('=' .repeat(60));
    
    const stateTest = this.testReactState();
    const checkboxTest = this.testCheckboxState();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📋 Minimal Test Results:');
    console.log('=' .repeat(60));
    console.log(`React State Management: ${stateTest ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Checkbox State Calculation: ${checkboxTest ? '✅ WORKING' : '❌ BROKEN'}`);
    
    const allPassed = stateTest && checkboxTest;
    
    console.log('\n🎯 DIAGNOSIS:');
    if (allPassed) {
      console.log('✅ BASIC LOGIC IS WORKING');
      console.log('The issue is likely in the Reports component specifically');
      console.log('Check for:');
      console.log('- Unexpected function calls');
      console.log('- React rendering issues');
      console.log('- Event handling conflicts');
    } else {
      console.log('❌ BASIC LOGIC HAS ISSUES');
    }
    
    return allPassed;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.MinimalSelectionConsoleTest = MinimalSelectionConsoleTest;
}

export default MinimalSelectionConsoleTest;
