import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle,
  Search,
  Copy,
  Check,
  ArrowLeft,
  MessageSquare,
  Smartphone,
  Mail,
  MapPin,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Printer,
  Clock,
  PackageCheck,
  Cpu,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, ORDERS_COLLECTION, getFirestoreOrderByOrderId } from '../services/firebaseService';
import { Order, OrderStatus } from '../types';
import { ProductMockup } from './ProductMockup';
import { ProgressiveImage } from './ProgressiveImage';
import { Logo } from './Logo';

interface OrderTrackingPageProps {
  orderId?: string;
  onBackToStore: () => void;
  onOpenChatWithOrder?: (orderId: string) => void;
}

interface StageStep {
  id: 'pending' | 'processing' | 'in_production' | 'shipped' | 'delivered';
  title: string;
  label: string; // concise badge for quick scan
  subtitle: string;
  description: string;
  location: string;
  icon: 'placed' | 'processing' | 'production' | 'transit' | 'delivered';
}

const STAGES: StageStep[] = [
  {
    id: 'pending',
    title: 'Order Placed',
    label: 'Placed',
    subtitle: 'Payment Verified & Logged',
    description: 'Order confirmed and registered in production schedule.',
    location: 'System Center · Manila',
    icon: 'placed',
  },
  {
    id: 'processing',
    title: 'Processing',
    label: 'Processing',
    subtitle: 'NFC Microchip Pre-Encoding',
    description: 'NTAG213 contactless chip programmed with your business Google Review link.',
    location: 'Encoding Lab · Ortigas, Pasig',
    icon: 'processing',
  },
  {
    id: 'in_production',
    title: 'In Production',
    label: 'Production',
    subtitle: 'Precision Assembly & Quality Audit',
    description: 'Anti-scratch surface polishing, UV alignment & 100% tap verification.',
    location: 'Fabrication Facility · QC, Manila',
    icon: 'production',
  },
  {
    id: 'shipped',
    title: 'In Transit',
    label: 'In Transit',
    subtitle: 'Handed to Express Courier',
    description: 'Dispatched via express logistics. In transit to destination storefront.',
    location: 'Express Logistics Hub · Metro Manila',
    icon: 'transit',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    label: 'Delivered',
    subtitle: 'Arrived at Storefront / Office',
    description: 'Package received and ready for instant contactless customer reviews.',
    location: 'Merchant Address · Final Delivery',
    icon: 'delivered',
  },
];

