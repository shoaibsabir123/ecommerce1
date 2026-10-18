import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { getOrdersByCustomer, getOrders } from '../../src/services/storage';
import { Order, ShippingAddress } from '../types';

interface AccountPageProps {
  onNavigateToShop: () => void;
  onNavigateToAdmin: () => void;
  onSelectOrder?: (order: Order) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigateToShop,
  onNavigateToAdmin,
  onSelectOrder
}) => {
  const { user, login, register, logout, switchRole, addSavedAddress } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth form states if logged out
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // Add address modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  // Get orders for current user or all demo orders if admin
  const userOrders = user 
    ? (user.role === 'admin' ? getOrders() : getOrdersByCustomer(user.email))
    : [];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (isLoginView) {
      await login(authEmail);
      showToast('Welcome back!', 'success');
    } else {
      await register(authName || authEmail.split('@')[0], authEmail);
      showToast('Account created successfully!', 'success');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newZip) {
      showToast('Please fill out all address fields', 'error');
      return;
    }

    const addr: ShippingAddress = {
      firstName: user?.name.split(' ')[0] || 'Customer',
      lastName: user?.name.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '+1 (555) 000-0000',
      street: newStreet,
      city: newCity,
      state: newState || 'NY',
      postalCode: newZip,
      country: 'United States'
    };

    addSavedAddress(addr);
    setShowAddressForm(false);
    setNewStreet('');
    setNewCity('');
    setNewZip('');
    showToast('New shipping address saved!', 'success');
  };

  // If user is not logged in:
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-left">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              {isLoginView ? 'Sign In to Your Account' : 'Create an Account'}
            </h1>
            <p className="text-xs text-stone-500">
              Access your order history, manage addresses, and track shipments.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="jane.doe@example.com"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                defaultValue="password123"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Login Helpers */}
          <div className="pt-4 border-t border-stone-100 text-center space-y-2">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Instant 1-Click Demo Logins</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchRole('customer');
                  showToast('Logged in as Customer (Jane Doe)', 'info');
                }}
                className="p-2 rounded-lg border border-stone-200 text-xs font-medium hover:bg-stone-50 text-stone-700"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  showToast('Logged in as Store Administrator', 'info');
                }}
                className="p-2 rounded-lg border border-stone-200 text-xs font-medium hover:bg-amber-50 text-amber-900 bg-amber-50/50"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-stone-500 pt-2">
            {isLoginView ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginView(false)}
                  className="font-bold text-amber-800 hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginView(true)}
                  className="font-bold text-amber-800 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      
      {/* Account Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-300 font-serif font-bold text-xl flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-slate-900">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-500">{user.email} · Member since {new Date(user.createdAt).getFullYear()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              showToast('Signed out', 'info');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          My Orders ({userOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'addresses'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Saved Addresses ({user.savedAddresses?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Profile Details
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-slate-900">No orders placed yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Once you place an order, its real-time shipping progress, tracking numbers, and receipts will appear here.
              </p>
              <button
                onClick={onNavigateToShop}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            userOrders.map(order => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-bold text-slate-900">Order #{order.id}</span>
                    <p className="text-[11px] text-stone-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : order.orderStatus === 'Processing'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {order.orderStatus === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {order.orderStatus === 'Shipped' && <Truck className="w-3.5 h-3.5" />}
                      {order.orderStatus === 'Processing' && <Clock className="w-3.5 h-3.5" />}
                      <span>{order.orderStatus}</span>
                    </span>

                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{item.productName}</p>
                          <p className="text-[11px] text-stone-500">Color: {item.colorName} · Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking info footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-500 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span>Courier Tracking: <strong className="font-mono text-slate-900">{order.trackingNumber}</strong></span>
                  </div>

                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Payment Status: {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SAVED ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-slate-900">Your Delivery Addresses</h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleSaveAddress} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 max-w-lg">
              <h4 className="font-serif font-bold text-sm text-slate-900">Add Shipping Address</h4>
              
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  placeholder="e.g. 500 Park Avenue"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    placeholder="New York"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={e => setNewState(e.target.value)}
                    placeholder="NY"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    required
                    value={newZip}
                    onChange={e => setNewZip(e.target.value)}
                    placeholder="10022"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Save Destination
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.savedAddresses?.map((addr, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">{addr.firstName} {addr.lastName}</p>
                <p className="text-stone-600">{addr.street}</p>
                <p className="text-stone-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="text-stone-400">{addr.country}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Primary Destination
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 max-w-lg space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900">Profile Information</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-stone-400 block">Name</span>
              <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Email Address</span>
              <span className="font-semibold text-slate-900 text-sm">{user.email}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Account Role</span>
              <span className="font-semibold text-slate-900 text-sm capitalize">{user.role}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Security</span>
              <span className="text-emerald-700 font-medium">Stripe PCI-DSS & Supabase Encrypted</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
