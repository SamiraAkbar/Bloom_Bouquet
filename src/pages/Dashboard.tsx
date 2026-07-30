import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Order, Product } from '../types';
import { Package, Heart, User, Settings } from 'lucide-react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';

export const Dashboard = () => {
  const { user, token, updateUser, isLoading } = useContext(AuthContext);
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'wishlist') {
      setActiveTab('wishlist');
    } else if (tabParam === 'orders') {
      setActiveTab('orders');
    } else if (tabParam === 'profile') {
      setActiveTab('profile');
    }
  }, [searchParams]);

  // Fetch full details of the profile
  useEffect(() => {
    if (!token || activeTab !== 'profile') return;

    fetch('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    })
    .then(data => {
      setProfileName(data.name || '');
      setProfileEmail(data.email || '');
      setProfilePhone(data.phone || '');
      setProfileAddress(data.address || '');
    })
    .catch(err => {
      console.error(err);
      setProfileError('Failed to fetch full profile details.');
    });
  }, [token, activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          address: profileAddress,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        setProfileSuccess(data.message || 'Profile updated successfully.');
        updateUser(data.user);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setProfileError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('An unexpected error occurred while saving.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const requestCancel = async (orderId: string) => {
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel-request`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancel_requested' as any } : o));
        setMessage('Cancellation request sent successfully.');
      } else {
        setMessage('Failed to send cancellation request.');
      }
    } catch (err) {
      setMessage('An error occurred.');
      console.error(err);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    if (!token) return;
    
    // Fetch orders
    fetch('/api/orders/my-orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => {
      setOrders([]);
      setLoading(false);
    });

    // Fetch wishlist
    fetch('/api/wishlist', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setWishlistProducts(Array.isArray(data) ? data : []);
      setLoadingWishlist(false);
    })
    .catch(() => {
      setWishlistProducts([]);
      setLoadingWishlist(false);
    });
  }, [token, wishlistIds.length]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif italic text-gray-900">Welcome, {user.name}</h1>
        <p className="text-[10px] uppercase tracking-widest text-brand-600 mt-2">Manage your orders and account settings.</p>
        
        {message && (
          <div className="mt-4 p-3 bg-brand-50 border border-brand-200 text-brand-600 text-sm font-medium animate-pulse">
            {message}
          </div>
        )}
      </div>

      <div className="flex space-x-8 mb-6 border-b border-brand-100">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'orders' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          My Orders
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'wishlist' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          Wishlist
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'profile' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          Account Settings
        </button>
      </div>

      <div className="bg-brand-50 border border-brand-100 p-8 text-sm">
        {activeTab === 'orders' && (
          <>
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-6 border-b border-brand-100 pb-2 flex items-center space-x-2">
              <Package className="w-4 h-4 text-brand-600" />
              <span>My Orders</span>
            </h2>

            {loading ? (
               <p>Loading orders...</p>
            ) : orders.length === 0 ? (
               <div className="text-center py-12 bg-white border border-brand-100">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">You haven't placed any orders yet.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-brand-100 bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-300 transition-colors">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-500 mb-1">Order #{order.id ? order.id.slice(0,8) : 'N/A'}</p>
                      <p className="font-serif italic text-gray-900">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-brand-500 mb-1">Total</p>
                       <p className="font-light text-gray-900">${order.total ? Number(order.total).toFixed(2) : '0.00'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase tracking-widest text-brand-500 mb-1">Status</p>
                       <div className="flex items-center space-x-3">
                         <span className={`inline-block px-2 py-1 text-[8px] uppercase tracking-widest font-bold border ${
                            order.status === 'completed' ? 'border-brand-600 text-brand-600' :
                            order.status === 'cancelled' ? 'border-red-600 text-red-600' :
                            order.status === 'cancel_requested' ? 'border-orange-500 text-orange-500' :
                            'border-gray-500 text-gray-500'
                         }`}>
                            {order.status ? order.status.replace('_', ' ') : 'Unknown'}
                         </span>
                         {order.status === 'pending' && (
                            <button 
                              onClick={() => requestCancel(order.id)}
                              className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500"
                            >
                              Request Cancel
                            </button>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'wishlist' && (
          <>
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-6 border-b border-brand-100 pb-2 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-brand-600" />
              <span>My Wishlist</span>
            </h2>
            
            {loadingWishlist ? (
               <p>Loading wishlist...</p>
            ) : wishlistProducts.length === 0 ? (
               <div className="text-center py-12 bg-white border border-brand-100">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Your wishlist is empty.</p>
                  <Link to="/shop" className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400">
                    Browse Shop
                  </Link>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {wishlistProducts.map(product => (
                    <div key={product.id} className="bg-white border border-brand-100 p-4 flex gap-4">
                      <Link to={`/product/${product.id}`} className="block shrink-0">
                        <img src={product.imageUrl} alt={product.name} className="w-20 h-24 object-cover" />
                      </Link>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <Link to={`/product/${product.id}`} className="font-serif italic text-gray-900 hover:text-brand-500 transition-colors">{product.name}</Link>
                          <p className="text-[10px] uppercase tracking-widest text-brand-500 mt-1">${product.price ? Number(product.price).toFixed(2) : '0.00'}</p>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-6 border-b border-brand-100 pb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>Account Information</span>
            </h2>

            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="max-w-2xl bg-white border border-brand-100 p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Default Shipping Address</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="House 22, Road 11, Banani, Dhaka"
                  />
                </div>
              </div>

              <hr className="border-brand-100" />

              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Settings className="w-3.5 h-3.5 text-brand-500" />
                  <span>Change Password (Optional)</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-brand-50/30 border border-brand-200 px-4 py-3 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand-900 hover:bg-brand-800 text-white text-[10px] uppercase tracking-widest font-bold px-8 py-3.5 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
};
