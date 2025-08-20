// Multi-format Data Exporter for BizGrow
import * as XLSX from 'xlsx';
import { format as formatDate } from 'date-fns';

export class DataExporter {
  static async exportData(data, exportFormat = 'json', options = {}) {
    const {
      filename = `bizgrow-export-${formatDate(new Date(), 'yyyy-MM-dd')}`,
      includeMetadata = true,
      dateRange = null,
    } = options;

    switch (exportFormat.toLowerCase()) {
      case 'json':
        return this.exportJSON(data, filename, { includeMetadata, dateRange });
      case 'csv':
        return this.exportCSV(data, filename, { dateRange });
      case 'xlsx':
      case 'excel':
        return this.exportExcel(data, filename, { dateRange });
      default:
        throw new Error(`Unsupported export format: ${exportFormat}`);
    }
  }

  static exportJSON(data, filename, options = {}) {
    const { includeMetadata = true, dateRange = null } = options;

    let exportData = { ...data };

    if (includeMetadata) {
      exportData.metadata = {
        exportDate: new Date().toISOString(),
        version: '1.1.0',
        exportFormat: 'json',
        dateRange: dateRange
          ? {
              from: dateRange.from.toISOString(),
              to: dateRange.to.toISOString(),
            }
          : null,
      };
    }

    // Filter by date range if provided
    if (dateRange) {
      exportData = this.filterByDateRange(exportData, dateRange);
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    this.downloadBlob(blob, `${filename}.json`);

    return {
      success: true,
      format: 'json',
      filename: `${filename}.json`,
      size: blob.size,
    };
  }

  static exportCSV(data, filename, options = {}) {
    const { dateRange = null } = options;

    let filteredData = dateRange
      ? this.filterByDateRange(data, dateRange)
      : data;
    const results = [];

    // Export each data type as separate CSV files
    Object.entries(filteredData).forEach(([dataType, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        const csv = this.convertToCSV(items);
        const blob = new Blob([csv], { type: 'text/csv' });
        this.downloadBlob(blob, `${filename}-${dataType}.csv`);

        results.push({
          dataType,
          filename: `${filename}-${dataType}.csv`,
          records: items.length,
        });
      }
    });

    return {
      success: true,
      format: 'csv',
      files: results,
    };
  }

  static exportExcel(data, filename, options = {}) {
    const { dateRange = null } = options;

    let filteredData = dateRange
      ? this.filterByDateRange(data, dateRange)
      : data;

    const workbook = XLSX.utils.book_new();

    // Add each data type as a separate worksheet
    Object.entries(filteredData).forEach(([dataType, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(items);

        // Auto-size columns
        const colWidths = this.calculateColumnWidths(items);
        worksheet['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, dataType);
      }
    });

    // Add summary sheet
    if (Object.keys(filteredData).length > 1) {
      const summaryData = this.generateSummaryData(filteredData);
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    }

    // Generate and download file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    this.downloadBlob(blob, `${filename}.xlsx`);

    return {
      success: true,
      format: 'xlsx',
      filename: `${filename}.xlsx`,
      sheets: Object.keys(filteredData).length,
      size: blob.size,
    };
  }

  static convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map(row => {
      return headers
        .map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        })
        .join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  static calculateColumnWidths(data) {
    if (!data || data.length === 0) return [];

    const headers = Object.keys(data[0]);
    const widths = headers.map(header => {
      const maxLength = Math.max(
        header.length,
        ...data.map(row => String(row[header] || '').length)
      );
      return { width: Math.min(maxLength + 2, 50) }; // Cap at 50 characters
    });

    return widths;
  }

  static generateSummaryData(data) {
    const summary = [];

    Object.entries(data).forEach(([dataType, items]) => {
      if (Array.isArray(items)) {
        summary.push({
          'Data Type': dataType,
          'Total Records': items.length,
          'Date Range': items.length > 0 ? this.getDateRange(items) : 'N/A',
        });
      }
    });

    // Add totals if financial data exists
    if (data.revenues && data.expenses) {
      const totalRevenue = data.revenues.reduce(
        (sum, r) => sum + (r.amount || 0),
        0
      );
      const totalExpenses = data.expenses.reduce(
        (sum, e) => sum + (e.amount || 0),
        0
      );

      summary.push({
        'Data Type': 'Financial Summary',
        'Total Revenue': totalRevenue,
        'Total Expenses': totalExpenses,
        'Net Profit': totalRevenue - totalExpenses,
      });
    }

    return summary;
  }

  static getDateRange(items) {
    const dates = items
      .map(item => item.date || item.acquisition_date)
      .filter(date => date)
      .map(date => new Date(date))
      .sort((a, b) => a - b);

    if (dates.length === 0) return 'N/A';
    if (dates.length === 1) return formatDate(dates[0], 'yyyy-MM-dd');

    return `${formatDate(dates[0], 'yyyy-MM-dd')} to ${formatDate(dates[dates.length - 1], 'yyyy-MM-dd')}`;
  }

  static filterByDateRange(data, dateRange) {
    const filtered = {};

    Object.entries(data).forEach(([dataType, items]) => {
      if (Array.isArray(items)) {
        filtered[dataType] = items.filter(item => {
          const itemDate = new Date(item.date || item.acquisition_date);
          return itemDate >= dateRange.from && itemDate <= dateRange.to;
        });
      } else {
        filtered[dataType] = items;
      }
    });

    return filtered;
  }

  static downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Test export functionality
  static testExport() {
    const testData = {
      customers: [
        {
          id: 1,
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+1-555-0123',
          company: 'Test Corp',
          status: 'active',
          acquisition_date: '2024-01-15',
          total_value: 5000,
        },
      ],
      revenues: [
        {
          id: 1,
          amount: 1500,
          source: 'Product Sales',
          category: 'product_sales',
          date: '2024-08-01',
          customer_name: 'Test Customer',
        },
      ],
      expenses: [
        {
          id: 1,
          amount: 500,
          category: 'software',
          vendor: 'Software Company',
          date: '2024-08-01',
          description: 'Monthly software license',
        },
      ],
    };

    console.log('Testing export functionality...');

    // Test JSON export
    try {
      this.exportData(testData, 'json', { filename: 'test-export' });
      console.log('✅ JSON export test passed');
    } catch (error) {
      console.error('❌ JSON export test failed:', error);
    }

    // Test CSV export
    try {
      this.exportData(testData, 'csv', { filename: 'test-export' });
      console.log('✅ CSV export test passed');
    } catch (error) {
      console.error('❌ CSV export test failed:', error);
    }

    // Test Excel export
    try {
      this.exportData(testData, 'xlsx', { filename: 'test-export' });
      console.log('✅ Excel export test passed');
    } catch (error) {
      console.error('❌ Excel export test failed:', error);
    }
  }

  // Template generators for different data types
  static generateTemplate(dataType, exportFormat = 'csv') {
    const templates = {
      customers: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0123',
          company: 'Example Corp',
          status: 'active',
          acquisition_date: '2024-01-15',
          total_value: 5000,
          last_purchase_date: '2024-08-01',
        },
      ],
      revenues: [
        {
          amount: 1500,
          source: 'Product Sales',
          category: 'product_sales',
          date: '2024-08-01',
          customer_name: 'John Doe',
          description: 'Monthly subscription',
        },
      ],
      expenses: [
        {
          amount: 500,
          category: 'software',
          vendor: 'Software Company',
          date: '2024-08-01',
          description: 'Monthly software license',
          receipt_url: '',
        },
      ],
    };

    const templateData = templates[dataType];
    if (!templateData) {
      throw new Error(`No template available for data type: ${dataType}`);
    }

    return this.exportData({ [dataType]: templateData }, exportFormat, {
      filename: `bizgrow-${dataType}-template`,
      includeMetadata: false,
    });
  }
}

export default DataExporter;
