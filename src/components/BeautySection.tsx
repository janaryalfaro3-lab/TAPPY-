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
      className="py-24 sm:py-32 bg-[#050505] text-[#E0E0E0] border-b border-white/10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 sm:mb-20 space-y-3 text-left">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2DD4BF] font-semibold">
            Materials & Finishes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E0E0E0]">
            Choose Your Finish
          </h2>
          <p className="text-sm sm:text-base text-[#949494] leading-relaxed tracking-wide">
            Crafted in two durable commercial finishes: crystal-clear acrylic and lightweight matte PVC.
          </p>
        </div>

        {/* Two Large Visual Comparison Cards matching the photo structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Acrylic Card (2 Acrylic Samples) */}
          <div className="bg-[#0E0E0E] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#2DD4BF]/40 transition-colors">
            <div className="p-8 pb-4 bg-[#080808] relative flex items-center justify-around gap-4 min-h-[260px]">
              <div className="absolute top-4 left-4 bg-[#141414] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#2DD4BF] border border-white/10 font-bold">
                2 Acrylic Samples
              </div>

              {/* Side-by-side Acrylic Stand & Tag Mockups */}
              <div className="flex items-end justify-center gap-6 pt-4">
                <div className="transform scale-90 sm:scale-100">
                  <ProductMockup format="stand" />
                  <span className="block text-center text-[10px] font-mono text-[#949494] mt-2">
                    Standee · 90×110mm
                  </span>
                </div>
                <div className="transform scale-85 sm:scale-95">
                  <ProductMockup format="tag" />
                  <span className="block text-center text-[10px] font-mono text-[#949494] mt-2">
                    Tag · 40×40mm
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#E0E0E0] tracking-tight">
                    ACRYLIC FINISH
                  </h3>
                  <p className="text-sm font-medium text-[#2DD4BF] mt-1 font-mono">
                    Crystal Clear · Laser Polished · Weighted Base
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#949494] block">
                    Best Suited For
                  </span>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    Countertops, reception desks, cafés, restaurants, salons, clinics, and hotel front desks.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#949494] block">
                    Available Formats
                  </span>
                  <p className="text-xs font-mono text-[#E0E0E0]">
                    90 × 110 mm Standee · 40 × 40 mm Square Tag
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSelectStand}
                  className="w-full py-3 bg-[#1C1C1C] hover:bg-[#E0E0E0] text-[#E0E0E0] hover:text-[#050505] text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border border-white/10 hover:border-transparent active:scale-95"
                >
                  View Acrylic Samples
                </button>
              </div>
            </div>
          </div>

          {/* PVC Card (2 PVC Samples) */}
          <div className="bg-[#0E0E0E] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#2DD4BF]/40 transition-colors">
            <div className="p-8 pb-4 bg-[#080808] relative flex items-center justify-around gap-4 min-h-[260px]">
              <div className="absolute top-4 left-4 bg-[#141414] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#2DD4BF] border border-white/10 font-bold">
                2 PVC Samples
              </div>

              {/* Side-by-side PVC Card & Sticker Mockups */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="transform scale-90 sm:scale-100">
                  <ProductMockup format="card" />
                  <span className="block text-center text-[10px] font-mono text-[#949494] mt-2">
                    Card · 85.6×54mm
                  </span>
                </div>
                <div className="transform scale-85 sm:scale-95">
                  <ProductMockup format="sticker" />
                  <span className="block text-center text-[10px] font-mono text-[#949494] mt-2">
                    Sticker · 40×40mm Round
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#E0E0E0] tracking-tight">
                    PVC FINISH
                  </h3>
                  <p className="text-sm font-medium text-[#2DD4BF] mt-1 font-mono">
                    Waterproof · Strong Adhesive · Portable Matte Build
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#949494] block">
                    Best Suited For
                  </span>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    Dining tables, checkout areas, glass doors, takeout menus, and direct staff handouts.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#949494] block">
                    Available Formats
                  </span>
                  <p className="text-xs font-mono text-[#E0E0E0]">
                    85.6 × 54 mm Business Card · 40 × 40 mm Round Sticker
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSelectCard}
                  className="w-full py-3 bg-[#1C1C1C] hover:bg-[#E0E0E0] text-[#E0E0E0] hover:text-[#050505] text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border border-white/10 hover:border-transparent active:scale-95"
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
