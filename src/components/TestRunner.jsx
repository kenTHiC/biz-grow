import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, Bug } from 'lucide-react';
import BizGrowTestSuite from '../utils/testSuite';

const TestRunner = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [currentTest, setCurrentTest] = useState('');

  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    setCurrentTest('Initializing tests...');

    try {
      const testSuite = new BizGrowTestSuite();
      
      // Override addTestResult to show progress
      const originalAddTestResult = testSuite.addTestResult.bind(testSuite);
      testSuite.addTestResult = (testName, passed, message) => {
        setCurrentTest(`Running: ${testName}`);
        originalAddTestResult(testName, passed, message);
      };

      const results = await testSuite.runAllTests();
      setTestResults({
        summary: testSuite.printTestResults(),
        details: testSuite.testResults
      });
      setCurrentTest('Tests completed!');
    } catch (error) {
      console.error('Test suite failed:', error);
      setTestResults({
        summary: { total: 0, passed: 0, failed: 1, successRate: 0 },
        details: [{ test: 'Test Suite', passed: false, message: error.message }]
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Bug className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">BizGrow Test Suite</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Run comprehensive tests to verify all BizGrow functionality including import/export, 
              data management, analytics, and backup/restore operations.
            </p>
            
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run All Tests
                </>
              )}
            </button>
          </div>

          {/* Current Test Status */}
          {isRunning && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-blue-800">{currentTest}</span>
              </div>
            </div>
          )}

          {/* Test Results */}
          {testResults && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.summary.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.summary.passed}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.summary.failed}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.summary.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-900">Detailed Test Results</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {testResults.details.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 border-b last:border-b-0 ${
                        result.passed ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {result.test}
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.message}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={runTests}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Run Tests Again
                </button>
                <button
                  onClick={() => {
                    const resultsText = testResults.details
                      .map(r => `${r.passed ? '✅' : '❌'} ${r.test}: ${r.message}`)
                      .join('\n');
                    navigator.clipboard.writeText(resultsText);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Copy Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestRunner;
