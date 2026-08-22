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
        <div className="space-y-4 text-xs text-[#949494] leading-relaxed">
          <p>
            Have questions about pre-programming, ordering in volume, or setting up your Google Review link?
          </p>
          <div className="p-4 bg-[#080808] border border-white/10 space-y-2">
            <div>
              <span className="text-[#666] block text-[10px] uppercase font-mono tracking-wider">Email</span>
              <span className="font-medium text-[#E0E0E0] text-xs">support@tapreviewnfc.store</span>
            </div>
            <div>
              <span className="text-[#666] block text-[10px] uppercase font-mono tracking-wider">Hours</span>
              <span className="text-[#E0E0E0] text-xs">Monday – Saturday: 9:00 AM – 6:00 PM (GMT+8)</span>
            </div>
          </div>
        </div>
      ),
    },
    shipping: {
      title: 'Shipping & Delivery',
      icon: Truck,
      body: (
        <div className="space-y-4 text-xs text-[#949494] leading-relaxed">
          <p>
            Every product is encoded and verified before dispatch.
          </p>
          <div className="space-y-2.5">
            <div className="p-3.5 bg-[#080808] border border-white/10">
              <span className="font-semibold text-[#E0E0E0] block text-xs mb-0.5">Metro Manila & Luzon</span>
              <span className="text-[#949494] text-[11px]">1 – 3 business days via express courier.</span>
            </div>
            <div className="p-3.5 bg-[#080808] border border-white/10">
              <span className="font-semibold text-[#E0E0E0] block text-xs mb-0.5">Visayas & Mindanao</span>
              <span className="text-[#949494] text-[11px]">3 – 5 business days via standard courier.</span>
            </div>
            <div className="p-3.5 bg-[#080808] border border-white/10">
              <span className="font-semibold text-[#2DD4BF] block text-xs mb-0.5">Complimentary Shipping</span>
              <span className="text-[#949494] text-[11px]">Free nationwide shipping on orders over ₱2,000.</span>
            </div>
          </div>
        </div>
      ),
    },
    payment: {
      title: 'Payment Methods',
      icon: CreditCard,
      body: (
        <div className="space-y-4 text-xs text-[#949494] leading-relaxed">
          <p>
            We support standard Philippine mobile wallets, cards, and direct bank transfers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#080808] border border-white/10">
              <span className="font-semibold text-[#E0E0E0] block text-xs">GCash & Maya</span>
              <span className="text-[#949494] text-[11px]">Instant mobile wallet payments.</span>
            </div>
            <div className="p-3.5 bg-[#080808] border border-white/10">
              <span className="font-semibold text-[#E0E0E0] block text-xs">Credit & Debit Cards</span>
              <span className="text-[#949494] text-[11px]">Visa, Mastercard, JCB, and AMEX.</span>
            </div>
            <div className="p-3.5 bg-[#080808] border border-white/10 sm:col-span-2">
              <span className="font-semibold text-[#E0E0E0] block text-xs">Direct Bank Deposit</span>
              <span className="text-[#949494] text-[11px]">BDO, BPI, UnionBank, or InstaPay.</span>
            </div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Lock,
      body: (
        <div className="space-y-3 text-xs text-[#949494] leading-relaxed">
          <p>
            We collect only the essential information needed to fulfill your physical order and pre-encode your Google Review link.
          </p>
          <p className="text-[#666] text-[11px]">
            We do not share, sell, or monetize your contact or business information with any third parties.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      body: (
        <div className="space-y-3 text-xs text-[#949494] leading-relaxed">
          <p>
            All products include a <strong className="text-[#E0E0E0]">1-Year Hardware Warranty</strong> covering NFC chip functionality under normal operating conditions.
          </p>
          <p className="text-[#666] text-[11px]">
            If you need to adjust your Google Review destination link prior to delivery dispatch, please message us immediately with your order ID.
          </p>
        </div>
      ),
    },
  };

  const item = contentMap[type];
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#050505]/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0E0E0E] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-[#E0E0E0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#949494] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#080808] border border-white/10 flex items-center justify-center text-[#2DD4BF] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-display text-base font-bold text-[#E0E0E0]">
            {item.title}
          </h3>
        </div>

        <div>{item.body}</div>

        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#949494] hover:text-[#E0E0E0] border border-white/10 hover:border-white/20 bg-[#141414] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
