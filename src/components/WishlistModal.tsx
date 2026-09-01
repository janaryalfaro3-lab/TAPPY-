import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ExternalLink,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        id="wishlist-modal-panel"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-8 ring-1 ring-white/10 text-white flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md shadow-rose-500/10">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Saved Wishlist
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your saved NFC hardware items stored locally in this browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistCount > 0 && (
              <button
                id="clear-wishlist-btn"
                onClick={clearWishlist}
                className="text-xs font-mono text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer"
                title="Clear all wishlist items"
              >
                Clear All
              </button>
            )}
            <button
              id="close-wishlist-modal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors cursor-pointer"
              aria-label="Close wishlist modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-4">
          {wishlistCount === 0 ? (
            <div className="py-12 sm:py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-500 mx-auto shadow-inner">
                <Heart className="w-8 h-8 text-slate-500" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-display text-lg font-bold text-white">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tap the heart icon on any NFC stand, card, or sticker in our catalog to save items for quick comparison and future checkout.
                </p>
              </div>
              <button
                id="wishlist-browse-catalog-btn"
                onClick={() => {
                  onClose();
                  onNavigateToProducts();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
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
                  className="group bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  >
                    {/* Mockup Preview */}
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-sky-500/60 transition-colors p-1">
                      <div className="transform scale-55 origin-center">
                        <ProductMockup format={product.format} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-white text-sm sm:text-base group-hover:text-sky-300 transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {product.size}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                        {product.material} · NTAG213 NFC + QR Fallback
                      </p>
                      <div className="font-display font-extrabold text-white text-sm sm:text-base">
                        ₱{product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      id={`wishlist-add-to-cart-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, 1, e);
                      }}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
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
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
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
          <div className="p-6 sm:p-7 border-t border-slate-800 bg-slate-950/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 font-mono">
              Total Value: <strong className="text-white font-bold text-sm">₱{wishlistProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="wishlist-add-all-btn"
                onClick={handleAddAllToCart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-sky-500/20 active:scale-95"
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
