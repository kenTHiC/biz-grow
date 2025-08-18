import React, { useState, useEffect } from "react";
import { Revenue, Expense, Customer } from "@/entities/all";
import { FileSpreadsheet, Plus, Edit, Trash2, DollarSign, TrendingDown, Calendar, User, Building } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import CategoryManager from '../utils/categories';

export default function Reports() {
  const { toast } = useToast();
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenues');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });

  useEffect(() => {
    loadData();
  }, []);

  // Debug selectedItems changes
  useEffect(() => {
    console.log('🔍 selectedItems STATE CHANGED:', JSON.stringify(selectedItems));
    console.log('🔍 selectedItems length:', selectedItems.length);
    console.log('🔍 selectedItems type:', typeof selectedItems);
    console.log('🔍 selectedItems is array:', Array.isArray(selectedItems));

    // Check if this is an unexpected change
    if (selectedItems.length > 1) {
      console.warn('⚠️ MULTIPLE ITEMS SELECTED - This might be the bug!');
      console.trace('Multiple selection call stack');
    }
  }, [selectedItems]);

  const loadData = async () => {
    console.log('Reports: Loading data...');
    setIsLoading(true);
    try {
      const [revenueData, expenseData, customerData] = await Promise.all([
        Revenue.list(),
        Expense.list(),
        Customer.list()
      ]);

      console.log('Reports: Loaded data:', {
        revenues: revenueData.length,
        expenses: expenseData.length,
        customers: customerData.length
      });

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
    console.log('🔧 EDIT CLICKED:', { item, type });
    console.log('Setting editing item:', item);
    console.log('Setting form data:', item);

    setEditingItem(item);
    setFormData(item);
    setActiveTab(type === 'revenue' ? 'revenues' : 'expenses');
    setShowForm(true);

    console.log('Edit form should now be visible');
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

  const handleDelete = (id, type) => {
    console.log('🗑️ DELETE CLICKED:', { id, type });
    setConfirmModal({
      isOpen: true,
      type: 'single-delete',
      data: { id, type }
    });
  };

  const confirmSingleDelete = async () => {
    const { id, type } = confirmModal.data;
    console.log(`Attempting to delete ${type} with ID:`, id);

    try {
      let result;
      if (type === 'revenue') {
        console.log('Calling Revenue.delete...');
        result = await Revenue.delete(id);
        console.log('Revenue delete result:', result);
      } else {
        console.log('Calling Expense.delete...');
        result = await Expense.delete(id);
        console.log('Expense delete result:', result);
      }

      console.log('Reloading data after delete...');
      await loadData();
      console.log('Data reloaded successfully');

      // Show success toast
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);

    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Error deleting ${type}: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'single-delete') {
      confirmSingleDelete();
    } else if (confirmModal.type === 'bulk-delete') {
      confirmBulkDelete();
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: '', data: null });
  };

  const getConfirmModalProps = () => {
    if (confirmModal.type === 'single-delete') {
      const { type } = confirmModal.data;
      return {
        title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        message: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
        confirmText: 'Delete',
        variant: 'danger'
      };
    } else if (confirmModal.type === 'bulk-delete') {
      const { selectedItems: itemsToDelete, itemType } = confirmModal.data;
      return {
        title: `Delete ${itemsToDelete.length} ${itemType}${itemsToDelete.length > 1 ? 's' : ''}`,
        message: `Are you sure you want to delete ${itemsToDelete.length} ${itemType}${itemsToDelete.length > 1 ? 's' : ''}? This action cannot be undone.`,
        confirmText: 'Delete All',
        variant: 'danger'
      };
    }
    return {};
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // Bulk delete functionality
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedItems([]);
  };

  const toggleItemSelection = (id) => {
    // Normalize IDs to strings to avoid 1 vs '1' mismatches
    const sid = String(id);
    console.log('☑️ CHECKBOX CLICKED for ID:', sid);
    console.log('Current selected items before toggle:', JSON.stringify(selectedItems));

    setSelectedItems(prevSelected => {
      // Use a Set to guarantee uniqueness and avoid duplicates under StrictMode
      const set = new Set(prevSelected.map(String));
      console.log('Inside setSelectedItems - current Set:', Array.from(set));

      if (set.has(sid)) {
        set.delete(sid);
        console.log('Removed from selection:', sid);
      } else {
        set.add(sid);
        console.log('Added to selection:', sid);
      }

      const next = Array.from(set);
      console.log('Next selection (unique):', next);
      return next;
    });
  };

  const selectAllItems = (event) => {
    console.log('🔘 SELECT ALL FUNCTION CALLED');
    console.log('Event object:', event);
    console.trace('selectAllItems call stack'); // This will show us where it's being called from

    // Only proceed if this was called by a real button click
    if (!event || !event.target) {
      console.error('❌ selectAllItems called without proper event - BLOCKING EXECUTION');
      return;
    }

    console.log('✅ selectAllItems called with proper event - proceeding');

    const currentItems = activeTab === 'revenues' ? revenues : expenses;
    const allIds = currentItems.map(item => item.id);
    console.log('All available IDs:', allIds);
    console.log('Currently selected:', selectedItems);
    console.log('Current selection length:', selectedItems.length);
    console.log('All items length:', allIds.length);

    const newSelection = selectedItems.length === allIds.length ? [] : allIds;
    console.log('New selection will be:', newSelection);

    setSelectedItems(newSelection);
  };

  const handleBulkDelete = () => {
    console.log('🗑️ BULK DELETE CLICKED');
    console.log('Selected items:', selectedItems);
    console.log('Active tab:', activeTab);

    if (selectedItems.length === 0) {
      console.log('No items selected');
      toast.warning('Please select items to delete');
      return;
    }

    const itemType = activeTab === 'revenues' ? 'revenue' : 'expense';
    setConfirmModal({
      isOpen: true,
      type: 'bulk-delete',
      data: { selectedItems: [...selectedItems], itemType }
    });
  };

  const confirmBulkDelete = async () => {
    const { selectedItems: itemsToDelete, itemType } = confirmModal.data;
    console.log('User confirmed bulk deletion');

    try {
      console.log(`Bulk deleting ${itemsToDelete.length} ${itemType}s:`, itemsToDelete);

      // Delete all selected items
      const deletePromises = itemsToDelete.map(id => {
        console.log(`Creating delete promise for ID: ${id}`);
        if (activeTab === 'revenues') {
          return Revenue.delete(id);
        } else {
          return Expense.delete(id);
        }
      });

      console.log('Executing bulk delete promises...');
      const deleteResults = await Promise.all(deletePromises);
      console.log('Bulk delete results:', deleteResults);

      console.log('Bulk delete completed, reloading data...');
      await loadData();

      // Reset selection
      console.log('Resetting selection state...');
      const deletedCount = itemsToDelete.length;
      setSelectedItems([]);
      setIsSelectionMode(false);

      toast.success(`Successfully deleted ${deletedCount} ${itemType}${deletedCount > 1 ? 's' : ''}!`);

    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error(`Error deleting items: ${error.message}`);
    }
  };

  const getCategoryColor = (category) => {
    // Determine type based on category
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

              {/* Bulk Delete Controls */}
              <div className="flex gap-2 border-l pl-2 ml-2">
                <button
                  onClick={toggleSelectionMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    isSelectionMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
                </button>

                {isSelectionMode && (
                  <>
                    <button
                      onClick={selectAllItems}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors duration-200 font-medium"
                    >
                      {selectedItems.length === (activeTab === 'revenues' ? revenues : expenses).length ? 'Deselect All' : 'Select All'}
                    </button>

                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Selected ({selectedItems.length})
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => handleTabChange('revenues')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'revenues'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revenues ({revenues.length})
          </button>
          <button
            onClick={() => handleTabChange('expenses')}
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
                    {/* Selection Checkbox */}
                    {isSelectionMode && (
                      <div className="mr-3">
                        <input
                          type="checkbox"
                          id={`checkbox-${item.id}`}
                          checked={selectedItems.map(String).includes(String(item.id))}
                          readOnly
                          onClick={(e) => {
                            console.log(`�️ Checkbox ${item.id} CLICKED`);
                            console.log('Checkbox checked state before click:', selectedItems.includes(item.id));
                            console.log('Current selectedItems before click:', JSON.stringify(selectedItems));
                            e.stopPropagation();
                            toggleItemSelection(item.id);
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                      </div>
                    )}

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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item, activeTab === 'revenues' ? 'revenue' : 'expense');
                        }}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, activeTab === 'revenues' ? 'revenue' : 'expense');
                        }}
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

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmAction}
          {...getConfirmModalProps()}
        />
      </div>
    </div>
  );
}
