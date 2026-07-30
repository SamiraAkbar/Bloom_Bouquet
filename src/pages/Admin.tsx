import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Product, Order, Category, User } from '../types';
import { Navigate, useNavigate } from 'react-router-dom';

export const Admin = () => {
  const { user, token, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'accounts'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Accounts Management state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null); // null means creating
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    phone: '',
    address: ''
  });
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');
  const [userSearchText, setUserSearchText] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  // Order search/filter state
  const [orderSearchText, setOrderSearchText] = useState('');

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'products') {
      fetch('/api/products').then(res => res.json()).then(setProducts).catch(console.error);
    } else if (activeTab === 'orders') {
      fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json()).then(setOrders).catch(console.error);
    } else if (activeTab === 'categories') {
      fetch('/api/categories').then(res => res.json()).then(setCategoriesList).catch(console.error);
    } else if (activeTab === 'accounts') {
      setLoadingUsers(true);
      fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          setUsersList(Array.isArray(data) ? data : []);
          setLoadingUsers(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingUsers(false);
        });
    }
  }, [activeTab, token]);

  if (isLoading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: status as any } : o));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: newCatName.trim() })
    });
    if (res.ok) {
      const data = await res.json();
      setCategoriesList([...categoriesList, data]);
      setNewCatName('');
    }
  };

  const updateCategory = async (id: string) => {
    if (!editingCatName.trim()) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: editingCatName.trim() })
    });
    if (res.ok) {
      const data = await res.json();
      setCategoriesList(categoriesList.map(c => c.id === id ? data : c));
      setEditingCatId(null);
      setEditingCatName('');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setCategoriesList(categoriesList.filter(c => c.id !== id));
    }
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      address: ''
    });
    setUserError('');
    setUserSuccess('');
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: User) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      phone: u.phone || '',
      address: u.address || ''
    });
    setUserError('');
    setUserSuccess('');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    if (!userForm.name || !userForm.email || !userForm.role) {
      setUserError('Name, email, and role are required.');
      return;
    }
    if (!editingUser && !userForm.password) {
      setUserError('Password is required when creating a new user.');
      return;
    }

    const payload: any = {
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      phone: userForm.phone,
      address: userForm.address
    };
    if (userForm.password) {
      payload.password = userForm.password;
    }

    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : `/api/admin/users`;
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setUserSuccess(data.message || 'Saved successfully');
        if (editingUser) {
          setUsersList(usersList.map(u => u.id === editingUser.id ? data.user : u));
        } else {
          setUsersList([...usersList, data.user]);
        }
        setTimeout(() => setIsUserModalOpen(false), 1200);
      } else {
        setUserError(data.message || 'Failed to save account');
      }
    } catch (err) {
      console.error(err);
      setUserError('An unexpected error occurred.');
    }
  };

  const deleteUser = async (targetId: string) => {
    setUserError('');
    setUserSuccess('');

    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUsersList(usersList.filter(u => u.id !== targetId));
      } else {
        setUserError(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      setUserError('An error occurred during deletion.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif italic text-gray-900">Admin Dashboard</h1>
        <p className="text-[10px] uppercase tracking-widest text-brand-600 mt-2">Manage store catalog and customer orders.</p>
      </div>

      <div className="flex space-x-8 mb-8 border-b border-brand-100">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'orders' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'products' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('categories')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'categories' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          Category
        </button>
        <button 
          onClick={() => setActiveTab('accounts')} 
          className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'accounts' ? 'text-brand-600 border-b border-brand-600' : 'text-gray-500 hover:text-brand-600'}`}
        >
          Accounts
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="bg-white border border-brand-100 overflow-hidden text-sm">
          <div className="p-4 border-b border-brand-100 flex justify-end">
            <button 
              onClick={() => navigate('/admin/products/edit/new')} 
              className="bg-brand-600 text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-700 transition-colors"
            >
               Add Product
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-100">
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Product</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Category</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Price</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Stock</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-[10px] uppercase tracking-widest text-gray-500">No products found</td></tr> : null}
              {products.map(p => (
                <tr key={p.id} className="border-b border-brand-100 last:border-0 hover:bg-brand-50">
                  <td className="p-4 flex items-center space-x-4 border-r border-brand-100">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover grayscale-[30%]" />
                    <span className="font-serif italic text-gray-900">{p.name}</span>
                  </td>
                  <td className="p-4 text-[10px] uppercase tracking-widest text-brand-500 border-r border-brand-100">{(p.categories && p.categories.length > 0) ? p.categories.join(', ') : p.category}</td>
                  <td className="p-4 font-light text-gray-900 border-r border-brand-100">${p.price ? Number(p.price).toFixed(2) : '0.00'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold border ${p.inStock ? 'border-brand-600 text-brand-600' : 'border-red-600 text-red-600'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => navigate(`/admin/products/edit/${p.id}`)} className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400 mr-4">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="bg-white border border-brand-100 overflow-hidden text-sm">
          {/* Search Controls for Orders */}
          <div className="p-6 border-b border-brand-100 bg-brand-50/50">
            <div className="relative max-w-lg">
              <input
                type="text"
                placeholder="Search by Order ID, customer email, phone number..."
                value={orderSearchText}
                onChange={(e) => setOrderSearchText(e.target.value)}
                className="w-full bg-white border border-brand-200 px-4 py-2.5 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
             <thead>
              <tr className="bg-brand-50 border-b border-brand-100">
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Order ID</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Date</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Customer Info (Email)</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Total</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Status</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900 font-sans">Action</th>
              </tr>
            </thead>
            <tbody>
               {orders.filter(o => {
                 const term = orderSearchText.toLowerCase().trim();
                 if (!term) return true;
                 const orderId = (o.id || '').toLowerCase();
                 const email = (o.customerEmail || '').toLowerCase();
                 const mainPhone = (o.customerPhone || '').toLowerCase();
                 const oPhone = (o.phone || '').toLowerCase();
                 return orderId.includes(term) || email.includes(term) || mainPhone.includes(term) || oPhone.includes(term);
               }).length === 0 ? (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
                     No orders found matching search criteria
                   </td>
                 </tr>
               ) : null}
               {orders
                 .filter(o => {
                   const term = orderSearchText.toLowerCase().trim();
                   if (!term) return true;
                   const orderId = (o.id || '').toLowerCase();
                   const email = (o.customerEmail || '').toLowerCase();
                   const mainPhone = (o.customerPhone || '').toLowerCase();
                   const oPhone = (o.phone || '').toLowerCase();
                   return orderId.includes(term) || email.includes(term) || mainPhone.includes(term) || oPhone.includes(term);
                 })
                 .map(o => (
                   <tr key={o.id} className="border-b border-brand-100 last:border-0 hover:bg-brand-50">
                      <td className="p-4 text-[10px] uppercase tracking-widest text-brand-500 border-r border-brand-100">#{o.id ? o.id.slice(0,8) : 'N/A'}</td>
                      <td className="p-4 font-serif italic text-gray-900 border-r border-brand-100">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown'}</td>
                      <td className="p-4 border-r border-brand-100">
                        <p className="font-semibold text-gray-900 text-xs">{o.customerEmail || 'Guest Account'}</p>
                        {o.customerName && <p className="text-[10px] text-gray-500 font-serif italic mt-0.5">{o.customerName}</p>}
                        {(o.customerPhone || o.phone) && (
                          <p className="text-[9px] text-brand-600 font-mono tracking-wider mt-0.5">{o.phone || o.customerPhone}</p>
                        )}
                      </td>
                      <td className="p-4 font-light text-gray-900 border-r border-brand-100">${o.total ? Number(o.total).toFixed(2) : '0.00'}</td>
                      <td className="p-4 border-r border-brand-100">
                        <select 
                           className={`border border-brand-100 px-2 py-1 text-[10px] uppercase tracking-widest font-bold bg-white focus:outline-none focus:border-brand-600 ${o.status === 'cancel_requested' ? 'text-orange-500 border-orange-500' : ''}`}
                           value={o.status}
                           onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        >
                           <option value="pending">Pending</option>
                           <option value="completed">Completed</option>
                           <option value="cancel_requested">Cancel Requested</option>
                           <option value="cancelled">Cancelled</option>
                        </select>
                        {o.status === 'cancel_requested' && (
                          <div className="mt-2 flex space-x-3">
                            <button onClick={() => updateOrderStatus(o.id, 'cancelled')} className="text-[9px] uppercase font-bold text-red-500 hover:underline">Approve Cancel</button>
                            <button onClick={() => updateOrderStatus(o.id, 'pending')} className="text-[9px] uppercase font-bold text-gray-400 hover:underline">Deny</button>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-2">
                          <button onClick={() => navigate(`/admin/orders/edit/${o.id}`)} className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400 text-left">Edit</button>
                          <button onClick={() => deleteOrder(o.id)} className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-400 text-left">Delete</button>
                        </div>
                      </td>
                   </tr>
                 ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white border border-brand-100 overflow-hidden text-sm p-8">
          <div className="flex mb-6 space-x-4">
             <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="New Category Name" className="border border-brand-100 px-3 py-2 text-sm flex-1 focus:outline-none focus:border-brand-600" />
             <button onClick={addCategory} className="bg-brand-600 text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-700 transition-colors">Add</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-brand-50 border-b border-brand-100">
                 <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Name</th>
                 <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Slug</th>
                 <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900 w-32">Action</th>
               </tr>
            </thead>
            <tbody>
              {categoriesList.length === 0 ? <tr><td colSpan={3} className="p-4 text-center text-[10px] uppercase tracking-widest text-gray-500">No categories found</td></tr> : null}
              {categoriesList.map(c => (
                <tr key={c.id} className="border-b border-brand-100 last:border-0 hover:bg-brand-50">
                  <td className="p-4 font-serif italic text-gray-900 border-r border-brand-100">
                    {editingCatId === c.id ? (
                      <input type="text" value={editingCatName} autoFocus onChange={e => setEditingCatName(e.target.value)} className="border border-brand-300 px-2 py-1 text-sm focus:outline-none" />
                    ) : c.name}
                  </td>
                  <td className="p-4 text-[10px] uppercase tracking-widest text-brand-500 border-r border-brand-100">{c.slug}</td>
                  <td className="p-4 flex space-x-4">
                    {editingCatId === c.id ? (
                      <>
                        <button onClick={() => updateCategory(c.id)} className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400">Save</button>
                        <button onClick={() => setEditingCatId(null)} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-400">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingCatId(c.id); setEditingCatName(c.name); }} className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400">Edit</button>
                        <button onClick={() => deleteCategory(c.id)} className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-400">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="bg-white border border-brand-100 overflow-hidden text-sm">
          {/* Controls Bar */}
          <div className="p-6 border-b border-brand-100 bg-brand-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={userSearchText}
                  onChange={(e) => setUserSearchText(e.target.value)}
                  className="w-full bg-white border border-brand-200 px-4 py-2.5 text-xs font-light text-gray-900 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="w-full bg-white border border-brand-200 px-4 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Customers Only</option>
                  <option value="admin">Administrators Only</option>
                </select>
              </div>
            </div>
            <div>
              <button
                onClick={openAddUserModal}
                className="w-full md:w-auto bg-brand-900 text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-800 transition-colors"
              >
                Add New Account
              </button>
            </div>
          </div>

          {/* User List Table */}
          <div className="overflow-x-auto">
            {loadingUsers ? (
              <div className="p-12 text-center">
                <p className="text-[10px] uppercase tracking-widest text-brand-600 animate-pulse">Loading accounts...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50 border-b border-brand-100">
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">User / Contact</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Role</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Phone</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900">Address</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-900 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.filter(u => {
                    const searchStr = userSearchText.toLowerCase();
                    const matchesSearch = u.name.toLowerCase().includes(searchStr) ||
                      u.email.toLowerCase().includes(searchStr) ||
                      (u.phone && u.phone.toLowerCase().includes(searchStr)) ||
                      (u.address && u.address.toLowerCase().includes(searchStr));
                    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                    return matchesSearch && matchesRole;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
                        No matching accounts found.
                      </td>
                    </tr>
                  ) : null}

                  {usersList
                    .filter(u => {
                      const searchStr = userSearchText.toLowerCase();
                      const matchesSearch = u.name.toLowerCase().includes(searchStr) ||
                        u.email.toLowerCase().includes(searchStr) ||
                        (u.phone && u.phone.toLowerCase().includes(searchStr)) ||
                        (u.address && u.address.toLowerCase().includes(searchStr));
                      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                      return matchesSearch && matchesRole;
                    })
                    .map(u => (
                      <tr key={u.id} className="border-b border-brand-100 last:border-0 hover:bg-brand-50/50">
                        <td className="p-4 border-r border-brand-100">
                          <div>
                            <p className="font-serif italic text-gray-900 text-sm">{u.name}</p>
                            <p className="text-[10px] tracking-wider text-brand-500 mt-0.5">{u.email}</p>
                          </div>
                        </td>
                        <td className="p-4 border-r border-brand-100">
                          <span className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold border ${
                            u.role === 'admin' ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-gray-500 text-gray-500'
                          }`}>
                            {u.role === 'admin' ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                        <td className="p-4 border-r border-brand-100 font-light text-gray-700 text-xs">
                          {u.phone || <span className="text-gray-300 italic">No phone</span>}
                        </td>
                        <td className="p-4 border-r border-brand-100 font-light text-gray-700 text-xs max-w-xs truncate">
                          {u.address || <span className="text-gray-300 italic">No address specified</span>}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-4">
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400"
                            >
                              Edit
                            </button>
                            {u.id !== user?.id ? (
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-400"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300 cursor-not-allowed">
                                (You)
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Account Creation / Editing Modal Pop-up */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-brand-100 w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <h3 className="text-xl font-serif italic text-gray-950 mb-6 border-b border-brand-100 pb-3">
              {editingUser ? `Edit Account: ${editingUser.name}` : 'Create New Account'}
            </h3>

            {userError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                {userError}
              </div>
            )}

            {userSuccess && (
              <div className="mb-4 p-3 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold">
                {userSuccess}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-brand-50/50 border border-brand-100 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-brand-50/50 border border-brand-100 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  placeholder="jane.smith@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full bg-brand-50/50 border border-brand-100 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                    placeholder="+8801700000000"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Role Type</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full bg-brand-50/50 border border-brand-100 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold"
                  >
                    <option value="user">Customer (User)</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Default Shipping Address</label>
                <input
                  type="text"
                  value={userForm.address}
                  onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                  className="w-full bg-brand-50/50 border border-brand-100 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  placeholder="House 12, Road 4, Gulshan, Dhaka"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                  {editingUser ? 'New Password (Optional)' : 'Account Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-brand-50/50 border border-brand-100 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  placeholder={editingUser ? 'Leave blank to keep unchanged' : '••••••••'}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="border border-brand-200 px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-900 border border-brand-900 text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-800 transition-colors"
                >
                  {editingUser ? 'Save Updates' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
