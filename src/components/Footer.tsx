import React from 'react';
import { PolicyType } from './PolicyModal';
import { NewsletterSubscribe } from './NewsletterSubscribe';
import { Logo } from './Logo';

interface FooterProps {
  onNavigateToProducts: () => void;
  onNavigateToBundles?: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToImpact?: () => void;
  onNavigateToReviews?: () => void;
  onNavigateToFaqs: () => void;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenOrderHistory?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToProducts,
  onNavigateToBundles,
  onNavigateToHowItWorks,
  onNavigateToImpact,
  onNavigateToReviews,
  onNavigateToFaqs,
  onOpenPolicy,
  onOpenOrderHistory,
}) => {
  return (
    <footer id="main-footer" className="bg-white text-slate-900 border-t border-slate-200 py-14 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
        {/* Newsletter Subscription Banner */}
        <NewsletterSubscribe />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
          {/* Brand Info with Logo Component */}
          <div className="space-y-1">
            <Logo size="sm" />
            <p className="text-xs text-slate-500 pl-9">
              Commercial Contactless Google Review Hardware
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
            <button
              onClick={onNavigateToProducts}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Products
            </button>
            {onNavigateToBundles && (
              <button
                onClick={onNavigateToBundles}
                className="hover:text-sky-800 text-sky-700 transition-colors cursor-pointer py-1 font-semibold"
              >
                Bundle Offers (Save 22%)
              </button>
            )}
            <button
              onClick={onNavigateToHowItWorks}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            {onNavigateToImpact && (
              <button
                onClick={onNavigateToImpact}
                className="hover:text-slate-900 transition-colors cursor-pointer py-1"
              >
                Impact
              </button>
            )}
            {onNavigateToReviews && (
              <button
                onClick={onNavigateToReviews}
                className="hover:text-slate-900 transition-colors cursor-pointer py-1"
              >
                Testimonials
              </button>
            )}
            <button
              onClick={onNavigateToFaqs}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              FAQs
            </button>
            {onOpenOrderHistory && (
              <button
                id="footer-track-orders-btn"
                onClick={onOpenOrderHistory}
                className="text-sky-700 hover:text-sky-800 font-semibold transition-colors cursor-pointer py-1 flex items-center gap-1"
              >
                Track Order
              </button>
            )}
            <button
              onClick={() => onOpenPolicy('shipping')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Shipping
            </button>
            <button
              onClick={() => onOpenPolicy('payment')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Payment
            </button>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Contact
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Privacy
            </button>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Terms
            </button>
          </nav>
        </div>

        {/* Direct Channels Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-700">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Direct Channels:</span>
            <a
              href="https://www.facebook.com/profile.php?id=61593179006229"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-800 transition-colors font-semibold"
            >
              Facebook Page
            </a>
            <a
              href="https://wa.me/639764421242"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 transition-colors font-semibold"
            >
              WhatsApp (09764421242)
            </a>
            <a
              href="tel:09764421242"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              Viber / Tel: 09764421242
            </a>
          </div>

          <div>
            <a
              href="mailto:tappyofficialstore@gmail.com"
              className="text-sky-700 hover:text-sky-800 font-semibold transition-colors"
            >
              tappyofficialstore@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom copyright & note */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TAPPY. All rights reserved.</p>
          <p className="text-slate-600 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Genuine NTAG213 NFC hardware · Manila, Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
};
