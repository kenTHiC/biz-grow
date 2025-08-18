import React from 'react';
import { Users, DollarSign, TrendingDown, TrendingUp, Calendar, BarChart3, Target, Percent } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

const DataSummaryCards = ({ customers, revenues, expenses }) => {
  // Calculate comprehensive statistics
  const stats = {
    // Basic counts
    totalCustomers: customers.length,
    totalRevenues: revenues.length,
    totalExpenses: expenses.length,
    
    // Financial calculations
    totalIncome: revenues.reduce((sum, r) => sum + (r.amount || 0), 0),
    totalExpenseAmount: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    
    // Customer statistics
    activeCustomers: customers.filter(c => c.status === 'active').length,
    potentialCustomers: customers.filter(c => c.status === 'potential').length,
    totalCustomerValue: customers.reduce((sum, c) => sum + (c.total_value || 0), 0),
    
    // Average calculations
    avgRevenuePerTransaction: revenues.length > 0 ? revenues.reduce((sum, r) => sum + (r.amount || 0), 0) / revenues.length : 0,
    avgExpensePerTransaction: expenses.length > 0 ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0) / expenses.length : 0,
    avgCustomerValue: customers.length > 0 ? customers.reduce((sum, c) => sum + (c.total_value || 0), 0) / customers.length : 0,
  };

  // Calculate net profit
  stats.netProfit = stats.totalIncome - stats.totalExpenseAmount;
  stats.profitMargin = stats.totalIncome > 0 ? (stats.netProfit / stats.totalIncome) * 100 : 0;

  // Date range calculations
  const allDates = [
    ...revenues.map(r => r.date),
    ...expenses.map(e => e.date),
    ...customers.map(c => c.acquisition_date)
  ].filter(date => date).map(date => parseISO(date)).sort((a, b) => a - b);

  const dateRange = allDates.length > 0 ? {
    earliest: allDates[0],
    latest: allDates[allDates.length - 1],
    span: differenceInDays(allDates[allDates.length - 1], allDates[0])
  } : null;

  // Growth calculations (comparing last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentRevenues = revenues.filter(r => parseISO(r.date) >= thirtyDaysAgo);
  const previousRevenues = revenues.filter(r => {
    const date = parseISO(r.date);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  });

  const recentRevenueTotal = recentRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
  const previousRevenueTotal = previousRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
  const revenueGrowth = previousRevenueTotal > 0 ? ((recentRevenueTotal - previousRevenueTotal) / previousRevenueTotal) * 100 : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      red: "bg-red-50 border-red-200 text-red-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      gray: "bg-gray-50 border-gray-200 text-gray-600"
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              {trendValue && <span>{trendValue}</span>}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-gray-600 font-medium">{title}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="col-span-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
      <p className="text-gray-600 mb-4">
        Import your business data to see comprehensive statistics and insights.
      </p>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('openDataManager'))}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Import Data
      </button>
    </div>
  );

  // Show empty state if no data
  if (stats.totalCustomers === 0 && stats.totalRevenues === 0 && stats.totalExpenses === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Revenue */}
      <StatCard
        icon={DollarSign}
        title="Total Revenue"
        value={formatCurrency(stats.totalIncome)}
        subtitle={`${formatNumber(stats.totalRevenues)} transactions`}
        trend={revenueGrowth > 0 ? 'up' : revenueGrowth < 0 ? 'down' : 'stable'}
        trendValue={revenueGrowth !== 0 ? `${Math.abs(revenueGrowth).toFixed(1)}%` : null}
        color="green"
      />

      {/* Total Expenses */}
      <StatCard
        icon={TrendingDown}
        title="Total Expenses"
        value={formatCurrency(stats.totalExpenseAmount)}
        subtitle={`${formatNumber(stats.totalExpenses)} transactions`}
        color="red"
      />

      {/* Net Profit */}
      <StatCard
        icon={Target}
        title="Net Profit"
        value={formatCurrency(stats.netProfit)}
        subtitle={`${stats.profitMargin.toFixed(1)}% margin`}
        color={stats.netProfit >= 0 ? "green" : "red"}
      />

      {/* Total Customers */}
      <StatCard
        icon={Users}
        title="Total Customers"
        value={formatNumber(stats.totalCustomers)}
        subtitle={`${stats.activeCustomers} active, ${stats.potentialCustomers} potential`}
        color="blue"
      />

      {/* Average Revenue per Transaction */}
      <StatCard
        icon={BarChart3}
        title="Avg Revenue/Transaction"
        value={formatCurrency(stats.avgRevenuePerTransaction)}
        subtitle="Per transaction average"
        color="purple"
      />

      {/* Average Customer Value */}
      <StatCard
        icon={DollarSign}
        title="Avg Customer Value"
        value={formatCurrency(stats.avgCustomerValue)}
        subtitle="Lifetime value average"
        color="orange"
      />

      {/* Data Date Range */}
      {dateRange && (
        <StatCard
          icon={Calendar}
          title="Data Range"
          value={`${dateRange.span} days`}
          subtitle={`${format(dateRange.earliest, 'MMM dd')} - ${format(dateRange.latest, 'MMM dd, yyyy')}`}
          color="gray"
        />
      )}

      {/* Profit Margin */}
      <StatCard
        icon={Percent}
        title="Profit Margin"
        value={`${stats.profitMargin.toFixed(1)}%`}
        subtitle={stats.profitMargin >= 20 ? "Excellent" : stats.profitMargin >= 10 ? "Good" : stats.profitMargin >= 0 ? "Fair" : "Needs Attention"}
        color={stats.profitMargin >= 20 ? "green" : stats.profitMargin >= 10 ? "blue" : stats.profitMargin >= 0 ? "orange" : "red"}
      />
    </div>
  );
};

export default DataSummaryCards;
