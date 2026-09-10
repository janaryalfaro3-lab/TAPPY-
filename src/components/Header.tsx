import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Heart, Truck, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { Logo } from './Logo';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderHistory: () => void;
  onNavigateToProducts: () => void;
  onNavigateToBundles?: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToReviews?: () => void;
  onNavigateToImpact?: () => void;
  onNavigateToFaqs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderHistory,
  onNavigateToProducts,
  onNavigateToBundles,
  onNavigateToHowItWorks,
  onNavigateToReviews,
  onNavigateToImpact,
  onNavigateToFaqs,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { wishlistCount } = useWishlist();

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Professional Brand Logo */}
        <Logo
          size="md"
          variant="light"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
        />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            id="nav-products-btn"
            onClick={onNavigateToProducts}
            className="hover:text-slate-900 transition-colors cursor-pointer py-1"
          >
            Products
          </button>
          {onNavigateToBundles && (
            <button
              id="nav-bundles-btn"
              onClick={onNavigateToBundles}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1 flex items-center gap-1.5 text-sky-700 font-semibold"
            >
              <span>Bundle Offers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                Save 22%
              </span>
            </button>
          )}
          <button
            id="nav-how-it-works-btn"
            onClick={onNavigateToHowItWorks}
            className="hover:text-slate-900 transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          {onNavigateToImpact && (
            <button
              id="nav-impact-btn"
              onClick={onNavigateToImpact}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Impact
            </button>
          )}
          {onNavigateToReviews && (
            <button
              id="nav-reviews-btn"
              onClick={onNavigateToReviews}
              className="hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              Testimonials
            </button>
          )}
          <button
            id="nav-faqs-btn"
            onClick={onNavigateToFaqs}
            className="hover:text-slate-900 transition-colors cursor-pointer py-1"
          >
            FAQs
          </button>
        </nav>

        {/* Right Action Controls: Orders + Wishlist + Cart + Shop Now */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Orders Tracking */}
          <button
            id="orders-tracking-trigger-btn"
            onClick={onOpenOrderHistory}
            className="relative px-3 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs rounded-lg"
            aria-label="Track Orders"
            title="Track Orders & View Purchase Status"
          >
            <Truck className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Orders</span>
          </button>

          {/* Wishlist */}
          <button
            id="wishlist-trigger-btn"
            onClick={onOpenWishlist}
            className={`relative px-3 py-2 border rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs ${
              wishlistCount > 0
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            aria-label="Saved Wishlist"
            title="View Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline">Saved</span>
            {wishlistCount > 0 && (
              <span className="text-[11px] text-white bg-rose-500 font-bold px-1.5 py-0.2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="relative px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-xs rounded-lg"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-slate-200" />
            <span className="hidden sm:inline">Cart</span>
            <span className="text-xs bg-sky-500 text-white font-bold px-1.5 py-0.2 rounded-full leading-tight">
              {totalItemCount}
            </span>
          </button>

          {/* Shop Hardware Direct CTA */}
          <button
            id="header-shop-now-btn"
            onClick={onNavigateToProducts}
            className="hidden md:inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 shadow-lg">
          <div className="flex gap-2 pt-1 pb-2">
            <button
              id="mobile-nav-orders-btn"
              onClick={() => {
                onOpenOrderHistory();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <Truck className="w-4 h-4 text-sky-600" />
              <span>Track Orders</span>
            </button>

            <button
              id="mobile-nav-wishlist-btn"
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
              <span>Saved ({wishlistCount})</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-1">
            <button
              id="mobile-nav-products-btn"
              onClick={() => {
                onNavigateToProducts();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              Products
            </button>

            {onNavigateToBundles && (
              <button
                id="mobile-nav-bundles-btn"
                onClick={() => {
                  onNavigateToBundles();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full text-left py-2.5 px-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
              >
                <span>Bundle Offers</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Save 22%
                </span>
              </button>
            )}

            <button
              id="mobile-nav-how-it-works-btn"
              onClick={() => {
                onNavigateToHowItWorks();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              How It Works
            </button>

            {onNavigateToImpact && (
              <button
                id="mobile-nav-impact-btn"
                onClick={() => {
                  onNavigateToImpact();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2.5 px-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                Impact
              </button>
            )}

            {onNavigateToReviews && (
              <button
                id="mobile-nav-reviews-btn"
                onClick={() => {
                  onNavigateToReviews();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2.5 px-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                Testimonials
              </button>
            )}

            <button
              id="mobile-nav-faqs-btn"
              onClick={() => {
                onNavigateToFaqs();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              FAQs
            </button>
          </div>

          <button
            id="mobile-shop-now-btn"
            onClick={() => {
              onNavigateToProducts();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 text-center block transition-colors mt-3 rounded-lg shadow-xs cursor-pointer"
          >
            Explore Hardware Catalog
          </button>
        </div>
      )}
    </header>
  );
};
