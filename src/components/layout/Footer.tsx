import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brand-100 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-serif italic tracking-tight font-light text-brand-600 flex items-center space-x-2">
              <span>Bloom <span className="text-brand-300 font-normal">&</span> Bouquet</span>
            </Link>
            <p className="mt-4 text-gray-500 max-w-sm text-sm leading-relaxed">
              Premium artisanal perfumes inspired by nature. Sourcing the rarest floral absolutes and natural essences to craft your signature scent.
            </p>
            <div className="mt-6 flex flex-space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors mr-4">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors mr-4">
                <span className="sr-only">Facebook</span>
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-3 text-sm font-serif italic">
              <li><Link to="/shop?category=women" className="text-gray-500 hover:text-brand-600 transition-colors">Women's Perfumes</Link></li>
              <li><Link to="/shop?category=men" className="text-gray-500 hover:text-brand-600 transition-colors">Men's Colognes</Link></li>
              <li><Link to="/shop?category=unisex" className="text-gray-500 hover:text-brand-600 transition-colors">Unisex Scents</Link></li>
              <li><Link to="/shop" className="text-gray-500 hover:text-brand-600 transition-colors">All Frangrances</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm font-serif italic">
              <li><Link to="/about" className="text-gray-500 hover:text-brand-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-brand-600 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-brand-600 transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-500 hover:text-brand-600 transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 py-6 border-t border-brand-100 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em]">
            Chittagong, Bangladesh
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-brand-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-brand-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="bg-brand-600 text-brand-50 py-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] font-light">Complimentary delivery on orders over $150 &mdash; Bloom responsibly</p>
      </div>
    </footer>
  );
};
