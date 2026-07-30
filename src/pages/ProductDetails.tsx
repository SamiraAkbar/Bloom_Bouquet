import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Product } from '../types';
import { motion } from 'motion/react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
         if (!res.ok) throw new Error('Not found');
         return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        // Mock fallback
        setProduct({ 
          id: id || '1', 
          name: 'Spring Blossom Bouquet', 
          price: 65, 
          category: 'Bouquets', 
          imageUrl: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?auto=format&fit=crop&q=80&w=800', 
          description: 'A beautiful collection of fresh spring flowers designed to bring joy and color to any space. Includes seasonal blooms arranged by our expert florists.', 
          inStock: true 
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-xl text-gray-500">Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const wishlisted = isWishlisted(product.id);
  const toggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-gray-500 hover:text-brand-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-100 relative aspect-[3/4] object-cover border border-brand-100"
        >
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="text-[10px] tracking-widest text-brand-500 uppercase mb-3">
            {(product.categories && product.categories.length > 0) ? product.categories.join(', ') : product.category}
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif italic text-gray-900 mb-4 tracking-tight">
            {product.name}
          </h1>
          <div className="text-2xl font-light text-gray-900 mb-6">
            ${product.price ? Number(product.price).toFixed(2) : '0.00'}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-900 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 h-12 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest font-bold transition-all border border-brand-600 ${
                isAdded 
                  ? 'bg-brand-500 text-white border-brand-500' 
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
            </button>

            <button 
              onClick={toggleWishlist}
              className={`h-12 w-12 flex items-center justify-center border transition-colors ${
                 wishlisted ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-500 hover:bg-brand-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-brand-500 text-brand-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {!product.inStock && (
            <p className="text-red-500 font-medium mb-6">Currently out of stock.</p>
          )}

          <div className="border-t border-gray-100 pt-8 mt-4 space-y-4">
            <div className="flex items-start space-x-4">
              <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-1">Same Day Delivery</h4>
                <p className="text-xs text-gray-500">Order within the next 4 hours.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-1">Premium Quality</h4>
                <p className="text-xs text-gray-500">Freshness guaranteed for 7 days.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
