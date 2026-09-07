import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  PackageCheck,
  Search,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, ORDERS_COLLECTION, getFirestoreOrderByOrderId } from '../services/firebaseService';
import { Order, OrderStatus } from '../types';
import { ProductMockup } from './ProductMockup';

interface OrderTrackingPageProps {
  orderId?: string;
  onBackToStore: () => void;
  onOpenChatWithOrder?: (orderId: string) => void;
}

interface StageStep {
  id: 'pending' | 'processing' | 'in_production' | 'shipped' | 'delivered';
  title: string;
  subtitle: string;
  description: string;
}

const STAGES: StageStep[] = [
  {
    id: 'pending',
    title: 'Order Placed',
    subtitle: 'Payment Confirmed & Queued',
    description: 'Payment verified successfully. Order entered into encoding schedule.',
  },
  {
    id: 'processing',
    title: 'Processing',
    subtitle: 'NFC Chip Encoding',
    description: 'NTAG213 microchip pre-programmed with your business Google Review URL.',
  },
  {
    id: 'in_production',
    title: 'In Production',
    subtitle: 'Hardware Assembly & Quality Audit',
    description: 'Laser assembly, anti-scratch surface inspection & 100% tap verification.',
  },
  {
    id: 'shipped',
    title: 'Shipped',
    subtitle: 'In-Transit via Courier (J&T Express)',
    description: 'Parcel dispatched to courier hub. Live tracking active with delivery driver.',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    subtitle: 'Delivered to Business Counter',
    description: 'Package delivered and received. Ready for instant customer review tapping.',
  },
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId: initialOrderId,
  onBackToStore,
  onOpenChatWithOrder,
}) => {
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [currentOrderId, setCurrentOrderId] = useState(initialOrderId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [firestoreDocId, setFirestoreDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Normalize order stage
  const getStageIndex = (status?: string | OrderStatus): number => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'in_production':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  // Fetch order data from Firestore or local storage
  const loadOrder = async (id: string) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Try fetching directly from Firestore
      const fsData = await getFirestoreOrderByOrderId(cleanId);
      if (fsData) {
        setFirestoreDocId(fsData.docId);
        setOrder({
          id: fsData.orderId || cleanId,
          createdAt: fsData.createdAt || 'Recent',
          items: (fsData.items || []).map((item: any) => ({
            product: {
              id: item.productId || 'p1',
              name: item.productName || 'NFC Hardware',
              tagline: 'Google Review Hardware',
              description: '',
              size: 'Standard',
              material: item.material || 'Premium Finish',
              chipType: 'NTAG213',
              format: item.format || 'stand',
              features: [],
              price: item.price || 0,
              image: '',
              idealFor: 'Business Counters',
            },
            quantity: item.quantity || 1,
            businessName: item.businessName || '',
            customGoogleLink: item.customGoogleLink || '',
          })),
          subtotal: fsData.subtotal || 0,
          shipping: fsData.shipping || 0,
          total: fsData.total || 0,
          paymentMethod: fsData.paymentMethod || 'gcash',
          customerInfo: fsData.customerInfo || {
            fullName: 'Customer',
            email: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            businessName: '',
            googleReviewUrlOrPlace: '',
          },
          status: (fsData.status || 'processing') as OrderStatus,
          estimatedDelivery: fsData.estimatedDelivery || '2–4 Business Days',
          trackingNumber: fsData.trackingNumber || `JT-PH-${cleanId.replace('TR-', '')}`,
          courier: fsData.courier || 'J&T Express Philippines',
          trackingUrl: fsData.trackingUrl,
          smsNotification: fsData.smsNotification || {
            sent: true,
            recipient: fsData.customerInfo?.phone || '',
            status: 'DELIVERED_MOCK',
          },
        });
        setLoading(false);
        return;
      }

      // 2. Fallback to localStorage saved orders
      const stored = localStorage.getItem('tapreviewnfc_order_history');
      if (stored) {
        const localList: Order[] = JSON.parse(stored);
        const found = localList.find((o) => o.id.toUpperCase() === cleanId);
        if (found) {
          setOrder(found);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback demo order if user enters demo ID or order not found in mock
      if (cleanId.startsWith('TR-')) {
        setError(`Order #${cleanId} was not found in active database records. Please double-check the Order ID sent to your email and SMS.`);
      } else {
        setError(`Please enter a valid TAPPY Order ID (e.g., TR-123456).`);
      }
      setOrder(null);
    } catch (err: any) {
      console.error('Error fetching tracking order:', err);
      setError('Could not retrieve tracking details right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      setCurrentOrderId(initialOrderId);
      loadOrder(initialOrderId);
    }
  }, [initialOrderId]);

  // Real-time Firestore subscription if docId is known
  useEffect(() => {
    if (!firestoreDocId) return;

    const unsub = onSnapshot(doc(db, ORDERS_COLLECTION, firestoreDocId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status) {
          setOrder((prev) => (prev ? { ...prev, status: data.status as OrderStatus } : null));
        }
      }
    });

    return () => unsub();
  }, [firestoreDocId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const formatted = searchId.trim().toUpperCase();
    setCurrentOrderId(formatted);

    // Update browser URL quietly without reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('track', formatted);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}

    loadOrder(formatted);
  };

  const getTrackingShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tapreview.ph';
    return `${origin}/?track=${order?.id || currentOrderId}`;
  };

  const handleCopyLink = () => {
    const url = getTrackingShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const activeStageIdx = order ? getStageIndex(order.status) : 1;
  const activeStageObj = STAGES[activeStageIdx] || STAGES[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Tracking Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-white text-sm tracking-tight">
              TAPPY<span className="text-sky-400">.</span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded-md">
              Order Tracker
            </span>
          </div>
        </div>

        {/* Live Search Input in Navbar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2 max-w-xs w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track Order ID (TR-XXXXXX)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono cursor-pointer transition-all"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Track'}
          </button>
        </form>
      </header>

      {/* Main Tracker Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Mobile Search Bar */}
        <div className="sm:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. TR-123456)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Track'}
            </button>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
            <p className="text-sm font-mono text-slate-300">Retrieving real-time order & courier telemetry...</p>
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-rose-500/30 space-y-4 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Order Record Not Found</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-xs">
              <button
                onClick={onBackToStore}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
              >
                Back to Storefront
              </button>
              {onOpenChatWithOrder && (
                <button
                  onClick={() => onOpenChatWithOrder(searchId)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer"
                >
                  Ask Chatbot for Help
                </button>
              )}
            </div>
          </div>
        )}

        {/* Order Details & Live Visual Stage Timeline */}
        {!loading && order && (
          <div className="space-y-6">
            {/* Header Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                      Tracking Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      {activeStageObj.title} — {activeStageObj.subtitle}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      Real-time Firestore Sync
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Order #{order.id}
                    </h1>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrderId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-mono flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Placed on: <strong className="text-white">{order.createdAt}</strong></span>
                    <span>•</span>
                    <span>Est. Delivery: <strong className="text-white">{order.estimatedDelivery}</strong></span>
                    <span>•</span>
                    <span>Courier: <strong className="text-white">{order.courier || 'J&T Express'}</strong></span>
                  </p>
                </div>

                {/* Unique Shareable Tracking Link Pill Box */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      Unique Tracking Link:
                    </span>
                    <span className="text-[10px] text-slate-500">Email & SMS Link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getTrackingShareUrl()}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono truncate focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
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
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Bookmark or open this unique link on any device to view live order milestones anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Automated Dispatch Notification Badges (Email & Mock SMS Confirmation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email Notification Confirmation */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3 text-xs font-mono">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Email Confirmation Sent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Receipt & tracking link forwarded to <span className="text-slate-200 font-medium">{order.customerInfo.email}</span>
                  </p>
                </div>
              </div>

              {/* Automated Mock SMS Confirmation */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3 text-xs font-mono">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Automated SMS Dispatched</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] border border-emerald-500/40">Mock Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    SMS milestone updates dispatched to <span className="text-slate-200 font-medium">{order.customerInfo.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 5-Stage Visual Progress Rail (Processing, In Production, Shipped, Delivered) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">
                  Fulfillment & Delivery Milestones
                </h2>
                <span className="text-xs font-mono text-sky-400 font-semibold">
                  Stage {activeStageIdx + 1} of {STAGES.length}
                </span>
              </div>

              {/* Step Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                {STAGES.map((stage, idx) => {
                  const isCompleted = idx < activeStageIdx;
                  const isCurrent = idx === activeStageIdx;
                  const isPending = idx > activeStageIdx;

                  return (
                    <div
                      key={stage.id}
                      className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-2 ${
                        isCurrent
                          ? 'bg-sky-950/40 border-sky-500/60 ring-1 ring-sky-500/40 shadow-lg shadow-sky-500/10'
                          : isCompleted
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                          : 'bg-slate-950/30 border-slate-800/40 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                            isCurrent
                              ? 'bg-sky-500 text-slate-950 shadow-md'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono font-bold text-sky-400 animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 pt-1">
                        <h4
                          className={`text-sm font-bold tracking-tight ${
                            isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {stage.title}
                        </h4>
                        <p
                          className={`text-[11px] font-mono leading-tight ${
                            isCurrent ? 'text-sky-300' : isCompleted ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {stage.subtitle}
                        </p>
                      </div>

                      <p
                        className={`text-[10px] leading-relaxed pt-1 border-t ${
                          isCurrent
                            ? 'text-slate-300 border-sky-800/40'
                            : 'text-slate-500 border-slate-800/60'
                        }`}
                      >
                        {stage.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Waybill / Courier Telemetry Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                      Express Courier Partner
                    </span>
                    <span className="font-bold text-white">
                      {order.courier || 'J&T Express Philippines'} · Waybill: <strong className="text-sky-400">{order.trackingNumber || `JT-PH-${order.id.replace('TR-', '')}`}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {onOpenChatWithOrder && (
                    <button
                      onClick={() => onOpenChatWithOrder(order.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Ask Chatbot</span>
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Column Details Grid: Order Items & Customer / Destination */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items Ordered (2 Cols) */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">
                    Hardware In Production / Shipped
                  </h3>

                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                            <div className="transform scale-50 origin-center">
                              <ProductMockup format={item.product.format} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{item.product.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Format: <strong className="text-slate-300">{item.product.format?.toUpperCase()}</strong> · Qty: {item.quantity} · NTAG213 Microchip
                            </div>
                            {item.businessName && (
                              <div className="text-[11px] text-sky-400 font-mono pt-0.5">
                                Pre-programmed for: {item.businessName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="font-mono text-white font-bold text-sm text-right">
                          ₱{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Google Review URL info */}
                  {(order.customerInfo.businessName || order.customerInfo.googleReviewUrlOrPlace) && (
                    <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs font-mono space-y-1">
                      <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                        Google Review Pre-Programming Status:
                      </div>
                      <div className="text-slate-300">
                        {order.customerInfo.businessName && (
                          <p>Business Name: <strong className="text-white">{order.customerInfo.businessName}</strong></p>
                        )}
                        {order.customerInfo.googleReviewUrlOrPlace && (
                          <p className="truncate">
                            Link / Map Place: <strong className="text-white">{order.customerInfo.googleReviewUrlOrPlace}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer & Payment Breakdown (1 Col) */}
              <div className="space-y-4">
                {/* Shipping Destination */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-[11px]">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>Shipping Destination</span>
                  </div>
                  <div className="space-y-1 text-slate-300 border-t border-slate-800 pt-3">
                    <p className="text-white font-bold text-sm">{order.customerInfo.fullName}</p>
                    <p className="text-slate-400">{order.customerInfo.address}</p>
                    <p className="text-slate-400">{order.customerInfo.city} {order.customerInfo.postalCode}</p>
                    <p className="text-sky-300 pt-1">Phone: {order.customerInfo.phone}</p>
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3 font-mono text-xs">
                  <h3 className="text-slate-400 font-bold uppercase text-[11px]">
                    Payment Summary
                  </h3>
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-white font-bold">₱{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shipping</span>
                      <span className="font-bold text-white">{order.shipping === 0 ? 'FREE' : `₱${order.shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Method</span>
                      <span className="uppercase text-slate-200 font-bold">{order.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div className="h-px bg-slate-800 my-1" />
                    <div className="flex justify-between items-baseline text-white">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Total Paid</span>
                      <span className="text-xl font-black text-white">₱{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
