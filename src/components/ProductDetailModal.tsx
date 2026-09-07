import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, Zap, Heart, Maximize2, Sparkles, Image as ImageIcon, Box, ShieldCheck, ArrowLeft, Copy, Share2, Link2 } from 'lucide-react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from './ToastProvider';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    customGoogleLink?: string,
    businessName?: string
  ) => void;
  onBuyNow: (
    product: Product,
    quantity: number,
    customGoogleLink?: string,
    businessName?: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [googleLink, setGoogleLink] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeView, setActiveView] = useState<'mockup' | 'photo'>('mockup');
  const [isPictureExpanded, setIsPictureExpanded] = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleCopyProductLink = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product?.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast({
        type: 'success',
        title: 'Product Link Copied!',
        message: `Shareable link for ${product?.name} copied to clipboard.`,
        duration: 3500,
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      // Fallback
      const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product?.id}`;
      const tempInput = document.createElement('textarea');
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopiedLink(true);
      showToast({
        type: 'success',
        title: 'Product Link Copied!',
        message: `Shareable link for ${product?.name} copied to clipboard.`,
        duration: 3500,
      });
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Escape key handler to exit modal or expanded picture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPictureExpanded) {
          setIsPictureExpanded(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPictureExpanded, onClose]);

  if (!isOpen || !product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, googleLink.trim(), businessName.trim());
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 800);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, googleLink.trim(), businessName.trim());
    onClose();
  };

  return (
    <>
      {/* Main Product Detail Modal */}
      <div
        id="product-detail-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden my-4 sm:my-8 ring-1 ring-white/10 max-h-[92vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Floating Exit & Action Controls */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              id="modal-copy-link-header-btn"
              type="button"
              onClick={handleCopyProductLink}
              className={`px-3 py-2 rounded-full border transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 border-slate-700'
              }`}
              title="Copy link to this product to share with business partners"
              aria-label="Copy Product Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            <button
              id="modal-wishlist-toggle-btn"
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-md active:scale-90 ${
                wishlisted
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border-slate-700'
              }`}
              title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              id="close-product-modal-btn"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-md hover:border-slate-500"
              aria-label="Exit and close product modal"
            >
              <X className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>

          {/* Left Column: True Color Product Mockup / Photo Preview with Exit Options */}
          <div className="md:w-1/2 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-6 sm:p-8 flex flex-col items-center justify-between relative overflow-y-auto">
            {/* View Switcher: 3D Specimen vs Studio Photo */}
            <div className="w-full flex items-center justify-between gap-2 pb-4">
              <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveView('mockup')}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'mockup'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Mockup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('photo')}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'photo'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>HD Photo</span>
                </button>
              </div>

              {/* Click to expand picture button */}
              <button
                type="button"
                onClick={() => setIsPictureExpanded(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400 text-slate-300 hover:text-sky-300 text-[11px] rounded-lg transition-all cursor-pointer shadow-xs"
                title="View picture in fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Expand Picture</span>
              </button>
            </div>

            {/* Visual Display Stage */}
            <div
              onClick={() => setIsPictureExpanded(true)}
              className="w-full my-auto py-6 flex items-center justify-center cursor-pointer group relative rounded-2xl transition-all"
              title="Click to expand picture"
            >
              {activeView === 'mockup' ? (
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <ProductMockup
                    format={product.format}
                    customBusinessName={businessName.trim() || undefined}
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl max-w-[280px] aspect-square group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1.5 bg-slate-950/90 border border-sky-400 text-sky-300 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" /> Click to Expand Picture
                </span>
              </div>
            </div>

            {/* Bottom Details Banner */}
            <div className="w-full pt-4 space-y-2 text-center">
              <div className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-sky-300 uppercase tracking-wider rounded-full shadow-2xs inline-flex items-center gap-2 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Dual-Tone Obsidian Black & Pure White · Official Google Colors
              </div>
              <p className="text-[11px] text-slate-400">
                Click picture anytime to expand or exit preview.
              </p>
            </div>
          </div>

          {/* Right Column: Product Information & Form (Spacious & Fully Visible) */}
          <div className="md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 text-white bg-slate-900/95 overflow-y-auto max-h-[92vh]">
            <div className="space-y-5">
              {/* Product Category & Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-extrabold bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
                    {product.badge || 'TAPPY OFFICIAL'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {product.size}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="font-display text-2xl sm:text-3xl font-black text-white">
                    ₱{product.price.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock · Ready to Ship
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed tracking-wide">
                {product.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-800 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Dimensions
                  </span>
                  <span className="text-slate-100 font-bold">{product.size}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Hardware Format
                  </span>
                  <span className="text-slate-100 font-bold">{product.format}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    NFC Microchip
                  </span>
                  <span className="text-sky-400 font-bold">NTAG213 NFC</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    QR Fallback
                  </span>
                  <span className="text-slate-100 font-bold">High-Contrast Print</span>
                </div>
              </div>

              {/* Free Pre-Programming Configuration Form with Generous Space */}
              <div className="space-y-3 pt-2 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Google Review Pre-Programming
                  </span>
                  <span className="text-[10px] text-teal-300 font-mono uppercase font-bold bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
                    Free Service
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter your business info below to see the live mockup update in real-time. We will encode this directly onto your product chips before courier dispatch.
                </p>
                
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Business Name (Displayed on Standee / Card)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lumina Café, Dr. Garcia Dental, etc."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Google Maps Review URL or Place Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://g.page/r/... or business search name"
                      value={googleLink}
                      onChange={(e) => setGoogleLink(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Share with Business Partners / Quick Copy Link Block */}
              <div className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-white block">
                      Share with Business Partners
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate block">
                      Send direct hardware link with NTAG213 specs
                    </span>
                  </div>
                </div>

                <button
                  id="modal-copy-product-link-btn"
                  type="button"
                  onClick={handleCopyProductLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs border ${
                    copiedLink
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sky-400" />
                      <span>Copy Product Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Select Quantity
                </span>
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 text-xs uppercase tracking-[0.14em] font-bold border rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    justAdded
                      ? 'bg-emerald-600 border-emerald-500 text-white scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 text-xs uppercase tracking-[0.14em] font-extrabold text-slate-950 bg-white hover:bg-sky-400 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl hover:shadow-sky-400/30"
                >
                  <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Picture Lightbox with Dedicated Exit Option */}
      {isPictureExpanded && (
        <div
          id="picture-lightbox-modal"
          className="fixed inset-0 z-60 flex flex-col items-center justify-between p-4 sm:p-8 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsPictureExpanded(false)}
        >
          {/* Top Bar with Prominent Exit Picture Button */}
          <div
            className="w-full max-w-5xl flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-white">
              <span className="text-xs uppercase font-mono tracking-wider text-sky-400 font-bold bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/30">
                HD Picture Preview
              </span>
              <span className="text-sm font-bold text-slate-200 hidden sm:inline">
                {product.name}
              </span>
            </div>

            {/* Highly Prominent Exit Picture Button */}
            <button
              id="exit-picture-btn"
              onClick={() => setIsPictureExpanded(false)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer border border-rose-400"
              aria-label="Exit picture preview"
            >
              <X className="w-4 h-4" />
              <span>Exit Picture (ESC)</span>
            </button>
          </div>

          {/* Centered High-Res Picture Display */}
          <div
            className="my-auto flex items-center justify-center max-h-[75vh] w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activeView === 'mockup' ? (
              <div className="transform scale-125 sm:scale-140 md:scale-150 transition-transform">
                <ProductMockup
                  format={product.format}
                  customBusinessName={businessName.trim() || undefined}
                />
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl max-w-lg max-h-[70vh]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Bottom Controls / Exit Hint */}
          <div
            className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-3 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveView(activeView === 'mockup' ? 'photo' : 'mockup')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {activeView === 'mockup' ? <ImageIcon className="w-4 h-4 text-sky-400" /> : <Box className="w-4 h-4 text-sky-400" />}
              <span>Switch to {activeView === 'mockup' ? 'Studio Photo' : '3D Mockup'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPictureExpanded(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Form & Specs</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
