import React, { useState } from 'react';
import { Heart, Check, Sparkles, Layers } from 'lucide-react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';
import { ProgressiveImage } from './ProgressiveImage';
import { TiltCard3D, TiltParallax } from './TiltCard3D';
import { NfcProductImage } from './NfcProductImage';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  const [viewMode, setViewMode] = useState<'photo' | 'mockup'>('photo');
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleViewMode = (e: React.MouseEvent, mode: 'photo' | 'mockup') => {
    e.stopPropagation();
    setViewMode(mode);
  };

  return (
    <TiltCard3D
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      maxTilt={8}
      scale={1.018}
      className="group product-card-glass card-3d-interactive relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 h-full"
    >
      {/* Specular Glare Reflection on Hover */}
      <div className="specular-layer" />

      {/* Top Header: Badge, Dimensions & Wishlist */}
      <div style={{ transform: 'translateZ(15px)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100/90 backdrop-blur-xs text-slate-700 border border-slate-200 font-medium shadow-2xs">
            {product.badge || product.format}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {product.size}
            </span>

            <button
              id={`wishlist-toggle-${product.id}`}
              type="button"
              onClick={handleToggleWishlist}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                wishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                  : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={wishlisted ? 'Remove from saved' : 'Save item'}
              aria-label={wishlisted ? 'Remove from saved' : 'Save item'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Product Visual Container: 3D Layered Stage with 100% Unclipped Full Visibility */}
        <div
          className="relative mb-5"
          style={{ transform: 'translateZ(25px)' }}
        >
          {viewMode === 'photo' ? (
            <NfcProductImage
              src={product.image}
              alt={product.name}
              format={product.format}
              aspectRatio="aspect-[4/3]"
              priority={true}
              className="group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="relative aspect-[4/3] bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-950 rounded-xl border border-stone-800 overflow-hidden shadow-inner flex items-center justify-center p-3">
              <div className="transform group-hover:scale-105 transition-transform duration-300 ease-out filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.7)]">
                <ProductMockup format={product.format} />
              </div>
            </div>
          )}

          {/* Quick View Switcher Pill */}
          <div
            className="absolute bottom-2.5 right-2.5 z-20 flex items-center bg-slate-900/90 backdrop-blur-xs p-0.5 rounded-lg border border-slate-700 shadow-sm text-[10px] font-semibold text-slate-300"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'translateZ(35px)' }}
          >
            <button
              type="button"
              onClick={(e) => handleToggleViewMode(e, 'photo')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'photo'
                  ? 'bg-sky-500 text-white shadow-xs font-bold'
                  : 'hover:text-white'
              }`}
            >
              Photo
            </button>
            <button
              type="button"
              onClick={(e) => handleToggleViewMode(e, 'mockup')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'mockup'
                  ? 'bg-sky-500 text-white shadow-xs font-bold'
                  : 'hover:text-white'
              }`}
            >
              3D View
            </button>
          </div>

          {/* 3D Floating NFC Tag Indicator */}
          <div
            className="absolute top-2.5 left-2.5 z-20"
            style={{ transform: 'translateZ(35px)' }}
          >
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-[10px] font-semibold text-sky-400 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-sky-400" />
              NTAG213 NFC
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1.5" style={{ transform: 'translateZ(10px)' }}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div
          className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600"
          style={{ transform: 'translateZ(8px)' }}
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Instant tap Google Review link</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>High-resolution printed QR backup</span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div
        className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between"
        style={{ transform: 'translateZ(15px)' }}
      >
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Unit Price
          </span>
          <span className="text-lg font-bold text-slate-900">
            ₱{product.price.toLocaleString()}
          </span>
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, 1, e);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
        >
          <span>Add to Cart</span>
        </button>
      </div>
    </TiltCard3D>
  );
};
