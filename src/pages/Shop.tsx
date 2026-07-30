import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

export const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();

  // We'll replace this with real API call
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategoriesList)
      .catch(console.error);

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Failed to fetch', e);
        // Fallback mock data
        setProducts([
          { id: '1', name: 'Spring Blossom Bouquet', price: 65, category: 'Bouquets', imageUrl: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?auto=format&fit=crop&q=80&w=600', description: 'Fresh spring flowers.', inStock: true },
          { id: '2', name: 'Velvet Rose Elegance', price: 85, category: 'Roses', imageUrl: 'https://images.unsplash.com/photo-1563241527-3fff5553e414?auto=format&fit=crop&q=80&w=600', description: 'Deep red velvet roses.', inStock: true },
          { id: '3', name: 'Sunburst Sunshine', price: 55, category: 'Sunflowers', imageUrl: 'https://images.unsplash.com/photo-1560790671-b7ac0fb2ce7c?auto=format&fit=crop&q=80&w=600', description: 'Bright.', inStock: true },
          { id: '4', name: 'Orchid Dream', price: 95, category: 'Orchids', imageUrl: 'https://images.unsplash.com/photo-1582274528604-1cae5f22f7cc?auto=format&fit=crop&q=80&w=600', description: 'Elegant orchids.', inStock: true },
        ]);
        setLoading(false);
      });
  }, []);

  // Listen to URL search parameter changes
  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery) {
      // Find matching category name based on simple case insensitivity
      const matched = categoriesList.find(c => c.name.toLowerCase() === catQuery.toLowerCase());
      if (matched) {
        setCategory(matched.name);
      } else {
        // Fallback checks for common predefined category words
        const defaultNames: Record<string, string> = {
          women: 'Women',
          men: 'Men',
          unisex: 'Unisex',
          floral: 'Floral',
          woody: 'Woody',
          fresh: 'Fresh'
        };
        const fallbackName = defaultNames[catQuery.toLowerCase()];
        if (fallbackName) {
          setCategory(fallbackName);
        }
      }
    } else {
      setCategory('All');
    }
  }, [searchParams, categoriesList]);

  const handleCategorySelect = (selectedCat: string) => {
    setCategory(selectedCat);
    if (selectedCat === 'All') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', selectedCat.toLowerCase());
      setSearchParams(newParams);
    }
  };

  const categories = ['All', ...categoriesList.map(c => c.name)];

  const filteredProducts = products.filter(p => {
    const pCats = p.categories || [p.category].filter(Boolean) as string[];
    const pName = p.name || '';
    
    // Check if category matches 'All' or is included in product's categories
    const matchCategory = category === 'All' || pCats.some(c => c.toLowerCase() === category.toLowerCase());
    const matchSearch = pName.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="py-12 bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-gray-900 mb-2">Our Collection</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Find the perfect arrangement for any occasion.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-brand-100 focus:outline-none bg-white text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <Filter className="text-gray-400 w-5 h-5 hidden sm:block" />
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => handleCategorySelect(c)}
                  className={`px-4 py-2 whitespace-nowrap text-[10px] uppercase tracking-widest font-bold transition-colors ${
                    category === c 
                      ? 'bg-brand-600 text-white border border-brand-600' 
                      : 'bg-white text-gray-600 border border-brand-100 hover:bg-brand-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-brand-100">
            <div className="text-gray-300 mb-4 flex justify-center">
              <Search className="w-12 h-12 opacity-50" />
            </div>
            <h3 className="text-xl font-serif italic text-gray-900 mb-2">No products found</h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">We couldn't find any blooms matching your search.</p>
            <button 
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-6 text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400 border-b border-brand-600 pb-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
