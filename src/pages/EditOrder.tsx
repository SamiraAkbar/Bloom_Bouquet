import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Order } from '../types';

export const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user, isLoading: isAuthLoading } = useContext(AuthContext);

  const [order, setOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    status: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      navigate('/');
      return;
    }

    if (id) {
      fetch(`/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Order not found');
          return res.json();
        })
        .then(data => {
          setOrder(data);
          setFormData({
            status: data.status,
            shippingAddress: data.shippingAddress || '',
            city: data.city || '',
            postalCode: data.postalCode || '',
            phone: data.phone || ''
          });
        })
        .catch(err => setError(err.message));
    }
  }, [id, user, isAuthLoading, navigate, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update order');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-serif italic text-gray-500">Loading authentication...</div>;
  }
  
  if (error && !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
        <button onClick={() => navigate('/admin')} className="px-8 py-3 border border-brand-100 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:bg-brand-50 transition-colors">Back to Admin</button>
      </div>
    );
  }

  if (!order) {
    return <div className="min-h-[70vh] flex items-center justify-center font-serif italic text-gray-500">Loading order details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif italic text-gray-900">Edit Order #{order.id ? order.id.slice(0,8) : 'N/A'}</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Update customer order details.</p>
      </div>

      <div className="bg-white border border-brand-100 p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}
        {success && <div className="mb-6 p-4 bg-brand-50 text-brand-600 border border-brand-100 text-[10px] uppercase tracking-widest font-bold">Order updated successfully. Redirecting...</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white text-sm"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancel_requested">Cancel Requested</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white text-sm"
              />
            </div>
          </div>

          <div>
             <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Shipping Address</label>
             <input
               type="text"
               name="shippingAddress"
               value={formData.shippingAddress} onChange={handleChange}
               className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white text-sm"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white text-sm"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-brand-100">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-8 py-4 border border-brand-100 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:bg-brand-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-brand-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
