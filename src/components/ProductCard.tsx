import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col group cursor-pointer transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-brand-100 mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brand-500 text-brand-500' : 'text-gray-400'}`} />
        </button>
        {!product.inStock && (
          <div className="absolute top-4 right-4 text-[10px] bg-white text-gray-900 px-2 py-1 uppercase tracking-tighter shadow-sm">
            Sold Out
          </div>
        )}
      </Link>
      <div className="flex justify-between items-start">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-serif italic text-gray-900 group-hover:text-brand-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            {(product.categories && product.categories.length > 0) ? product.categories.join(', ') : product.category}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-900">${product.price ? Number(product.price).toFixed(2) : '0.00'}</span>
          <button 
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="mt-2 text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            + Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};
