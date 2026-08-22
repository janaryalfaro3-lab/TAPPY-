import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductMockup } from './ProductMockup';

interface HeroSectionProps {
  onShopClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onHowItWorksClick,
}) => {
  return (
    <motion.section
      id="hero-section"
      className="relative pt-32 sm:pt-36 md:pt-40 pb-20 md:pb-28 bg-[#050505] text-[#E0E0E0] overflow-hidden"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column / Editorial Content (5 cols) */}
          <motion.div
            className="lg:col-span-5 space-y-8 text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101010] border border-[#2DD4BF]/30 text-[#2DD4BF] text-[11px] font-mono font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                <span>NTAG213 Contactless NFC Hardware</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#E0E0E0] leading-[1.08]">
                Make Every Review <br />
                <span className="text-[#E0E0E0]">One Tap Away.</span>
              </h1>

              <p className="text-base text-[#949494] leading-relaxed max-w-xl font-normal pt-2 tracking-wide">
                NFC Google Review standees, tags, cards and stickers engineered to convert in-person customers into 5-star Google reviews in seconds.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-shop-products-btn"
                  onClick={onShopClick}
                  className="bg-[#E0E0E0] hover:bg-white text-[#050505] px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-sm active:scale-95"
                >
                  <span>Shop Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-how-it-works-btn"
                  onClick={onHowItWorksClick}
                  className="border border-white/15 hover:border-[#2DD4BF]/50 text-[#E0E0E0] hover:bg-white/5 text-[12px] uppercase tracking-[0.14em] font-medium py-3.5 px-6 transition-all cursor-pointer text-center"
                >
                  How It Works
                </button>
              </div>

              {/* Subline */}
              <p className="text-[11px] text-[#949494] font-mono tracking-wide">
                Dual-Band: Contactless NFC Tap + Universal QR Code
              </p>
            </div>
          </motion.div>

          {/* Right Column / Full 4-Product Lineup Showcase matching the reference photo (7 cols) */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative border border-white/10 bg-[#0F0F0F] overflow-hidden group shadow-2xl p-6 sm:p-8">
              {/* Category Headers matching the photo */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10 text-center font-mono text-[11px] uppercase tracking-widest font-bold">
                <div className="text-[#E0E0E0] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2DD4BF]" />
                  <span>2 Acrylic Samples</span>
                </div>
                <div className="text-[#E0E0E0] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2DD4BF]" />
                  <span>2 PVC Samples</span>
                </div>
              </div>

              {/* 4 Physical Products rendered in accurate colors and shapes */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 items-end justify-items-center py-6 sm:py-8 min-h-[280px]">
                {/* 1. Acrylic Standee (90x110 mm) */}
                <div
                  className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer"
                  onClick={onShopClick}
                >
                  <div className="transform scale-75 sm:scale-90 origin-bottom">
                    <ProductMockup format="stand" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] line-clamp-1">
                      Acrylic Standee
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-mono text-[#949494]">
                      90 × 110 mm
                    </div>
                  </div>
                </div>

                {/* 2. Acrylic Tag (40x40 mm) */}
                <div
                  className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer"
                  onClick={onShopClick}
                >
                  <div className="transform scale-70 sm:scale-80 origin-bottom">
                    <ProductMockup format="tag" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] line-clamp-1">
                      Acrylic Tag
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-mono text-[#949494]">
                      40 × 40 mm
                    </div>
                  </div>
                </div>

                {/* 3. PVC Business Card (85.6x54 mm) */}
                <div
                  className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer"
                  onClick={onShopClick}
                >
                  <div className="transform scale-75 sm:scale-85 origin-bottom">
                    <ProductMockup format="card" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] line-clamp-1">
                      PVC Card
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-mono text-[#949494]">
                      85.6 × 54 mm
                    </div>
                  </div>
                </div>

                {/* 4. PVC Round Sticker (40x40 mm) */}
                <div
                  className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer"
                  onClick={onShopClick}
                >
                  <div className="transform scale-70 sm:scale-80 origin-bottom">
                    <ProductMockup format="sticker" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] line-clamp-1">
                      PVC Sticker
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-mono text-[#949494]">
                      40 × 40 mm
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Specs Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#949494] font-mono">
                <span className="text-[#2DD4BF] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Dual-Tone Face (Black & White)
                </span>
                <span>NTAG213 NFC · Zero Batteries</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
