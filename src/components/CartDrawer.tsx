import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { ProductMockup } from './ProductMockup';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onShopProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onShopProducts,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col text-white">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              <h2 className="font-display text-sm uppercase tracking-wider font-bold text-white">
                Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400">Select a product to get started.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onShopProducts();
                  }}
                  className="mt-2 px-6 py-2.5 bg-white hover:bg-sky-400 text-slate-950 text-[11px] uppercase tracking-[0.14em] font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                >
                  View Products
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex gap-4 items-center"
                >
                  {/* Thumbnail Mockup */}
                  <div className="w-16 h-16 bg-slate-900 border border-slate-700/80 rounded-lg shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <div className="transform scale-50 origin-center">
                      <ProductMockup format={item.product.format} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate mb-0.5">
                      {item.product.name}
                    </h4>
                    <div className="text-[10px] font-mono text-slate-400 space-x-1.5 mb-2">
                      <span>{item.product?.size || ''}</span>
                      <span>·</span>
                      <span className="text-sky-400 font-semibold">{item.product?.material || ''}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-700 bg-slate-900 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2.5 text-[11px] font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-xs font-mono text-white font-bold">
                        ₱{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? (
                      <span className="text-teal-400 font-bold">Free (over ₱2,000)</span>
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
                id="cart-proceed-to-payment-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 uppercase text-[11px] tracking-[0.14em] font-extrabold text-slate-950 bg-white hover:bg-sky-400 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
