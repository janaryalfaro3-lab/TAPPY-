import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  X,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  Search,
  Trash2,
  Sparkles,
  ShoppingBag,
  Smartphone,
  Zap,
  CreditCard,
  Building,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Boxes,
  RefreshCw,
  MapPin,
  Radio,
  Store,
  ArrowRight,
  CheckCheck,
  Sliders,
} from 'lucide-react';
import { Order, CartItem, PaymentMethodId, Product, OrderStatus } from '../types';
import { ProductMockup } from './ProductMockup';
import { PRODUCTS } from '../data/products';
import { useToast } from './ToastProvider';
import { subscribeToOrders, getFirestoreOrderByOrderId } from '../services/firebaseService';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onReorder?: (items: CartItem[]) => void;
  onNavigateToProducts: () => void;
  onOpenTrackingPage?: (orderId: string) => void;
}

const ORDERS_STORAGE_KEY = 'tapreviewnfc_order_history';

// Sample initial order for demonstration
const SAMPLE_ORDER: Order = {
  id: 'TR-748921',
  createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
  items: [
    {
      product: PRODUCTS[0], // Acrylic Stand
      quantity: 2,
      businessName: 'Manila Roast Coffee Co.',
      customGoogleLink: 'https://g.page/r/sample-coffee-reviews/review',
    },
    {
      product: PRODUCTS[1], // Waterproof Sticker
      quantity: 5,
      businessName: 'Manila Roast Coffee Co.',
      customGoogleLink: 'https://g.page/r/sample-coffee-reviews/review',
    },
  ],
  subtotal: 3180,
  shipping: 0,
  total: 3180,
  paymentMethod: 'gcash',
  customerInfo: {
    fullName: 'Marco Santos',
    email: 'marco@manilaroast.ph',
    phone: '0917 888 4321',
    address: 'Unit 4B, Bonifacio High Street, BGC',
    city: 'Taguig City, Metro Manila',
    postalCode: '1634',
    businessName: 'Manila Roast Coffee Co.',
    googleReviewUrlOrPlace: 'https://g.page/r/sample-coffee-reviews/review',
  },
  status: 'shipped',
  estimatedDelivery: 'Tomorrow by 4:00 PM',
};

// Helper interface for Real-Time Timeline
export interface RealtimeStage {
  stage: 'pending' | 'processing' | 'shipped' | 'delivered';
  title: string;
  subtitle: string;
  timestamp: string;
  details: string;
  isComplete: boolean;
  isCurrent: boolean;
  iconName: 'receipt' | 'cpu' | 'truck' | 'store';
}

