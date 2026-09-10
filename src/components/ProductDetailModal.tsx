import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, Zap, Heart, Maximize2, Sparkles, Image as ImageIcon, Box, ShieldCheck, ArrowLeft, Copy, Share2, Link2, Layers, Clock } from 'lucide-react';
import { Product } from '../types';
import { ProductMockup } from './ProductMockup';
import { Product3DViewer } from './Product3DViewer';
import { ProgressiveImage } from './ProgressiveImage';
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
  const [activeView, setActiveView] = useState<'3d' | 'photo' | 'mockup'>('3d');
  const [isPictureExpanded, setIsPictureExpanded] = useState(false);

  useEffect(() => {
    setActiveView('3d');
  }, [product?.id]);

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
    } catch {
      const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product?.id}`;
      const tempInput = document.createElement('textarea');
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Floating Exit & Action Controls */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              id="modal-copy-link-header-btn"
              type="button"
              onClick={handleCopyProductLink}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5 ${
                copiedLink
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
              title="Copy product link"
              aria-label="Copy Product Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            <button
              id="modal-wishlist-toggle-btn"
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                wishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200 shadow-2xs'
              }`}
              title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              id="close-product-modal-btn"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
              aria-label="Exit and close product modal"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>

          {/* Left Column: Product Mockup / Photo / 3D Spin Preview */}
          <div className="md:w-1/2 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-between relative overflow-y-auto">
            {/* View Switcher: 3D Spin vs Photo vs Branding */}
            <div className="w-full flex items-center justify-between gap-2 pb-3">
              <div className="inline-flex p-1 bg-white border border-slate-200 rounded-lg shadow-2xs text-xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('3d')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeView === '3d'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-sky-400" />
                  <span>3D Spin (360°)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('photo')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeView === 'photo'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Studio Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('mockup')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeView === 'mockup'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Branding</span>
                </button>
              </div>

              {/* Click to expand picture button */}
              <button
                type="button"
                onClick={() => setIsPictureExpanded(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all cursor-pointer shadow-2xs shrink-0"
                title="View in fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Expand</span>
              </button>
            </div>

            {/* Visual Display Stage */}
            <div className="w-full my-auto py-2 flex items-center justify-center relative rounded-xl transition-all">
              {activeView === '3d' ? (
                <div className="w-full">
                  <Product3DViewer
                    format={product.format}
                    name={product.name}
                    size={product.size}
                    material={product.material}
                    chipType={product.chipType}
                    customBusinessName={businessName.trim() || undefined}
                    photoImage={product.image}
                  />
                </div>
              ) : activeView === 'photo' ? (
                <div
                  onClick={() => setIsPictureExpanded(true)}
                  className="relative rounded-2xl overflow-hidden border border-stone-800 bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-950 shadow-xl w-full max-w-md aspect-[4/3] group-hover:scale-102 transition-transform duration-300 flex items-center justify-center p-3 cursor-pointer"
                  title="Click to view full resolution"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.85)] block"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-stone-300 font-mono flex items-center gap-1 border border-stone-700">
                    <Maximize2 className="w-2.5 h-2.5 text-sky-400" />
                    <span>Click to zoom</span>
                  </div>
                </div>
              ) : (
                <div
                  className="py-6 transform group-hover:scale-105 transition-transform duration-300"
                  style={{
                    perspective: 800,
                    filter: 'drop-shadow(0 20px 30px rgba(15,23,42,0.18))',
                  }}
                >
                  <ProductMockup
                    format={product.format}
                    customBusinessName={businessName.trim() || undefined}
                  />
                </div>
              )}
            </div>

            {/* Bottom Details Banner */}
            <div className="w-full pt-3 space-y-1 text-center">
              <div className="px-3 py-1 bg-white border border-slate-200 text-xs text-slate-700 rounded-full shadow-2xs inline-flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                Pre-calibrated NTAG213 Contactless NFC & QR Code
              </div>
              <p className="text-[11px] text-slate-500">
                Tap or scan instantly with all iOS & Android smartphones without an app.
              </p>
            </div>
          </div>

          {/* Right Column: Product Information & Form */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-slate-900 bg-white overflow-y-auto max-h-[92vh]">
            <div className="space-y-5">
              {/* Product Category & Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {product.badge || product.format}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {product.size}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ₱{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₱{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.savings && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      Save ₱{product.savings.toLocaleString()}
                    </span>
                  )}
                  {product.isBundle && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Limited Time Bundle
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In Stock · Ready to Ship
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Bundle Specific: Exactly what items are included in this bundle */}
              {product.bundleItems && product.bundleItems.length > 0 && (
                <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-700" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Items Included in This Bundle
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {product.bundleItems.reduce((acc, item) => acc + item.quantity, 0)} Units Total
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {product.bundleItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200"
                      >
                        <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                          {item.quantity}×
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.productName}
                            </span>
                            <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                              {item.format}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>All units pre-programmed with your business review URL and tested before courier dispatch.</span>
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-200 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 block text-[11px] font-medium">
                    Dimensions
                  </span>
                  <span className="text-slate-900 font-semibold">{product.size}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 block text-[11px] font-medium">
                    Hardware Format
                  </span>
                  <span className="text-slate-900 font-semibold">{product.format}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 block text-[11px] font-medium">
                    NFC Microchip
                  </span>
                  <span className="text-sky-700 font-semibold">NTAG213 NFC</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 block text-[11px] font-medium">
                    QR Fallback
                  </span>
                  <span className="text-slate-900 font-semibold">High-Contrast Print</span>
                </div>
              </div>

              {/* Free Pre-Programming Configuration Form */}
              <div className="space-y-3 pt-2 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Google Review Pre-Programming
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Free Service
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your business info below to see the live mockup update in real-time. We will encode this directly onto your product chips before courier dispatch.
                </p>
                
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Name (Displayed on Standee / Card)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lumina Café, Dr. Garcia Dental, etc."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Google Maps Review URL or Place Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://g.page/r/... or business search name"
                      value={googleLink}
                      onChange={(e) => setGoogleLink(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Share with Business Partners / Quick Copy Link Block */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block">
                      Share with Business Partners
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      Send direct hardware link with NTAG213 specs
                    </span>
                  </div>
                </div>

                <button
                  id="modal-copy-product-link-btn"
                  type="button"
                  onClick={handleCopyProductLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                    copiedLink
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                  Select Quantity
                </span>
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`py-3 px-4 text-xs font-semibold border rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98 ${
                    justAdded
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
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
                  className="py-3 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Picture Lightbox */}
      {isPictureExpanded && (
        <div
          id="picture-lightbox-modal"
          className="fixed inset-0 z-60 flex flex-col items-center justify-between p-4 sm:p-8 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPictureExpanded(false)}
        >
          {/* Top Bar with Exit Button */}
          <div
            className="w-full max-w-5xl flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-white">
              <span className="text-xs uppercase font-semibold text-slate-200 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                Hardware Preview
              </span>
              <span className="text-sm font-bold text-white hidden sm:inline">
                {product.name}
              </span>
            </div>

            <button
              id="exit-picture-btn"
              onClick={() => setIsPictureExpanded(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              aria-label="Exit picture preview"
            >
              <X className="w-4 h-4" />
              <span>Exit Preview (ESC)</span>
            </button>
          </div>

          {/* Centered Picture / 3D Model Display */}
          <div
            className="my-auto flex items-center justify-center max-h-[75vh] w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activeView === '3d' ? (
              <div className="w-full max-w-xl">
                <Product3DViewer
                  format={product.format}
                  name={product.name}
                  size={product.size}
                  material={product.material}
                  chipType={product.chipType}
                  customBusinessName={businessName.trim() || undefined}
                  photoImage={product.image}
                />
              </div>
            ) : activeView === 'mockup' ? (
              <div className="transform scale-125 sm:scale-140 md:scale-150 transition-transform">
                <ProductMockup
                  format={product.format}
                  customBusinessName={businessName.trim() || undefined}
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-black/90 shadow-2xl w-full max-w-2xl max-h-[75vh] flex items-center justify-center p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[70vh] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] block"
                />
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div
            className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center bg-stone-900/90 border border-stone-700 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveView('3d')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === '3d'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Spin</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('photo')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'photo'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('mockup')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'mockup'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Branding</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPictureExpanded(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
