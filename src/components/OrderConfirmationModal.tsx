import React, { useState } from 'react';
import {
  CheckCircle,
  Download,
  Truck,
  ArrowRight,
  Share2,
  Instagram,
  Facebook,
  Camera,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Order } from '../types';
import { ProductMockup } from './ProductMockup';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  const [copiedTag, setCopiedTag] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHashtag = () => {
    navigator.clipboard?.writeText('#TapReviewNFC');
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#050505]/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0E0E0E] border border-white/10 shadow-2xl overflow-hidden my-8 p-6 md:p-8 space-y-6 text-[#E0E0E0]">
        {/* Success Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-12 h-12 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#E0E0E0] tracking-tight">
            Order Confirmed
          </h2>
          <p className="text-[#949494] text-xs sm:text-sm max-w-md mx-auto leading-relaxed tracking-wide">
            Thank you for your order. We have received your payment and are preparing your hardware.
          </p>
        </div>

        {/* Order Meta Pill */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-[#080808] border border-white/10 text-xs font-mono">
          <div>
            <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">Order ID</span>
            <span className="font-bold text-[#2DD4BF]">{order.id}</span>
          </div>
          <div>
            <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">Date</span>
            <span className="text-[#E0E0E0]">{order.createdAt}</span>
          </div>
          <div>
            <span className="text-[#949494] block text-[10px] uppercase tracking-wider mb-0.5">Payment</span>
            <span className="font-semibold text-[#E0E0E0] uppercase">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Pre-programmed business banner */}
        {(order.customerInfo.businessName || order.customerInfo.googleReviewUrlOrPlace) && (
          <div className="p-3.5 bg-[#141414] border border-white/10 text-xs font-mono text-[#E0E0E0] space-y-1">
            <div className="font-medium text-[10px] uppercase tracking-wider text-[#2DD4BF]">
              Google Review Setup:
            </div>
            <div className="text-[#949494] text-xs">
              {order.customerInfo.businessName && <span><strong>Business:</strong> {order.customerInfo.businessName} &nbsp;</span>}
              {order.customerInfo.googleReviewUrlOrPlace && <span><strong>Link / Place:</strong> {order.customerInfo.googleReviewUrlOrPlace}</span>}
            </div>
          </div>
        )}

        {/* Items Purchased List */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#949494]">
            Items Ordered
          </h3>
          <div className="divide-y divide-white/5 border border-white/10 bg-[#080808]">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#050505] border border-white/5 overflow-hidden flex items-center justify-center p-0.5">
                    <div className="transform scale-40 origin-center">
                      <ProductMockup format={item.product.format} />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#E0E0E0] text-xs">{item.product.name}</div>
                    <div className="text-[11px] text-[#949494] font-mono">
                      {item.product.material} · Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[#E0E0E0] font-semibold text-xs">
                  ₱{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Customer & Shipping Destination */}
          <div className="p-4 bg-[#080808] border border-white/10 space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[#E0E0E0] text-[10px] flex items-center gap-1.5 mb-1">
              <Truck className="w-3.5 h-3.5 text-[#2DD4BF]" />
              Shipping Destination
            </span>
            <p className="text-[#E0E0E0] font-medium">{order.customerInfo.fullName}</p>
            <p className="text-[#949494] text-[11px]">{order.customerInfo.address}, {order.customerInfo.city}</p>
            <p className="text-[#949494] text-[11px]">{order.customerInfo.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-[#080808] border border-white/10 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#949494] text-[11px]">
                <span>Subtotal</span>
                <span>₱{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#949494] text-[11px]">
                <span>Shipping</span>
                <span className="font-medium">{order.shipping === 0 ? 'FREE' : `₱${order.shipping}`}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-wider text-[#949494]">Total Paid</span>
              <span className="text-[#E0E0E0] font-bold text-base">₱{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Social Media Share Prompt (Feature with crisp white background) */}
        <div
          id="social-share-delivery-prompt"
          className="bg-white text-zinc-900 border border-zinc-200 rounded-lg p-5 sm:p-6 shadow-xl space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-mono uppercase font-bold tracking-wider">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Post-Delivery Spotlight
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                Share Your Setup Once Your Order Arrives!
              </h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-700">
              <Camera className="w-4 h-4 text-zinc-700" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            When your parcel is delivered, snap a quick photo or video of your NFC stand, card, or sticker on your counter or table. Tag our official social pages to get featured on our feed and receive a <strong className="text-zinc-900 font-semibold">10% discount voucher</strong> for your next branch order!
          </p>

          {/* Social Links & Hashtag Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors group text-zinc-800"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                  <Facebook className="w-3.5 h-3.5 fill-[#1877F2] text-[#1877F2]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-900 leading-tight">Facebook</span>
                  <span className="block text-[10px] text-zinc-500 font-mono leading-tight">@tapreviewnfc.ph</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors group text-zinc-800"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C]">
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-900 leading-tight">Instagram</span>
                  <span className="block text-[10px] text-zinc-500 font-mono leading-tight">@tapreviewnfc</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
            </a>

            {/* TikTok / Official Channel */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors group text-zinc-800"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-900/10 flex items-center justify-center text-zinc-900">
                  <Share2 className="w-3.5 h-3.5 text-zinc-900" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-900 leading-tight">TikTok</span>
                  <span className="block text-[10px] text-zinc-500 font-mono leading-tight">@tapreviewnfc</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
            </a>
          </div>

          {/* Hashtag Copy & Callout */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100">
            <span className="text-[11px] text-zinc-500 font-medium">
              Official Hashtag: <strong className="text-zinc-900 font-mono">#TapReviewNFC</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyHashtag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-mono font-medium transition-colors cursor-pointer active:scale-95"
            >
              {copiedTag ? (
                <>
                  <Check className="w-3 h-3 text-teal-300" />
                  <span>Hashtag Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Tag</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#949494] hover:text-[#E0E0E0] border border-white/10 hover:border-white/20 bg-[#141414] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Print Receipt
          </button>

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="w-full sm:flex-1 py-3.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#050505] bg-[#E0E0E0] hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Continue to Store</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#050505]" />
          </button>
        </div>
      </div>
    </div>
  );
};

