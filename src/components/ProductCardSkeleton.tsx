import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden ring-1 ring-white/5 animate-pulse">
      {/* Top Badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-24 bg-slate-800/90 rounded-full border border-slate-700/50" />
        <div className="h-5 w-16 bg-slate-800/70 rounded-md" />
      </div>

      {/* Mockup Container Shimmer */}
      <div className="relative aspect-[4/3] bg-slate-950/70 border border-slate-800/80 rounded-xl mb-6 flex items-center justify-center p-4 overflow-hidden">
        {/* Shimmering Center Hardware Silhouette */}
        <div className="w-24 h-28 rounded-lg bg-slate-800/60 border border-slate-700/40 relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-700/40 animate-ping opacity-25" />
          <div className="w-8 h-8 rounded-full bg-slate-700/50" />
        </div>

        {/* Shimmer diagonal sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Product Details Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-3/4 bg-slate-800 rounded-md" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full bg-slate-800/70 rounded" />
          <div className="h-3 w-4/5 bg-slate-800/50 rounded" />
        </div>

        {/* Specs Pills */}
        <div className="pt-2 flex items-center gap-2">
          <div className="h-4 w-20 bg-slate-800/70 rounded" />
          <div className="h-4 w-16 bg-slate-800/60 rounded" />
          <div className="h-4 w-16 bg-slate-800/50 rounded" />
        </div>
      </div>

      {/* Pricing & Add to Cart Skeleton */}
      <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2.5 w-10 bg-slate-800 rounded" />
          <div className="h-6 w-20 bg-slate-800/90 rounded-md" />
        </div>
        <div className="h-10 w-28 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
};
