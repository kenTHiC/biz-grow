import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from 'date-fns';

const TrendSparklines = ({ revenues, expenses, customers }) => {
  // Generate monthly data for the last 6 months
  const generateMonthlyData = (
    data,
    valueField = 'amount',
    dateField = 'date'
  ) => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);

    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthData = data.filter(item => {
        const itemDate = parseISO(item[dateField]);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });

      const value =
        valueField === 'count'
          ? monthData.length
          : monthData.reduce((sum, item) => sum + (item[valueField] || 0), 0);

      return {
        month: format(month, 'MMM'),
        value: value,
        fullDate: month,
      };
    });
  };

  const revenueData = generateMonthlyData(revenues);
  const expenseData = generateMonthlyData(expenses);
  const customerData = generateMonthlyData(
    customers,
    'count',
    'acquisition_date'
  );

  // Calculate trends
  const calculateTrend = data => {
    if (data.length < 2) return { direction: 'stable', percentage: 0 };

    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;

    if (previous === 0) return { direction: 'stable', percentage: 0 };

    const percentage = ((current - previous) / previous) * 100;
    const direction =
      percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable';

    return { direction, percentage: Math.abs(percentage) };
  };

  const revenueTrend = calculateTrend(revenueData);
  const expenseTrend = calculateTrend(expenseData);
  const customerTrend = calculateTrend(customerData);

  const formatCurrency = value => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const TrendCard = ({ title, data, trend, color, type = 'currency' }) => {
    const currentValue = data[data.length - 1]?.value || 0;
    const hasData = data.some(d => d.value > 0);

    const TrendIcon =
      trend.direction === 'up'
        ? TrendingUp
        : trend.direction === 'down'
          ? TrendingDown
          : Minus;

    const trendColor =
      trend.direction === 'up'
        ? 'text-green-600'
        : trend.direction === 'down'
          ? 'text-red-600'
          : 'text-gray-600';

    const EmptySparkline = () => (
      <div className="h-16 flex items-center justify-center text-gray-400">
        <BarChart3 className="w-8 h-8" />
      </div>
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {trend.percentage > 0 && (
              <span>{trend.percentage.toFixed(1)}%</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xl font-bold text-gray-900">
            {type === 'currency'
              ? formatCurrency(currentValue)
              : currentValue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Last 6 months</div>
        </div>

        <div className="h-16">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id={`gradient-${color}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${color})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptySparkline />
          )}
        </div>

        {hasData && (
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{data[0]?.month}</span>
            <span>{data[data.length - 1]?.month}</span>
          </div>
        )}
      </div>
    );
  };

  const OverallTrendCard = () => {
    const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);
    const totalExpenses = expenseData.reduce((sum, d) => sum + d.value, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Calculate profit trend data
    const profitData = revenueData.map((rev, index) => ({
      month: rev.month,
      value: rev.value - (expenseData[index]?.value || 0),
      fullDate: rev.fullDate,
    }));

    const profitTrend = calculateTrend(profitData);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Net Profit Trend
          </h4>
          <div
            className={`flex items-center gap-1 text-xs ${
              profitTrend.direction === 'up'
                ? 'text-green-600'
                : profitTrend.direction === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {profitTrend.direction === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : profitTrend.direction === 'down' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {profitTrend.percentage > 0 && (
              <span>{profitTrend.percentage.toFixed(1)}%</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(netProfit)}
          </div>
          <div className="text-xs text-gray-500">
            {profitMargin.toFixed(1)}% margin
          </div>
        </div>

        <div className="h-16">
          {profitData.some(d => d.value !== 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient
                    id="gradient-profit"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={netProfit >= 0 ? '#22c55e' : '#ef4444'}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={netProfit >= 0 ? '#22c55e' : '#ef4444'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={netProfit >= 0 ? '#22c55e' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#gradient-profit)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-16 flex items-center justify-center text-gray-400">
              <BarChart3 className="w-8 h-8" />
            </div>
          )}
        </div>

        {profitData.some(d => d.value !== 0) && (
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{profitData[0]?.month}</span>
            <span>{profitData[profitData.length - 1]?.month}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <TrendCard
        title="Revenue Trend"
        data={revenueData}
        trend={revenueTrend}
        color="#22c55e"
        type="currency"
      />

      <TrendCard
        title="Expense Trend"
        data={expenseData}
        trend={expenseTrend}
        color="#ef4444"
        type="currency"
      />

      <TrendCard
        title="Customer Growth"
        data={customerData}
        trend={customerTrend}
        color="#3b82f6"
        type="number"
      />

      <OverallTrendCard />
    </div>
  );
};

export default TrendSparklines;
