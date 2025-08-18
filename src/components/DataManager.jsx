import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Database, AlertTriangle, CheckCircle, X, Settings } from 'lucide-react';
import DataImporter from '../utils/dataImporter';
import DataExporter from '../utils/dataExporter';
import dataStore from '../store/dataStore';

const DataManager = ({ isOpen, onClose, onDataChange }) => {
  const [activeTab, setActiveTab] = useState('import');
  const [importStatus, setImportStatus] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(null);
    setImportPreview(null);

    try {
      const importedData = await DataImporter.importFile(file);
      const preview = DataImporter.generateImportPreview(importedData);
      
      setImportPreview({
        data: importedData,
        preview: preview,
        filename: file.name
      });
      
      setImportStatus({
        type: 'success',
        message: `File "${file.name}" loaded successfully. Review the preview below.`
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportConfirm = async (mergeData = false) => {
    if (!importPreview) return;

    setIsProcessing(true);
    try {
      const result = await dataStore.importData(importPreview.data, {
        merge: mergeData,
        validateData: true,
        createBackup: true
      });

      setImportStatus({
        type: 'success',
        message: `Successfully imported ${result.imported.customers} customers, ${result.imported.revenues} revenues, and ${result.imported.expenses} expenses.`
      });

      setImportPreview(null);
      onDataChange?.();
      
      // Auto-close after successful import
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (format) => {
    setIsProcessing(true);
    setExportStatus(null);

    try {
      const allData = dataStore.exportAllData();
      const result = await DataExporter.exportData(allData, format);
      
      setExportStatus({
        type: 'success',
        message: `Data exported successfully as ${format.toUpperCase()}.`
      });
    } catch (error) {
      setExportStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = async (dataType) => {
    try {
      await DataExporter.generateTemplate(dataType, 'csv');
      setExportStatus({
        type: 'success',
        message: `${dataType} template downloaded successfully.`
      });
    } catch (error) {
      setExportStatus({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      dataStore.clearAllUserData();
      onDataChange?.();
      setImportStatus({
        type: 'success',
        message: 'All data cleared successfully.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Import Data
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export Data
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Import Your Data</h3>
                <p className="text-gray-600 mb-4">
                  Upload your business data from JSON, CSV, or Excel files. We'll automatically detect and map your data fields.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Choose a file to import</p>
                  <p className="text-gray-600 mb-4">Supports JSON, CSV, and Excel files</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Select File'}
                  </button>
                </div>

                {/* Status Messages */}
                {importStatus && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    importStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {importStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span>{importStatus.message}</span>
                  </div>
                )}

                {/* Import Preview */}
                {importPreview && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Import Preview: {importPreview.filename}</h4>
                    
                    {Object.entries(importPreview.preview).map(([dataType, info]) => (
                      <div key={dataType} className="mb-4">
                        <h5 className="font-medium capitalize mb-2">
                          {dataType} ({info.total} records)
                        </h5>
                        <div className="bg-white rounded border p-3 text-sm">
                          <div className="font-medium mb-2">Sample data:</div>
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(info.sample[0], null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleImportConfirm(false)}
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Replace All Data
                      </button>
                      <button
                        onClick={() => handleImportConfirm(true)}
                        disabled={isProcessing}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Merge with Existing
                      </button>
                      <button
                        onClick={() => setImportPreview(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Templates */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Download Templates</h4>
                  <p className="text-gray-600 mb-3">
                    Download sample templates to see the expected data format.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownloadTemplate('customers')}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Customers Template
                    </button>
                    <button
                      onClick={() => handleDownloadTemplate('revenues')}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Revenues Template
                    </button>
                    <button
                      onClick={() => handleDownloadTemplate('expenses')}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Expenses Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Export Your Data</h3>
                <p className="text-gray-600 mb-4">
                  Download your business data in various formats for backup or analysis.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleExport('json')}
                    disabled={isProcessing}
                    className="p-6 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                  >
                    <FileText className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-medium mb-2">JSON Format</h4>
                    <p className="text-sm text-gray-600">
                      Complete data export with metadata. Best for backup and re-importing.
                    </p>
                  </button>

                  <button
                    onClick={() => handleExport('csv')}
                    disabled={isProcessing}
                    className="p-6 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                  >
                    <FileText className="w-8 h-8 text-green-600 mb-3" />
                    <h4 className="font-medium mb-2">CSV Format</h4>
                    <p className="text-sm text-gray-600">
                      Separate CSV files for each data type. Great for spreadsheet analysis.
                    </p>
                  </button>

                  <button
                    onClick={() => handleExport('xlsx')}
                    disabled={isProcessing}
                    className="p-6 border rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                  >
                    <FileText className="w-8 h-8 text-orange-600 mb-3" />
                    <h4 className="font-medium mb-2">Excel Format</h4>
                    <p className="text-sm text-gray-600">
                      Multi-sheet Excel file with summary. Perfect for detailed analysis.
                    </p>
                  </button>
                </div>

                {exportStatus && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    exportStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {exportStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span>{exportStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Data Settings</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                    <p className="text-red-700 mb-3">
                      This action will permanently delete all your data. This cannot be undone.
                    </p>
                    <button
                      onClick={handleClearAllData}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManager;
