import React from 'react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';

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
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-[#0E0E0E] border border-white/10 hover:border-[#2DD4BF]/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 cursor-pointer"
    >
      {/* Product Sample Badge (e.g., "2 ACRYLIC SAMPLES" / "2 PVC SAMPLES") */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-[#171717] border border-white/10 text-[#2DD4BF] font-semibold">
          {product.badge}
        </span>
        <span className="text-[10px] font-mono text-[#949494]">
          {product.size}
        </span>
      </div>

      {/* Realistic Product Visual Showcase matching the photo colors & design */}
      <div className="relative aspect-[4/3] bg-[#050505] border border-white/5 mb-6 flex items-center justify-center p-4 overflow-hidden group-hover:border-white/15 transition-colors">
        <div className="transform group-hover:scale-[1.04] transition-transform duration-500 ease-out">
          <ProductMockup format={product.format} />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-[#E0E0E0] tracking-tight group-hover:text-white transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-[#949494] leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Material Specs */}
        <div className="pt-2 text-[11px] font-mono text-[#949494] flex items-center gap-2">
          <span>{product.material}</span>
          <span>·</span>
          <span className="text-[#2DD4BF] font-medium">NTAG213 NFC</span>
          <span>·</span>
          <span>QR Fallback</span>
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#949494] block">
            Price
          </span>
          <span className="font-display text-xl font-bold text-[#E0E0E0]">
            ₱{product.price.toLocaleString()}
          </span>
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, 1, e);
          }}
          className="bg-[#1C1C1C] group-hover:bg-[#E0E0E0] text-[#E0E0E0] group-hover:text-[#050505] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer border border-white/10 group-hover:border-transparent active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
