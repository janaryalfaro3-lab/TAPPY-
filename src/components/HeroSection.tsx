import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, QrCode, Smartphone, Camera, Grid, Sparkles, Box } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductMockup } from './ProductMockup';
import { ProgressiveImage } from './ProgressiveImage';
import { TiltCard3D } from './TiltCard3D';
import { Product3DStage } from './Product3DStage';
import { ASSET_IMAGES } from '../data/products';

interface HeroSectionProps {
  onShopClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onHowItWorksClick,
}) => {
  const [lineupView, setLineupView] = useState<'photo' | 'interactive' | '3d'>('photo');
  const [activeInspectorFormat, setActiveInspectorFormat] = useState<'stand' | 'tag' | 'card' | 'sticker'>('stand');

  return (
    <section
      id="hero-section"
      className="relative pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-50 text-slate-900 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column / Editorial Content (6 cols) */}
          <motion.div
            className="lg:col-span-6 space-y-7 text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.14]">
                Make Every Customer Review Effortless.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Equip your counter, tables, or checkout with commercial-grade NFC stands, cards, tags, and stickers. Customers tap with any smartphone to open your Google Review page instantly—no app required.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-shop-products-btn"
                  onClick={onShopClick}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg shadow-sm active:scale-98"
                >
                  <span>Explore Hardware Catalog</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  id="hero-how-it-works-btn"
                  onClick={onHowItWorksClick}
                  className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold py-3.5 px-6 transition-all cursor-pointer text-center rounded-lg active:scale-98 shadow-2xs"
                >
                  See How It Works
                </button>
              </div>

              {/* Lively Merchant Trust Bar */}
              <div className="flex flex-wrap items-center gap-3 py-1 text-xs text-slate-600">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span>★★★★★</span>
                  <span className="text-slate-900 ml-1 font-extrabold">4.9/5</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">Over 2,400+ tap review devices deployed nationwide</span>
              </div>

              {/* Assurances List */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Compatible with iPhone & Android</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Free Google link pre-encoding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Dual NFC tap + QR code fallback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Waterproof acrylic & durable PVC</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column / Clean Hardware Showcase (6 cols) */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard3D
              maxTilt={7}
              scale={1.01}
              className="border border-slate-200 bg-white rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm"
            >
              <div
                className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2"
                style={{ transform: 'translateZ(10px)' }}
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Commercial Hardware Lineup
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-programmed with your business Google Maps link
                  </p>
                </div>
                
                {/* View switcher tabs */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium shrink-0">
                  <button
                    type="button"
                    onClick={() => setLineupView('photo')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      lineupView === 'photo'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Real Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLineupView('interactive')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      lineupView === 'interactive'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>4 Formats</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLineupView('3d')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      lineupView === '3d'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold text-sky-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-sky-600" />
                    <span>3D Stage</span>
                  </button>
                </div>
              </div>

              {lineupView === 'photo' && (
                /* Studio Photo Lineup Display with complete visibility */
                <div
                  onClick={onShopClick}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 bg-stone-950 shadow-inner cursor-pointer"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <img
                    src={ASSET_IMAGES.hero}
                    alt="tappy NFC Google Review Hardware Lineup"
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-103 transition-transform duration-500 ease-out block"
                  />
                  
                  {/* Subtle overlay with format tags */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white pointer-events-none">
                    <div className="flex items-center justify-between pointer-events-auto">
                      <div>
                        <div className="text-xs font-semibold flex items-center gap-1.5 text-white drop-shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Official 4-Piece Commercial Collection</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Acrylic Stand · Square Tag · Business Card · Round Sticker
                        </p>
                      </div>
                      <span className="text-xs bg-white text-slate-900 px-3 py-1 rounded-lg font-bold shadow-sm group-hover:bg-sky-50 transition-colors">
                        Select Hardware →
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {lineupView === 'interactive' && (
                /* 4 Hardware Cards Grid - 100% Unclipped Full Visibility */
                <div className="grid grid-cols-2 gap-3" style={{ transform: 'translateZ(20px)' }}>
                  {/* 1. Acrylic Stand */}
                  <div
                    onClick={onShopClick}
                    className="p-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="h-28 rounded-lg overflow-hidden border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 flex items-center justify-center p-1.5">
                      <img
                        src={ASSET_IMAGES.stand}
                        alt="Acrylic Google Review Standee"
                        loading="eager"
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                        TMY-1 Stand
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                        <span>90 × 110 mm</span>
                        <span className="font-bold text-slate-900">₱1,490</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Acrylic Tag */}
                  <div
                    onClick={onShopClick}
                    className="p-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="h-28 rounded-lg overflow-hidden border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 flex items-center justify-center p-1.5">
                      <img
                        src={ASSET_IMAGES.tag}
                        alt="Acrylic NFC Tag (Square)"
                        loading="eager"
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                        TMY-2 Mini Tag
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                        <span>40 × 40 mm</span>
                        <span className="font-bold text-slate-900">₱590</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. PVC Card */}
                  <div
                    onClick={onShopClick}
                    className="p-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="h-28 rounded-lg overflow-hidden border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 flex items-center justify-center p-1.5">
                      <img
                        src={ASSET_IMAGES.card}
                        alt="PVC NFC Business Card"
                        loading="eager"
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                        TMY-3 NFC Card
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                        <span>85.6 × 54 mm</span>
                        <span className="font-bold text-slate-900">₱490</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. PVC Sticker */}
                  <div
                    onClick={onShopClick}
                    className="p-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="h-28 rounded-lg overflow-hidden border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 flex items-center justify-center p-1.5">
                      <img
                        src={ASSET_IMAGES.sticker}
                        alt="PVC NFC Sticker (Round)"
                        loading="eager"
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                        TMY-4 Tag Sticker
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                        <span>40 × 40 mm</span>
                        <span className="font-bold text-slate-900">₱350</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {lineupView === '3d' && (
                /* Interactive 3D Stage in Hero */
                <div className="space-y-3" style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                    {(['stand', 'tag', 'card', 'sticker'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setActiveInspectorFormat(fmt)}
                        className={`px-3 py-1 rounded-md transition-all capitalize cursor-pointer ${
                          activeInspectorFormat === fmt
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <Product3DStage
                    format={activeInspectorFormat}
                    name={`TMY ${activeInspectorFormat.toUpperCase()}`}
                    image={ASSET_IMAGES[activeInspectorFormat]}
                    size={
                      activeInspectorFormat === 'stand'
                        ? '90 × 110 mm'
                        : activeInspectorFormat === 'tag'
                        ? '40 × 40 mm'
                        : activeInspectorFormat === 'card'
                        ? '85.6 × 54 mm'
                        : '40 mm round'
                    }
                  />
                </div>
              )}

              {/* Technical Specifications Footnote */}
              <div
                className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
                style={{ transform: 'translateZ(10px)' }}
              >
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
            </TiltCard3D>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
