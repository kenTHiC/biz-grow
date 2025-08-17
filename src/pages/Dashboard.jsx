import React, { useState, useEffect } from "react";
import { Revenue, Expense, Customer } from "@/entities/all";
import { DollarSign, TrendingDown, Users, Target } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

import KPICard from "../components/dashboard/KPICard";
import RevenueChart from "../components/dashboard/RevenueChart";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import CustomerGrowthChart from "../components/dashboard/CustomerGrowthChart";
import DateRangeFilter from "../components/dashboard/DateRangeFilter";

export default function Dashboard() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [revenueData, expenseData, customerData] = await Promise.all([
        Revenue.list('-date'),
        Expense.list('-date'),
        Customer.list('-acquisition_date')
      ]);
      
      setRevenues(revenueData);
      setExpenses(expenseData);
      setCustomers(customerData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const filterDataByDateRange = (data, dateField = 'date') => {
    if (!dateRange?.from || !dateRange?.to) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
    });
  };

  const filteredRevenues = filterDataByDateRange(revenues);
  const filteredExpenses = filterDataByDateRange(expenses);
  const filteredCustomers = filterDataByDateRange(customers, 'acquisition_date');

  const totalRevenue = filteredRevenues.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;

  // Prepare chart data
  const revenueChartData = prepareRevenueChartData(filteredRevenues);
  const expenseChartData = prepareExpenseChartData(filteredExpenses);
  const customerChartData = prepareCustomerChartData(filteredCustomers);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        summary: {
          totalRevenue,
          totalExpenses,
          netProfit,
          activeCustomers,
          dateRange: {
            from: format(dateRange.from, 'yyyy-MM-dd'),
            to: format(dateRange.to, 'yyyy-MM-dd')
          }
        },
        revenues: filteredRevenues.map(r => ({
          date: r.date,
          amount: r.amount,
          source: r.source,
          category: r.category,
          customer: r.customer_name
        })),
        expenses: filteredExpenses.map(e => ({
          date: e.date,
          amount: e.amount,
          category: e.category,
          vendor: e.vendor,
          description: e.description
        })),
        customers: filteredCustomers.map(c => ({
          name: c.name,
          email: c.email,
          company: c.company,
          status: c.status,
          acquisitionDate: c.acquisition_date,
          totalValue: c.total_value
        }))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
    setIsExporting(false);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
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

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Business Dashboard</h1>
            <p className="text-slate-600 text-lg">Track your business performance and growth</p>
          </div>
        </div>

        <DateRangeFilter 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExport={handleExport}
          isExporting={isExporting}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12.5%"
            changeType="positive"
            icon={DollarSign}
            color="bg-blue-500"
            delay={0}
          />
          <KPICard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            change="+5.2%"
            changeType="positive"
            icon={TrendingDown}
            color="bg-amber-500"
            delay={0.1}
          />
          <KPICard
            title="Net Profit"
            value={`$${netProfit.toLocaleString()}`}
            change={netProfit > 0 ? "+18.3%" : "-8.1%"}
            changeType={netProfit > 0 ? "positive" : "negative"}
            icon={Target}
            color={netProfit > 0 ? "bg-emerald-500" : "bg-red-500"}
            delay={0.2}
          />
          <KPICard
            title="Active Customers"
            value={activeCustomers.toString()}
            change="+23.1%"
            changeType="positive"
            icon={Users}
            color="bg-purple-500"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart data={revenueChartData} />
          <ExpenseChart data={expenseChartData} />
        </div>

        <CustomerGrowthChart data={customerChartData} />
      </div>
    </div>
  );
}

function prepareRevenueChartData(revenues) {
  const monthlyData = {};
  
  revenues.forEach(revenue => {
    const month = format(new Date(revenue.date), 'MMM yyyy');
    monthlyData[month] = (monthlyData[month] || 0) + (revenue.amount || 0);
  });

  return Object.entries(monthlyData)
    .map(([period, revenue]) => ({ period, revenue }))
    .sort((a, b) => new Date(a.period) - new Date(b.period))
    .slice(-12);
}

function prepareExpenseChartData(expenses) {
  const categoryData = {};
  
  expenses.forEach(expense => {
    const category = expense.category?.replace(/_/g, ' ') || 'other';
    categoryData[category] = (categoryData[category] || 0) + (expense.amount || 0);
  });

  return Object.entries(categoryData)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
}

function prepareCustomerChartData(customers) {
  const monthlyData = {};
  
  customers.forEach(customer => {
    const month = format(new Date(customer.acquisition_date || customer.created_date), 'MMM yyyy');
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  return Object.entries(monthlyData)
    .map(([period, customers]) => ({ period, customers }))
    .sort((a, b) => new Date(a.period) - new Date(b.period))
    .slice(-12);
}