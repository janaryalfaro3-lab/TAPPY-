import React, { useState, useEffect } from 'react';
import { X, Smartphone, Zap, CreditCard, Building, Loader2, Lock, Copy, Check, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartItem, CustomerInfo, Order, PaymentMethodId } from '../types';
import { PAYMENT_METHODS } from '../data/products';
import { createFirestoreOrder } from '../services/firebaseService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('gcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedDetail, setCopiedDetail] = useState<string | null>(null);

  // Keyboard Escape listener to exit modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDetail(label);
    setTimeout(() => setCopiedDetail(null), 2000);
  };

  // Customer form state
  const [customer, setCustomer] = useState<CustomerInfo>({
    businessName: '',
    googleReviewUrlOrPlace: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  const validateForm = () => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full name is required';
    if (!customer.email.trim() || !customer.email.includes('@')) errors.email = 'Valid email is required';
    if (!customer.phone.trim()) errors.phone = 'Mobile number is required';
    if (!customer.address.trim()) errors.address = 'Shipping address is required';
    if (!customer.city.trim()) errors.city = 'City / Municipality is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    const orderNumber = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderNumber,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cartItems],
      subtotal,
      shipping,
      total,
      paymentMethod: selectedMethod,
      customerInfo: customer,
      status: 'confirmed',
      estimatedDelivery: '2–4 Business Days',
    };

    // Save into Firebase Firestore & notify admin jaesthetic.info@gmail.com
    try {
      await createFirestoreOrder(newOrder);
    } catch (err) {
      console.warn('Firestore save warning:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      onOrderCompleted(newOrder);
    }, 600);
  };

  const getMethodIcon = (id: PaymentMethodId) => {
    switch (id) {
      case 'gcash':
        return <Smartphone className="w-4 h-4 text-sky-400" />;
      case 'maya':
        return <Zap className="w-4 h-4 text-sky-400" />;
      case 'card':
        return <CreditCard className="w-4 h-4 text-sky-400" />;
      case 'bank_transfer':
        return <Building className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-4 sm:my-8 text-white ring-1 ring-white/10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Prominent Exit / Close Button */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Secure Checkout & Payment
              </h2>
              <p className="text-xs text-slate-400">
                Complete your details below · Free pre-programming included
              </p>
            </div>
          </div>

          {/* Prominent Exit Button */}
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="px-3.5 py-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-md hover:border-slate-500"
            aria-label="Exit checkout"
          >
            <X className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>

        {/* Scrollable Form Body with Generous Spacing and 100% Visibility */}
        <form onSubmit={handlePayNow} className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(92vh-150px)]">
          {/* Customer & Shipping Information */}
          <div className="space-y-4 bg-slate-950/40 p-5 sm:p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-mono font-extrabold flex items-center justify-center">
                  1
                </span>
                Customer & Shipping Information
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    formErrors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0917 123 4567"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address * (For order confirmation & receipt)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. juan@business.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    formErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Complete Shipping Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Unit / Floor / Bldg, Street Name, Barangay"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    formErrors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  City / Municipality & Province *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taguig, Makati, Cebu City, Davao"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    formErrors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
                  }`}
                />
                {formErrors.city && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1630"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Optional Review Link Pre-Programming Setup */}
          <div className="space-y-4 bg-slate-950/40 p-5 sm:p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-mono font-extrabold flex items-center justify-center">
                  2
                </span>
                Google Review Pre-Programming
              </h3>
              <span className="text-[10px] text-teal-300 uppercase font-mono font-bold bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We can pre-encode your Google Maps review link onto your products before shipping so they work right out of the box with zero setup.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business Name (For Standee Print)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Specialty Café"
                  value={customer.businessName}
                  onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Google Maps Review Link / Place Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://g.page/r/... or Place ID"
                  value={customer.googleReviewUrlOrPlace}
                  onChange={(e) => setCustomer({ ...customer, googleReviewUrlOrPlace: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4 bg-slate-950/40 p-5 sm:p-6 rounded-2xl border border-slate-800/80">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-slate-950 text-[10px] font-mono font-extrabold flex items-center justify-center">
                3
              </span>
              Select Payment Method
            </h3>

            {/* Payment options list */}
            <div className="space-y-3 pt-1">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as PaymentMethodId)}
                    className={`p-4 sm:p-5 border rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 ring-1 ring-sky-400 shadow-md'
                        : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        {getMethodIcon(method.id as PaymentMethodId)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          <span>{method.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                          {method.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedMethod(method.id as PaymentMethodId)}
                        className="accent-sky-500 w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Active Payment Method Instructions Box */}
            {selectedMethod === 'gcash' && (
              <div className="p-4 sm:p-5 bg-sky-950/50 border border-sky-500/40 rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-sky-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    GCash Express Send Details:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('09764421242', 'gcash')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {copiedDetail === 'gcash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDetail === 'gcash' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
                <div className="text-white space-y-1 text-xs pt-1">
                  <div><strong>Account Number:</strong> <span className="text-sky-300 font-bold">09764421242</span></div>
                  <div><strong>Account Name:</strong> TAPPY OFFICIAL STORE</div>
                  <div className="text-slate-400 text-[11px] pt-1 border-t border-sky-800/40 mt-1">
                    Send exact amount: ₱{total.toLocaleString()} · Instant automatic order verification
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'maya' && (
              <div className="p-4 sm:p-5 bg-teal-950/50 border border-teal-500/40 rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-teal-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-teal-400" />
                    Maya Transfer / Send Money Details:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('09764421242', 'maya')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {copiedDetail === 'maya' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDetail === 'maya' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
                <div className="text-white space-y-1 text-xs pt-1">
                  <div><strong>Maya Number:</strong> <span className="text-teal-300 font-bold">09764421242</span></div>
                  <div><strong>Account Name:</strong> TAPPY OFFICIAL STORE</div>
                  <div className="text-slate-400 text-[11px] pt-1 border-t border-teal-800/40 mt-1">
                    Send exact amount: ₱{total.toLocaleString()} · Zero transaction fee
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'bank_transfer' && (
              <div className="p-4 sm:p-5 bg-indigo-950/50 border border-indigo-500/40 rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-indigo-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-indigo-400" />
                    GoTyme Bank Account Details:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('016846634686', 'gotyme')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-slate-950 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {copiedDetail === 'gotyme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDetail === 'gotyme' ? 'Copied!' : 'Copy Account No.'}</span>
                  </button>
                </div>
                <div className="text-white space-y-1 text-xs pt-1">
                  <div><strong>Bank:</strong> GoTyme Bank (InstaPay / PESONet)</div>
                  <div><strong>Account Number:</strong> <span className="text-indigo-300 font-bold">016846634686</span></div>
                  <div><strong>Account Name:</strong> TAPPY OFFICIAL STORE</div>
                  <div className="text-slate-400 text-[11px] pt-1 border-t border-indigo-800/40 mt-1">
                    Transfer amount: ₱{total.toLocaleString()} · Receipt sent automatically
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Submit / Exit Buttons */}
          <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-5 shadow-xl">
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="text-white font-bold">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Nationwide Shipping</span>
                <span className="text-white font-bold">
                  {shipping === 0 ? (
                    <span className="text-teal-400">Free</span>
                  ) : (
                    `₱${shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="h-px bg-slate-800 my-2" />
              <div className="flex justify-between text-sm font-bold text-white">
                <span>Total Amount Due</span>
                <span className="text-lg font-black text-white">
                  ₱{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-4 uppercase text-xs tracking-[0.14em] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit & Return</span>
              </button>

              <button
                id="confirm-payment-btn"
                type="submit"
                disabled={isProcessing}
                className="sm:col-span-2 w-full py-4 uppercase text-xs tracking-[0.14em] font-black text-slate-950 bg-white hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl hover:shadow-sky-400/30"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>Pay Now · ₱{total.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
