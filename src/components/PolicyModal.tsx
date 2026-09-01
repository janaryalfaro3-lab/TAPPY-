import React from 'react';
import { X, Truck, CreditCard, Mail, FileText, Lock } from 'lucide-react';

export type PolicyType = 'contact' | 'shipping' | 'payment' | 'privacy' | 'terms';

interface PolicyModalProps {
  type: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap: Record<
    PolicyType,
    { title: string; icon: React.ComponentType<{ className?: string }>; body: React.ReactNode }
  > = {
    contact: {
      title: 'Contact & Support',
      icon: Mail,
      body: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Have questions about pre-programming, ordering in volume, or setting up your Google Review link?
          </p>
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Email Support</span>
              <a href="mailto:tappyofficialstore@gmail.com" className="font-bold text-sky-400 text-xs hover:underline">
                tappyofficialstore@gmail.com
              </a>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Phone / WhatsApp / Viber / Telegram</span>
              <span className="font-bold text-slate-200 text-xs">09764421242 (+63 976 442 1242)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Official Facebook Page</span>
              <a
                href="https://www.facebook.com/profile.php?id=61593179006229"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-400 text-xs hover:underline"
              >
                facebook.com/tappyofficialstore
              </a>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Hours</span>
              <span className="font-semibold text-slate-200 text-xs">Monday – Saturday: 9:00 AM – 6:00 PM (GMT+8)</span>
            </div>
          </div>
        </div>
      ),
    },
    shipping: {
      title: 'Shipping & Delivery',
      icon: Truck,
      body: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Every product is encoded and verified before dispatch.
          </p>
          <div className="space-y-2.5">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="font-bold text-white block text-xs mb-0.5">Metro Manila & Luzon</span>
              <span className="text-slate-400 text-[11px]">1 – 3 business days via express courier.</span>
            </div>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="font-bold text-white block text-xs mb-0.5">Visayas & Mindanao</span>
              <span className="text-slate-400 text-[11px]">3 – 5 business days via standard courier.</span>
            </div>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="font-bold text-teal-400 block text-xs mb-0.5">Complimentary Shipping</span>
              <span className="text-slate-400 text-[11px]">Free nationwide shipping on orders over ₱2,000.</span>
            </div>
          </div>
        </div>
      ),
    },
    payment: {
      title: 'Payment Methods',
      icon: CreditCard,
      body: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            We support instant Philippine mobile wallets (GCash, Maya), GoTyme bank transfers, and credit/debit cards.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="font-bold text-white block text-xs">GCash & Maya</span>
              <span className="text-sky-400 text-xs font-bold block mt-0.5">09764421242</span>
              <span className="text-slate-400 text-[10px]">Account: TAPPY OFFICIAL STORE</span>
            </div>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="font-bold text-white block text-xs">GoTyme Bank</span>
              <span className="text-indigo-400 text-xs font-bold block mt-0.5">016846634686</span>
              <span className="text-slate-400 text-[10px]">InstaPay / PESONet</span>
            </div>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl sm:col-span-2">
              <span className="font-bold text-white block text-xs">Credit & Debit Cards</span>
              <span className="text-slate-400 text-[11px]">Visa, Mastercard, JCB, and AMEX with 3D-Secure.</span>
            </div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Lock,
      body: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            We collect only the essential information needed to fulfill your physical order and pre-encode your Google Review link.
          </p>
          <p className="text-slate-400 text-[11px]">
            We do not share, sell, or monetize your contact or business information with any third parties.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      body: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            All products include a <strong className="text-white font-bold">1-Year Hardware Warranty</strong> covering NFC chip functionality under normal operating conditions.
          </p>
          <p className="text-slate-400 text-[11px]">
            If you need to adjust your Google Review destination link prior to delivery dispatch, please message us immediately with your order ID.
          </p>
        </div>
      ),
    },
  };

  const item = contentMap[type];
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6 text-white ring-1 ring-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500/20 border border-sky-500/30 rounded-xl flex items-center justify-center text-sky-400 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-display text-base font-extrabold text-white">
            {item.title}
          </h3>
        </div>

        <div>{item.body}</div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[11px] uppercase tracking-[0.14em] font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 bg-slate-800 rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
