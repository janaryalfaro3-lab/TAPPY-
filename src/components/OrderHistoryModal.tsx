import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  X,
  Truck,
  CheckCircle,
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
} from 'lucide-react';
import { Order, CartItem, PaymentMethodId, Product } from '../types';
import { ProductMockup } from './ProductMockup';
import { PRODUCTS } from '../data/products';
import { useToast } from './ToastProvider';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onReorder?: (items: CartItem[]) => void;
  onNavigateToProducts: () => void;
}

const ORDERS_STORAGE_KEY = 'tapreviewnfc_order_history';

// Sample initial order for users who open tracking before placing a live order
const SAMPLE_ORDER: Order = {
  id: 'TR-748921',
  createdAt: 'Aug 28, 2026, 02:45 PM',
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

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onReorder,
  onNavigateToProducts,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'processing' | 'shipped'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

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

  const handleReorderOrder = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReorder) {
      onReorder(order.items);
      onClose();
      showToast({
        type: 'success',
        title: 'Items Added to Cart',
        message: `Added ${order.items.reduce((s, i) => s + i.quantity, 0)} items from order ${order.id} to your cart.`,
      });
    }
  };

  const handleDeleteOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete order', err);
    }
    showToast({
      type: 'info',
      title: 'Order Removed',
      message: `Order ${orderId} was removed from your local history.`,
    });
  };

  const handleLoadSampleOrder = () => {
    const updated = [SAMPLE_ORDER, ...orders.filter((o) => o.id !== SAMPLE_ORDER.id)];
    setOrders(updated);
    setExpandedOrderId(SAMPLE_ORDER.id);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save sample order', err);
    }
    showToast({
      type: 'success',
      title: 'Demo Order Loaded',
      message: 'Sample NFC hardware order loaded for testing.',
    });
  };

  const handlePrintReceipt = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 0; font-family: monospace;">
            <strong>${item.product.name}</strong> (${item.product.size})<br/>
            <span style="color: #64748b; font-size: 11px;">Place: ${item.businessName || order.customerInfo.businessName || 'Configured'}</span>
          </td>
          <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; text-align: right;">₱${item.product.price.toLocaleString()}</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold;">₱${(item.product.price * item.quantity).toLocaleString()}</td>
        </tr>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.id} - TapReviewNFC</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 600px; margin: 0 auto; }
            h1 { font-size: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
            th { text-align: left; padding-bottom: 8px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #475569; }
            .total-box { margin-top: 20px; border-top: 2px solid #0f172a; padding-top: 12px; }
            .footer { margin-top: 40px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TapReview NFC Philippines</h1>
            <div style="font-size: 12px; color: #475569;">Commercial NFC Google Review Hardware</div>
            <div style="margin-top: 12px; font-family: monospace; font-size: 12px;">
              <strong>Order ID:</strong> ${order.id}<br/>
              <strong>Date:</strong> ${order.createdAt}<br/>
              <strong>Status:</strong> ${order.status.toUpperCase()}
            </div>
          </div>

          <div style="font-size: 12px; margin-bottom: 20px;">
            <strong>Ship To:</strong><br/>
            ${order.customerInfo.fullName} (${order.customerInfo.phone})<br/>
            ${order.customerInfo.address}, ${order.customerInfo.city} ${order.customerInfo.postalCode}<br/>
            <strong>Business:</strong> ${order.customerInfo.businessName || 'N/A'}
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-box">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Subtotal:</span>
              <span>₱${order.subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Shipping:</span>
              <span>${order.shipping === 0 ? 'FREE (Metro Manila / Nationwide)' : `₱${order.shipping}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 8px;">
              <span>Total Paid:</span>
              <span>₱${order.total.toLocaleString()} (${order.paymentMethod.toUpperCase()})</span>
            </div>
          </div>

          <div class="footer">
            Thank you for choosing TapReview NFC! All items include lifetime NTAG213 hardware warranty.<br/>
            Support: support@tapreviewnfc.ph · www.tapreviewnfc.ph
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();

    const searchable = [
      order.id,
      order.customerInfo.fullName,
      order.customerInfo.businessName,
      order.customerInfo.city,
      ...order.items.map((i) => i.product.name),
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(query);
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Order Confirmed',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          step: 1,
        };
      case 'processing':
        return {
          label: 'NFC Chip Encoding',
          color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          step: 2,
        };
      case 'shipped':
        return {
          label: 'In Transit / Courier Dispatched',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          step: 3,
        };
      default:
        return {
          label: 'Processing',
          color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          step: 1,
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
                  Order History & Tracking
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track live fulfillment stages, courier status, and download tax receipts.
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

        {/* Search & Filter Bar */}
        {orders.length > 0 && (
          <div className="p-4 sm:px-7 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID (TR-XXXXXX) or Business Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
              {(['all', 'confirmed', 'processing', 'shipped'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer border ${
                    statusFilter === filter
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-xs'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-4">
          {orders.length === 0 ? (
            /* Empty State */
            <div className="py-12 sm:py-16 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-display text-lg font-bold text-white">
                  No Recent Orders Found
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Orders placed in this browser are automatically stored here for live tracking, NFC provisioning verification, and instant re-ordering.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="order-history-load-sample-btn"
                  onClick={handleLoadSampleOrder}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono font-bold text-xs border border-slate-700 hover:border-sky-400/40 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preview Demo Order</span>
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
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-xs text-sky-400 hover:underline font-mono"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const statusMeta = getStatusBadge(order.status);
                const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

                return (
                  <div
                    key={order.id}
                    id={`order-card-${order.id}`}
                    className="bg-slate-950/75 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all shadow-md"
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors select-none"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 shrink-0">
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
                              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                              title="Copy Order ID"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <span
                              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${statusMeta.color}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>{order.createdAt}</span>
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

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 font-mono mr-2">
                          <span>Est: {order.estimatedDelivery}</span>
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

                    {/* Expanded Order Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-800/80 bg-slate-900/30 p-5 sm:p-6 space-y-6"
                        >
                          {/* 4-Step Interactive Tracking Bar */}
                          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-sky-400" />
                                Live Fulfillment Timeline
                              </span>
                              <span className="text-xs font-mono text-emerald-400 font-bold">
                                Courier: J&T Express (PH-Express)
                              </span>
                            </div>

                            {/* Tracking Progress Steps */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                              {/* Step 1 */}
                              <div className="flex items-center sm:flex-col sm:text-center gap-3 sm:gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center shrink-0">
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block text-xs font-bold text-white">
                                    1. Order Placed
                                  </span>
                                  <span className="block text-[10px] text-slate-400 font-mono">
                                    Payment Confirmed
                                  </span>
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div
                                className={`flex items-center sm:flex-col sm:text-center gap-3 sm:gap-2 p-2.5 rounded-lg border ${
                                  statusMeta.step >= 2
                                    ? 'bg-slate-900/90 border-sky-500/40 text-white'
                                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                                    statusMeta.step >= 2
                                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                                      : 'bg-slate-800 text-slate-500 border-slate-700'
                                  }`}
                                >
                                  <Cpu className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block text-xs font-bold">
                                    2. NFC Chip Provisioning
                                  </span>
                                  <span className="block text-[10px] text-slate-400 font-mono">
                                    NTAG213 Encoded
                                  </span>
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div
                                className={`flex items-center sm:flex-col sm:text-center gap-3 sm:gap-2 p-2.5 rounded-lg border ${
                                  statusMeta.step >= 3
                                    ? 'bg-slate-900/90 border-amber-500/40 text-white'
                                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                                    statusMeta.step >= 3
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                                      : 'bg-slate-800 text-slate-500 border-slate-700'
                                  }`}
                                >
                                  <Boxes className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block text-xs font-bold">
                                    3. QA & Packaging
                                  </span>
                                  <span className="block text-[10px] text-slate-400 font-mono">
                                    Anti-Scratch Wrapped
                                  </span>
                                </div>
                              </div>

                              {/* Step 4 */}
                              <div
                                className={`flex items-center sm:flex-col sm:text-center gap-3 sm:gap-2 p-2.5 rounded-lg border ${
                                  statusMeta.step >= 3
                                    ? 'bg-slate-900/90 border-emerald-500/40 text-white'
                                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                                    statusMeta.step >= 3
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                      : 'bg-slate-800 text-slate-500 border-slate-700'
                                  }`}
                                >
                                  <Truck className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block text-xs font-bold">
                                    4. Out For Delivery
                                  </span>
                                  <span className="block text-[10px] text-slate-400 font-mono">
                                    {order.estimatedDelivery}
                                  </span>
                                </div>
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
                            <div className="flex items-center gap-2">
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
