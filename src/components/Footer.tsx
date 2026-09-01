import React from 'react';
import { PolicyType } from './PolicyModal';

interface FooterProps {
  onNavigateToProducts: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToImpact?: () => void;
  onNavigateToReviews?: () => void;
  onNavigateToFaqs: () => void;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenOrderHistory?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToProducts,
  onNavigateToHowItWorks,
  onNavigateToImpact,
  onNavigateToReviews,
  onNavigateToFaqs,
  onOpenPolicy,
  onOpenOrderHistory,
}) => {
  return (
    <footer id="main-footer" className="bg-slate-900 text-white border-t border-slate-800 py-14 sm:py-18 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-sky-500/20">
                TR
              </span>
              <span className="font-display text-lg font-black tracking-[0.12em] uppercase text-white">
                TAPREVIEW<span className="text-sky-400">NFC</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wider uppercase font-mono font-medium pl-10.5">
              Commercial NFC Google Review Hardware
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2.5 text-xs text-slate-300 font-semibold font-mono">
            <button
              onClick={onNavigateToProducts}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              Products
            </button>
            <button
              onClick={onNavigateToHowItWorks}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              How It Works
            </button>
            {onNavigateToImpact && (
              <button
                onClick={onNavigateToImpact}
                className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
              >
                Impact
              </button>
            )}
            {onNavigateToReviews && (
              <button
                onClick={onNavigateToReviews}
                className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
              >
                Reviews
              </button>
            )}
            <button
              onClick={onNavigateToFaqs}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              FAQs
            </button>
            {onOpenOrderHistory && (
              <button
                id="footer-track-orders-btn"
                onClick={onOpenOrderHistory}
                className="hover:text-sky-400 text-sky-300 font-bold transition-colors cursor-pointer py-1 active:scale-95 flex items-center gap-1"
              >
                Track Order
              </button>
            )}
            <button
              onClick={() => onOpenPolicy('shipping')}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              Shipping
            </button>
            <button
              onClick={() => onOpenPolicy('payment')}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              Payment
            </button>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              Contact
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              Privacy
            </button>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-sky-400 transition-colors cursor-pointer py-1 active:scale-95"
            >
              Terms
            </button>
          </nav>
        </div>

        {/* Bottom copyright & note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© 2026 TAPREVIEWNFC. All rights reserved.</p>
          <p className="text-sky-400 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Genuine NTAG213 NFC hardware · Manila, Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
};
