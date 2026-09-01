import React from 'react';

export const CustomerTestimonialsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-pulse">
      {/* Left Feature Card Skeleton */}
      <div className="lg:col-span-8">
        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-8 sm:p-12 shadow-2xl h-full flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Stars & Metric Badge Skeleton */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-28 bg-slate-800 rounded-md" />
                <div className="h-4 w-12 bg-slate-800/60 rounded" />
              </div>
              <div className="h-6 w-36 bg-slate-800 rounded-full" />
            </div>

            {/* Headline Quote Skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-7 w-3/4 bg-slate-800 rounded-lg" />
              <div className="h-7 w-1/2 bg-slate-800/80 rounded-lg" />
            </div>

            {/* Body Lines Skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-slate-800/70 rounded" />
              <div className="h-4 w-11/12 bg-slate-800/60 rounded" />
              <div className="h-4 w-4/5 bg-slate-800/50 rounded" />
            </div>
          </div>

          {/* Customer Info Skeleton */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <div className="h-3 w-48 bg-slate-800/60 rounded" />
              </div>
            </div>
            <div className="space-y-1.5 text-left sm:text-right">
              <div className="h-3 w-24 bg-slate-800/60 rounded" />
              <div className="h-4 w-32 bg-slate-800 rounded" />
            </div>
          </div>

          {/* Controls Skeleton */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 bg-slate-700 rounded-full" />
              <div className="h-2 w-2 bg-slate-800 rounded-full" />
              <div className="h-2 w-2 bg-slate-800 rounded-full" />
              <div className="h-2 w-2 bg-slate-800 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800" />
              <div className="w-10 h-10 rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeletons */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={`testimonial-sidebar-skeleton-${i}`}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-2xl p-6 shadow-xl flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-20 bg-slate-800 rounded-md" />
              <div className="h-3 w-full bg-slate-800/60 rounded" />
            </div>
          </div>
        ))}

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-center space-y-3">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-full bg-slate-800/60 rounded" />
          <div className="h-3 w-4/5 bg-slate-800/50 rounded" />
        </div>
      </div>
    </div>
  );
};
