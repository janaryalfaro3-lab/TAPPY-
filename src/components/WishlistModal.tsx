import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, e: React.MouseEvent) => void;
  onNavigateToProducts: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  onNavigateToProducts,
}) => {
  const { wishlistProducts, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();

  if (!isOpen) return null;

  const handleAddAllToCart = (e: React.MouseEvent) => {
    wishlistProducts.forEach((product) => {
      onAddToCart(product, 1, e);
    });
  };

  return (
    <div
      id="wishlist-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        id="wishlist-modal-panel"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden my-8 text-slate-900 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Saved Wishlist
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Your saved NFC hardware items stored locally in this browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistCount > 0 && (
              <button
                id="clear-wishlist-btn"
                onClick={clearWishlist}
                className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Clear all wishlist items"
              >
                Clear All
              </button>
            )}
            <button
              id="close-wishlist-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close wishlist modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {wishlistCount === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tap the heart icon on any NFC stand, card, or sticker in our catalog to save items for quick comparison.
                </p>
              </div>
              <button
                id="wishlist-browse-catalog-btn"
                onClick={() => {
                  onClose();
                  onNavigateToProducts();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                <span>Browse NFC Hardware</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  id={`wishlist-item-${product.id}`}
                  className="group bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div
                    className="flex items-center gap-3.5 cursor-pointer flex-1"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  >
                    {/* Mockup Preview */}
                    <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1 shadow-2xs">
                      <div className="transform scale-45 origin-center">
                        <ProductMockup format={product.format} />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {product.size}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {product.material} · NTAG213 NFC + QR Fallback
                      </p>
                      <div className="font-bold text-slate-900 text-sm">
                        ₱{product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <button
                      id={`wishlist-add-to-cart-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, 1, e);
                      }}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-98"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      id={`wishlist-remove-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {wishlistCount > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Total Value: <strong className="text-slate-900 font-bold text-sm">₱{wishlistProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="wishlist-add-all-btn"
                onClick={handleAddAllToCart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add All ({wishlistCount}) to Cart</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
