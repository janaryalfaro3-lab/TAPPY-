import React, { useState } from 'react';
import { X, Check, Plus, Minus, Zap } from 'lucide-react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';

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

  if (!isOpen || !product) return null;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#050505]/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0E0E0E] border border-white/15 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#949494] hover:text-[#E0E0E0] bg-[#141414] hover:bg-[#1C1C1C] border border-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: True Color Product Mockup & Preview */}
          <div className="bg-[#050505] border-b md:border-b-0 md:border-r border-white/10 p-8 sm:p-12 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-center py-6">
              <ProductMockup
                format={product.format}
                customBusinessName={businessName.trim() || undefined}
              />
            </div>

            {/* Live Color / Format Stamp */}
            <div className="mt-4 px-3 py-1 bg-[#101010] border border-white/10 text-[10px] font-mono text-[#2DD4BF] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              Dual-Tone Obsidian Black & Pure White · Official Google Colors
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Flow */}
          <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6 text-[#E0E0E0]">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#2DD4BF] font-semibold">
                  {product.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#E0E0E0] tracking-tight mt-1">
                  {product.name}
                </h2>
                <div className="font-display text-2xl font-bold text-[#E0E0E0] mt-2">
                  ₱{product.price.toLocaleString()}
                </div>
              </div>

              <p className="text-sm text-[#949494] leading-relaxed tracking-wide">
                {product.description}
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">
                    Dimensions
                  </span>
                  <span className="text-[#E0E0E0] font-medium">{product.size}</span>
                </div>
                <div>
                  <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">
                    Material
                  </span>
                  <span className="text-[#E0E0E0] font-medium">{product.material}</span>
                </div>
                <div>
                  <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">
                    NFC Microchip
                  </span>
                  <span className="text-[#2DD4BF] font-medium">NTAG213 NFC</span>
                </div>
                <div>
                  <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">
                    QR Fallback
                  </span>
                  <span className="text-[#E0E0E0] font-medium">High-Contrast Printed</span>
                </div>
              </div>

              {/* Free Pre-Programming Configuration (Optional) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#E0E0E0] text-[11px] uppercase tracking-wider">
                    Google Review Link Setup
                  </span>
                  <span className="text-[10px] text-[#2DD4BF] font-mono uppercase">
                    Free Pre-Programming
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Business Name (updates visual preview above)"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#2DD4BF] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Google Review link or Place ID (optional)"
                  value={googleLink}
                  onChange={(e) => setGoogleLink(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#2DD4BF] transition-colors"
                />
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#949494] font-medium">
                  Quantity
                </span>
                <div className="flex items-center border border-white/10 bg-[#080808]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-[#949494] hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-[#E0E0E0]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-[#949494] hover:text-white transition-colors cursor-pointer"
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
                  className={`py-3.5 px-4 text-[11px] uppercase tracking-[0.14em] font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    justAdded
                      ? 'bg-[#10B981] border-[#10B981] text-white'
                      : 'bg-[#181818] hover:bg-[#222222] border-white/10 text-[#E0E0E0]'
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
                  className="py-3.5 px-4 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#050505] bg-[#E0E0E0] hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-[#050505] text-[#050505]" />
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
