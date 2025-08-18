import timePeriodsConfig from '../config/timePeriods.json';
import { startOfDay, endOfDay, subDays, subMonths, startOfMonth, endOfMonth, 
         startOfQuarter, endOfQuarter, startOfYear, endOfYear, 
         startOfWeek, endOfWeek, subWeeks, subQuarters, subYears } from 'date-fns';

export class TimePeriodManager {
  static getTimePeriods(context = 'dashboard') {
    return timePeriodsConfig[context] || {};
  }

  static getTimePeriodOptions(context = 'dashboard') {
    const periods = this.getTimePeriods(context);
    return Object.entries(periods).map(([key, config]) => ({
      value: key,
      label: config.label,
      description: config.description,
      type: config.type
    }));
  }

  static getTimePeriodLabel(context, key) {
    const periods = this.getTimePeriods(context);
    return periods[key]?.label || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  static getTimePeriodDescription(context, key) {
    const periods = this.getTimePeriods(context);
    return periods[key]?.description || '';
  }

  static getDefaultTimePeriod(context = 'dashboard') {
    const periods = this.getTimePeriods(context);
    const keys = Object.keys(periods);
    
    // Default preferences by context
    const defaults = {
      dashboard: 'last_30_days',
      analytics: 'last_90_days', 
      reports: 'this_month'
    };
    
    const preferred = defaults[context];
    return keys.includes(preferred) ? preferred : keys[0] || 'last_30_days';
  }

  static calculateDateRange(context, key, customStart = null, customEnd = null) {
    const periods = this.getTimePeriods(context);
    const period = periods[key];
    
    if (!period) {
      throw new Error(`Time period '${key}' not found in context '${context}'`);
    }

    const now = new Date();
    let startDate, endDate;

    switch (period.type) {
      case 'relative':
        if (period.days) {
          startDate = startOfDay(subDays(now, period.days - 1));
          endDate = endOfDay(now);
        } else if (period.months) {
          startDate = startOfDay(subMonths(now, period.months));
          endDate = endOfDay(now);
        }
        break;

      case 'current_month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;

      case 'current_quarter':
        startDate = startOfQuarter(now);
        endDate = endOfQuarter(now);
        break;

      case 'current_year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;

      case 'current_week':
        startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;

      case 'yesterday':
        const yesterday = subDays(now, 1);
        startDate = startOfDay(yesterday);
        endDate = endOfDay(yesterday);
        break;

      case 'last_week':
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        break;

      case 'last_month':
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;

      case 'last_quarter':
        const lastQuarter = subQuarters(now, 1);
        startDate = startOfQuarter(lastQuarter);
        endDate = endOfQuarter(lastQuarter);
        break;

      case 'last_year':
        const lastYear = subYears(now, 1);
        startDate = startOfYear(lastYear);
        endDate = endOfYear(lastYear);
        break;

      case 'year_to_date':
        startDate = startOfYear(now);
        endDate = endOfDay(now);
        break;

      case 'custom':
        if (!customStart || !customEnd) {
          throw new Error('Custom date range requires start and end dates');
        }
        startDate = startOfDay(new Date(customStart));
        endDate = endOfDay(new Date(customEnd));
        break;

      default:
        // Default to last 30 days
        startDate = startOfDay(subDays(now, 29));
        endDate = endOfDay(now);
    }

    return {
      startDate,
      endDate,
      label: period.label,
      description: period.description
    };
  }

  static filterDataByDateRange(data, dateField, startDate, endDate) {
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => {
      if (!item[dateField]) return false;
      
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  static getQuickFilters(context = 'dashboard') {
    const periods = this.getTimePeriods(context);
    
    // Return commonly used quick filters
    const quickFilterKeys = {
      dashboard: ['last_7_days', 'last_30_days', 'last_90_days', 'this_month', 'this_year'],
      analytics: ['last_30_days', 'last_90_days', 'this_quarter', 'this_year'],
      reports: ['today', 'this_week', 'this_month', 'this_quarter', 'custom']
    };
    
    const keys = quickFilterKeys[context] || quickFilterKeys.dashboard;
    
    return keys
      .filter(key => periods[key])
      .map(key => ({
        value: key,
        label: periods[key].label,
        description: periods[key].description
      }));
  }

  static addCustomTimePeriod(context, key, config) {
    // This would be used for future functionality to add custom time periods
    // For now, we'll just validate the structure
    if (!config.label || !config.description || !config.type) {
      throw new Error('Time period config must include label, description, and type');
    }
    
    // In a real implementation, this would save to localStorage or send to API
    console.log(`Would add custom time period: ${context}.${key}`, config);
    return true;
  }

  static validateTimePeriod(context, key) {
    const periods = this.getTimePeriods(context);
    return Object.keys(periods).includes(key);
  }

  static getAllTimePeriods() {
    return timePeriodsConfig;
  }

  static exportTimePeriods() {
    return JSON.stringify(timePeriodsConfig, null, 2);
  }

  static importTimePeriods(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      // Validate structure
      if (!imported.dashboard || !imported.analytics || !imported.reports) {
        throw new Error('Invalid time periods structure');
      }
      
      // In a real implementation, this would update the config
      console.log('Would import time periods:', imported);
      return true;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  static formatDateRange(startDate, endDate) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const start = startDate.toLocaleDateString('en-US', options);
    const end = endDate.toLocaleDateString('en-US', options);
    
    return `${start} - ${end}`;
  }

  static getRelativeDateDescription(context, key) {
    try {
      const range = this.calculateDateRange(context, key);
      return this.formatDateRange(range.startDate, range.endDate);
    } catch (error) {
      return 'Invalid date range';
    }
  }
}

export default TimePeriodManager;
