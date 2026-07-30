/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';

// Lazy load secondary routes to split bundles and boost TTI/FCP performance
const Shop = React.lazy(() => import('./pages/Shop').then(module => ({ default: module.Shop })));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails').then(module => ({ default: module.ProductDetails })));
const Cart = React.lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Signup = React.lazy(() => import('./pages/Signup').then(module => ({ default: module.Signup })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Admin = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const EditProduct = React.lazy(() => import('./pages/EditProduct').then(module => ({ default: module.EditProduct })));
const EditOrder = React.lazy(() => import('./pages/EditOrder').then(module => ({ default: module.EditOrder })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const FAQ = React.lazy(() => import('./pages/FAQ').then(module => ({ default: module.FAQ })));
const Privacy = React.lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = React.lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Shipping = React.lazy(() => import('./pages/Shipping').then(module => ({ default: module.Shipping })));

// Beautiful styled Rose Loader spinner to align with Bloom & Bouquet's branding
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-brand-50" id="page-loader">
    <div className="relative w-12 h-12" id="spinner-container">
      <div className="absolute inset-0 rounded-full border-2 border-brand-200 animate-pulse" id="spinner-pulse"></div>
      <div className="absolute inset-x-0 top-0 h-12 w-12 rounded-full border-t-2 border-brand-500 animate-spin" id="spinner-active"></div>
    </div>
    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-brand-500 mt-4 animate-pulse" id="loader-brand-text">
      Bloom & Bouquet
    </span>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen" id="app-root">
              <Navbar />
              <main className="flex-grow" id="app-main-content">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                    <Route path="/admin/orders/edit/:id" element={<EditOrder />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shipping" element={<Shipping />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}
