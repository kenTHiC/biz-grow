import React, { useState, useEffect } from 'react';
import { Customer } from '@/entities/all';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/toast';
import ConfirmationModal from '@/components/ui/confirmation-modal';

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'potential',
    total_value: 0,
    acquisition_date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    customerId: null,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await Customer.list();
      // Filter out any null/undefined customers and ensure they have IDs
      const validCustomers = (data || []).filter(
        customer =>
          customer &&
          customer.id !== null &&
          customer.id !== undefined &&
          customer.email
      );
      console.log('Loaded customers:', validCustomers);
      setCustomers(validCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]); // Set empty array on error
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }

    if (formData.total_value < 0) {
      errors.total_value = 'Total value cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    console.log('Form submission started');
    console.log('Editing customer:', editingCustomer);
    console.log('Form data:', formData);

    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    // Validate for duplicates (only when creating new customer or changing email)
    if (
      !editingCustomer ||
      (editingCustomer &&
        editingCustomer.email.toLowerCase() !== formData.email.toLowerCase())
    ) {
      console.log('Checking for duplicates...');
      console.log('Current email:', editingCustomer?.email);
      console.log('New email:', formData.email);

      const isDuplicate = customers.some(
        customer =>
          customer.email.toLowerCase() === formData.email.toLowerCase() &&
          customer.id !== (editingCustomer?.id || null)
      );

      console.log('Is duplicate:', isDuplicate);

      if (isDuplicate) {
        console.log('Duplicate email detected');
        setFormErrors({ email: 'A customer with this email already exists!' });
        return;
      }
    } else {
      console.log(
        'Skipping duplicate check - same email for existing customer'
      );
    }

    try {
      // Ensure numeric values are properly converted
      const customerData = {
        ...formData,
        total_value: parseFloat(formData.total_value) || 0,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
      };

      if (editingCustomer) {
        console.log('Updating customer:', editingCustomer.id, customerData);
        const result = await Customer.update(editingCustomer.id, customerData);
        console.log('Update result:', result);
      } else {
        console.log('Creating customer:', customerData);
        const result = await Customer.create(customerData);
        console.log('Create result:', result);
      }

      await loadCustomers();
      resetForm();

      // Show success message
      const action = editingCustomer ? 'updated' : 'created';
      console.log(`Customer ${action} successfully!`);
    } catch (error) {
      console.error('Error saving customer:', error);
      if (error.message.includes('already exists')) {
        setFormErrors({ email: error.message });
      } else {
        toast.error(`Error saving customer: ${error.message}`);
      }
    }
  };

  const handleEdit = customer => {
    console.log('Editing customer:', customer);
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company,
      status: customer.status,
      total_value: customer.total_value || 0,
      acquisition_date:
        customer.acquisition_date || format(new Date(), 'yyyy-MM-dd'),
    });
    setFormErrors({}); // Clear any existing errors
    setShowForm(true);
  };

  const handleDelete = id => {
    setConfirmModal({ isOpen: true, customerId: id });
  };

  const confirmDelete = async () => {
    try {
      await Customer.delete(confirmModal.customerId);
      await loadCustomers();
      toast.success('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(`Error deleting customer: ${error.message}`);
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, customerId: null });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'potential',
      total_value: 0,
      acquisition_date: format(new Date(), 'yyyy-MM-dd'),
    });
    setFormErrors({});
    setEditingCustomer(null);
    setShowForm(false);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-slate-100 text-slate-800';
      case 'potential':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
                ))}
            </div>
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
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Customer Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your customer relationships and data
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </motion.div>

        {/* Customer Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.name && (
                    <p key="name-error" className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                    placeholder="customer@example.com"
                  />
                  {formErrors.email ? (
                    <p key="email-error" className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  ) : (
                    <p key="email-help" className="text-xs text-gray-500 mt-1">
                      Email must be unique for each customer
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.company
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.company && (
                    <p
                      key="company-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="potential">Potential</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Value ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_value}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        total_value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.total_value
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.total_value && (
                    <p
                      key="total-value-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.total_value}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Acquisition Date
                  </label>
                  <input
                    type="date"
                    value={formData.acquisition_date}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        acquisition_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {editingCustomer ? 'Update' : 'Create'} Customer
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

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers
            .filter(customer => customer && customer.id)
            .map((customer, index) => (
              <motion.div
                key={`customer-${customer.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-900">
                            {customer.name}
                          </CardTitle>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}
                          >
                            {customer.status.charAt(0).toUpperCase() +
                              customer.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>

                    {customer.phone && (
                      <div
                        key={`phone-${customer.id}`}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}

                    {customer.company && (
                      <div
                        key={`company-${customer.id}`}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <Building className="w-4 h-4" />
                        <span>{customer.company}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Acquired:{' '}
                        {format(
                          new Date(customer.acquisition_date),
                          'MMM d, yyyy'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        Total Value: $
                        {customer.total_value?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {customers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No customers yet
            </h3>
            <p className="text-slate-600 mb-6">
              Get started by adding your first customer
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Your First Customer
            </button>
          </motion.div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={closeConfirmModal}
          onConfirm={confirmDelete}
          title="Delete Customer"
          message="Are you sure you want to delete this customer? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
}
