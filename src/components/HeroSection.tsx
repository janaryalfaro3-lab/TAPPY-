import React, { useState } from 'react';
import { ArrowRight, Sparkles, Box, Layers, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductMockup } from './ProductMockup';
import { NfcBackground3D } from './NfcBackground3D';

interface HeroSectionProps {
  onShopClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onHowItWorksClick,
}) => {
  const [heroViewMode, setHeroViewMode] = useState<'lineup' | '3d-nfc'>('3d-nfc');

  return (
    <motion.section
      id="hero-section"
      className="relative pt-32 sm:pt-36 md:pt-40 pb-20 md:pb-28 bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950 text-white overflow-hidden border-b border-slate-800"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 3D NFC Background Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto -z-10 opacity-70">
        <NfcBackground3D showControls={false} />
      </div>

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-teal-500/15 blur-3xl pointer-events-none -z-20 rounded-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column / Editorial Content (5 cols) */}
          <motion.div
            className="lg:col-span-5 space-y-8 text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/15 backdrop-blur-md border border-sky-400/30 text-sky-300 text-[11px] font-mono font-bold tracking-wide rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse ring-4 ring-sky-500/20" />
                <span>3D NTAG213 CONTACTLESS NFC HARDWARE</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Make Every Review <br />
                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                  One Tap Away.
                </span>
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-xl font-normal pt-2 tracking-wide">
                Engineered with high-speed 13.56 MHz NFC micro-antennas. Convert in-person customers into genuine 5-star Google reviews with zero apps needed.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-shop-products-btn"
                  onClick={onShopClick}
                  className="bg-white hover:bg-gradient-to-r hover:from-white hover:to-sky-100 text-slate-900 px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] font-black transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-xl hover:shadow-2xl hover:shadow-sky-500/20 active:scale-95 rounded-xl border border-white"
                >
                  <span>Shop Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-sky-600" />
                </button>

                <button
                  id="hero-how-it-works-btn"
                  onClick={onHowItWorksClick}
                  className="border border-slate-700/80 hover:border-sky-400/80 bg-slate-900/80 hover:bg-slate-800 text-white text-[12px] uppercase tracking-[0.14em] font-bold py-3.5 px-6 transition-all cursor-pointer text-center shadow-xs hover:shadow-sm active:scale-95 rounded-xl backdrop-blur-md"
                >
                  How It Works
                </button>
              </div>

              {/* Subline */}
              <p className="text-[11px] text-slate-400 font-mono tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dual-Band: 3D Contactless NFC Induction + QR Fallback
              </p>
            </div>
          </motion.div>

          {/* Right Column / Interactive 3D Showcase and Product Lineup (7 cols) */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative border border-slate-700/80 bg-slate-900/85 backdrop-blur-md rounded-3xl overflow-hidden group shadow-2xl shadow-slate-950/50 p-6 sm:p-8 ring-1 ring-white/10">
              {/* Category & Mode Switcher Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block font-display">
                      3D NFC Hardware Visualizer
                    </span>
                    <span className="text-[10px] font-mono text-sky-400">
                      13.56 MHz Near-Field Induction
                    </span>
                  </div>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setHeroViewMode('3d-nfc')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      heroViewMode === '3d-nfc'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    <span>3D Model</span>
                  </button>
                  <button
                    onClick={() => setHeroViewMode('lineup')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      heroViewMode === 'lineup'
                        ? 'bg-indigo-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Lineup</span>
                  </button>
                </div>
              </div>

              {/* View Content: 3D Interactive Stage OR 4-Product Lineup */}
              {heroViewMode === '3d-nfc' ? (
                <div className="relative min-h-[320px] sm:min-h-[340px] rounded-2xl overflow-hidden my-4 border border-slate-800/80 bg-slate-950/60 flex items-center justify-center">
                  <NfcBackground3D showControls={true} />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-4 items-end justify-items-center py-6 sm:py-8 min-h-[320px] sm:min-h-[340px]">
                  {/* 1. Acrylic Standee (90x110 mm) */}
                  <div
                    className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer active:scale-95 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 w-full"
                    onClick={onShopClick}
                  >
                    <div className="transform scale-75 sm:scale-85 origin-bottom">
                      <ProductMockup format="stand" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-[9px] sm:text-[10px] font-bold text-white line-clamp-1">
                        Acrylic Stand
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                        90 × 110 mm
                      </div>
                    </div>
                  </div>

                  {/* 2. Acrylic Tag (40x40 mm) */}
                  <div
                    className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer active:scale-95 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 w-full"
                    onClick={onShopClick}
                  >
                    <div className="transform scale-70 sm:scale-80 origin-bottom">
                      <ProductMockup format="tag" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-[9px] sm:text-[10px] font-bold text-white line-clamp-1">
                        Acrylic Tag
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                        40 × 40 mm
                      </div>
                    </div>
                  </div>

                  {/* 3. PVC Business Card (85.6x54 mm) */}
                  <div
                    className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer active:scale-95 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 w-full"
                    onClick={onShopClick}
                  >
                    <div className="transform scale-75 sm:scale-85 origin-bottom">
                      <ProductMockup format="card" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-[9px] sm:text-[10px] font-bold text-white line-clamp-1">
                        PVC Card
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                        85.6 × 54 mm
                      </div>
                    </div>
                  </div>

                  {/* 4. PVC Round Sticker (40x40 mm) */}
                  <div
                    className="flex flex-col items-center group/item hover:scale-105 transition-transform cursor-pointer active:scale-95 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 w-full"
                    onClick={onShopClick}
                  >
                    <div className="transform scale-70 sm:scale-80 origin-bottom">
                      <ProductMockup format="sticker" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-[9px] sm:text-[10px] font-bold text-white line-clamp-1">
                        PVC Sticker
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                        40 × 40 mm
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Specs Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-sky-400 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  Copper Antenna Coils & Micro-Die
                </span>
                <span>NTAG213 · Zero Battery · Lifetime Tap</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