export const calculateRealtimeStatus = (
  order: Order,
  syncTimestamp?: number,
  overrideStage?: 'pending' | 'processing' | 'shipped' | 'delivered',
  firestoreStatus?: OrderStatus
) => {
  // Parse order created date
  let orderDate = new Date(order.createdAt);
  if (isNaN(orderDate.getTime())) {
    orderDate = new Date();
  }

  const now = syncTimestamp ? new Date(syncTimestamp) : new Date();

  // Dynamic real-time stage progression: manual override > live Firestore status > order record status
  let derivedStage: 'pending' | 'processing' | 'shipped' | 'delivered' = 'pending';

  const effectiveStatus = overrideStage || firestoreStatus || order.status;

  if (effectiveStatus === 'delivered') {
    derivedStage = 'delivered';
  } else if (effectiveStatus === 'shipped') {
    derivedStage = 'shipped';
  } else if (effectiveStatus === 'processing') {
    derivedStage = 'processing';
  } else if (effectiveStatus === 'pending') {
    derivedStage = 'pending';
  } else {
    derivedStage = 'pending';
  }

  const formatDate = (d: Date) => {
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingDate = new Date(orderDate.getTime());
  const processingDate = new Date(orderDate.getTime() + 3 * 60 * 60 * 1000);
  const shippedDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
  const deliveredDate = new Date(orderDate.getTime() + 68 * 60 * 60 * 1000);

  const stepIndex =
    derivedStage === 'pending'
      ? 0
      : derivedStage === 'processing'
      ? 1
      : derivedStage === 'shipped'
      ? 2
      : 3;

  const progressPercent =
    derivedStage === 'pending'
      ? 25
      : derivedStage === 'processing'
      ? 50
      : derivedStage === 'shipped'
      ? 75
      : 100;

  const stages: RealtimeStage[] = [
    {
      stage: 'pending',
      title: 'Order Placed',
      subtitle: 'Payment & Verification',
      timestamp: formatDate(pendingDate),
      details: 'Order verified and queued for custom NFC hardware programming.',
      isComplete: stepIndex >= 0,
      isCurrent: stepIndex === 0,
      iconName: 'receipt',
    },
    {
      stage: 'processing',
      title: 'NFC Encoding',
      subtitle: 'NTAG213 Chip QA & Lock',
      timestamp: stepIndex >= 1 ? formatDate(processingDate) : 'Est. within 3-4 hrs',
      details: 'Google Review URL programmed into NTAG213 microchip with permanent write-lock.',
      isComplete: stepIndex >= 1,
      isCurrent: stepIndex === 1,
      iconName: 'cpu',
    },
    {
      stage: 'shipped',
      title: 'In-Transit',
      subtitle: 'Courier J&T Handover',
      timestamp: stepIndex >= 2 ? formatDate(shippedDate) : 'Est. 24 hrs from order',
      details: 'Dispatched via J&T Express with real-time waypoint logging and route tracking.',
      isComplete: stepIndex >= 2,
      isCurrent: stepIndex === 2,
      iconName: 'truck',
    },
    {
      stage: 'delivered',
      title: 'Delivered',
      subtitle: 'Arrived at Counter',
      timestamp: stepIndex === 3 ? formatDate(deliveredDate) : 'Est. 2-3 Business Days',
      details: 'Package delivered at your business counter. Lifetime NFC warranty activated.',
      isComplete: stepIndex === 3,
      isCurrent: stepIndex === 3,
      iconName: 'store',
    },
  ];

  // Deterministic Waybill Tracking ID
  const hashSeed = Math.abs(
    order.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1234) * 7823
  );
  const waybill = `JT-PH-${hashSeed.toString().padStart(8, '0').slice(0, 8)}`;

  const hubLocation =
    derivedStage === 'delivered'
      ? 'Delivered to Customer Business Counter'
      : derivedStage === 'shipped'
      ? 'Out for delivery — Metro Manila Hub Dispatch'
      : derivedStage === 'processing'
      ? 'TAPPY NFC Cleanroom & Encoding Facility, Pasig'
      : 'Metro Manila Automated Payment Gateway';

  return {
    stage: derivedStage,
    stepIndex,
    progressPercent,
    stages,
    waybill,
    hubLocation,
    lastSyncTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
};

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onReorder,
  onNavigateToProducts,
  onOpenTrackingPage,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState<number>(Date.now());
  const [stageOverrides, setStageOverrides] = useState<Record<string, 'pending' | 'processing' | 'shipped' | 'delivered'>>({});
  
  // Real-time Firestore shipping status sync
  const [firestoreStatusMap, setFirestoreStatusMap] = useState<Record<string, { status: OrderStatus; updatedAt?: any }>>({});
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [lookedUpFirestoreOrder, setLookedUpFirestoreOrder] = useState<Order | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const { showToast } = useToast();

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          if (parsed.length > 0) {
            setExpandedOrderId(parsed[0].id);
          }
          return;
        }
      }
      setOrders([]);
    } catch (e) {
      console.warn('Failed to load orders from localStorage', e);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadOrders();
    setSyncTimestamp(Date.now());

    // Subscribe to Firestore 'orders' collection in real-time to fetch shipping updates
    const unsubscribe = subscribeToOrders((liveOrders) => {
      setIsFirestoreConnected(true);
      const statusMap: Record<string, { status: OrderStatus; updatedAt?: any }> = {};

      liveOrders.forEach((doc) => {
        const orderId = doc.orderId || doc.id;
        if (orderId && doc.status) {
          statusMap[orderId] = {
            status: doc.status as OrderStatus,
            updatedAt: doc.updatedAt,
          };
        }
      });

      setFirestoreStatusMap(statusMap);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [isOpen]);

  const handleLookupFirestoreOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = searchQuery.trim();
    if (!cleanId) return;

    setIsLookingUp(true);
    try {
      const found = await getFirestoreOrderByOrderId(cleanId);
      if (found) {
        const orderData: Order = {
          id: found.orderId || found.id,
          createdAt: found.createdAt || new Date().toLocaleDateString('en-US'),
          items: Array.isArray(found.items)
            ? found.items.map((it: any) => {
                const matchedProduct = PRODUCTS.find((p) => p.id === it.productId) || {
                  id: it.productId || 'acrylic-stand',
                  name: it.productName || 'NFC Hardware',
                  price: it.price || 1290,
                  format: it.format || 'Acrylic Display Stand',
                  features: ['NFC Built-in'],
                  description: 'Google Review Hardware',
                  rating: 5,
                  reviewCount: 50,
                  badge: 'Bestseller',
                };
                return {
                  product: matchedProduct,
                  quantity: it.quantity || 1,
                  businessName: it.businessName || found.customerInfo?.businessName,
                  customGoogleLink: it.customGoogleLink || found.customerInfo?.googleReviewUrlOrPlace,
                };
              })
            : [],
          subtotal: found.subtotal || 0,
          shipping: found.shipping || 0,
          total: found.total || 0,
          paymentMethod: (found.paymentMethod as PaymentMethodId) || 'gcash',
          customerInfo: found.customerInfo || {
            fullName: 'Customer',
            email: '',
            phone: '',
            address: '',
            city: '',
          },
          status: (found.status as OrderStatus) || 'pending',
          estimatedDelivery: found.estimatedDelivery || '2-3 Business Days',
        };

        setLookedUpFirestoreOrder(orderData);
        setExpandedOrderId(orderData.id);
        showToast({
          type: 'success',
          title: 'Order Found in Firestore',
          message: `Order #${orderData.id} status is "${(found.status || 'pending').toUpperCase()}".`,
        });
      } else {
        showToast({
          type: 'info',
          title: 'Not Found in Firestore',
          message: `No order found with ID "${cleanId}". Checking local history...`,
        });
      }
    } catch (err) {
      console.warn('Error querying Firestore order:', err);
    } finally {
      setIsLookingUp(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast({
      type: 'info',
      title: 'Order ID Copied',
      message: `Copied ${id} to clipboard.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyWaybill = (waybill: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(waybill);
    showToast({
      type: 'info',
      title: 'Waybill Copied',
      message: `Copied courier tracking number ${waybill}.`,
    });
  };

  const handleSyncRealtimeStatus = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSyncing(true);
    setTimeout(() => {
      setSyncTimestamp(Date.now());
      setIsSyncing(false);
      showToast({
        type: 'success',
        title: 'Courier GPS Telemetry Synced',
        message: `Updated live status & waypoint check-in for order ${orderId}.`,
      });
    }, 600);
  };

  const handleSimulateStageChange = (
    orderId: string,
    stage: 'pending' | 'processing' | 'shipped' | 'delivered',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setStageOverrides((prev) => ({
      ...prev,
      [orderId]: stage,
    }));
    const stageTitles: Record<string, string> = {
      pending: '1. Placed (25%)',
      processing: '2. Encoding (50%)',
      shipped: '3. In-Transit (75%)',
      delivered: '4. Delivered to Counter (100%)',
    };
    showToast({
      type: 'info',
      title: `Simulated Stage: ${stage.toUpperCase()}`,
      message: `Progress bar updated to ${stageTitles[stage]}.`,
    });
  };

  const handleLoadSampleOrder = () => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      let list: Order[] = [];
      if (stored) {
        list = JSON.parse(stored);
      }
      // Check if sample already exists
      const exists = list.some((o) => o.id === SAMPLE_ORDER.id);
      if (!exists) {
        list = [SAMPLE_ORDER, ...list];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(list));
      }
      setOrders(list);
      setExpandedOrderId(SAMPLE_ORDER.id);
      showToast({
        type: 'success',
        title: 'Simulated Order Loaded',
        message: 'Sample order with visual 4-stage tracking progress is now visible.',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      showToast({
        type: 'info',
        title: 'Order Removed',
        message: `Order #${orderId} was removed from your history.`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleReorderOrder = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReorder) {
      onReorder(order.items);
      onClose();
      showToast({
        type: 'success',
        title: 'Re-order Added to Cart',
        message: `${order.items.reduce((s, i) => s + i.quantity, 0)} item(s) from order #${order.id} added to cart.`,
      });
    }
  };

  const handlePrintReceipt = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) {
      showToast({
        type: 'info',
        title: 'Receipt Ready',
        message: `Order summary for ${order.id} total: ₱${order.total.toLocaleString()}`,
      });
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.product.name} (x${item.quantity})</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">₱${(item.product.price * item.quantity).toLocaleString()}</td>
      </tr>
    `
      )
      .join('');

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TAPPY NFC - Official Order Receipt #${order.id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #0f172a; max-width: 600px; margin: 0 auto; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
            .title { font-size: 14px; text-transform: uppercase; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; margin: 20px 0; }
            .badge { display: inline-block; padding: 4px 8px; background: #e0f2fe; color: #0284c7; font-weight: bold; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TAPPY <span style="color: #0284c7;">NFC</span></div>
            <div class="title">Official Hardware Purchase Receipt & Warranty Certificate</div>
          </div>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Date Placed:</strong> ${order.createdAt}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()} <span class="badge">VERIFIED PAID</span></p>
          
          <div class="info-grid">
            <div>
              <strong>DELIVERY TO:</strong><br/>
              ${order.customerInfo.fullName}<br/>
              ${order.customerInfo.address}<br/>
              ${order.customerInfo.city} ${order.customerInfo.postalCode}<br/>
              Phone: ${order.customerInfo.phone}
            </div>
            <div>
              <strong>BUSINESS PROFILE:</strong><br/>
              ${order.customerInfo.businessName || 'N/A'}<br/>
              NFC Target: ${order.customerInfo.googleReviewUrlOrPlace || 'Google Maps Profile'}
            </div>
          </div>

          <table>
            <thead>
              <tr style="background: #f8fafc; text-align: left;">
                <th style="padding: 8px;">Hardware Item</th>
                <th style="padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; font-size: 13px; color: #64748b;">
            <div>Subtotal: ₱${order.subtotal.toLocaleString()}</div>
            <div>Shipping: ${order.shipping === 0 ? 'FREE (Special Promo)' : '₱' + order.shipping}</div>
          </div>
          <div class="total">
            Total Paid: ₱${order.total.toLocaleString()}
          </div>

          <div style="margin-top: 40px; padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 12px; color: #166534;">
            <strong>Lifetime NTAG213 Microchip Warranty Included:</strong> Guaranteed 100,000+ tap endurance and zero battery maintenance.
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.focus();
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  const allOrders = React.useMemo(() => {
    let combined = [...orders];
    if (lookedUpFirestoreOrder && !combined.some((o) => o.id === lookedUpFirestoreOrder.id)) {
      combined = [lookedUpFirestoreOrder, ...combined];
    }
    return combined;
  }, [orders, lookedUpFirestoreOrder]);

  const filteredOrders = allOrders.filter((order) => {
    const override = stageOverrides[order.id];
    const liveStatus = firestoreStatusMap[order.id]?.status;
    const tracker = calculateRealtimeStatus(order, syncTimestamp, override, liveStatus);

    // Status filter
    if (statusFilter !== 'all' && tracker.stage !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchWaybill = tracker.waybill.toLowerCase().includes(q);
      const matchBusiness =
        order.customerInfo.businessName?.toLowerCase().includes(q) || false;
      const matchCustomer =
        order.customerInfo.fullName.toLowerCase().includes(q);
      const matchItem = order.items.some((i) =>
        i.product.name.toLowerCase().includes(q)
      );

      return matchId || matchWaybill || matchBusiness || matchCustomer || matchItem;
    }

    return true;
  });

  const getStatusBadgeUI = (stage: 'pending' | 'processing' | 'shipped' | 'delivered' | string) => {
    switch (stage) {
      case 'pending':
        return {
          label: 'Pending',
          subLabel: 'Payment Verified & Queued',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'processing':
        return {
          label: 'Processing',
          subLabel: 'NFC Chip Encoding & Quality Audit',
          color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400',
        };
      case 'shipped':
        return {
          label: 'Shipped',
          subLabel: 'In-Transit via Courier (J&T)',
          color: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          dot: 'bg-sky-400',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          subLabel: 'Delivered to Business Counter',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      default:
        return {
          label: 'Pending',
          subLabel: 'Order In Queue',
          color: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          dot: 'bg-slate-400',
        };
    }
  };

  const getPaymentIcon = (method: PaymentMethodId) => {
    switch (method) {
      case 'gcash':
        return <Smartphone className="w-3.5 h-3.5 text-sky-400" />;
      case 'maya':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'card':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-400" />;
      case 'bank_transfer':
        return <Building className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getStageIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'receipt':
        return <CreditCard className={className} />;
      case 'cpu':
        return <Cpu className={className} />;
      case 'truck':
        return <Truck className={className} />;
      case 'store':
        return <Store className={className} />;
      default:
        return <CheckCircle2 className={className} />;
    }
  };

  return (
    <div
      id="order-history-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        id="order-history-modal-panel"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-8 ring-1 ring-white/10 text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-md shadow-sky-500/10">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Real-Time Order Tracking
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visual order journey progress tracker from 'Placed' to 'Delivered' with live telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="close-order-history-modal-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors cursor-pointer"
              aria-label="Close order history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Status Filter Bar with Direct Firestore Order Tracking */}
        <div className="p-4 sm:px-7 bg-slate-950/40 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          <form
            onSubmit={handleLookupFirestoreOrder}
            className="relative flex-1 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search or enter Order ID (e.g. TR-XXXXXX) to track live..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLookingUp || !searchQuery.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
              title="Track order status directly from Firestore"
            >
              {isLookingUp ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Truck className="w-3.5 h-3.5" />
              )}
              <span>Track Order</span>
            </button>
          </form>

          {allOrders.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
              {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer border shrink-0 ${
                    statusFilter === filter
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-xs'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {filter === 'all' ? 'All Orders' : filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-4">
          {allOrders.length === 0 ? (
            /* Empty State */
            <div className="py-12 sm:py-16 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-display text-lg font-bold text-white">
                  No Order Records Found
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Have an existing order number? Enter your Order ID above to fetch real-time shipping updates directly from Firestore.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="order-history-load-sample-btn"
                  onClick={handleLoadSampleOrder}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono font-bold text-xs border border-slate-700 hover:border-sky-400/40 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preview Simulated Live Order</span>
                </button>

                <button
                  id="order-history-browse-catalog-btn"
                  onClick={() => {
                    onClose();
                    onNavigateToProducts();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse NFC Lineup</span>
                </button>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* Search yielded no results */
            <div className="py-10 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-white">No orders match "{searchQuery}"</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleLookupFirestoreOrder}
                  className="text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg font-mono cursor-pointer transition-all"
                >
                  Check Firestore for "{searchQuery}"
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            /* Orders List with Intuitive Visual Progress Journey */
            <div className="space-y-5">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const override = stageOverrides[order.id];
                const tracker = calculateRealtimeStatus(order, syncTimestamp, override);
                const statusBadge = getStatusBadgeUI(tracker.stage);
                const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

                return (
                  <div
                    key={order.id}
                    id={`order-card-${order.id}`}
                    className={`border rounded-2xl overflow-hidden transition-all shadow-md ${
                      isExpanded
                        ? 'bg-slate-950/90 border-slate-700 ring-1 ring-sky-500/20'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Collapsible Header with Integrated Visual Progress Summary */}
                    <div
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-4 sm:p-5 flex flex-col gap-3 cursor-pointer hover:bg-slate-900/40 transition-colors select-none"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 shrink-0 shadow-inner">
                            <Package className="w-5 h-5 text-sky-400" />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-extrabold text-white text-sm">
                                {order.id}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleCopyId(order.id, e)}
                                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedId === order.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                                <div className="inline-flex items-center gap-1.5 ml-1">
                                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 hidden xs:inline">
                                    Track Order:
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full font-bold border shadow-xs ${statusBadge.color}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} ${tracker.stage !== 'delivered' ? 'animate-pulse' : ''}`} />
                                    <span>{statusBadge.label}</span>
                                  </span>
                                  {firestoreStatusMap[order.id] && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30" title="Live status fetched from Firestore 'orders' collection">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                      Live Sync
                                    </span>
                                  )}
                                </div>
                              </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                              <span>Placed: {order.createdAt}</span>
                              <span>•</span>
                              <span className="font-medium text-slate-300">
                                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                              </span>
                              <span>•</span>
                              <span className="font-bold text-white">
                                ₱{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="hidden sm:flex flex-col text-right text-xs font-mono">
                            <span className="text-slate-400 text-[10px]">Courier Waybill:</span>
                            <span className="text-sky-400 font-bold">{tracker.waybill}</span>
                          </div>

                          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Header Mini Order Progress Tracker Bar */}
                      <div className="pt-2 border-t border-slate-800/60 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
                            Order Journey: <strong className="text-white uppercase">{tracker.stage}</strong>
                          </span>
                          <span className="font-bold text-sky-400">{tracker.progressPercent}% Complete</span>
                        </div>

                        {/* Visual Progress Track */}
                        <div className="relative w-full bg-slate-900/90 h-2 rounded-full overflow-hidden border border-slate-800/80">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${tracker.progressPercent}%` }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>

                        {/* 4 Mini Milestone Labels */}
                        <div className="grid grid-cols-4 text-[10px] font-mono text-center pt-0.5">
                          {tracker.stages.map((stg, sIdx) => {
                            const isPast = tracker.stepIndex >= sIdx;
                            const isCurrent = tracker.stepIndex === sIdx;
                            return (
                              <span
                                key={sIdx}
                                className={`truncate px-0.5 ${
                                  isCurrent
                                    ? 'text-sky-400 font-bold'
                                    : isPast
                                    ? 'text-emerald-400 font-medium'
                                    : 'text-slate-500'
                                }`}
                              >
                                {sIdx + 1}. {stg.title}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Intuitive Real-Time Order Journey Stepper */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-800/80 bg-slate-900/40 p-5 sm:p-6 space-y-6"
                        >
                          {/* Dedicated Visual Order Journey Roadmap Card */}
                          <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl relative overflow-hidden">
                            {/* Top Header of the Journey */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                                    Live Fulfillment Journey & Milestone Tracker
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  Track each stage of your custom Google Review hardware from instant payment verification to business counter delivery.
                                </p>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <button
                                  type="button"
                                  onClick={(e) => handleSyncRealtimeStatus(order.id, e)}
                                  disabled={isSyncing}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 text-[11px] font-mono font-semibold transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                                  <span>{isSyncing ? 'Syncing...' : 'Refresh GPS'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Prominent Track Order Live Status Banner */}
                            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
                                  Track Order Status:
                                </span>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-xs ${statusBadge.color}`}>
                                  <span className={`w-2 h-2 rounded-full ${statusBadge.dot} ${tracker.stage !== 'delivered' ? 'animate-pulse' : ''}`} />
                                  <span>{statusBadge.label} — {statusBadge.subLabel}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Live updates synced from Firestore 'orders'</span>
                              </div>
                            </div>

                            {/* Prominent Visual Stepper Rail (Desktop & Tablet) */}
                            <div className="relative py-3">
                              {/* Background rail */}
                              <div className="absolute top-7 left-6 right-6 h-1.5 bg-slate-800/90 rounded-full z-0 hidden sm:block" />
                              
                              {/* Animated gradient progress fill rail */}
                              <motion.div
                                className="absolute top-7 left-6 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 rounded-full z-0 hidden sm:block shadow-sm shadow-sky-500/50"
                                initial={{ width: 0 }}
                                animate={{
                                  width:
                                    tracker.stepIndex === 0
                                      ? '10%'
                                      : tracker.stepIndex === 1
                                      ? '38%'
                                      : tracker.stepIndex === 2
                                      ? '70%'
                                      : 'calc(100% - 3rem)',
                                }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              />

                              {/* 4 Connected Waypoint Nodes */}
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                                {tracker.stages.map((stg, sIdx) => {
                                  const isCurrent = stg.isCurrent;
                                  const isDone = stg.isComplete && !isCurrent;

                                  return (
                                    <div
                                      key={sIdx}
                                      className={`flex flex-col items-start sm:items-center text-left sm:text-center p-3.5 sm:p-3 rounded-xl border transition-all ${
                                        isCurrent
                                          ? 'bg-sky-950/60 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/40'
                                          : isDone
                                          ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                                          : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                                      }`}
                                    >
                                      {/* Circular Waypoint Icon Pin */}
                                      <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2.5 shrink-0 transition-transform ${
                                          isCurrent
                                            ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 scale-105 ring-4 ring-sky-400/20'
                                            : isDone
                                            ? 'bg-emerald-500 text-slate-950 shadow-xs'
                                            : 'bg-slate-800 text-slate-500'
                                        }`}
                                      >
                                        {isDone ? (
                                          <CheckCheck className="w-5 h-5 text-slate-950" />
                                        ) : (
                                          getStageIcon(stg.iconName, 'w-5 h-5')
                                        )}
                                      </div>

                                      {/* Status Label */}
                                      <div className="space-y-1 w-full">
                                        <div className="flex items-center justify-between sm:justify-center gap-2">
                                          <span
                                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                                              isCurrent
                                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                                : isDone
                                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                : 'bg-slate-900 text-slate-500 border-slate-800'
                                            }`}
                                          >
                                            {isCurrent ? '● Active Step' : isDone ? '✓ Completed' : 'Upcoming'}
                                          </span>
                                        </div>

                                        <h5
                                          className={`text-xs font-bold font-display ${
                                            isCurrent ? 'text-white' : isDone ? 'text-slate-100' : 'text-slate-400'
                                          }`}
                                        >
                                          {stg.title}
                                        </h5>

                                        <p className="text-[10px] text-slate-400 font-mono leading-tight">
                                          {stg.subtitle}
                                        </p>
                                      </div>

                                      {/* Timestamp / ETA */}
                                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 w-full text-[10px] font-mono text-slate-400">
                                        <span className={isCurrent ? 'text-sky-300 font-semibold' : ''}>
                                          {stg.timestamp}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Interactive Stage Simulation Bar (Allows testing each stage visually) */}
                            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                                <span>Simulate & Preview Order Stages:</span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5">
                                {(
                                  [
                                    { key: 'pending', label: '1. Placed' },
                                    { key: 'processing', label: '2. Encoding' },
                                    { key: 'shipped', label: '3. Shipped' },
                                    { key: 'delivered', label: '4. Delivered' },
                                  ] as const
                                ).map((stgBtn) => {
                                  const isActive = tracker.stage === stgBtn.key;
                                  return (
                                    <button
                                      key={stgBtn.key}
                                      type="button"
                                      onClick={(e) => handleSimulateStageChange(order.id, stgBtn.key, e)}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                                        isActive
                                          ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-xs'
                                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                                      }`}
                                    >
                                      {stgBtn.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Live Courier & Waypoint Telemetry Banner */}
                            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-[11px]">Carrier:</span>
                                    <strong className="text-white font-bold">J&T Express Philippines</strong>
                                    <span className="text-slate-600">·</span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyWaybill(tracker.waybill, e)}
                                      className="text-sky-400 hover:text-sky-300 underline font-bold flex items-center gap-1 cursor-pointer"
                                      title="Copy Waybill"
                                    >
                                      <span>{tracker.waybill}</span>
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-[11px] text-slate-300 mt-0.5">
                                    Current Checkpoint: <span className="text-emerald-400 font-semibold">{tracker.hubLocation}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-400 sm:text-right shrink-0">
                                <span>Last GPS Ping: {tracker.lastSyncTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Item Breakdown */}
                          <div className="space-y-3">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                              Items in Order ({totalItemsCount})
                            </span>
                            <div className="space-y-2.5">
                              {order.items.map((item, idx) => (
                                <div
                                  key={`order-item-${idx}`}
                                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                      <div className="transform scale-40 origin-center">
                                        <ProductMockup format={item.product.format} />
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-display font-bold text-white text-xs sm:text-sm">
                                        {item.product.name}
                                      </h4>
                                      <p className="text-[11px] text-slate-400 font-mono">
                                        Qty: <strong className="text-white">{item.quantity}</strong> × ₱{item.product.price.toLocaleString()}
                                      </p>
                                      {(item.businessName || order.customerInfo.businessName) && (
                                        <p className="text-[10px] text-sky-400 font-mono truncate max-w-xs">
                                          Configured for: {item.businessName || order.customerInfo.businessName}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="font-display font-bold text-white text-xs sm:text-sm">
                                      ₱{(item.product.price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping and Payment Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                                Delivery Address
                              </span>
                              <p className="text-white font-medium">{order.customerInfo.fullName}</p>
                              <p className="text-slate-300">{order.customerInfo.phone}</p>
                              <p className="text-slate-400 mt-0.5">
                                {order.customerInfo.address}, {order.customerInfo.city} {order.customerInfo.postalCode}
                              </p>
                            </div>

                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                                Payment Details
                              </span>
                              <div className="flex items-center gap-1.5 text-white font-medium mb-1">
                                {getPaymentIcon(order.paymentMethod)}
                                <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded ml-1 border border-emerald-500/30">
                                  PAID
                                </span>
                              </div>
                              <div className="space-y-0.5 text-slate-400 text-[11px] font-mono">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>₱{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span>{order.shipping === 0 ? 'FREE' : `₱${order.shipping}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800 text-xs">
                                  <span>Total:</span>
                                  <span>₱{order.total.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                            <div className="flex flex-wrap items-center gap-2">
                              {onOpenTrackingPage && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenTrackingPage(order.id);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500 text-sky-300 hover:text-slate-950 text-xs font-mono font-bold border border-sky-500/40 transition-all cursor-pointer"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Track Live Page</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => handlePrintReceipt(order, e)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-semibold border border-slate-700 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                                <span>Print Receipt</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteOrder(order.id, e)}
                                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                                title="Delete from history"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleReorderOrder(order, e)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Re-order Items</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 sm:px-7 border-t border-slate-800 bg-slate-950/80 shrink-0 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Lifetime NTAG213 Chip Warranty Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
