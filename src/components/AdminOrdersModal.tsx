import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Database,
  Mail,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  Eye,
  Sliders,
  Check,
  Building,
  User,
  Phone,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Truck,
  Cpu,
  Store,
} from 'lucide-react';
import { subscribeToOrders, updateFirestoreOrderStatus } from '../services/firebaseService';
import { OrderStatus } from '../types';
import { useToast } from './ToastProvider';

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

  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    // Subscribe to real-time Firestore updates
    const unsubscribe = subscribeToOrders((liveOrders) => {
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (docId: string, orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(docId);
    const success = await updateFirestoreOrderStatus(docId, newStatus);
    setIsUpdatingStatus(null);
    if (success) {
      showToast({
        type: 'success',
        title: 'Status Updated in Firestore',
        message: `Order #${orderId} marked as ${newStatus.toUpperCase()}`,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update status in Firestore.',
      });
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        id="admin-orders-modal-panel"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-6 ring-1 ring-white/10 text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                  Firebase Database & Admin Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected to Firestore · Email forwarding to <strong className="text-sky-300">jaesthetic.info@gmail.com</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Analytics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 bg-slate-950/40 border-b border-slate-800 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Firestore Orders</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{orders.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Sales Volume</span>
            <div className="text-xl font-bold text-sky-400 font-mono mt-0.5">₱{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Target Admin Inbox</span>
            <div className="text-xs font-bold text-emerald-400 truncate mt-1">jaesthetic.info@gmail.com</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Collection</span>
            <div className="text-xs font-bold text-indigo-300 font-mono mt-1">firestore/orders</div>
          </div>
        </div>

        {/* Tab switcher & Search */}
        <div className="p-4 sm:px-6 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                activeTab === 'orders'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-xs'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              Firestore Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-xs'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Dispatch Logs ({emailLogs.length})
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, names, emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'logs' ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs font-mono">
                  <Mail className="w-4 h-4" />
                  <span>Email Webhook & Dispatch Overview</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every time a customer checks out on the website, a real-time webhook sends the complete customer info, customized Google Review links, and ordered hardware items to <strong className="text-sky-300">jaesthetic.info@gmail.com</strong> while storing the records in Firestore.
                </p>
              </div>

              {emailLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-mono border border-dashed border-slate-800 rounded-2xl">
                  No email dispatches recorded in this session yet. Complete an order to trigger the email pipeline!
                </div>
              ) : (
                emailLogs.map((log, idx) => (
                  <div
                    key={`log-${idx}`}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Order #{log.orderId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {log.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400">→ {log.recipient}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Customer: {log.customerName} · Total: ₱{log.total?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Syncing with Firestore database...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-14 text-center space-y-4">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">No Firestore Records Found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When a customer places an order on your TAPPY NFC store, it will immediately show here in real-time and notify your email.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const isExpanded = expandedDocId === ord.docId;
                const statusColors: Record<string, string> = {
                  confirmed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                  processing: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                  shipped: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
                  delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                };

                return (
                  <div
                    key={ord.docId}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-extrabold text-white text-sm">
                              #{ord.orderId}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                                statusColors[ord.status] || statusColors.confirmed
                              }`}
                            >
                              {ord.status?.toUpperCase() || 'CONFIRMED'}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> jaesthetic.info@gmail.com
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Customer: <strong className="text-white">{ord.customerInfo?.fullName}</strong> ({ord.customerInfo?.email}) · Placed: {ord.createdAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="font-bold text-white text-sm font-mono">
                            ₱{ord.total?.toLocaleString()}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {ord.paymentMethod}
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedDocId(isExpanded ? null : ord.docId)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick status updater controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span>Change Status in Firestore:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            disabled={isUpdatingStatus === ord.docId || ord.status === st}
                            onClick={() => handleStatusChange(ord.docId, ord.orderId, st)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold capitalize transition-all cursor-pointer border ${
                              ord.status === st
                                ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                            } disabled:opacity-50`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Accordion */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs bg-slate-900/60 p-3.5 rounded-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                          <div>
                            <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                              Shipping & Contact
                            </span>
                            <p><strong>Phone:</strong> {ord.customerInfo?.phone}</p>
                            <p><strong>Address:</strong> {ord.customerInfo?.address}, {ord.customerInfo?.city} {ord.customerInfo?.postalCode}</p>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                              Custom Google NFC Configuration
                            </span>
                            <p><strong>Business Name:</strong> {ord.customerInfo?.businessName || 'N/A'}</p>
                            <p className="truncate"><strong>Review Link:</strong> {ord.customerInfo?.googleReviewUrlOrPlace || 'Auto-generated'}</p>
                            {ord.customerInfo?.notes && <p><strong>Notes:</strong> {ord.customerInfo?.notes}</p>}
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                            Ordered Items
                          </span>
                          <div className="space-y-1">
                            {ord.items?.map((item: any, iIdx: number) => (
                              <div key={iIdx} className="flex justify-between text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800">
                                <span>{item.productName || item.product?.name} (x{item.quantity})</span>
                                <span className="font-mono font-bold text-white">₱{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</span>
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
