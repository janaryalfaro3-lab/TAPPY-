import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Layers,
  Check,
  Store,
  ExternalLink,
  Eye,
  Package,
  Boxes,
  Zap,
} from 'lucide-react';
import { BundleOffer, Product } from '../types';
import {
  COMBO_BUNDLES,
  BULK_BUNDLES,
  BUNDLE_OFFERS,
  convertBundleToProduct,
} from '../data/bundles';
import { ProgressiveImage } from './ProgressiveImage';
import { TiltCard3D } from './TiltCard3D';
import { NfcProductImage } from './NfcProductImage';
import { useToast } from './ToastProvider';

interface BundleOffersSectionProps {
  onAddBundleToCart: (product: Product, quantity?: number) => void;
  onSelectBundleDetail?: (product: Product) => void;
  onInstantBuyBundle?: (product: Product) => void;
}

export const BundleOffersSection: React.FC<BundleOffersSectionProps> = ({
  onAddBundleToCart,
  onSelectBundleDetail,
  onInstantBuyBundle,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'kits' | 'bulk'>('all');
  const [bulkFilter, setBulkFilter] = useState<'all' | 'TMY-1' | 'TMY-2' | 'TMY-3' | 'TMY-4'>('all');
  const [addingId, setAddingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleAddBundle = (bundle: BundleOffer, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingId(bundle.id);
    const bundleProduct = convertBundleToProduct(bundle);
    onAddBundleToCart(bundleProduct, 1);

    showToast({
      type: 'success',
      title: `Added ${bundle.title}!`,
      message: `Saved ₱${bundle.savings.toLocaleString()} with this bundle offer. Check your cart to complete checkout.`,
    });

    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  const handleBuyNow = (bundle: BundleOffer, e: React.MouseEvent) => {
    e.stopPropagation();
    const bundleProduct = convertBundleToProduct(bundle);
    if (onInstantBuyBundle) {
      onInstantBuyBundle(bundleProduct);
    } else {
      onAddBundleToCart(bundleProduct, 1);
    }
  };

  const filteredBulkBundles = bulkFilter === 'all'
    ? BULK_BUNDLES
    : BULK_BUNDLES.filter((b) => b.skuCode === bulkFilter);

  return (
    <motion.section
      id="bundle-offers-section"
      className="py-20 sm:py-28 bg-slate-50 text-slate-900 border-b border-slate-200 relative z-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="flex items-center gap-1 text-sky-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Official TAPPY Value Bundles
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Save Up to ₱1,701
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-slate-600 font-medium">
              Pre-programmed & Ready
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-slate-900">
            Bundle & Multiply Your Reviews
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Equip your counter, dining tables, checkout stations, and staff simultaneously. All units arrive pre-programmed with your business Google Review URL and individually tested.
          </p>

          {/* Primary View Toggle: All / Multi-Product Kits / Bulk Packs */}
          <div className="pt-3 flex items-center justify-center">
            <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-2xs gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                All Bundles ({BUNDLE_OFFERS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kits')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'kits'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Multi-Product Kits ({COMBO_BUNDLES.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bulk')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bulk'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Bulk Savings Packs ({BULK_BUNDLES.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. CURATED COMBINATION KITS (Starter Kit, Business Kit ⭐ BEST SELLER, Premium Suite) */}
        {(activeTab === 'all' || activeTab === 'kits') && (
          <div className="space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-sky-600" />
                  Turnkey Hardware Kits (Multi-Touchpoint)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Hand-curated hardware combos to cover your storefront entrance, cashier desk, and mobile staff.
                </p>
              </div>
              <span className="text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
                Ready to Deploy
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch card-perspective-container">
              {COMBO_BUNDLES.map((bundle, bundleIdx) => {
                const isPopular = bundle.isPopular;
                const isAdding = addingId === bundle.id;

                return (
                  <div key={bundle.id} className="card-perspective-container h-full">
                    <TiltCard3D
                      id={`combo-bundle-${bundle.id}`}
                      onClick={() => {
                        const bundleProduct = convertBundleToProduct(bundle);
                        if (onSelectBundleDetail) {
                          onSelectBundleDetail(bundleProduct);
                        }
                      }}
                      maxTilt={6}
                      scale={1.015}
                      className={`group relative rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer product-card-glass card-3d-interactive overflow-hidden h-full ${
                        isPopular
                          ? 'border-2 border-sky-500/80 shadow-lg ring-4 ring-sky-500/10'
                          : 'border border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Specular Glare Reflection on Hover */}
                      <div className="specular-layer" />

                      {/* Badge / Ribbon */}
                      {bundle.badge && (
                        <div className="absolute -top-3.5 left-6 z-20">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${
                              isPopular
                                ? 'bg-sky-600 text-white'
                                : bundle.id === 'bundle-premium-suite'
                                ? 'bg-amber-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {bundle.badge}
                          </span>
                        </div>
                      )}

                      {/* Card Upper Content */}
                      <div className="p-6 sm:p-8 space-y-5">
                        {/* Title & Subtitle */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 group-hover:text-sky-700 transition-colors">
                              {bundle.title}
                            </h3>
                            {isPopular && (
                              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-200 shrink-0">
                                Best Seller
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                            {bundle.subtitle}
                          </p>
                        </div>

                        {/* Hardware Photo Showcase with explicit aspect ratio */}
                        <div
                          className="relative"
                          style={{ transform: 'translateZ(20px)' }}
                        >
                          <NfcProductImage
                            src={convertBundleToProduct(bundle).image}
                            alt={bundle.title}
                            format="stand"
                            aspectRatio="aspect-[16/9]"
                            priority={true}
                            className="group-hover:scale-104 transition-transform duration-500"
                            showBadge={true}
                            badgeLabel={`${bundle.itemsIncluded.length} Formats Included`}
                          />
                        </div>

                      {/* Pricing Display */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
                        <div>
                          <div className="text-xs text-slate-400 line-through">
                            Regular Price: ₱{bundle.originalPrice.toLocaleString()}
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 flex items-baseline gap-1 mt-0.5">
                            <span className="text-base text-sky-700 font-bold">₱</span>
                            <span>{bundle.discountedPrice.toLocaleString()}</span>
                            <span className="text-xs font-normal text-slate-500 ml-1">bundle</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                            SAVE ₱{bundle.savings.toLocaleString()}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-1 font-medium">
                            {bundle.discountPercentage}% Savings
                          </div>
                        </div>
                      </div>

                      {/* What's Included (Visual Breakdown) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-sky-600" />
                            Hardware Included:
                          </span>
                          <span className="text-xs text-sky-700 font-semibold">
                            {bundle.itemsIncluded.reduce((acc, i) => acc + i.quantity, 0)} Units
                          </span>
                        </div>

                        <div className="space-y-2">
                          {bundle.itemsIncluded.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                            >
                              <span className="shrink-0 w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center border border-sky-200">
                                {item.quantity}×
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-900 flex items-center justify-between">
                                  <span className="truncate">{item.productName}</span>
                                  <span className="text-[10px] text-slate-500 uppercase font-medium ml-2 shrink-0">
                                    {item.format}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-snug truncate mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Business Benefit Box */}
                      <div className="text-xs text-slate-700 bg-sky-50/70 p-3 rounded-xl border border-sky-200/80 leading-relaxed">
                        <div className="font-bold text-sky-900 flex items-center gap-1.5 mb-1">
                          <Store className="w-3.5 h-3.5 text-sky-700" />
                          <span>Business Benefit:</span>
                        </div>
                        <p className="text-slate-600 text-xs">
                          {bundle.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Lower Actions */}
                    <div className="p-6 sm:p-8 pt-0 space-y-2.5">
                      <button
                        id={`view-bundle-details-${bundle.id}-btn`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const bundleProduct = convertBundleToProduct(bundle);
                          if (onSelectBundleDetail) {
                            onSelectBundleDetail(bundleProduct);
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-sky-800 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-700" />
                        <span>View Details & Specs</span>
                      </button>

                      <button
                        id={`add-bundle-${bundle.id}-btn`}
                        type="button"
                        onClick={(e) => handleAddBundle(bundle, e)}
                        disabled={isAdding}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98 ${
                          isPopular
                            ? 'bg-sky-600 hover:bg-sky-500 text-white font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isAdding ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add Bundle to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        id={`buy-bundle-now-${bundle.id}-btn`}
                        type="button"
                        onClick={(e) => handleBuyNow(bundle, e)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Instant Checkout with Bundle Discount</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TiltCard3D>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* 2. BULK SAVINGS BUNDLES (Single Product Packs: TMY-1, TMY-2, TMY-3, TMY-4 in 5-Pack & 10-Pack) */}
        {(activeTab === 'all' || activeTab === 'bulk') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                    <Boxes className="w-6 h-6 text-sky-600" />
                    Bulk Savings Bundles (Single Product Packs)
                  </h3>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    Volume Pricing
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Equip multiple checkout counters, dining tables, or sales teams with dedicated 5-pack and 10-pack volume savings.
                </p>
              </div>

              {/* Bulk Filter by Model */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium mr-1">Filter Model:</span>
                {(['all', 'TMY-1', 'TMY-2', 'TMY-3', 'TMY-4'] as const).map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => setBulkFilter(model)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      bulkFilter === model
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {model === 'all' ? 'All Models (8)' : model}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch card-perspective-container">
              {filteredBulkBundles.map((bundle, idx) => {
                const isAdding = addingId === bundle.id;
                const is10Pack = bundle.unitCount === 10;

                return (
                  <div key={bundle.id} className="card-perspective-container h-full">
                    <TiltCard3D
                      id={`bulk-bundle-${bundle.id}`}
                      onClick={() => {
                        const bundleProduct = convertBundleToProduct(bundle);
                        if (onSelectBundleDetail) {
                          onSelectBundleDetail(bundleProduct);
                        }
                      }}
                      maxTilt={7}
                      scale={1.018}
                      className={`group rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer product-card-glass card-3d-interactive overflow-hidden relative h-full ${
                        is10Pack
                          ? 'border-2 border-sky-400/80 shadow-md'
                          : 'border border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Specular Glare Reflection on Hover */}
                      <div className="specular-layer" />

                      <div className="p-5 space-y-4">
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-800 text-[11px] font-bold border border-slate-200 uppercase tracking-wide">
                            {bundle.skuCode} · {bundle.unitCount} Units
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            SAVE ₱{bundle.savings.toLocaleString()}
                          </span>
                        </div>

                        {/* Title & Benefit */}
                        <div>
                          <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                            {bundle.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {bundle.subtitle}
                          </p>
                        </div>

                        {/* Product Thumbnail with explicit aspect ratio & unclipped view */}
                        <div className="relative">
                          <NfcProductImage
                            src={convertBundleToProduct(bundle).image}
                            alt={bundle.title}
                            format={bundle.skuCode.toLowerCase()}
                            aspectRatio="aspect-[4/3]"
                            priority={true}
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-white text-[11px] font-bold">
                            ₱{bundle.perPiecePrice}/pc
                          </div>
                        </div>

                        {/* Pricing block */}
                        <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-400 line-through">
                              Reg: ₱{bundle.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              {bundle.discountPercentage}% OFF
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between pt-0.5">
                            <div className="text-xl font-extrabold font-display text-slate-900 flex items-baseline">
                              <span className="text-sm text-sky-700 font-bold mr-0.5">₱</span>
                              <span>{bundle.discountedPrice.toLocaleString()}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-600">
                              (₱{bundle.perPiecePrice}/pc)
                            </span>
                          </div>
                        </div>

                        {/* Quick Highlight bullet */}
                        <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{bundle.idealFor}</span>
                        </div>
                      </div>

                      {/* Bottom Card Actions */}
                      <div className="p-5 pt-0 space-y-2">
                        <button
                          type="button"
                          onClick={(e) => handleAddBundle(bundle, e)}
                          disabled={isAdding}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 ${
                            is10Pack
                              ? 'bg-sky-600 hover:bg-sky-500 text-white font-bold'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          {isAdding ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add {bundle.unitCount}-Pack</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(bundle, e)}
                          className="w-full py-1.5 px-3 rounded-lg text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Instant Buy</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </TiltCard3D>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Trust & Quality Strip */}
        <div className="mt-14 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
                100% Pre-programmed & Tested Guarantee
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                  Plug & Play
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Every single stand, card, and tag in your bundle is individually pre-encoded with your business Google Review URL and verified across iOS & Android before packing.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500">Need 20+ units or custom enterprise branding?</span>
            <a
              href="https://wa.me/639764421242?text=Hi%20TAPPY!%20I%20am%20interested%20in%20an%20enterprise%20bulk%20quote."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors inline-flex items-center gap-1"
            >
              <span>Custom Quote</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
