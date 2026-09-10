import React, { useState, useEffect } from 'react';
import { X, Smartphone, Zap, CreditCard, Building, Loader2, Lock, Copy, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartItem, CustomerInfo, Order, PaymentMethodId } from '../types';
import { PAYMENT_METHODS } from '../data/products';
import { createFirestoreOrder } from '../services/firebaseService';
import { useOrderSoundNotification } from '../hooks/useOrderSoundNotification';

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

  const { playOrderSuccessPing } = useOrderSoundNotification();

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

  const [customer, setCustomer] = useState<CustomerInfo>({
    businessName: '',
    googleReviewUrlOrPlace: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!customer.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!customer.email.trim() || !customer.email.includes('@')) errors.email = 'Valid email is required';
    if (!customer.phone.trim() || customer.phone.length < 7) errors.phone = 'Valid phone number is required';
    if (!customer.address.trim()) errors.address = 'Street address is required';
    if (!customer.city.trim()) errors.city = 'City is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    const orderNumber = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tapreview.ph';
    const trackingUrl = `${origin}/?track=${orderNumber}`;

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
      trackingUrl,
      trackingNumber: `JT-PH-${orderNumber.replace('TR-', '')}`,
      courier: 'J&T Express Philippines',
      smsNotification: {
        sent: true,
        recipient: customer.phone,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await createFirestoreOrder(newOrder);
    } catch (err) {
      console.warn('Firestore save warning:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      playOrderSuccessPing();
      onOrderCompleted(newOrder);
    }, 600);
  };

  const getMethodIcon = (id: PaymentMethodId) => {
    switch (id) {
      case 'gcash':
        return <Smartphone className="w-4 h-4 text-sky-700" />;
      case 'maya':
        return <Zap className="w-4 h-4 text-emerald-700" />;
      case 'card':
        return <CreditCard className="w-4 h-4 text-indigo-700" />;
      case 'bank_transfer':
        return <Building className="w-4 h-4 text-purple-700" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden my-4 sm:my-8 text-slate-900 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close Button */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Secure Checkout & Payment
              </h2>
              <p className="text-xs text-slate-500">
                Complete your details below · Free pre-programming included
              </p>
            </div>
          </div>

          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            aria-label="Exit checkout"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePayNow} className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(92vh-150px)]">
          {/* Order Items Summary Preview */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-sky-700" />
                Items in this Order ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
              <span className="text-xs text-slate-900 font-bold">
                Subtotal: ₱{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-7 h-7 rounded bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 shrink-0 overflow-hidden flex items-center justify-center p-0.5 shadow-2xs">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                      ) : null}
                    </div>
                    <span className="w-5 h-5 rounded bg-sky-50 text-sky-800 font-bold text-[10px] flex items-center justify-center shrink-0 border border-sky-200">
                      {item.quantity}×
                    </span>
                    <span className="text-slate-900 font-medium truncate">{item.product.name}</span>
                    {item.product.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {item.product.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-900 font-bold shrink-0 ml-2">
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="space-y-4 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                Customer & Shipping Information
              </h3>
              <span className="text-xs text-slate-500">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs ${
                    formErrors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-slate-400'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0917 123 4567"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs ${
                    formErrors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-slate-400'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address * (For order confirmation & receipt)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. juan@business.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs ${
                    formErrors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-slate-400'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Shipping Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Unit / Floor / Bldg, Street Name, Barangay"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs ${
                    formErrors.address ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-slate-400'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Municipality & Province *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taguig, Makati, Cebu City, Davao"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs ${
                    formErrors.city ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-slate-400'
                  }`}
                />
                {formErrors.city && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1630"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Review Link Pre-Programming Setup */}
          <div className="space-y-4 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                Google Review Pre-Programming
              </h3>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                Free Service
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              We can pre-encode your Google Maps review link onto your products before shipping so they work right out of the box.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name (For Standee Print)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Specialty Café"
                  value={customer.businessName}
                  onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Maps Review Link / Place Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://g.page/r/... or Place ID"
                  value={customer.googleReviewUrlOrPlace}
                  onChange={(e) => setCustomer({ ...customer, googleReviewUrlOrPlace: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
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
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0 shadow-2xs">
                        {getMethodIcon(method.id as PaymentMethodId)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{method.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
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
                        className="accent-slate-900 w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Active Payment Method Instructions Box */}
            {selectedMethod === 'gcash' && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-sky-700" />
                    GCash Express Send Details:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('09764421242', 'gcash')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                  >
                    {copiedDetail === 'gcash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDetail === 'gcash' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
                <div className="text-slate-800 space-y-1 text-xs pt-1">
                  <div><strong>Account Number:</strong> <span className="text-sky-800 font-bold">09764421242</span></div>
                  <div><strong>Account Name:</strong> TAPPY OFFICIAL STORE</div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-100 mt-1">
                    Send exact amount: ₱{total.toLocaleString()} · Fast automatic order verification
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'maya' && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-700" />
                    Maya Transfer / Send Money Details:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('09764421242', 'maya')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                  >
                    {copiedDetail === 'maya' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDetail === 'maya' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
                <div className="text-slate-800 space-y-1 text-xs pt-1">
                  <div><strong>Maya Number:</strong> <span className="text-emerald-800 font-bold">09764421242</span></div>
                  <div><strong>Account Name:</strong> TAPPY OFFICIAL STORE</div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-100 mt-1">
                    Send exact amount: ₱{total.toLocaleString()} · Zero transaction fee
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'bank_transfer' && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-purple-700" />
                    GoTyme Bank Account Details:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('016846634686', 'gotyme')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                  >
                    {copiedDetail === 'gotyme' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDetail === 'gotyme' ? 'Copied!' : 'Copy Account No.'}</span>
                  </button>
                </div>
                <div className="text-slate-800 space-y-1 text-xs pt-1">
                  <div><strong>Bank:</strong> GoTyme Bank (InstaPay / PESONet)</div>
                  <div><strong>Account Number:</strong> <span className="text-purple-800 font-bold">016846634686</span></div>
                  <div><strong>Account Name:</strong> TAPPY OFFICIAL STORE</div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-100 mt-1">
                    Transfer amount: ₱{total.toLocaleString()} · Receipt sent automatically
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Submit Buttons */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="text-slate-900 font-bold">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nationwide Shipping</span>
                <span className="text-slate-900 font-bold">
                  {shipping === 0 ? (
                    <span className="text-emerald-700">Free</span>
                  ) : (
                    `₱${shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-lg font-extrabold text-slate-900">
                  ₱{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Cart</span>
              </button>

              <button
                id="confirm-payment-btn"
                type="submit"
                disabled={isProcessing}
                className="sm:col-span-2 w-full py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white" />
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
