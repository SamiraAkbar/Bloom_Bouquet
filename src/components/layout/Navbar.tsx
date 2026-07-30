import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-50 border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif italic tracking-tight font-light text-brand-600 focus:outline-none select-none">
              Bloom <span className="text-brand-400 font-normal">&</span> Bouquet
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-semibold">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-gray-600 hover:text-brand-400 transition-colors focus:outline-none select-none">
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-brand-400 transition-colors focus:outline-none select-none">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-widest font-semibold">
            <Link to="/dashboard?tab=wishlist" className="relative text-gray-600 hover:text-brand-400 transition-colors flex items-center focus:outline-none select-none">
              <Heart className="w-4 h-4 mr-1.5" />
              <span className="mr-2">Wishlist</span>
              {wishlistIds.length > 0 && (
                <span className="bg-brand-300 text-brand-950 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-600 hover:text-brand-400 transition-colors flex items-center focus:outline-none select-none">
              <span className="mr-2">Cart</span>
              {itemCount > 0 && (
                <span className="bg-brand-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-brand-400 flex items-center space-x-1 focus:outline-none select-none">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-brand-400 transition-colors focus:outline-none select-none cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-brand-400 transition-colors focus:outline-none select-none">
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/dashboard?tab=wishlist" className="relative text-gray-600 mr-4">
              <Heart className="w-6 h-6" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-400 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-600 mr-4">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-brand-600">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-brand-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-600 font-medium text-lg hover:text-brand-600"
                >
                  {link.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium text-lg hover:text-brand-600">
                  Admin
                </Link>
              )}
              <hr className="border-brand-50" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium text-lg hover:text-brand-600">
                    Dashboard ({user.name})
                  </Link>
                  <Link to="/dashboard?tab=wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium text-lg hover:text-brand-600 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-brand-400" />
                    <span>My Wishlist ({wishlistIds.length})</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left text-brand-600 font-medium text-lg">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/dashboard?tab=wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 font-medium text-lg hover:text-brand-600 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-brand-400" />
                    <span>My Wishlist</span>
                  </Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-brand-600 font-medium text-lg">
                    Log In / Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
