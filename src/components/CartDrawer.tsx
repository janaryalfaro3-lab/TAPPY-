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
        className="absolute inset-0 bg-[#050505]/85 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-[#0E0E0E] border-l border-white/10 shadow-2xl flex flex-col text-[#E0E0E0]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#080808]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#2DD4BF]" />
              <h2 className="font-display text-sm uppercase tracking-wider font-semibold text-[#E0E0E0]">
                Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#949494] hover:text-[#E0E0E0] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-[#141414] border border-white/10 flex items-center justify-center text-[#949494]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#E0E0E0]">Your cart is empty</h3>
                  <p className="text-xs text-[#949494]">Select a product to get started.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onShopProducts();
                  }}
                  className="mt-2 px-6 py-2.5 bg-[#E0E0E0] hover:bg-white text-[#050505] text-[11px] uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer active:scale-95"
                >
                  View Products
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="p-4 bg-[#141414] border border-white/10 flex gap-4 items-center"
                >
                  {/* Thumbnail Mockup */}
                  <div className="w-16 h-16 bg-[#080808] border border-white/5 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <div className="transform scale-50 origin-center">
                      <ProductMockup format={item.product.format} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#E0E0E0] truncate mb-0.5">
                      {item.product.name}
                    </h4>
                    <div className="text-[10px] font-mono text-[#949494] space-x-1.5 mb-2">
                      <span>{item.product?.size || ''}</span>
                      <span>·</span>
                      <span className="text-[#2DD4BF]">{item.product?.material || ''}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/10 bg-[#0A0A0A]">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#949494] hover:text-[#E0E0E0] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2.5 text-[11px] font-mono font-medium text-[#E0E0E0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#949494] hover:text-[#E0E0E0] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-xs font-mono text-[#E0E0E0] font-semibold">
                        ₱{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-1.5 text-[#949494] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
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
            <div className="p-6 border-t border-white/10 bg-[#080808] space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#949494]">
                  <span>Subtotal</span>
                  <span className="text-[#E0E0E0] font-medium">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#949494]">
                  <span>Shipping</span>
                  <span className="text-[#E0E0E0]">
                    {shipping === 0 ? (
                      <span className="text-[#2DD4BF] font-medium">Free (over ₱2,000)</span>
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
                id="cart-proceed-to-payment-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 uppercase text-[11px] tracking-[0.14em] font-semibold text-[#050505] bg-[#E0E0E0] hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
