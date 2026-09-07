import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, QrCode, Smartphone } from 'lucide-react';
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
    <section
      id="hero-section"
      className="relative pt-32 sm:pt-36 md:pt-40 pb-20 md:pb-28 bg-slate-950 text-white border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column / Editorial Content (6 cols) */}
          <motion.div
            className="lg:col-span-6 space-y-8 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-full">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Contactless Google Review Hardware</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                Make Every Customer Review Effortless.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal pt-1">
                Equip your counter, tables, or checkout with commercial-grade NFC stands, cards, tags, and stickers. Customers tap with any smartphone to open your Google Review page instantly—no app required.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-shop-products-btn"
                  onClick={onShopClick}
                  className="bg-white hover:bg-slate-100 text-slate-950 px-7 py-3.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-white active:scale-98 shadow-sm"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>

                <button
                  id="hero-how-it-works-btn"
                  onClick={onHowItWorksClick}
                  className="border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-medium py-3.5 px-6 transition-all cursor-pointer text-center rounded-lg active:scale-98"
                >
                  How It Works
                </button>
              </div>

              {/* Assurances List */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Compatible with iOS & Android</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Free Google link pre-encoding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Dual NFC tap + QR code fallback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Waterproof acrylic & durable PVC</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column / Clean Hardware Showcase (6 cols) */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border border-slate-800 bg-slate-900/60 rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Commercial Hardware Lineup
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-programmed with your business Google Maps link
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md font-medium">
                  4 Formats
                </span>
              </div>

              {/* 4 Hardware Cards Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* 1. Acrylic Stand */}
                <div
                  onClick={onShopClick}
                  className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors group flex flex-col justify-between"
                >
                  <div className="h-28 flex items-center justify-center">
                    <div className="transform scale-75 origin-center">
                      <ProductMockup format="stand" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                      Acrylic Standee
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                      <span>90 × 110 mm</span>
                      <span className="font-semibold text-white">₱699</span>
                    </div>
                  </div>
                </div>

                {/* 2. Acrylic Tag */}
                <div
                  onClick={onShopClick}
                  className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors group flex flex-col justify-between"
                >
                  <div className="h-28 flex items-center justify-center">
                    <div className="transform scale-70 origin-center">
                      <ProductMockup format="tag" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                      Acrylic Square Tag
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                      <span>40 × 40 mm</span>
                      <span className="font-semibold text-white">₱349</span>
                    </div>
                  </div>
                </div>

                {/* 3. PVC Card */}
                <div
                  onClick={onShopClick}
                  className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors group flex flex-col justify-between"
                >
                  <div className="h-28 flex items-center justify-center">
                    <div className="transform scale-75 origin-center">
                      <ProductMockup format="card" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                      PVC Business Card
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                      <span>85.6 × 54 mm</span>
                      <span className="font-semibold text-white">₱449</span>
                    </div>
                  </div>
                </div>

                {/* 4. PVC Sticker */}
                <div
                  onClick={onShopClick}
                  className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors group flex flex-col justify-between"
                >
                  <div className="h-28 flex items-center justify-center">
                    <div className="transform scale-70 origin-center">
                      <ProductMockup format="sticker" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                      PVC Round Sticker
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                      <span>40 × 40 mm</span>
                      <span className="font-semibold text-white">₱249</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Footnote */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  NTAG213 Microchip
                </span>
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-slate-400" />
                  Printed QR Backup
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Zero Battery
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
