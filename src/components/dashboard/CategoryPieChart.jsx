import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

const CategoryPieChart = ({ data, title, type = "expense" }) => {
  // Process data to group by category
  const processData = () => {
    if (!data || data.length === 0) return [];

    const categoryTotals = {};
    data.forEach(item => {
      const category = item.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + (item.amount || 0);
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: amount,
        percentage: 0 // Will be calculated after sorting
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index, array) => {
        const total = array.reduce((sum, i) => sum + i.value, 0);
        return {
          ...item,
          percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
        };
      });
  };

  const chartData = processData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Color schemes
  const expenseColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'
  ];

  const revenueColors = [
    '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
    '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
    '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'
  ];

  const colors = type === 'expense' ? expenseColors : revenueColors;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <BarChart3 className="w-12 h-12 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
      <p className="text-center text-gray-600">
        {type === 'expense' 
          ? 'Add expense data to see category breakdown'
          : 'Add revenue data to see source breakdown'
        }
      </p>
    </div>
  );

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-600">
          Total: {formatCurrency(total)}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Breakdown</h4>
        <div className="space-y-2">
          {chartData.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-gray-500">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
          {chartData.length > 5 && (
            <div className="text-xs text-gray-500 pt-2">
              +{chartData.length - 5} more categories
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
