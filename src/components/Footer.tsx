import React from 'react';
import { PolicyType } from './PolicyModal';

interface FooterProps {
  onNavigateToProducts: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToFaqs: () => void;
  onOpenPolicy: (type: PolicyType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToProducts,
  onNavigateToHowItWorks,
  onNavigateToFaqs,
  onOpenPolicy,
}) => {
  return (
    <footer id="main-footer" className="bg-[#050505] text-[#E0E0E0] border-t border-white/10 py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-1">
            <div className="font-display text-base sm:text-lg font-bold tracking-[0.14em] uppercase text-[#E0E0E0]">
              TAPREVIEWNFC
            </div>
            <p className="text-xs text-[#949494] tracking-wider uppercase font-mono">
              NFC Google Review Products
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2.5 text-xs text-[#949494] font-medium">
            <button
              onClick={onNavigateToProducts}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              Products
            </button>
            <button
              onClick={onNavigateToHowItWorks}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={onNavigateToFaqs}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              FAQs
            </button>
            <button
              onClick={() => onOpenPolicy('shipping')}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              Shipping
            </button>
            <button
              onClick={() => onOpenPolicy('payment')}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              Payment
            </button>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              Contact
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              Privacy
            </button>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
            >
              Terms
            </button>
          </nav>
        </div>

        {/* Bottom copyright & note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#949494] font-mono">
          <p>© 2026 TAPREVIEWNFC. All rights reserved.</p>
          <p className="text-[#2DD4BF]">Genuine NTAG213 NFC hardware.</p>
        </div>
      </div>
    </footer>
  );
};
