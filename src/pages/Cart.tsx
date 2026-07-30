import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-gray-300 mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-serif italic text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added any flowers to your cart yet. Let's find something beautiful.
        </p>
        <Link to="/shop" className="border border-brand-600 text-brand-600 px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-brand-600 hover:text-white transition-colors">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-serif italic text-gray-900 mb-10">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="bg-white border text-sm border-brand-100 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-brand-100 last:border-0 last:pb-0"
                  >
                    <div className="w-full sm:w-24 h-32 overflow-hidden bg-brand-50 shrink-0 border border-brand-100">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale-[30%]" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-brand-500 mb-1">{(item.categories && item.categories.length > 0) ? item.categories.join(', ') : item.category}</p>
                          <h3 className="text-sm font-serif italic text-gray-900">{item.name}</h3>
                        </div>
                        <p className="font-light text-gray-900 shrink-0">${(Number(item.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-900 lg:w-32 h-8">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex-1 flex justify-center text-gray-600 hover:text-brand-600"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex-1 flex justify-center text-gray-600 hover:text-brand-600"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-brand-50 border border-brand-100 p-6 md:p-8 sticky top-24">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 text-sm text-gray-600 font-light">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-brand-600 uppercase text-[10px] tracking-widest flex items-center">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="text-gray-900">${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-brand-200 pt-6 mb-8">
              <div className="flex justify-between items-center text-lg text-gray-900">
                <span className="text-[10px] uppercase font-bold tracking-widest">Total</span>
                <span className="font-serif italic">${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-600 text-white text-[10px] uppercase tracking-widest font-bold py-4 hover:bg-brand-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="mt-6 text-[10px] uppercase tracking-widest text-center text-gray-400 flex flex-col gap-2">
              <p>Secure checkout powered by Stripe.</p>
              <p>Delivery information collected securely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
