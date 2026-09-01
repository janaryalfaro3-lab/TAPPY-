import React from 'react';
import { motion } from 'motion/react';
import { ProductMockup } from './ProductMockup';

interface BeautySectionProps {
  onSelectStand: () => void;
  onSelectCard: () => void;
}

export const BeautySection: React.FC<BeautySectionProps> = ({
  onSelectStand,
  onSelectCard,
}) => {
  return (
    <motion.section
      id="materials-section"
      className="py-24 sm:py-32 bg-slate-950/40 text-white border-b border-slate-800/80 backdrop-blur-xs relative z-10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 sm:mb-20 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-mono font-bold tracking-wide rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>MATERIALS & FINISHES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choose Your Material & Finish
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed tracking-wide">
            Crafted in two durable commercial finishes: crystal-clear laser acrylic and lightweight waterproof matte PVC.
          </p>
        </div>

        {/* Two Large Visual Comparison Cards matching the photo structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Acrylic Card (2 Acrylic Samples) */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/20 transition-all ring-1 ring-white/10">
            <div className="p-8 pb-4 bg-gradient-to-b from-sky-950/40 to-slate-950/60 relative flex items-center justify-around gap-4 min-h-[260px] border-b border-slate-800">
              <div className="absolute top-4 left-4 bg-sky-500/20 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-300 border border-sky-400/40 rounded-full font-bold shadow-2xs">
                2 Acrylic Samples
              </div>

              {/* Side-by-side Acrylic Stand & Tag Mockups */}
              <div className="flex items-end justify-center gap-6 pt-4">
                <div className="transform scale-90 sm:scale-100">
                  <ProductMockup format="stand" />
                  <span className="block text-center text-[10px] font-mono text-slate-400 mt-2 font-medium">
                    Standee · 90×110mm
                  </span>
                </div>
                <div className="transform scale-85 sm:scale-95">
                  <ProductMockup format="tag" />
                  <span className="block text-center text-[10px] font-mono text-slate-400 mt-2 font-medium">
                    Tag · 40×40mm
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between bg-slate-900/60">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                    ACRYLIC FINISH
                  </h3>
                  <p className="text-sm font-semibold text-sky-400 mt-1 font-mono">
                    Crystal Clear · Laser Polished · Weighted Base
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Best Suited For
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Countertops, reception desks, cafés, restaurants, salons, clinics, and hotel front desks.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Available Formats
                  </span>
                  <p className="text-xs font-mono text-slate-200 font-medium">
                    90 × 110 mm Standee · 40 × 40 mm Square Tag
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSelectStand}
                  className="w-full py-3.5 bg-white hover:bg-sky-400 text-slate-950 text-[11px] uppercase tracking-[0.14em] font-extrabold transition-all cursor-pointer rounded-xl shadow-lg hover:shadow-sky-400/30 active:scale-95 border border-white"
                >
                  View Acrylic Samples
                </button>
              </div>
            </div>
          </div>

          {/* PVC Card (2 PVC Samples) */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all ring-1 ring-white/10">
            <div className="p-8 pb-4 bg-gradient-to-b from-indigo-950/40 to-slate-950/60 relative flex items-center justify-around gap-4 min-h-[260px] border-b border-slate-800">
              <div className="absolute top-4 left-4 bg-indigo-500/20 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-indigo-300 border border-indigo-400/40 rounded-full font-bold shadow-2xs">
                2 PVC Samples
              </div>

              {/* Side-by-side PVC Card & Sticker Mockups */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="transform scale-90 sm:scale-100">
                  <ProductMockup format="card" />
                  <span className="block text-center text-[10px] font-mono text-slate-400 mt-2 font-medium">
                    Card · 85.6×54mm
                  </span>
                </div>
                <div className="transform scale-85 sm:scale-95">
                  <ProductMockup format="sticker" />
                  <span className="block text-center text-[10px] font-mono text-slate-400 mt-2 font-medium">
                    Sticker · 40×40mm Round
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between bg-slate-900/60">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                    PVC FINISH
                  </h3>
                  <p className="text-sm font-semibold text-indigo-400 mt-1 font-mono">
                    Waterproof · Strong Adhesive · Portable Matte Build
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Best Suited For
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Dining tables, checkout areas, glass doors, takeout menus, and direct staff handouts.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Available Formats
                  </span>
                  <p className="text-xs font-mono text-slate-200 font-medium">
                    85.6 × 54 mm Business Card · 40 × 40 mm Round Sticker
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSelectCard}
                  className="w-full py-3.5 bg-white hover:bg-indigo-400 text-slate-950 text-[11px] uppercase tracking-[0.14em] font-extrabold transition-all cursor-pointer rounded-xl shadow-lg hover:shadow-indigo-400/30 active:scale-95 border border-white"
                >
                  View PVC Samples
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
