import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, e: React.MouseEvent) => void;
  isLoading?: boolean;
}

const QUICK_FILTERS = [
  { id: 'all', label: 'All Items' },
  { id: 'low-stock', label: '🔥 Low Stock (<5 left)' },
  { id: 'stand', label: 'Stands' },
  { id: 'sticker', label: 'Stickers' },
  { id: 'card', label: 'Cards' },
  { id: 'tag', label: 'Tags' },
  { id: 'acrylic', label: 'Acrylic' },
  { id: 'pvc', label: 'PVC' },
];

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [internalLoading, setInternalLoading] = useState(true);

  // Initial content loading simulation for smooth perception
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const currentlyLoading = isLoading || internalLoading;

  // Real-time search and filter logic
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return products.filter((product) => {
      // Check quick category filter
      let matchesFilter = true;
      if (activeFilter === 'low-stock') matchesFilter = (product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0);
      else if (activeFilter === 'stand') matchesFilter = product.format === 'stand';
      else if (activeFilter === 'sticker') matchesFilter = product.format === 'sticker';
      else if (activeFilter === 'card') matchesFilter = product.format === 'card';
      else if (activeFilter === 'tag') matchesFilter = product.format === 'tag';
      else if (activeFilter === 'acrylic') matchesFilter = product.material.toLowerCase().includes('acrylic');
      else if (activeFilter === 'pvc') matchesFilter = product.material.toLowerCase().includes('pvc');

      if (!matchesFilter) return false;

      // Check text search query
      if (!query) return true;

      const searchableText = [
        product.name,
        product.tagline,
        product.description,
        product.format,
        product.material,
        product.chipType,
        product.idealFor,
        ...(product.features || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [products, searchQuery, activeFilter]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  return (
    <motion.section
      id="products-section"
      className="py-24 sm:py-32 bg-slate-950/40 text-white border-b border-slate-800/80 relative backdrop-blur-xs z-10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-mono font-bold tracking-wide rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>THE COMMERCIAL LINEUP</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Choose Your Hardware Format
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed tracking-wide">
              Four commercial formats matching your countertop, checkout area, point-of-sale, and customer touchpoints.
            </p>
          </div>

          {/* Product Count Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md self-start lg:self-auto">
            <span>Showing</span>
            <strong className="text-white font-bold">{filteredProducts.length}</strong>
            <span>of {products.length} models</span>
          </div>
        </div>

        {/* Search Bar & Quick Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="relative flex items-center max-w-2xl">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NFC hardware (e.g. 'stand', 'sticker', 'acrylic', 'card', 'tag')..."
              className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 border border-slate-700/80 focus:border-sky-400 rounded-2xl text-sm text-white placeholder-slate-400 font-sans shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                id="clear-product-search-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              Filter:
            </span>
            {QUICK_FILTERS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  id={`filter-pill-${filter.id}`}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}

            {(searchQuery || activeFilter !== 'all') && (
              <button
                id="reset-all-filters-btn"
                onClick={handleClearSearch}
                className="text-xs text-sky-400 hover:text-sky-300 font-mono underline ml-2 shrink-0 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* 4-Product Grid with Skeletons or Cards */}
        {currentlyLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={`product-skeleton-${n}`} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div
            id="empty-search-state"
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 my-8 backdrop-blur-md"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold text-white">
                No NFC Products Found
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                No items match "{searchQuery || activeFilter}". Try searching for keywords like <span className="text-sky-400 font-mono">stand</span>, <span className="text-sky-400 font-mono">sticker</span>, <span className="text-sky-400 font-mono">card</span>, or <span className="text-sky-400 font-mono">tag</span>.
              </p>
            </div>
            <button
              id="clear-search-empty-btn"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>View All 4 Products</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
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
        )}
      </div>
    </motion.section>
  );
};

