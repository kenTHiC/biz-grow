import React, { useState, useEffect } from 'react';
import {
  Analytics as AnalyticsService,
  Revenue,
  Expense,
  Customer,
} from '@/entities/all';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import DateRangeFilter from '../components/dashboard/DateRangeFilter';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await AnalyticsService.getAnalytics(dateRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setIsLoading(false);
  };

  const handleExport = async () => {
    if (!analytics) return;

    const exportData = {
      summary: {
        totalRevenue: analytics.totalRevenue,
        totalExpenses: analytics.totalExpenses,
        netProfit: analytics.netProfit,
        activeCustomers: analytics.activeCustomers,
        dateRange: {
          from: format(dateRange.from, 'yyyy-MM-dd'),
          to: format(dateRange.to, 'yyyy-MM-dd'),
        },
      },
      revenues: analytics.revenues,
      expenses: analytics.expenses,
      customers: analytics.customers,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const prepareRevenueByCategory = () => {
    if (!analytics?.revenues) return [];

    const categoryData = {};
    analytics.revenues.forEach(revenue => {
      const category = revenue.category || 'other';
      categoryData[category] = (categoryData[category] || 0) + revenue.amount;
    });

    return Object.entries(categoryData).map(([category, amount]) => ({
      category: category.replace('_', ' ').toUpperCase(),
      amount,
      percentage: ((amount / analytics.totalRevenue) * 100).toFixed(1),
    }));
  };

  const prepareExpenseByCategory = () => {
    if (!analytics?.expenses) return [];

    const categoryData = {};
    analytics.expenses.forEach(expense => {
      const category = expense.category || 'other';
      categoryData[category] = (categoryData[category] || 0) + expense.amount;
    });

    return Object.entries(categoryData).map(([category, amount]) => ({
      category: category.replace('_', ' ').toUpperCase(),
      amount,
      percentage: ((amount / analytics.totalExpenses) * 100).toFixed(1),
    }));
  };

  const prepareMonthlyTrends = () => {
    if (!analytics?.revenues || !analytics?.expenses) return [];

    const monthlyData = {};

    // Process revenues
    analytics.revenues.forEach(revenue => {
      const month = format(new Date(revenue.date), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = { month, revenue: 0, expenses: 0 };
      }
      monthlyData[month].revenue += revenue.amount;
    });

    // Process expenses
    analytics.expenses.forEach(expense => {
      const month = format(new Date(expense.date), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = { month, revenue: 0, expenses: 0 };
      }
      monthlyData[month].expenses += expense.amount;
    });

    return Object.values(monthlyData)
      .map(data => ({
        ...data,
        profit: data.revenue - data.expenses,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-200 rounded-2xl"></div>
              <div className="h-96 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Analytics</h1>
          <p className="text-slate-600">
            No data available for the selected date range.
          </p>
        </div>
      </div>
    );
  }

  const revenueByCategory = prepareRevenueByCategory();
  const expenseByCategory = prepareExpenseByCategory();
  const monthlyTrends = prepareMonthlyTrends();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Business Analytics
              </h1>
              <p className="text-slate-600 text-lg">
                Deep insights into your business performance
              </p>
            </div>
          </div>

          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onExport={handleExport}
            isExporting={false}
          />
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${analytics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    +12.5% vs last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${analytics.totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    +5.2% vs last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Net Profit
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${analytics.netProfit.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs mt-1 ${analytics.netProfit > 0 ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {analytics.netProfit > 0 ? '+18.3%' : '-8.1%'} vs last
                    period
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${analytics.netProfit > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                >
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Active Customers
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.activeCustomers}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    +23.1% vs last period
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue by Category */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={revenueByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        label={({ category, percentage }) =>
                          `${category}: ${percentage}%`
                        }
                      >
                        {revenueByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={value => [
                          `$${value.toLocaleString()}`,
                          'Amount',
                        ]}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expense by Category */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expenseByCategory}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="category"
                        stroke="#64748b"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        formatter={value => [
                          `$${value.toLocaleString()}`,
                          'Amount',
                        ]}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Revenue vs Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      formatter={value => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Expenses"
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
