import React from 'react';
import { Heart, Check } from 'lucide-react';
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
  const wishlisted = isWishlisted(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* Top Header: Badge, Dimensions & Wishlist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {product.badge || product.format}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {product.size}
            </span>

            <button
              id={`wishlist-toggle-${product.id}`}
              type="button"
              onClick={handleToggleWishlist}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                wishlisted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
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

        {/* Product Visual Mockup */}
        <div className="relative aspect-[4/3] bg-slate-950/60 border border-slate-800/80 rounded-lg mb-5 flex items-center justify-center p-4 overflow-hidden">
          <div className="transform group-hover:scale-105 transition-transform duration-300 ease-out">
            <ProductMockup format={product.format} />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-white group-hover:text-sky-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>NTAG213 contactless chip</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Printed QR code fallback</span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Unit Price
          </span>
          <span className="text-lg font-bold text-white">
            ₱{product.price.toLocaleString()}
          </span>
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, 1, e);
          }}
          className="bg-white hover:bg-slate-100 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-white active:scale-98"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