const getStageIndex = (status: OrderStatus): number => {
  switch (status) {
    case 'pending':
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

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId: initialOrderId,
  onBackToStore,
  onOpenChatWithOrder,
}) => {
  const [currentOrderId, setCurrentOrderId] = useState<string>(initialOrderId || '');
  const [searchId, setSearchId] = useState<string>(initialOrderId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [simulatedStatus, setSimulatedStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  useEffect(() => {
    if (!currentOrderId) {
      const stored = localStorage.getItem('last_order');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Order;
          if (parsed && parsed.id) {
            setCurrentOrderId(parsed.id);
            setSearchId(parsed.id);
            setOrder(parsed);
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
      setError('Please provide an order number to track.');
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const orderRef = doc(db, ORDERS_COLLECTION, currentOrderId);
        unsubscribe = onSnapshot(
          orderRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as Order;
              setOrder({ ...data, id: snapshot.id });
              setLoading(false);
            } else {
              getFirestoreOrderByOrderId(currentOrderId)
                .then((docOrder) => {
                  if (docOrder) {
                    setOrder(docOrder);
                  } else {
                    const localOrdersStr = localStorage.getItem('tappy_orders');
                    if (localOrdersStr) {
                      try {
                        const localOrders = JSON.parse(localOrdersStr) as Order[];
                        const matched = localOrders.find((o) => o.id === currentOrderId);
                        if (matched) {
                          setOrder(matched);
                          setLoading(false);
                          return;
                        }
                      } catch {
                        // ignore
                      }
                    }
                    setError(`No order found with ID "${currentOrderId}". Please verify your order number.`);
                  }
                  setLoading(false);
                })
                .catch(() => {
                  setError(`Could not fetch order with ID "${currentOrderId}".`);
                  setLoading(false);
                });
            }
          },
          () => {
            getFirestoreOrderByOrderId(currentOrderId)
              .then((docOrder) => {
                if (docOrder) {
                  setOrder(docOrder);
                } else {
                  setError(`Order "${currentOrderId}" not found.`);
                }
                setLoading(false);
              })
              .catch(() => {
                setError(`Could not connect to tracking database.`);
                setLoading(false);
              });
          }
        );
      } catch {
        setError('Error initializing tracking connection.');
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setSimulatedStatus(null);
    setCurrentOrderId(searchId.trim());
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

  const effectiveStatus: OrderStatus = simulatedStatus || (order ? order.status : 'processing');
  const activeStageIdx = getStageIndex(effectiveStatus);
  const activeStageObj = STAGES[activeStageIdx] || STAGES[1];

  // Progress percentage for visual connection track
  const progressPercent = Math.min(100, Math.max(0, (activeStageIdx / (STAGES.length - 1)) * 100));

  const renderStageIcon = (icon: StageStep['icon'], isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <Check className="w-4 h-4 text-white" strokeWidth={3} />;
    }

    switch (icon) {
      case 'placed':
        return <PackageCheck className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'processing':
        return <Cpu className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'production':
        return <Layers className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'transit':
        return <Truck className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      case 'delivered':
        return <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />;
      default:
        return <Check className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Tracking Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Order Tracker
            </span>
          </div>
        </div>

        {/* Live Search Form */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2 max-w-xs w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Order ID (TR-XXXXXX)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
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
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-2xs"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Track'}
            </button>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Retrieving real-time order status...</p>
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-white border border-rose-200 space-y-4 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Order Record Not Found</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold">
              <button
                onClick={onBackToStore}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
              >
                Back to Storefront
              </button>
              {onOpenChatWithOrder && (
                <button
                  onClick={() => onOpenChatWithOrder(searchId)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  Ask Support
                </button>
              )}
            </div>
          </div>
        )}

        {/* Order Details & Timeline */}
        {!loading && order && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Tracking Status:
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600" />
                      </span>
                      {activeStageObj.title} — {activeStageObj.subtitle}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Live Verified
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Order #{order.id}
                    </h1>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Placed on: <strong className="text-slate-800">{order.createdAt}</strong></span>
                    <span>•</span>
                    <span>Est. Delivery: <strong className="text-slate-800">{order.estimatedDelivery}</strong></span>
                    <span>•</span>
                    <span>Courier: <strong className="text-slate-800">{order.courier || 'J&T Express'}</strong></span>
                  </p>
                </div>

                {/* Shareable Link Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md w-full space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      Shareable Tracking Link:
                    </span>
                    <span className="text-[11px] text-slate-500">Live Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getTrackingShareUrl()}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 truncate focus:outline-none shadow-2xs"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
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
                </div>
              </div>

              {/* Interactive Stage Preview Toolbar */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Simulate Milestone:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {STAGES.map((s) => {
                      const isSelected = effectiveStatus === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSimulatedStatus(s.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {simulatedStatus && (
                  <button
                    type="button"
                    onClick={() => setSimulatedStatus(null)}
                    className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
                  >
                    Reset to Real Status
                  </button>
                )}
              </div>
            </div>

            {/* Notification Status Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Email Confirmation Sent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    Receipt & tracking link sent to <span className="text-slate-800 font-medium">{order.customerInfo.email}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Courier SMS Updates Active</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    Dispatch notifications enabled for <span className="text-slate-800 font-medium">{order.customerInfo.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ENHANCED VISUAL PROGRESS TIMELINE */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>Visual Fulfillment & Delivery Progress</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live updates across processing, fabrication, dispatch, and final storefront arrival.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                  Milestone {activeStageIdx + 1} of {STAGES.length}: {activeStageObj.title}
                </span>
              </div>

              {/* Connected Visual Progress Rail (Desktop / Tablet) */}
              <div className="hidden md:block relative py-6">
                {/* Background Connecting Rail Track */}
                <div className="absolute top-[36px] left-[5%] right-[5%] h-1.5 bg-slate-100 rounded-full z-0" />

                {/* Animated Gradient Active Fill Track */}
                <div
                  className="absolute top-[36px] left-[5%] h-1.5 bg-linear-to-r from-emerald-500 via-sky-500 to-sky-600 rounded-full z-0 transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercent * 0.9}%` }}
                />

                {/* 5 Milestone Step Nodes */}
                <div className="relative z-10 grid grid-cols-5 gap-2 text-center">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx < activeStageIdx;
                    const isCurrent = idx === activeStageIdx;
                    const isUpcoming = idx > activeStageIdx;

                    return (
                      <div
                        key={stage.id}
                        className="flex flex-col items-center group cursor-pointer"
                        onClick={() => setSimulatedStatus(stage.id)}
                      >
                        {/* Node Bubble with Status Icons */}
                        <div className="relative">
                          {isCurrent && (
                            <div className="absolute -inset-2 rounded-full bg-sky-400/20 animate-ping z-0" />
                          )}

                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 shadow-xs ${
                              isCompleted
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                : isCurrent
                                ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-110'
                                : 'bg-white text-slate-400 border-2 border-slate-200'
                            }`}
                          >
                            {renderStageIcon(stage.icon, isCompleted, isCurrent)}
                          </div>

                          {isCurrent && (
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-wider font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-full shadow-2xs">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Text Details */}
                        <div className="mt-7 space-y-1 px-1">
                          <h4
                            className={`text-xs font-bold tracking-tight ${
                              isCurrent
                                ? 'text-sky-800 font-extrabold'
                                : isCompleted
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage.title}
                          </h4>
                          <p
                            className={`text-[11px] leading-tight line-clamp-2 ${
                              isCurrent
                                ? 'text-slate-700 font-medium'
                                : isCompleted
                                ? 'text-slate-500'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Visual Timeline Cards Grid (All devices) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {STAGES.map((stage, idx) => {
                  const isCompleted = idx < activeStageIdx;
                  const isCurrent = idx === activeStageIdx;
                  const isUpcoming = idx > activeStageIdx;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => setSimulatedStatus(stage.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer ${
                        isCurrent
                          ? 'bg-sky-50/70 border-sky-300 shadow-sm ring-2 ring-sky-500/20'
                          : isCompleted
                          ? 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300'
                          : 'bg-white border-slate-100 text-slate-400 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isCurrent
                              ? 'bg-sky-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            idx + 1
                          )}
                        </span>

                        {isCurrent ? (
                          <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
                            Active Step
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4
                          className={`text-sm font-bold tracking-tight ${
                            isCurrent
                              ? 'text-slate-900'
                              : isCompleted
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.title}
                        </h4>
                        <p
                          className={`text-[11px] leading-tight font-medium ${
                            isCurrent
                              ? 'text-sky-800'
                              : isCompleted
                              ? 'text-slate-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.subtitle}
                        </p>
                      </div>

                      <p
                        className={`text-[11px] leading-relaxed pt-2 border-t ${
                          isCurrent
                            ? 'text-slate-600 border-sky-200'
                            : 'text-slate-500 border-slate-200'
                        }`}
                      >
                        {stage.description}
                      </p>

                      <div className="pt-1 text-[10px] text-slate-400 font-mono truncate">
                        📍 {stage.location}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Waybill / Courier Telemetry Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase text-slate-500 font-semibold block">
                      Express Courier Partner & Real-Time Air Waybill
                    </span>
                    <span className="font-bold text-slate-900">
                      {order.courier || 'J&T Express Philippines'} · Waybill:{' '}
                      <strong className="text-sky-700 font-mono">
                        {order.trackingNumber || `JT-PH-${order.id.replace('TR-', '')}`}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {onOpenChatWithOrder && (
                    <button
                      onClick={() => onOpenChatWithOrder(order.id)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                      <span>Ask Support</span>
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Column Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items Ordered with Progressive Images (2 Cols) */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-600">
                      Hardware Units in Order
                    </h3>
                    <span className="text-xs text-slate-500">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} Items Total
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Product Image Stage */}
                          <div className="w-14 h-14 bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-inner">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                loading="eager"
                                decoding="sync"
                                className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="transform scale-50 origin-center">
                                  <ProductMockup format={item.product.format} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm truncate">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              Format: <strong className="text-slate-700">{item.product.format?.toUpperCase()}</strong> · Qty: {item.quantity} · NTAG213 Microchip
                            </div>
                            {item.businessName && (
                              <div className="text-xs text-sky-700 font-medium pt-0.5 truncate">
                                Pre-programmed for: {item.businessName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-slate-900 font-bold text-sm text-right shrink-0">
                          ₱{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Google Review URL info */}
                  {(order.customerInfo.businessName || order.customerInfo.googleReviewUrlOrPlace) && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="text-[11px] uppercase font-bold text-sky-800 tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                        <span>Google Review Pre-Programming Status:</span>
                      </div>
                      <div className="text-slate-600 space-y-0.5">
                        {order.customerInfo.businessName && (
                          <p>
                            Business Name: <strong className="text-slate-900">{order.customerInfo.businessName}</strong>
                          </p>
                        )}
                        {order.customerInfo.googleReviewUrlOrPlace && (
                          <p className="truncate">
                            Link / Map Place:{' '}
                            <strong className="text-slate-900">{order.customerInfo.googleReviewUrlOrPlace}</strong>
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
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold uppercase text-[11px]">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>Shipping Destination</span>
                  </div>
                  <div className="space-y-1 text-slate-600 border-t border-slate-200 pt-3">
                    <p className="text-slate-900 font-bold text-sm">{order.customerInfo.fullName}</p>
                    <p className="text-slate-500">{order.customerInfo.address}</p>
                    <p className="text-slate-500">
                      {order.customerInfo.city} {order.customerInfo.postalCode}
                    </p>
                    <p className="text-slate-700 pt-1 font-medium">Phone: {order.customerInfo.phone}</p>
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                  <h3 className="text-slate-600 font-bold uppercase text-[11px]">
                    Payment Summary
                  </h3>
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="text-slate-900 font-bold">₱{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Shipping</span>
                      <span className="font-bold text-slate-900">
                        {order.shipping === 0 ? 'FREE' : `₱${order.shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Method</span>
                      <span className="uppercase text-slate-800 font-semibold">
                        {order.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="h-px bg-slate-200 my-1" />
                    <div className="flex justify-between items-baseline text-slate-900">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
                        Total Paid
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        ₱{order.total.toLocaleString()}
                      </span>
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
