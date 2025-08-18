import React, { useState, useEffect } from "react";
import { Revenue, Expense, Customer } from "@/entities/all";
import { FileSpreadsheet, Plus, Edit, Trash2, DollarSign, TrendingDown, Calendar, User, Building } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import CategoryManager from '../utils/categories';

export default function Reports() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenues');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [revenueData, expenseData, customerData] = await Promise.all([
        Revenue.list(),
        Expense.list(),
        Customer.list()
      ]);
      setRevenues(revenueData);
      setExpenses(expenseData);
      setCustomers(customerData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const getInitialFormData = (type) => {
    if (type === 'revenue') {
      return {
        amount: 0,
        source: '',
        category: CategoryManager.getDefaultCategory('revenue'),
        date: format(new Date(), 'yyyy-MM-dd'),
        customer_name: '',
        description: ''
      };
    } else {
      return {
        amount: 0,
        category: CategoryManager.getDefaultCategory('expense'),
        vendor: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        receipt_url: ''
      };
    }
  };

  const handleAdd = (type) => {
    setEditingItem(null);
    setFormData(getInitialFormData(type));
    setActiveTab(type === 'revenue' ? 'revenues' : 'expenses');
    setShowForm(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData(item);
    setActiveTab(type === 'revenue' ? 'revenues' : 'expenses');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'revenues') {
        if (editingItem) {
          await Revenue.update(editingItem.id, formData);
        } else {
          await Revenue.create(formData);
        }
      } else {
        if (editingItem) {
          await Expense.update(editingItem.id, formData);
        } else {
          await Expense.create(formData);
        }
      }
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'revenue') {
          await Revenue.delete(id);
        } else {
          await Expense.delete(id);
        }
        await loadData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  const getCategoryColor = (category, type = 'expense') => {
    // Determine type based on category if not provided
    const revenueCategories = Object.keys(CategoryManager.getCategories('revenue'));
    const actualType = revenueCategories.includes(category) ? 'revenue' : 'expense';

    return CategoryManager.getCategoryColorClass(actualType, category);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Financial Reports</h1>
              <p className="text-slate-600 text-lg">Manage your revenue and expense records</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAdd('revenue')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Revenue
              </button>
              <button
                onClick={() => handleAdd('expense')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('revenues')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'revenues'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revenues ({revenues.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'expenses'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses ({expenses.length})
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'revenues' ? 'Revenue' : 'Expense'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {activeTab === 'revenues' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                      <input
                        type="text"
                        value={formData.source || ''}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select
                        value={formData.category || CategoryManager.getDefaultCategory('revenue')}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CategoryManager.getCategoryOptions('revenue').map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={formData.customer_name || ''}
                        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select
                        value={formData.category || CategoryManager.getDefaultCategory('expense')}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CategoryManager.getCategoryOptions('expense').map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                      <input
                        type="text"
                        value={formData.vendor || ''}
                        onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === 'revenues' ? (
                  <>
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Revenue Records
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Expense Records
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(activeTab === 'revenues' ? revenues : expenses).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-slate-900">
                          ${item.amount.toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {CategoryManager.getCategoryLabel(activeTab === 'revenues' ? 'revenue' : 'expense', item.category)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </div>
                        {activeTab === 'revenues' ? (
                          item.customer_name && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {item.customer_name}
                            </div>
                          )
                        ) : (
                          item.vendor && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {item.vendor}
                            </div>
                          )
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item, activeTab === 'revenues' ? 'revenue' : 'expense')}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, activeTab === 'revenues' ? 'revenue' : 'expense')}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {(activeTab === 'revenues' ? revenues : expenses).length === 0 && (
                  <div className="text-center py-12">
                    <FileSpreadsheet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No {activeTab} yet
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Get started by adding your first {activeTab === 'revenues' ? 'revenue' : 'expense'} record
                    </p>
                    <button
                      onClick={() => handleAdd(activeTab === 'revenues' ? 'revenue' : 'expense')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add {activeTab === 'revenues' ? 'Revenue' : 'Expense'}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
