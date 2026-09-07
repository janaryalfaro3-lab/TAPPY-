import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface FinalCTAProps {
  onShopClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onShopClick }) => {
  return (
    <section
      id="final-cta-section"
      className="py-20 sm:py-24 bg-slate-950 text-white border-b border-slate-800"
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-full">
          <span>Get Started</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          Ready to Elevate Your Google Reviews?
        </h2>

        <p className="text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
          Choose from commercial acrylic stands, tags, cards, or stickers. Pre-programmed with your business Google review URL and ready to deploy right out of the box.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="final-cta-shop-btn"
            onClick={onShopClick}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 px-8 py-3.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-white active:scale-98 shadow-sm"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            No app or battery needed
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            Free custom pre-encoding
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            Fast nationwide shipping
          </span>
        </div>
      </div>
    </section>
  );
};
