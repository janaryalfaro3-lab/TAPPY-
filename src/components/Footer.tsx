import React from 'react';
import { PolicyType } from './PolicyModal';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface FooterProps {
  onNavigateToProducts: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToImpact?: () => void;
  onNavigateToReviews?: () => void;
  onNavigateToFaqs: () => void;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenOrderHistory?: () => void;
  onOpenAdminOrders?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToProducts,
  onNavigateToHowItWorks,
  onNavigateToImpact,
  onNavigateToReviews,
  onNavigateToFaqs,
  onOpenPolicy,
  onOpenOrderHistory,
  onOpenAdminOrders,
}) => {
  return (
    <footer id="main-footer" className="bg-slate-900 text-white border-t border-slate-800 py-14 sm:py-18 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
        {/* Newsletter Subscription Banner */}
        <NewsletterSubscribe />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-500/20">
                T
              </span>
              <span className="font-display text-lg font-black tracking-[0.14em] uppercase text-white flex items-center">
                TAPPY<span className="text-sky-400 font-extrabold text-xs ml-1 font-mono">NFC</span>
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
            {onOpenAdminOrders && (
              <button
                id="footer-admin-orders-btn"
                onClick={onOpenAdminOrders}
                className="hover:text-indigo-300 text-indigo-400 font-bold transition-colors cursor-pointer py-1 active:scale-95 flex items-center gap-1"
              >
                Admin Database
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

        {/* Quick Contact & Social Channels Bar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Direct Channels:</span>
            <a
              href="https://www.facebook.com/profile.php?id=61593179006229"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-bold"
            >
              Facebook Page
            </a>
            <a
              href="https://wa.me/639764421242"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline flex items-center gap-1 font-bold"
            >
              WhatsApp (09764421242)
            </a>
            <a
              href="tel:09764421242"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Viber / Tel: 09764421242
            </a>
          </div>

          <div>
            <a
              href="mailto:tappyofficialstore@gmail.com"
              className="text-sky-400 hover:text-sky-300 font-bold transition-colors"
            >
              tappyofficialstore@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom copyright & note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© 2026 TAPPY. All rights reserved.</p>
          <p className="text-sky-400 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Genuine NTAG213 NFC hardware · Manila, Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
};
