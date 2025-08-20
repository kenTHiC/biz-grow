// Advanced Analytics Engine for BizGrow
import {
  format,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO,
  isWithinInterval,
} from 'date-fns';

export class AdvancedAnalytics {
  constructor(data) {
    this.customers = data.customers || [];
    this.revenues = data.revenues || [];
    this.expenses = data.expenses || [];
  }

  // Comprehensive Business Metrics
  getBusinessMetrics(dateRange = null) {
    const filteredData = this.filterByDateRange(dateRange);

    return {
      financial: this.getFinancialMetrics(filteredData),
      customer: this.getCustomerMetrics(filteredData),
      growth: this.getGrowthMetrics(filteredData),
      efficiency: this.getEfficiencyMetrics(filteredData),
      trends: this.getTrendAnalysis(filteredData),
      forecasting: this.getForecasting(filteredData),
      benchmarks: this.getBenchmarks(filteredData),
    };
  }

  // Financial Metrics
  getFinancialMetrics(data) {
    const { revenues, expenses } = data;

    const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Revenue breakdown by category
    const revenueByCategory = this.groupByCategory(revenues, 'category');
    const expensesByCategory = this.groupByCategory(expenses, 'category');

    // Average transaction values
    const avgRevenuePerTransaction =
      revenues.length > 0 ? totalRevenue / revenues.length : 0;
    const avgExpensePerTransaction =
      expenses.length > 0 ? totalExpenses / expenses.length : 0;

    // Cash flow analysis
    const cashFlow = this.calculateCashFlow(revenues, expenses);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      revenueByCategory,
      expensesByCategory,
      avgRevenuePerTransaction,
      avgExpensePerTransaction,
      cashFlow,
      burnRate: this.calculateBurnRate(expenses),
      runway: this.calculateRunway(netProfit, expenses),
    };
  }

  // Customer Metrics
  getCustomerMetrics(data) {
    const { customers, revenues } = data;

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const potentialCustomers = customers.filter(
      c => c.status === 'potential'
    ).length;
    const inactiveCustomers = customers.filter(
      c => c.status === 'inactive'
    ).length;

    // Customer Lifetime Value (CLV)
    const clv = this.calculateCLV(customers, revenues);

    // Customer Acquisition Cost (CAC)
    const cac = this.calculateCAC(data.expenses, customers);

    // Churn rate
    const churnRate = this.calculateChurnRate(customers);

    // Customer value distribution
    const valueDistribution = this.getCustomerValueDistribution(customers);

    return {
      totalCustomers,
      activeCustomers,
      potentialCustomers,
      inactiveCustomers,
      activationRate:
        totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0,
      clv,
      cac,
      clvToCacRatio: cac > 0 ? clv / cac : 0,
      churnRate,
      valueDistribution,
      avgCustomerValue:
        customers.length > 0
          ? customers.reduce((sum, c) => sum + (c.total_value || 0), 0) /
            customers.length
          : 0,
    };
  }

  // Growth Metrics
  getGrowthMetrics(data) {
    const monthlyRevenue = this.getMonthlyData(data.revenues, 'amount');
    const monthlyCustomers = this.getMonthlyCustomerGrowth(data.customers);

    const revenueGrowthRate = this.calculateGrowthRate(monthlyRevenue);
    const customerGrowthRate = this.calculateGrowthRate(monthlyCustomers);

    return {
      revenueGrowthRate,
      customerGrowthRate,
      monthlyRevenue,
      monthlyCustomers,
      quarterlyGrowth: this.getQuarterlyGrowth(data),
      yearOverYearGrowth: this.getYearOverYearGrowth(data),
    };
  }

  // Efficiency Metrics
  getEfficiencyMetrics(data) {
    const { revenues, expenses, customers } = data;

    const revenuePerCustomer =
      customers.length > 0
        ? revenues.reduce((sum, r) => sum + (r.amount || 0), 0) /
          customers.length
        : 0;

    const expensePerCustomer =
      customers.length > 0
        ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0) /
          customers.length
        : 0;

    return {
      revenuePerCustomer,
      expensePerCustomer,
      profitPerCustomer: revenuePerCustomer - expensePerCustomer,
      operationalEfficiency: this.calculateOperationalEfficiency(
        revenues,
        expenses
      ),
      resourceUtilization: this.calculateResourceUtilization(data),
    };
  }

  // Trend Analysis
  getTrendAnalysis(data) {
    const revenueData = this.getMonthlyData(data.revenues, 'amount');
    const expenseData = this.getMonthlyData(data.expenses, 'amount');

    return {
      revenueTrend: this.calculateTrend(revenueData),
      expenseTrend: this.calculateTrend(expenseData),
      seasonality: this.detectSeasonality(revenueData),
      volatility: this.calculateVolatility(revenueData),
      momentum: this.calculateMomentum(revenueData),
    };
  }

  // Forecasting
  getForecasting(data) {
    const monthlyRevenue = this.getMonthlyData(data.revenues, 'amount');
    const monthlyExpenses = this.getMonthlyData(data.expenses, 'amount');

    return {
      revenueProjection: this.projectRevenue(monthlyRevenue),
      expenseProjection: this.projectExpenses(monthlyExpenses),
      profitProjection: this.projectProfit(monthlyRevenue, monthlyExpenses),
      customerProjection: this.projectCustomerGrowth(data.customers),
    };
  }

  // Benchmarks and KPIs
  getBenchmarks(data) {
    return {
      industryBenchmarks: this.getIndustryBenchmarks(),
      kpiStatus: this.evaluateKPIs(data),
      performanceScore: this.calculatePerformanceScore(data),
      recommendations: this.generateRecommendations(data),
    };
  }

  // Helper Methods
  filterByDateRange(dateRange) {
    if (!dateRange?.from || !dateRange?.to) {
      return {
        customers: this.customers,
        revenues: this.revenues,
        expenses: this.expenses,
      };
    }

    return {
      customers: this.customers.filter(c => {
        const date = parseISO(c.acquisition_date);
        return isWithinInterval(date, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }),
      revenues: this.revenues.filter(r => {
        const date = parseISO(r.date);
        return isWithinInterval(date, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }),
      expenses: this.expenses.filter(e => {
        const date = parseISO(e.date);
        return isWithinInterval(date, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }),
    };
  }

  groupByCategory(items, categoryField) {
    return items.reduce((acc, item) => {
      const category = item[categoryField] || 'other';
      acc[category] = (acc[category] || 0) + (item.amount || 0);
      return acc;
    }, {});
  }

  getMonthlyData(items, valueField) {
    const monthlyData = {};

    items.forEach(item => {
      const month = format(parseISO(item.date), 'yyyy-MM');
      monthlyData[month] = (monthlyData[month] || 0) + (item[valueField] || 0);
    });

    return Object.entries(monthlyData)
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  calculateGrowthRate(monthlyData) {
    if (monthlyData.length < 2) return 0;

    const current = monthlyData[monthlyData.length - 1].value;
    const previous = monthlyData[monthlyData.length - 2].value;

    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  }

  calculateCLV(customers, revenues) {
    if (customers.length === 0) return 0;

    const totalCustomerValue = customers.reduce(
      (sum, c) => sum + (c.total_value || 0),
      0
    );
    return totalCustomerValue / customers.length;
  }

  calculateCAC(expenses, customers) {
    const marketingExpenses = expenses
      .filter(e => e.category === 'marketing')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const newCustomers = customers.filter(c => {
      const acquisitionDate = parseISO(c.acquisition_date);
      const threeMonthsAgo = subMonths(new Date(), 3);
      return acquisitionDate >= threeMonthsAgo;
    }).length;

    return newCustomers > 0 ? marketingExpenses / newCustomers : 0;
  }

  calculateChurnRate(customers) {
    const inactiveCustomers = customers.filter(
      c => c.status === 'inactive'
    ).length;
    return customers.length > 0
      ? (inactiveCustomers / customers.length) * 100
      : 0;
  }

  calculateBurnRate(expenses) {
    const monthlyExpenses = this.getMonthlyData(expenses, 'amount');
    if (monthlyExpenses.length === 0) return 0;

    const totalExpenses = monthlyExpenses.reduce((sum, m) => sum + m.value, 0);
    return totalExpenses / monthlyExpenses.length;
  }

  calculateRunway(netProfit, expenses) {
    const burnRate = this.calculateBurnRate(expenses);
    return burnRate > 0 ? Math.abs(netProfit) / burnRate : Infinity;
  }

  calculateCashFlow(revenues, expenses) {
    const monthlyRevenue = this.getMonthlyData(revenues, 'amount');
    const monthlyExpenses = this.getMonthlyData(expenses, 'amount');

    const cashFlow = [];
    const allMonths = new Set([
      ...monthlyRevenue.map(r => r.month),
      ...monthlyExpenses.map(e => e.month),
    ]);

    Array.from(allMonths)
      .sort()
      .forEach(month => {
        const revenue = monthlyRevenue.find(r => r.month === month)?.value || 0;
        const expense =
          monthlyExpenses.find(e => e.month === month)?.value || 0;
        cashFlow.push({
          month,
          revenue,
          expense,
          netCashFlow: revenue - expense,
        });
      });

    return cashFlow;
  }

  getCustomerValueDistribution(customers) {
    const values = customers.map(c => c.total_value || 0).sort((a, b) => a - b);
    const total = values.length;

    if (total === 0) return { low: 0, medium: 0, high: 0 };

    const lowThreshold = values[Math.floor(total * 0.33)];
    const highThreshold = values[Math.floor(total * 0.67)];

    return {
      low: values.filter(v => v <= lowThreshold).length,
      medium: values.filter(v => v > lowThreshold && v <= highThreshold).length,
      high: values.filter(v => v > highThreshold).length,
    };
  }

  calculateTrend(data) {
    if (data.length < 2) return 'stable';

    const recent = data.slice(-3);
    const increases = recent
      .slice(1)
      .filter((item, i) => item.value > recent[i].value).length;

    if (increases >= 2) return 'increasing';
    if (increases === 0) return 'decreasing';
    return 'stable';
  }

  calculatePerformanceScore(data) {
    const metrics = this.getBusinessMetrics();
    let score = 0;
    let maxScore = 0;

    // Revenue growth (25 points)
    if (metrics.growth.revenueGrowthRate > 10) score += 25;
    else if (metrics.growth.revenueGrowthRate > 0) score += 15;
    else if (metrics.growth.revenueGrowthRate > -5) score += 5;
    maxScore += 25;

    // Profit margin (25 points)
    if (metrics.financial.profitMargin > 20) score += 25;
    else if (metrics.financial.profitMargin > 10) score += 15;
    else if (metrics.financial.profitMargin > 0) score += 10;
    maxScore += 25;

    // Customer growth (25 points)
    if (metrics.growth.customerGrowthRate > 15) score += 25;
    else if (metrics.growth.customerGrowthRate > 5) score += 15;
    else if (metrics.growth.customerGrowthRate > 0) score += 10;
    maxScore += 25;

    // CLV to CAC ratio (25 points)
    if (metrics.customer.clvToCacRatio > 3) score += 25;
    else if (metrics.customer.clvToCacRatio > 2) score += 15;
    else if (metrics.customer.clvToCacRatio > 1) score += 10;
    maxScore += 25;

    return Math.round((score / maxScore) * 100);
  }

  generateRecommendations(data) {
    const metrics = this.getBusinessMetrics();
    const recommendations = [];

    if (metrics.financial.profitMargin < 10) {
      recommendations.push({
        type: 'financial',
        priority: 'high',
        title: 'Improve Profit Margins',
        description:
          'Your profit margin is below 10%. Consider reducing costs or increasing prices.',
        action: 'Review expense categories and pricing strategy',
      });
    }

    if (metrics.customer.clvToCacRatio < 2) {
      recommendations.push({
        type: 'customer',
        priority: 'high',
        title: 'Optimize Customer Acquisition',
        description:
          'Your CLV to CAC ratio is low. Focus on improving customer retention or reducing acquisition costs.',
        action: 'Implement customer retention programs',
      });
    }

    if (metrics.growth.revenueGrowthRate < 0) {
      recommendations.push({
        type: 'growth',
        priority: 'critical',
        title: 'Address Revenue Decline',
        description:
          'Revenue is declining. Immediate action needed to identify and address root causes.',
        action: 'Conduct market analysis and customer feedback sessions',
      });
    }

    return recommendations;
  }

  getIndustryBenchmarks() {
    return {
      profitMargin: { good: 15, average: 8, poor: 3 },
      customerGrowthRate: { good: 20, average: 10, poor: 5 },
      clvToCacRatio: { good: 3, average: 2, poor: 1 },
      churnRate: { good: 5, average: 10, poor: 20 },
    };
  }

  getMonthlyCustomerGrowth(customers) {
    const monthlyData = {};

    customers.forEach(customer => {
      const month = format(parseISO(customer.acquisition_date), 'yyyy-MM');
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, value: count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  getQuarterlyGrowth(data) {
    const quarterlyRevenue = this.getQuarterlyData(data.revenues, 'amount');
    return this.calculateGrowthRate(quarterlyRevenue);
  }

  getYearOverYearGrowth(data) {
    const yearlyRevenue = this.getYearlyData(data.revenues, 'amount');
    return this.calculateGrowthRate(yearlyRevenue);
  }

  getQuarterlyData(items, valueField) {
    const quarterlyData = {};

    items.forEach(item => {
      const date = parseISO(item.date);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const key = `${year}-Q${quarter}`;
      quarterlyData[key] = (quarterlyData[key] || 0) + (item[valueField] || 0);
    });

    return Object.entries(quarterlyData)
      .map(([period, value]) => ({ month: period, value }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  getYearlyData(items, valueField) {
    const yearlyData = {};

    items.forEach(item => {
      const year = format(parseISO(item.date), 'yyyy');
      yearlyData[year] = (yearlyData[year] || 0) + (item[valueField] || 0);
    });

    return Object.entries(yearlyData)
      .map(([year, value]) => ({ month: year, value }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  calculateOperationalEfficiency(revenues, expenses) {
    const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    return totalExpenses > 0 ? (totalRevenue / totalExpenses) * 100 : 0;
  }

  calculateResourceUtilization(data) {
    const expensesByCategory = this.groupByCategory(data.expenses, 'category');
    const totalExpenses = Object.values(expensesByCategory).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }));
  }

  detectSeasonality(data) {
    if (data.length < 12) return 'insufficient_data';

    const monthlyAverages = {};
    data.forEach(item => {
      const month = parseInt(item.month.split('-')[1]);
      if (!monthlyAverages[month]) monthlyAverages[month] = [];
      monthlyAverages[month].push(item.value);
    });

    const avgByMonth = Object.entries(monthlyAverages).map(
      ([month, values]) => ({
        month: parseInt(month),
        avg: values.reduce((sum, v) => sum + v, 0) / values.length,
      })
    );

    const overallAvg =
      avgByMonth.reduce((sum, m) => sum + m.avg, 0) / avgByMonth.length;
    const variance =
      avgByMonth.reduce((sum, m) => sum + Math.pow(m.avg - overallAvg, 2), 0) /
      avgByMonth.length;

    return variance > overallAvg * 0.1 ? 'seasonal' : 'stable';
  }

  calculateVolatility(data) {
    if (data.length < 2) return 0;

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

    return (Math.sqrt(variance) / mean) * 100;
  }

  calculateMomentum(data) {
    if (data.length < 3) return 'stable';

    const recent = data.slice(-3);
    const changes = recent
      .slice(1)
      .map((item, i) => item.value - recent[i].value);
    const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;

    if (avgChange > 0) return 'accelerating';
    if (avgChange < 0) return 'decelerating';
    return 'stable';
  }

  projectRevenue(monthlyRevenue) {
    if (monthlyRevenue.length < 3) return [];

    const recent = monthlyRevenue.slice(-3);
    const trend = (recent[2].value - recent[0].value) / 2;

    const projections = [];
    for (let i = 1; i <= 3; i++) {
      const lastValue = monthlyRevenue[monthlyRevenue.length - 1].value;
      projections.push({
        month: `Projected +${i}`,
        value: Math.max(0, lastValue + trend * i),
      });
    }

    return projections;
  }

  projectExpenses(monthlyExpenses) {
    if (monthlyExpenses.length < 3) return [];

    const recent = monthlyExpenses.slice(-3);
    const trend = (recent[2].value - recent[0].value) / 2;

    const projections = [];
    for (let i = 1; i <= 3; i++) {
      const lastValue = monthlyExpenses[monthlyExpenses.length - 1].value;
      projections.push({
        month: `Projected +${i}`,
        value: Math.max(0, lastValue + trend * i),
      });
    }

    return projections;
  }

  projectProfit(monthlyRevenue, monthlyExpenses) {
    const revenueProjections = this.projectRevenue(monthlyRevenue);
    const expenseProjections = this.projectExpenses(monthlyExpenses);

    return revenueProjections.map((rev, i) => ({
      month: rev.month,
      value: rev.value - (expenseProjections[i]?.value || 0),
    }));
  }

  projectCustomerGrowth(customers) {
    const monthlyGrowth = this.getMonthlyCustomerGrowth(customers);
    if (monthlyGrowth.length < 3) return [];

    const recent = monthlyGrowth.slice(-3);
    const avgGrowth =
      recent.reduce((sum, m) => sum + m.value, 0) / recent.length;

    const projections = [];
    for (let i = 1; i <= 3; i++) {
      projections.push({
        month: `Projected +${i}`,
        value: Math.round(avgGrowth),
      });
    }

    return projections;
  }

  evaluateKPIs(data) {
    const metrics = this.getBusinessMetrics();
    const benchmarks = this.getIndustryBenchmarks();

    return {
      profitMargin: {
        value: metrics.financial.profitMargin,
        status:
          metrics.financial.profitMargin >= benchmarks.profitMargin.good
            ? 'excellent'
            : metrics.financial.profitMargin >= benchmarks.profitMargin.average
              ? 'good'
              : 'poor',
      },
      customerGrowth: {
        value: metrics.growth.customerGrowthRate,
        status:
          metrics.growth.customerGrowthRate >=
          benchmarks.customerGrowthRate.good
            ? 'excellent'
            : metrics.growth.customerGrowthRate >=
                benchmarks.customerGrowthRate.average
              ? 'good'
              : 'poor',
      },
      clvToCac: {
        value: metrics.customer.clvToCacRatio,
        status:
          metrics.customer.clvToCacRatio >= benchmarks.clvToCacRatio.good
            ? 'excellent'
            : metrics.customer.clvToCacRatio >= benchmarks.clvToCacRatio.average
              ? 'good'
              : 'poor',
      },
      churnRate: {
        value: metrics.customer.churnRate,
        status:
          metrics.customer.churnRate <= benchmarks.churnRate.good
            ? 'excellent'
            : metrics.customer.churnRate <= benchmarks.churnRate.average
              ? 'good'
              : 'poor',
      },
    };
  }
}

export default AdvancedAnalytics;
