import React, { useState } from 'react';
import { X, Check, Plus, Minus, Zap, Heart, Flame } from 'lucide-react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    customGoogleLink?: string,
    businessName?: string
  ) => void;
  onBuyNow: (
    product: Product,
    quantity: number,
    customGoogleLink?: string,
    businessName?: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [googleLink, setGoogleLink] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, googleLink.trim(), businessName.trim());
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 800);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, googleLink.trim(), businessName.trim());
    onClose();
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-8 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Action Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            id="modal-wishlist-toggle-btn"
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-md active:scale-90 ${
              wishlisted
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border-slate-700'
            }`}
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: True Color Product Mockup & Preview */}
          <div className="bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-8 sm:p-12 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-center py-6">
              <ProductMockup
                format={product.format}
                customBusinessName={businessName.trim() || undefined}
              />
            </div>

            {/* Live Color / Format Stamp */}
            <div className="mt-4 px-3 py-1 bg-slate-900 border border-slate-700/80 text-[10px] font-mono text-sky-300 uppercase tracking-wider rounded-full shadow-2xs flex items-center gap-2 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Dual-Tone Obsidian Black & Pure White · Official Google Colors
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Flow */}
          <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6 text-white bg-slate-900/90">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                  {product.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="font-display text-2xl font-extrabold text-white">
                    ₱{product.price.toLocaleString()}
                  </span>
                  {product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Low Stock: Only {product.stockQuantity} Left</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed tracking-wide">
                {product.description}
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-medium">
                    Dimensions
                  </span>
                  <span className="text-slate-100 font-semibold">{product.size}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-medium">
                    Material
                  </span>
                  <span className="text-slate-100 font-semibold">{product.material}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-medium">
                    NFC Microchip
                  </span>
                  <span className="text-sky-400 font-bold">NTAG213 NFC</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-medium">
                    QR Fallback
                  </span>
                  <span className="text-slate-100 font-semibold">High-Contrast Printed</span>
                </div>
              </div>

              {/* Free Pre-Programming Configuration (Optional) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                    Google Review Link Setup
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono uppercase font-bold">
                    Free Pre-Programming
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Business Name (updates visual preview above)"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Google Review link or Place ID (optional)"
                  value={googleLink}
                  onChange={(e) => setGoogleLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 text-[11px] uppercase tracking-[0.14em] font-semibold border rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Added</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 text-[11px] uppercase tracking-[0.14em] font-bold text-slate-950 bg-white hover:bg-sky-400 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
