import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Product, Category } from '../types';

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user, isLoading: isAuthLoading } = useContext(AuthContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    categories: [] as string[],
    imageUrl: '',
    description: '',
    inStock: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      navigate('/');
      return;
    }

    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategoriesList)
      .catch(console.error);

    if (id && id !== 'new') {
      fetch(`/api/products/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Product not found');
          return res.json();
        })
        .then(data => {
          setProduct(data);
          let cats = data.categories || [];
          if (cats.length === 0 && data.category) {
            cats = [data.category]; // Fallback for old data
          }
          setFormData({
            name: data.name,
            price: data.price.toString(),
            category: data.category || '',
            categories: cats,
            imageUrl: data.imageUrl,
            description: data.description,
            inStock: data.inStock
          });
        })
        .catch(err => setError(err.message));
    } else {
      setProduct({ id: 'new' } as any);
    }
  }, [id, user, isAuthLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => {
       const newCats = e.target.checked 
          ? [...prev.categories, value]
          : prev.categories.filter(c => c !== value);
       return { ...prev, categories: newCats };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const url = id === 'new' ? '/api/products' : `/api/products/${id}`;
      const method = id === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || (id === 'new' ? 'Failed to create product' : 'Failed to update product'));
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
  
  if (error && (!product || id === 'new')) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
        <button onClick={() => navigate('/admin')} className="px-8 py-3 border border-brand-100 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:bg-brand-50 transition-colors">Back to Admin</button>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-[70vh] flex items-center justify-center font-serif italic text-gray-500">Loading product details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif italic text-gray-900">{id === 'new' ? 'Add Product' : 'Edit Product'}</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">{id === 'new' ? 'Create a new product' : 'Update product details and inventory.'}</p>
      </div>

      <div className="bg-white border border-brand-100 p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}
        {success && <div className="mb-6 p-4 bg-brand-50 text-brand-600 border border-brand-100 text-[10px] uppercase tracking-widest font-bold">Product {id === 'new' ? 'created' : 'updated'} successfully. Redirecting...</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Name</label>
              <input
                type="text" required
                name="name"
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Price ($)</label>
              <input
                type="number" required min="0" step="0.01"
                name="price"
                value={formData.price} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Image URL</label>
              <input
                type="url" required
                name="imageUrl"
                value={formData.imageUrl} onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-3">Categories</label>
            <div className="flex flex-wrap gap-4">
              {categoriesList.map(c => (
                <label key={c.id} className="flex items-center space-x-2 cursor-pointer">
                   <input 
                     type="checkbox" 
                     value={c.name}
                     checked={formData.categories.includes(c.name)}
                     onChange={handleCategoryChange}
                     className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                   />
                   <span className="text-sm text-gray-700">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Description</label>
             <textarea
               required rows={4}
               name="description"
               value={formData.description} onChange={handleChange}
               className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-600 bg-white"
             ></textarea>
          </div>

          <div className="flex items-center space-x-3">
             <input
               type="checkbox"
               id="inStock"
               name="inStock"
               checked={formData.inStock} onChange={handleChange}
               className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
             />
             <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
          </div>

          {formData.imageUrl && (
            <div className="mt-4">
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-3">Image Preview</label>
              <div className="w-32 h-32 border border-brand-100 overflow-hidden bg-brand-50">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover grayscale-[30%]" />
              </div>
            </div>
          )}

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
              {loading ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
