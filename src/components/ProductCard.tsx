import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';
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
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isAcrylic = product.material.toLowerCase().includes('acrylic');
  const wishlisted = isWishlisted(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-400 cursor-pointer ring-1 ring-white/10 hover:ring-sky-400/40"
    >
      {/* Product Sample Badge & Wishlist Heart */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-2xs border ${
            isAcrylic
              ? 'bg-sky-500/15 text-sky-300 border-sky-400/40'
              : 'bg-indigo-500/15 text-indigo-300 border-indigo-400/40'
          }`}
        >
          {product.badge || (isAcrylic ? 'Acrylic Specimen' : 'PVC Specimen')}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md">
            {product.size}
          </span>

          {/* Heart / Wishlist Toggle */}
          <button
            id={`wishlist-toggle-${product.id}`}
            type="button"
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-85 ${
              wishlisted
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/20 scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700/90 border-slate-700/70 text-slate-400 hover:text-rose-300'
            }`}
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-rose-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Realistic Product Visual Showcase matching the photo colors & design */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-950/60 to-slate-900/80 border border-slate-800 rounded-xl mb-6 flex items-center justify-center p-4 overflow-hidden group-hover:border-sky-500/50 transition-colors">
        <div className="transform group-hover:scale-[1.08] transition-transform duration-500 ease-out">
          <ProductMockup format={product.format} />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Material Specs */}
        <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-slate-200">{product.material}</span>
          <span>·</span>
          <span className="text-sky-400 font-bold">NTAG213 NFC</span>
          <span>·</span>
          <span className="text-slate-400">QR Fallback</span>
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-semibold">
            Price
          </span>
          <span className="font-display text-xl font-black text-white">
            ₱{product.price.toLocaleString()}
          </span>
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, 1, e);
          }}
          className="bg-white hover:bg-sky-400 text-slate-950 px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-[0.12em] font-extrabold transition-all cursor-pointer shadow-lg hover:shadow-sky-400/30 active:scale-95 border border-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
