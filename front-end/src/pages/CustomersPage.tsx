import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CustomerList } from '../components/CustomerList';
import { CustomerForm } from '../components/CustomerForm';
import { MatterList } from '../components/MatterList';
import { MatterForm } from '../components/MatterForm';
import type { Customer, Matter } from '../types';

export function CustomersPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showMatterForm, setShowMatterForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [refreshMatters, setRefreshMatters] = useState(0);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCustomerCreated = (customer: Customer) => {
    setShowCustomerForm(false);
    window.location.reload();
  };

  const handleMatterCreated = (matter: Matter) => {
    setShowMatterForm(false);
    setRefreshMatters(prev => prev + 1);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-100">Law Firm CRM</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">{user.firmName}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Customers</h2>
            <button
              onClick={() => {
                setShowCustomerForm(true);
                setSelectedCustomer(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Customer
            </button>
          </div>

          {showCustomerForm ? (
            <div className="bg-gray-800 shadow sm:rounded-lg p-6">
              <CustomerForm
                onCustomerCreated={handleCustomerCreated}
                onCancel={() => setShowCustomerForm(false)}
              />
            </div>
          ) : (
            <CustomerList onSelectCustomer={handleSelectCustomer} />
          )}

          {selectedCustomer && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-100">
                  Matters for {selectedCustomer.name}
                </h3>
                <button
                  onClick={() => setShowMatterForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Matter
                </button>
              </div>
              <div className="bg-gray-800 shadow sm:rounded-lg p-6">
                <MatterList 
                  customerId={selectedCustomer.id.toString()} 
                  key={refreshMatters}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Matter Form Modal */}
      {showMatterForm && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-100">
                Create New Matter for {selectedCustomer.name}
              </h3>
              <button
                onClick={() => setShowMatterForm(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MatterForm
              customerId={selectedCustomer.id.toString()}
              onMatterCreated={handleMatterCreated}
              onCancel={() => setShowMatterForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 