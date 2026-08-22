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
        return <Smartphone className="w-4 h-4 text-[#2DD4BF]" />;
      case 'maya':
        return <Zap className="w-4 h-4 text-[#2DD4BF]" />;
      case 'card':
        return <CreditCard className="w-4 h-4 text-[#2DD4BF]" />;
      case 'bank_transfer':
        return <Building className="w-4 h-4 text-[#2DD4BF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#050505]/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0E0E0E] border border-white/10 shadow-2xl overflow-hidden my-8 text-[#E0E0E0]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#080808]">
          <div>
            <h2 className="font-display text-lg font-bold text-[#E0E0E0] tracking-tight">
              Checkout & Payment
            </h2>
            <p className="text-xs text-[#949494] mt-0.5">
              Complete your shipping details and select payment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#949494] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePayNow} className="p-6 md:p-8 space-y-8">
          {/* Customer & Shipping Information */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#E0E0E0]">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#949494] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Juan dela Cruz"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className={`w-full bg-[#080808] border px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none transition-colors ${
                    formErrors.fullName ? 'border-red-500' : 'border-white/10 focus:border-[#2DD4BF]'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#949494] mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0917 123 4567"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full bg-[#080808] border px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none transition-colors ${
                    formErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#2DD4BF]'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#949494] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className={`w-full bg-[#080808] border px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none transition-colors ${
                    formErrors.email ? 'border-red-500' : 'border-white/10 focus:border-[#2DD4BF]'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#949494] mb-1.5">
                  Shipping Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Unit / Floor / Street, Barangay"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className={`w-full bg-[#080808] border px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none transition-colors ${
                    formErrors.address ? 'border-red-500' : 'border-white/10 focus:border-[#2DD4BF]'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#949494] mb-1.5">
                  City / Municipality *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Taguig, Makati, Cebu City, etc."
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={`w-full bg-[#080808] border px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none transition-colors ${
                    formErrors.city ? 'border-red-500' : 'border-white/10 focus:border-[#2DD4BF]'
                  }`}
                />
                {formErrors.city && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#949494] mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="1630"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#2DD4BF] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Optional Review Link Setup */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#E0E0E0]">
                2. Google Review Pre-Programming
              </h3>
              <span className="text-[10px] text-[#2DD4BF] uppercase font-mono">
                Optional
              </span>
            </div>
            <p className="text-xs text-[#949494]">
              We can pre-encode your Google Maps review link onto your products before shipping.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Business Name (e.g. Lumina Café)"
                value={customer.businessName}
                onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#2DD4BF] transition-colors"
              />
              <input
                type="text"
                placeholder="Google Maps link or Place ID"
                value={customer.googleReviewUrlOrPlace}
                onChange={(e) => setCustomer({ ...customer, googleReviewUrlOrPlace: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#2DD4BF] transition-colors"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#E0E0E0]">
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
                    className={`p-4 border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#181818] border-[#2DD4BF]'
                        : 'bg-[#101010] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 bg-[#080808] border border-white/10 flex items-center justify-center shrink-0">
                        {getMethodIcon(method.id as PaymentMethodId)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#E0E0E0]">
                          {method.name}
                        </div>
                        <p className="text-[11px] text-[#949494]">
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
                        className="accent-[#2DD4BF]"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Pay Button */}
          <div className="p-6 bg-[#080808] border border-white/10 space-y-4">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#949494]">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-[#E0E0E0] font-medium">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#949494]">
                <span>Shipping</span>
                <span className="text-[#E0E0E0] font-medium">
                  {shipping === 0 ? (
                    <span className="text-[#2DD4BF]">Free</span>
                  ) : (
                    `₱${shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between text-sm font-semibold text-[#E0E0E0]">
                <span>Total</span>
                <span className="text-base font-bold text-[#E0E0E0]">
                  ₱{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              id="confirm-payment-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 uppercase text-[11px] tracking-[0.14em] font-semibold text-[#050505] bg-[#E0E0E0] hover:bg-white disabled:bg-[#444] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#050505]" />
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
