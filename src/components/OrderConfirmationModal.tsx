import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
  PartyPopper,
  Smartphone,
  Mail,
} from 'lucide-react';
import { Order } from '../types';
import { ProductMockup } from './ProductMockup';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
  onOpenOrderHistory?: () => void;
  onOpenTrackingPage?: (orderId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onContinueShopping,
  onOpenOrderHistory,
  onOpenTrackingPage,
}) => {
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fireConfetti = () => {
    try {
      // Main Center Firework
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f43f5e', '#fbbf24', '#a855f7'],
        disableForReducedMotion: true,
      });

      // Left Cannon
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.7 },
          colors: ['#38bdf8', '#34d399', '#fbbf24'],
          disableForReducedMotion: true,
        });
      }, 250);

      // Right Cannon
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.7 },
          colors: ['#818cf8', '#f43f5e', '#38bdf8'],
          disableForReducedMotion: true,
        });
      }, 450);
    } catch (e) {
      console.warn('Confetti animation failed:', e);
    }
  };

  // Trigger celebration on mount
  useEffect(() => {
    if (order) {
      fireConfetti();
    }
  }, [order]);

  if (!order) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tapreview.ph';
  const trackingUrl = order.trackingUrl || `${origin}/?track=${order.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHashtag = () => {
    navigator.clipboard?.writeText('#TAPPY');
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleCopyTrackingLink = () => {
    navigator.clipboard?.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-8 p-6 md:p-8 space-y-6 text-white ring-1 ring-white/10">
        {/* Success Header with Confetti Trigger */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-7 h-7" />
            </div>
            <button
              onClick={fireConfetti}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-800 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-slate-700 transition-colors shadow-md cursor-pointer active:scale-90"
              title="Celebrate again!"
              aria-label="Trigger confetti animation"
            >
              <PartyPopper className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Order Confirmed! 🎉
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed tracking-wide">
            Thank you for your order. We have received your payment and are pre-programming your hardware.
          </p>
        </div>

        {/* Unique Tracking Link Card & Automated Notifications */}
        <div className="p-4 bg-slate-950/90 border border-sky-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Unique Tracking Link:
            </span>
            <span className="text-[10px] font-mono text-slate-400">Sent via Email & SMS</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={trackingUrl}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopyTrackingLink}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Automated Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">SMS sent to <strong className="text-white">{order.customerInfo.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">Email sent to <strong className="text-white">{order.customerInfo.email}</strong></span>
            </div>
          </div>
        </div>

        {/* Order Meta Pill */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-semibold">Order ID</span>
            <span className="font-bold text-sky-400">{order.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-semibold">Date</span>
            <span className="text-slate-200 font-medium">{order.createdAt}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-semibold">Status Stage</span>
            <span className="font-bold text-amber-400 uppercase">Processing & Encoding</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-semibold">Payment</span>
            <span className="font-bold text-slate-200 uppercase">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Pre-programmed business banner */}
        {(order.customerInfo.businessName || order.customerInfo.googleReviewUrlOrPlace) && (
          <div className="p-3.5 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-xs font-mono text-slate-200 space-y-1">
            <div className="font-bold text-[10px] uppercase tracking-wider text-sky-400">
              Google Review Setup:
            </div>
            <div className="text-slate-300 text-xs">
              {order.customerInfo.businessName && <span><strong>Business:</strong> {order.customerInfo.businessName} &nbsp;</span>}
              {order.customerInfo.googleReviewUrlOrPlace && <span><strong>Link / Place:</strong> {order.customerInfo.googleReviewUrlOrPlace}</span>}
            </div>
          </div>
        )}

        {/* Items Purchased List */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-300">
            Items Ordered
          </h3>
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                    <div className="transform scale-40 origin-center">
                      <ProductMockup format={item.product.format} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{item.product.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.product.material} · Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-white font-bold text-xs">
                  ₱{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Customer & Shipping Destination */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-white text-[10px] flex items-center gap-1.5 mb-1">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              Shipping Destination
            </span>
            <p className="text-white font-bold">{order.customerInfo.fullName}</p>
            <p className="text-slate-300 text-[11px]">{order.customerInfo.address}, {order.customerInfo.city}</p>
            <p className="text-slate-400 text-[11px]">{order.customerInfo.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Subtotal</span>
                <span className="text-white font-bold">₱{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Shipping</span>
                <span className="font-bold text-white">{order.shipping === 0 ? 'FREE' : `₱${order.shipping}`}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Paid</span>
              <span className="text-white font-extrabold text-base">₱{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Social Media Share Prompt */}
        <div
          id="social-share-delivery-prompt"
          className="bg-slate-950/80 text-white border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Post-Delivery Spotlight
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                Share Your Setup Once Your Order Arrives!
              </h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
              <Camera className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When your parcel is delivered, snap a quick photo or video of your NFC stand, card, or sticker on your counter or table. Tag our official social pages to get featured on our feed and receive a <strong className="text-white font-semibold">10% discount voucher</strong> for your next branch order!
          </p>

          {/* Social Links & Hashtag Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Facebook Official */}
            <a
              href="https://www.facebook.com/profile.php?id=61593179006229"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group text-slate-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2]">
                  <Facebook className="w-3.5 h-3.5 fill-[#1877F2] text-[#1877F2]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white leading-tight">Facebook</span>
                  <span className="block text-[10px] text-slate-400 font-mono leading-tight">TAPPY Official</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group text-slate-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white leading-tight">Instagram</span>
                  <span className="block text-[10px] text-slate-400 font-mono leading-tight">@tappy.ph</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </a>

            {/* TikTok / Official Channel */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group text-slate-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-white">
                  <Share2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white leading-tight">TikTok</span>
                  <span className="block text-[10px] text-slate-400 font-mono leading-tight">@tappynfc</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </a>
          </div>

          {/* Hashtag Copy & Callout */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">
              Official Hashtag: <strong className="text-white font-mono">#TAPPY</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyHashtag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-[11px] font-mono font-bold transition-colors cursor-pointer active:scale-95"
            >
              {copiedTag ? (
                <>
                  <Check className="w-3 h-3 text-slate-950" />
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
            className="w-full sm:w-auto px-4 py-3 text-[11px] uppercase tracking-[0.14em] font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 bg-slate-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Print Receipt
          </button>

          {onOpenTrackingPage ? (
            <button
              onClick={() => {
                onClose();
                onOpenTrackingPage(order.id);
              }}
              className="w-full sm:w-auto px-5 py-3 text-[11px] uppercase tracking-[0.14em] font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-sky-500/20"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Track Order Live</span>
            </button>
          ) : onOpenOrderHistory ? (
            <button
              onClick={() => {
                onClose();
                onOpenOrderHistory();
              }}
              className="w-full sm:w-auto px-4 py-3 text-[11px] uppercase tracking-[0.14em] font-bold text-sky-300 hover:text-white border border-sky-500/40 hover:border-sky-400 bg-sky-950/40 hover:bg-sky-900/50 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              Track Order
            </button>
          ) : null}

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="w-full sm:flex-1 py-3.5 text-[11px] uppercase tracking-[0.14em] font-extrabold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl"
          >
            <span>Continue to Store</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
