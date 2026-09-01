import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FinalCTAProps {
  onShopClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onShopClick }) => {
  return (
    <motion.section
      id="final-cta-section"
      className="py-24 sm:py-32 bg-slate-950/60 text-white border-b border-slate-800/80 backdrop-blur-xs relative overflow-hidden z-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Radiant Glow Behind CTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-teal-500/20 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-8 relative z-10">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-mono font-bold tracking-wide rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>READY TO BOOST YOUR RATINGS?</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Make Every Review <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300 bg-clip-text text-transparent">
              One Tap Away.
            </span>
          </h2>
          <p className="text-base text-slate-300 leading-relaxed tracking-wide">
            Choose from stands, tags, cards, or stickers. Ready out of the box with free Google link pre-programming.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            id="final-cta-shop-btn"
            onClick={onShopClick}
            className="bg-white hover:bg-sky-400 text-slate-950 px-9 py-4 text-[12px] uppercase tracking-[0.14em] font-black transition-all cursor-pointer flex items-center gap-2.5 shadow-2xl hover:shadow-sky-400/30 group active:scale-95 rounded-xl border border-white"
          >
            <span>Choose Your Product</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-950" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};
