import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Mail,
  RefreshCw,
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { subscribeToOrders, updateFirestoreOrderStatus } from '../services/firebaseService';
import { OrderStatus } from '../types';
import { useToast } from './ToastProvider';
import { useOrderSoundNotification } from '../hooks/useOrderSoundNotification';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'logs'>('orders');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Audio ping hook (silent-by-default, persisted in localStorage)
  const { isSoundEnabled, setSoundEnabled, playOrderSuccessPing, previewPing } = useOrderSoundNotification();

  const prevOrderCountRef = useRef<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      prevOrderCountRef.current = null;
      return;
    }

    setLoading(true);
    // Subscribe to real-time Firestore updates
    const unsubscribe = subscribeToOrders((liveOrders) => {
      // If modal is open and a new order arrives while admin is viewing
      if (
        prevOrderCountRef.current !== null &&
        liveOrders.length > prevOrderCountRef.current
      ) {
        if (isSoundEnabled) {
          playOrderSuccessPing();
        }
        showToast({
          type: 'info',
          title: 'New Order Received',
          message: `A new order was just placed and saved to Firestore.`,
        });
      }
      prevOrderCountRef.current = liveOrders.length;
      setOrders(liveOrders);
      setLoading(false);
    });

    // Fetch server dispatch logs
    fetch('/api/orders/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.recentNotifications) {
          setEmailLogs(data.recentNotifications);
        }
      })
      .catch((err) => console.warn('Failed to load email logs', err));

    return () => unsubscribe();
  }, [isOpen, isSoundEnabled, playOrderSuccessPing]);

  if (!isOpen) return null;

  const handleStatusChange = async (docId: string, orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(docId);
    const success = await updateFirestoreOrderStatus(docId, newStatus);
    setIsUpdatingStatus(null);
    if (success) {
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Order #${orderId} updated to ${newStatus.toUpperCase()}`,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update status in Firestore.',
      });
    }
  };

  const handleDownloadCSV = () => {
    if (!orders || orders.length === 0) {
      showToast({
        type: 'warning',
        title: 'No Orders to Export',
        message: 'There are currently no customer orders in the database.',
      });
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'Business Name',
      'Google Review URL',
      'Shipping Address',
      'City',
      'Province',
      'Postal Code',
      'Payment Method',
      'Items Ordered',
      'Subtotal (PHP)',
      'Shipping Fee (PHP)',
      'Total Amount (PHP)',
      'Order Status',
      'Customer Notes',
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = orders.map((order) => {
      const cust = order.customerInfo || {};
      const itemsSummary = Array.isArray(order.items)
        ? order.items
            .map(
              (item: any) =>
                `${item.productName || item.product?.name || 'Product'} (Qty: ${item.quantity || 1})`
            )
            .join('; ')
        : '';

      return [
        escapeCSV(order.orderId || order.id || order.docId),
        escapeCSV(order.createdAt || order.timestamp || ''),
        escapeCSV(cust.fullName || ''),
        escapeCSV(cust.email || ''),
        escapeCSV(cust.phone || ''),
        escapeCSV(cust.businessName || order.businessName || ''),
        escapeCSV(cust.googleReviewUrlOrPlace || order.googleLink || ''),
        escapeCSV(cust.address || ''),
        escapeCSV(cust.city || ''),
        escapeCSV(cust.province || ''),
        escapeCSV(cust.postalCode || ''),
        escapeCSV(order.paymentMethod || ''),
        escapeCSV(itemsSummary),
        escapeCSV(order.subtotal || 0),
        escapeCSV(order.shipping || 0),
        escapeCSV(order.total || 0),
        escapeCSV(order.status || 'pending'),
        escapeCSV(cust.notes || ''),
      ].join(',');
    });

    const csvString = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `tappy_orders_${dateStamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'CSV Export Ready',
      message: `Downloaded ${orders.length} orders formatted for spreadsheets.`,
    });
  };

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatusFilter !== 'all' && ord.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (ord.orderId || '').toLowerCase().includes(q);
      const matchName = (ord.customerInfo?.fullName || '').toLowerCase().includes(q);
      const matchEmail = (ord.customerInfo?.email || '').toLowerCase().includes(q);
      const matchBiz = (ord.customerInfo?.businessName || '').toLowerCase().includes(q);
      return matchId || matchName || matchEmail || matchBiz;
    }
    return true;
  });

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  return (
    <div
      id="admin-orders-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        id="admin-orders-modal-panel"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden my-6 text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                  Order Management & Database
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected to Firestore · Email notifications to <span className="text-slate-200 font-medium">jaesthetic.info@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download CSV Button */}
            <button
              id="admin-download-csv-btn"
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download orders as CSV for Excel or Google Sheets"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download CSV</span>
            </button>

            {/* Sound Notification Toggle (Silent by default, subtle ping) */}
            <div className="flex items-center gap-1.5">
              <button
                id="admin-sound-toggle-btn"
                type="button"
                onClick={() => {
                  const next = !isSoundEnabled;
                  setSoundEnabled(next);
                  if (next) {
                    previewPing();
                  }
                  showToast({
                    type: 'info',
                    title: next ? 'Order Audio Ping Enabled' : 'Order Audio Ping Muted',
                    message: next
                      ? 'A subtle ping sound will play when customer completes an order.'
                      : 'Audio notifications muted (silent by default).',
                  });
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSoundEnabled
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sm'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
                title={
                  isSoundEnabled
                    ? 'Audio Notification: ON (Plays subtle ping on order completion) · Click to mute'
                    : 'Audio Notification: OFF (Silent by default) · Click to enable'
                }
                aria-label="Toggle order completion audio ping"
              >
                {isSoundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Audio Ping: On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Audio Ping: Silent</span>
                  </>
                )}
              </button>
              {isSoundEnabled && (
                <button
                  type="button"
                  onClick={previewPing}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer"
                  title="Test subtle ping sound"
                >
                  Test
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              id="admin-modal-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 bg-slate-950/40 border-b border-slate-800 shrink-0">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Orders</span>
            <div className="text-xl font-bold text-white mt-0.5">{orders.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Revenue</span>
            <div className="text-xl font-bold text-white mt-0.5">₱{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">Admin Email</span>
            <div className="text-xs font-semibold text-emerald-400 truncate mt-1">jaesthetic.info@gmail.com</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">Sound Notification</span>
            <div className="text-xs font-semibold text-slate-300 mt-1 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isSoundEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              {isSoundEnabled ? 'Active (Chime on Order)' : 'Muted'}
            </div>
          </div>
        </div>

        {/* Tab switcher, status filter & Search */}
        <div className="p-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                activeTab === 'orders'
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Logs ({emailLogs.length})</span>
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>

              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders, names, emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'logs' ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>Automated Admin Order Email Notifications</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every time a customer places an order on TAPPY, the server automatically formats a professional order summary and delivers it directly to <strong className="text-white">jaesthetic.info@gmail.com</strong>.
                </p>
              </div>

              {emailLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  No email notifications recorded in this session yet. Place a test order to see it logged here in real-time.
                </div>
              ) : (
                emailLogs.map((log, idx) => (
                  <div
                    key={`log-${idx}`}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Order #{log.orderId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          {log.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400">→ {log.recipient}</span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        Customer: {log.customerName} · Total: ₱{log.total?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Connecting to Firestore database...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <Package className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">No Orders Found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When a customer checks out, the order will appear here in real-time and trigger an email to jaesthetic.info@gmail.com.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const isExpanded = expandedDocId === ord.docId;
                const statusBadge: Record<string, string> = {
                  confirmed: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                  processing: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
                  shipped: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
                  delivered: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
                };

                return (
                  <div
                    key={ord.docId}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-white text-sm">
                              #{ord.orderId || ord.id}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                                statusBadge[ord.status] || statusBadge.confirmed
                              }`}
                            >
                              {ord.status?.toUpperCase() || 'CONFIRMED'}
                            </span>
                            <span className="text-xs text-slate-400">
                              {ord.createdAt || ord.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Customer: <span className="text-white font-medium">{ord.customerInfo?.fullName}</span> ({ord.customerInfo?.email})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="font-bold text-white text-sm">
                            ₱{ord.total?.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {ord.paymentMethod}
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedDocId(isExpanded ? null : ord.docId)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Status updater pills */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                      <span className="text-slate-400 text-xs">Update Status:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            disabled={isUpdatingStatus === ord.docId || ord.status === st}
                            onClick={() => handleStatusChange(ord.docId, ord.orderId, st)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer border ${
                              ord.status === st
                                ? 'bg-slate-800 text-white border-slate-700'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                            } disabled:opacity-50`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accordion Details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-900 space-y-3 text-xs bg-slate-900/50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                          <div>
                            <span className="font-semibold text-slate-400 block mb-1 text-[11px]">
                              Shipping & Contact
                            </span>
                            <p><strong>Phone:</strong> {ord.customerInfo?.phone || 'N/A'}</p>
                            <p><strong>Address:</strong> {ord.customerInfo?.address}, {ord.customerInfo?.city} {ord.customerInfo?.postalCode}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400 block mb-1 text-[11px]">
                              Google Review Configuration
                            </span>
                            <p><strong>Business Name:</strong> {ord.customerInfo?.businessName || 'N/A'}</p>
                            <p className="truncate"><strong>Review Link:</strong> {ord.customerInfo?.googleReviewUrlOrPlace || 'Standard Review Setup'}</p>
                            {ord.customerInfo?.notes && <p><strong>Notes:</strong> {ord.customerInfo?.notes}</p>}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-400 block mb-1 text-[11px]">
                            Items
                          </span>
                          <div className="space-y-1">
                            {ord.items?.map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="flex justify-between text-slate-300 bg-slate-950 p-2 rounded border border-slate-800"
                              >
                                <span>{item.productName || item.product?.name} (x{item.quantity})</span>
                                <span className="font-semibold text-white">
                                  ₱{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
