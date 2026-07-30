import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { AuthContext } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  // Keep local storage updated
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Sync cart from server database on token change
  useEffect(() => {
    if (token) {
      fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(dbItems => {
        if (Array.isArray(dbItems)) {
          if (dbItems.length > 0) {
            setItems(dbItems);
          } else if (items.length > 0) {
            // Local cart has items, database has none (guest items just logged in)
            fetch('/api/cart/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ items })
            })
            .catch(err => console.error('Failed to sync guest cart to database:', err));
          }
        }
      })
      .catch(err => console.error('Failed to fetch database cart on auth load:', err));
    } else {
      // Clear when logging out
      setItems([]);
    }
  }, [token]);

  const addToCart = React.useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    if (token) {
      fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id, quantity })
      })
      .catch(err => console.error('Failed to save add-to-cart item in DB:', err));
    }
  }, [token]);

  const removeFromCart = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter(item => item.id !== productId));

    if (token) {
      fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .catch(err => console.error('Failed to delete item from database cart:', err));
    }
  }, [token]);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setItems((prev) => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));

    if (token) {
      fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      })
      .catch(err => console.error('Failed to update quantity in database cart:', err));
    }
  }, [token, removeFromCart]);

  const clearCart = React.useCallback(() => {
    setItems([]);

    if (token) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .catch(err => console.error('Failed to clear database cart:', err));
    }
  }, [token]);

  const total = React.useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  }, [items]);

  const itemCount = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const contextValue = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
