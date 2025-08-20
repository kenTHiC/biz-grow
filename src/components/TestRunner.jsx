import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Download,
  Bug,
  Zap,
  Settings,
  X,
} from 'lucide-react';

/**
 * TestRunner Component for BizGrow v1.3.3
 * Provides a visual interface for running the test suite in development mode
 *
 * Usage:
 * - Controlled by external visibility prop (typically from Dashboard "Test Suite" button)
 * - Toggle visibility using Dashboard button or Ctrl+Shift+T keyboard shortcut
 * - Provides visual interface for all test suite functionality
 * - Can be closed using X button or external toggle control
 */
export default function TestRunner({ isVisible = false, onClose = null }) {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState('all');

  // Only show in development mode and when visible
  if (process.env.NODE_ENV === 'production' || !isVisible) {
    return null;
  }

  const runTests = async (testType = 'all') => {
    setIsRunning(true);
    setTestResults(null);

    // Check if test suite is available
    if (typeof window.BizGrowTestSuite === 'undefined') {
      setTestResults({
        error: 'Test Suite not loaded. Please refresh the page.',
      });
      setIsRunning(false);
      return;
    }

    try {
      let results;

      switch (testType) {
        case 'quick':
          results = window.BizGrowTestSuite.quickTest();
          break;
        case 'multi-selection':
          window.BizGrowTestSuite.testMultiSelection();
          results = { passed: 'See console', total: 'for details' };
          break;
        case 'modals':
          window.BizGrowTestSuite.testModalSystem();
          results = { passed: 'See console', total: 'for details' };
          break;
        case 'performance':
          window.BizGrowTestSuite.testPerformance();
          results = { passed: 'See console', total: 'for details' };
          break;
        default:
          results = await window.BizGrowTestSuite.runAllTests();
          break;
      }

      setTestResults(results);
    } catch (error) {
      console.error('Test runner error:', error);
      setTestResults({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  const debugState = () => {
    if (window.BizGrowTestSuite) {
      window.BizGrowTestSuite.debugState();
    } else {
      console.error('Test Suite not available');
    }
  };

  const exportResults = () => {
    if (window.BizGrowTestSuite) {
      window.BizGrowTestSuite.exportResults();
    } else {
      console.error('Test Suite not available');
    }
  };

  const simulateError = type => {
    console.log(`Simulating ${type} error...`);
    // Simple error simulation without requiring test suite
    if (type === 'network') {
      console.warn(
        'Network error simulation: This would normally disable network requests for 5 seconds'
      );
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Test Suite v1.3.3</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Close Test Runner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Test Selection */}
        <div className="mb-3">
          <select
            value={selectedTest}
            onChange={e => setSelectedTest(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Tests (25+)</option>
            <option value="quick">Quick Test (Essential)</option>
            <option value="multi-selection">Multi-Selection</option>
            <option value="modals">Modal System</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => runTests(selectedTest)}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Tests
              </>
            )}
          </button>

          <button
            onClick={debugState}
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            title="Debug State"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Utility Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={exportResults}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            <Download className="w-3 h-3" />
            Export
          </button>

          <button
            onClick={() => simulateError('network')}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
          >
            <Zap className="w-3 h-3" />
            Error Test
          </button>
        </div>

        {/* Results Display */}
        {testResults && (
          <div className="border-t pt-3">
            {testResults.error ? (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Error: {testResults.error}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Results:</span>
                  <div className="flex items-center gap-1">
                    {testResults.success !== false ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>

                {typeof testResults.passed === 'number' && (
                  <div className="text-sm text-gray-600">
                    <div>Passed: {testResults.passed}</div>
                    <div>Total: {testResults.total}</div>
                    {testResults.successRate && (
                      <div>Success: {testResults.successRate}%</div>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Check console for detailed results
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="border-t pt-2 mt-3">
          <div className="text-xs text-gray-500">
            <div className="font-medium mb-1">Console Commands:</div>
            <div>• window.BizGrowTestSuite.runAllTests()</div>
            <div>• window.BizGrowTestSuite.quickTest()</div>
            <div>• window.BizGrowTestSuite.debugState()</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for keyboard shortcut integration (optional)
export function useTestRunnerKeyboard(onToggle) {
  useEffect(() => {
    // Add keyboard shortcut (Ctrl+Shift+T) - only if onToggle is provided
    if (!onToggle) return;

    const handleKeyDown = event => {
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);
}
