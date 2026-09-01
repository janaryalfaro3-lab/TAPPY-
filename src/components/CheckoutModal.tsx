import React, { useState } from 'react';
import { X, Smartphone, Zap, CreditCard, Building, Loader2, Lock } from 'lucide-react';
import { CartItem, CustomerInfo, Order, PaymentMethodId } from '../types';
import { PAYMENT_METHODS } from '../data/products';

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
    if (!customer.city.trim()) errors.city = 'City is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    setTimeout(() => {
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

      setIsProcessing(false);
      onOrderCompleted(newOrder);
    }, 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-8 text-white ring-1 ring-white/10">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="font-display text-lg font-extrabold text-white tracking-tight">
              Checkout & Payment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete your shipping details and select payment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePayNow} className="p-6 md:p-8 space-y-8">
          {/* Customer & Shipping Information */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Juan dela Cruz"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.fullName ? 'border-red-500' : 'border-slate-700 focus:border-sky-400'
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
                  placeholder="0917 123 4567"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.phone ? 'border-red-500' : 'border-slate-700 focus:border-sky-400'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.email ? 'border-red-500' : 'border-slate-700 focus:border-sky-400'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Shipping Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Unit / Floor / Street, Barangay"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.address ? 'border-red-500' : 'border-slate-700 focus:border-sky-400'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  City / Municipality *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Taguig, Makati, Cebu City, etc."
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.city ? 'border-red-500' : 'border-slate-700 focus:border-sky-400'
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
                  placeholder="1630"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Optional Review Link Setup */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                2. Google Review Pre-Programming
              </h3>
              <span className="text-[10px] text-sky-400 uppercase font-mono font-bold">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-400">
              We can pre-encode your Google Maps review link onto your products before shipping.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Business Name (e.g. Lumina Café)"
                value={customer.businessName}
                onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              <input
                type="text"
                placeholder="Google Maps link or Place ID"
                value={customer.googleReviewUrlOrPlace}
                onChange={(e) => setCustomer({ ...customer, googleReviewUrlOrPlace: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              3. Payment Method
            </h3>

            {/* Horizontal payment options */}
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as PaymentMethodId)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 ring-1 ring-sky-400'
                        : 'bg-slate-950/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center shrink-0">
                        {getMethodIcon(method.id as PaymentMethodId)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {method.name}
                        </div>
                        <p className="text-[11px] text-slate-400">
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
                        className="accent-sky-500"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Pay Button */}
          <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-white font-bold">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
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
                <span>Total</span>
                <span className="text-base font-extrabold text-white">
                  ₱{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              id="confirm-payment-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 uppercase text-[11px] tracking-[0.14em] font-extrabold text-slate-950 bg-white hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Pay Now · ₱{total.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
