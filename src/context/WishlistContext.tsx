import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { useToast } from '../components/ToastProvider';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tapreviewnfc_wishlist_ids';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  // Keep local storage in sync whenever wishlistIds changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  const isWishlisted = useCallback(
    (productId: string) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const addToWishlist = useCallback(
    (product: Product) => {
      setWishlistIds((prev) => {
        if (prev.includes(product.id)) return prev;
        return [...prev, product.id];
      });
      showToast({
        type: 'success',
        title: 'Saved to Wishlist',
        message: `${product.name} was added to your saved items.`,
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: product ? `${product.name} removed from wishlist.` : 'Item removed.',
      });
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      let isNowWishlisted = false;
      setWishlistIds((prev) => {
        if (prev.includes(product.id)) {
          isNowWishlisted = false;
          return prev.filter((id) => id !== product.id);
        } else {
          isNowWishlisted = true;
          return [...prev, product.id];
        }
      });

      if (!wishlistIds.includes(product.id)) {
        showToast({
          type: 'success',
          title: 'Saved to Wishlist ❤️',
          message: `${product.name} is now saved in your wishlist.`,
        });
      } else {
        showToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${product.name} was removed from your wishlist.`,
        });
      }

      return isNowWishlisted;
    },
    [wishlistIds, showToast]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    showToast({
      type: 'info',
      title: 'Wishlist Cleared',
      message: 'All items removed from your wishlist.',
    });
  }, [showToast]);

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const wishlistCount = wishlistIds.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount,
        isWishlisted,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
