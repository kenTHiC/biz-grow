// Multi-format Data Importer for BizGrow
import * as XLSX from 'xlsx';

export class DataImporter {
  static async importFile(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    switch (fileExtension) {
      case 'json':
        return await this.importJSON(file);
      case 'csv':
        return await this.importCSV(file);
      case 'xlsx':
      case 'xls':
        return await this.importExcel(file);
      default:
        throw new Error(`Unsupported file format: ${fileExtension}`);
    }
  }

  static async importJSON(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Handle different JSON structures
      if (data.customers || data.revenues || data.expenses) {
        // BizGrow format
        return data;
      } else if (Array.isArray(data)) {
        // Array format - try to detect type
        return this.detectArrayType(data, file.name);
      } else {
        throw new Error('Unrecognized JSON format');
      }
    } catch (error) {
      throw new Error(`JSON import failed: ${error.message}`);
    }
  }

  static async importCSV(file) {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = this.parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      // Detect data type based on headers
      const dataType = this.detectDataType(headers);
      const normalizedData = this.normalizeData(rows, dataType);

      return {
        [dataType]: normalizedData
      };
    } catch (error) {
      throw new Error(`CSV import failed: ${error.message}`);
    }
  }

  static async importExcel(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const result = {};
      
      // Process each sheet
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length > 0) {
          const headers = Object.keys(jsonData[0]);
          const dataType = this.detectDataType(headers);
          const normalizedData = this.normalizeData(jsonData, dataType);
          
          if (!result[dataType]) {
            result[dataType] = [];
          }
          result[dataType] = result[dataType].concat(normalizedData);
        }
      });

      return result;
    } catch (error) {
      throw new Error(`Excel import failed: ${error.message}`);
    }
  }

  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static detectDataType(headers) {
    const headerStr = headers.join(' ').toLowerCase();
    
    // Customer indicators
    if (headerStr.includes('customer') || headerStr.includes('client') || 
        headerStr.includes('name') && headerStr.includes('email')) {
      return 'customers';
    }
    
    // Revenue indicators
    if (headerStr.includes('revenue') || headerStr.includes('income') || 
        headerStr.includes('sales') || (headerStr.includes('amount') && headerStr.includes('source'))) {
      return 'revenues';
    }
    
    // Expense indicators
    if (headerStr.includes('expense') || headerStr.includes('cost') || 
        headerStr.includes('vendor') || (headerStr.includes('amount') && headerStr.includes('category'))) {
      return 'expenses';
    }
    
    // Default to customers if unclear
    return 'customers';
  }

  static detectArrayType(data, filename) {
    if (data.length === 0) {
      throw new Error('Empty data array');
    }

    const sample = data[0];
    const keys = Object.keys(sample);
    const dataType = this.detectDataType(keys);
    
    return {
      [dataType]: data
    };
  }

  static normalizeData(data, dataType) {
    return data.map((item, index) => {
      try {
        switch (dataType) {
          case 'customers':
            return this.normalizeCustomer(item);
          case 'revenues':
            return this.normalizeRevenue(item);
          case 'expenses':
            return this.normalizeExpense(item);
          default:
            return item;
        }
      } catch (error) {
        console.warn(`Error normalizing ${dataType} at index ${index}:`, error);
        return null;
      }
    }).filter(item => item !== null);
  }

  static normalizeCustomer(item) {
    // Map common field variations
    const fieldMappings = {
      name: ['name', 'customer_name', 'client_name', 'company_name', 'full_name'],
      email: ['email', 'email_address', 'contact_email'],
      phone: ['phone', 'phone_number', 'contact_phone', 'mobile'],
      company: ['company', 'organization', 'business_name'],
      status: ['status', 'customer_status', 'state'],
      acquisition_date: ['acquisition_date', 'date_acquired', 'signup_date', 'created_date', 'date'],
      total_value: ['total_value', 'lifetime_value', 'value', 'amount', 'revenue'],
      last_purchase_date: ['last_purchase_date', 'last_order_date', 'last_transaction']
    };

    const normalized = {};
    
    Object.entries(fieldMappings).forEach(([targetField, possibleFields]) => {
      for (const field of possibleFields) {
        if (item[field] !== undefined && item[field] !== '') {
          normalized[targetField] = item[field];
          break;
        }
      }
    });

    // Ensure required fields
    if (!normalized.name) {
      throw new Error('Customer name is required');
    }
    if (!normalized.email) {
      throw new Error('Customer email is required');
    }

    // Set defaults
    normalized.status = normalized.status || 'potential';
    normalized.total_value = parseFloat(normalized.total_value) || 0;
    normalized.acquisition_date = normalized.acquisition_date || new Date().toISOString().split('T')[0];

    return normalized;
  }

  static normalizeRevenue(item) {
    const fieldMappings = {
      amount: ['amount', 'revenue', 'income', 'value', 'total', 'price'],
      source: ['source', 'revenue_source', 'income_source', 'customer', 'client'],
      category: ['category', 'type', 'revenue_type', 'income_type'],
      date: ['date', 'revenue_date', 'transaction_date', 'created_date'],
      customer_name: ['customer_name', 'client_name', 'customer', 'client'],
      description: ['description', 'notes', 'details', 'memo']
    };

    const normalized = {};
    
    Object.entries(fieldMappings).forEach(([targetField, possibleFields]) => {
      for (const field of possibleFields) {
        if (item[field] !== undefined && item[field] !== '') {
          normalized[targetField] = item[field];
          break;
        }
      }
    });

    // Ensure required fields
    if (!normalized.amount) {
      throw new Error('Revenue amount is required');
    }
    if (!normalized.date) {
      throw new Error('Revenue date is required');
    }

    // Set defaults and parse values
    normalized.amount = parseFloat(normalized.amount);
    normalized.category = normalized.category || 'other';
    normalized.source = normalized.source || 'Unknown';

    return normalized;
  }

  static normalizeExpense(item) {
    const fieldMappings = {
      amount: ['amount', 'cost', 'expense', 'value', 'total', 'price'],
      category: ['category', 'type', 'expense_type', 'cost_type'],
      vendor: ['vendor', 'supplier', 'company', 'merchant', 'payee'],
      date: ['date', 'expense_date', 'transaction_date', 'created_date'],
      description: ['description', 'notes', 'details', 'memo', 'purpose'],
      receipt_url: ['receipt_url', 'receipt', 'invoice_url', 'document_url']
    };

    const normalized = {};
    
    Object.entries(fieldMappings).forEach(([targetField, possibleFields]) => {
      for (const field of possibleFields) {
        if (item[field] !== undefined && item[field] !== '') {
          normalized[targetField] = item[field];
          break;
        }
      }
    });

    // Ensure required fields
    if (!normalized.amount) {
      throw new Error('Expense amount is required');
    }
    if (!normalized.date) {
      throw new Error('Expense date is required');
    }

    // Set defaults and parse values
    normalized.amount = parseFloat(normalized.amount);
    normalized.category = normalized.category || 'other';
    normalized.vendor = normalized.vendor || 'Unknown';

    return normalized;
  }

  static generateImportPreview(data, maxRows = 5) {
    const preview = {};
    
    Object.entries(data).forEach(([dataType, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        preview[dataType] = {
          total: items.length,
          sample: items.slice(0, maxRows),
          fields: Object.keys(items[0])
        };
      }
    });

    return preview;
  }
}

export default DataImporter;
