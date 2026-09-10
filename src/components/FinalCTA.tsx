import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface FinalCTAProps {
  onShopClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onShopClick }) => {
  return (
    <motion.section
      id="final-cta-section"
      className="py-20 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-2xs">
          <span>Get Started Today</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          Ready to Grow Your Verified Google Reviews?
        </h2>

        <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Choose from commercial acrylic stands, tags, cards, or stickers. Pre-programmed with your business Google review URL and ready to deploy right out of the box.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="final-cta-shop-btn"
            onClick={onShopClick}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-xl shadow-xs active:scale-98"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            No app or battery needed
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Free custom pre-encoding
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Fast nationwide delivery
          </span>
        </div>
      </div>
    </motion.section>
  );
};
