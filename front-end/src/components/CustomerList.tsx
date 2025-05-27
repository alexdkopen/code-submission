import { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import type { Customer } from '../types';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerList({ onSelectCustomer }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerService.getCustomers();
      setCustomers(response.data.customers);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <ul className="list-none">
        {customers.map((customer) => (
          <li key={customer.id} className="mb-4 last:mb-0">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectCustomer(customer)}
                  className="text-sm font-medium text-indigo-400 truncate hover:text-indigo-300"
                >
                  {customer.name}
                </button>
                <div className="flex items-center space-x-4">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                    {customer.phone || 'No phone'}
                  </p>
                  <button
                    onClick={() => handleDelete(customer)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-400">
                    Created: {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-100 mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete {customerToDelete.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 