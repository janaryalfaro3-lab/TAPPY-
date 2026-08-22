import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, e: React.MouseEvent) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  return (
    <motion.section
      id="products-section"
      className="py-24 sm:py-32 bg-[#050505] text-[#E0E0E0] border-b border-white/10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-16 space-y-3 text-left">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2DD4BF] font-semibold">
            The Product Lineup
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E0E0E0]">
            Choose Your Product
          </h2>
          <p className="text-sm sm:text-base text-[#949494] leading-relaxed tracking-wide">
            Four commercial formats matching your countertop, checkout area, and customer touchpoints.
          </p>
        </div>

        {/* 4-Product Grid with subtle staggered appearance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.8,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProductCard
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
