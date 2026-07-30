import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetch('/api/wishlist/ids', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWishlistIds(data);
        }
      })
      .catch(console.error);
    } else {
      setWishlistIds([]);
    }
  }, [token]);

  const addToWishlist = React.useCallback(async (productId: string) => {
    if (!token) return; // or redirect to login
    try {
      setWishlistIds(prev => [...prev, productId]);
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (!res.ok) {
        setWishlistIds(prev => prev.filter(id => id !== productId));
      }
    } catch (err) {
      console.error(err);
      setWishlistIds(prev => prev.filter(id => id !== productId));
    }
  }, [token]);

  const removeFromWishlist = React.useCallback(async (productId: string) => {
    if (!token) return;
    try {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
         setWishlistIds(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error(err);
      setWishlistIds(prev => [...prev, productId]);
    }
  }, [token]);

  const isWishlisted = React.useCallback((productId: string) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const contextValue = React.useMemo(() => ({
    wishlistIds,
    addToWishlist,
    removeFromWishlist,
    isWishlisted
  }), [wishlistIds, addToWishlist, removeFromWishlist, isWishlisted]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
