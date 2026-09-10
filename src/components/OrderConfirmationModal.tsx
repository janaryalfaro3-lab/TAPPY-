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
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#0284c7', '#0d9488', '#16a34a', '#e11d48', '#d97706'],
        disableForReducedMotion: true,
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#0284c7', '#16a34a'],
          disableForReducedMotion: true,
        });
      }, 200);
    } catch {
      // Confetti fallback
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden my-8 p-6 md:p-8 space-y-6 text-slate-900">
        {/* Success Header with Confetti Trigger */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <button
              onClick={fireConfetti}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-90"
              title="Celebrate again!"
              aria-label="Trigger confetti animation"
            >
              <PartyPopper className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Order Confirmed!
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Thank you for your order. We have received your payment and are pre-programming your NFC hardware.
          </p>
        </div>

        {/* Unique Tracking Link Card & Notifications */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-700" />
              Unique Tracking Link
            </span>
            <span className="text-xs text-slate-500">Sent via Email & SMS</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={trackingUrl}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 truncate focus:outline-none shadow-2xs"
            />
            <button
              onClick={handleCopyTrackingLink}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">SMS sent to <strong className="text-slate-900">{order.customerInfo.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span className="truncate">Email sent to <strong className="text-slate-900">{order.customerInfo.email}</strong></span>
            </div>
          </div>
        </div>

        {/* Order Meta Pill */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs gap-3">
          <div>
            <span className="text-slate-500 block text-[11px] mb-0.5">Order ID</span>
            <span className="font-bold text-slate-900">{order.id}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] mb-0.5">Date</span>
            <span className="text-slate-800 font-medium">{order.createdAt}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] mb-0.5">Status</span>
            <span className="font-semibold text-amber-700">Processing & Encoding</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] mb-0.5">Payment</span>
            <span className="font-semibold text-slate-900 uppercase">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Pre-programmed business banner */}
        {(order.customerInfo.businessName || order.customerInfo.googleReviewUrlOrPlace) && (
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-sky-900">
              Google Review Pre-Programming:
            </div>
            <div>
              {order.customerInfo.businessName && <span><strong>Business:</strong> {order.customerInfo.businessName} &nbsp;</span>}
              {order.customerInfo.googleReviewUrlOrPlace && <span><strong>Link / Place:</strong> {order.customerInfo.googleReviewUrlOrPlace}</span>}
            </div>
          </div>
        )}

        {/* Items Purchased List */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Items Ordered
          </h3>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-0.5 shadow-2xs">
                    <div className="transform scale-40 origin-center">
                      <ProductMockup format={item.product.format} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{item.product.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.product.material} · Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="text-slate-900 font-bold text-xs">
                  ₱{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Customer & Shipping Destination */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5 mb-1">
              <Truck className="w-3.5 h-3.5 text-sky-700" />
              Shipping Destination
            </span>
            <p className="text-slate-900 font-bold">{order.customerInfo.fullName}</p>
            <p className="text-slate-600">{order.customerInfo.address}, {order.customerInfo.city}</p>
            <p className="text-slate-500">{order.customerInfo.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">₱{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">{order.shipping === 0 ? 'FREE' : `₱${order.shipping}`}</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-slate-700">Total Paid</span>
              <span className="text-slate-900 font-extrabold text-base">₱{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Social Share Prompt */}
        <div
          id="social-share-delivery-prompt"
          className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                Post-Delivery Spotlight
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Share Your Setup Once Your Order Arrives
              </h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 shadow-2xs">
              <Camera className="w-4 h-4 text-slate-600" />
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When your parcel arrives, tag our official social pages to get featured on our feed and receive a <strong className="text-slate-900 font-semibold">10% discount voucher</strong> for your next branch order!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <a
              href="https://www.facebook.com/profile.php?id=61593179006229"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group text-slate-700 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                  <Facebook className="w-3 h-3 fill-[#1877F2] text-[#1877F2]" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-900 leading-tight">Facebook</span>
                  <span className="block text-[10px] text-slate-500 leading-tight">TAPPY Official</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group text-slate-700 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C]">
                  <Instagram className="w-3 h-3 text-[#E1306C]" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-900 leading-tight">Instagram</span>
                  <span className="block text-[10px] text-slate-500 leading-tight">@tappy.ph</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group text-slate-700 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <Share2 className="w-3 h-3 text-slate-700" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-900 leading-tight">TikTok</span>
                  <span className="block text-[10px] text-slate-500 leading-tight">@tappynfc</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-600 font-medium">
              Official Hashtag: <strong className="text-slate-900">#TAPPY</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyHashtag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              {copiedTag ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied!</span>
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
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 bg-white rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
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
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <Truck className="w-4 h-4 text-sky-700" />
              <span>Track Order Live</span>
            </button>
          ) : onOpenOrderHistory ? (
            <button
              onClick={() => {
                onClose();
                onOpenOrderHistory();
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <Truck className="w-3.5 h-3.5 text-sky-700" />
              Track Order
            </button>
          ) : null}

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="w-full sm:flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <span>Continue to Store</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
