import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Heart, Truck, Moon, Sparkles, Sliders, Radio } from 'lucide-react';
import { CartItem } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './ToastProvider';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderHistory: () => void;
  onNavigateToProducts: () => void;
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
  onNavigateToHowItWorks,
  onNavigateToReviews,
  onNavigateToImpact,
  onNavigateToFaqs,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { wishlistCount } = useWishlist();
  const { themeVariant, toggleThemeVariant } = useTheme();
  const { showToast } = useToast();

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleToggleTheme = () => {
    toggleThemeVariant();
    const nextVariant = themeVariant === 'deep-midnight' ? 'Soft Slate' : 'Deep Midnight';
    showToast({
      type: 'info',
      title: `Theme: ${nextVariant}`,
      message:
        nextVariant === 'Soft Slate'
          ? 'Switched to Soft Slate dark mode (calm slate tones)'
          : 'Switched to Deep Midnight dark mode (high-contrast obsidian black)',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3.5'
          : 'bg-slate-900/70 backdrop-blur-md border-b border-slate-800/60 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Name / Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <Radio className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              TAPPY <span className="text-[11px] font-medium tracking-normal text-slate-400 font-sans border border-slate-700 px-1.5 py-0.5 rounded">NFC</span>
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium">
              Google Review Hardware
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            id="nav-products-btn"
            onClick={onNavigateToProducts}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Products
          </button>
          <button
            id="nav-how-it-works-btn"
            onClick={onNavigateToHowItWorks}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          {onNavigateToImpact && (
            <button
              id="nav-impact-btn"
              onClick={onNavigateToImpact}
              className="hover:text-white transition-colors cursor-pointer py-1"
            >
              Impact
            </button>
          )}
          {onNavigateToReviews && (
            <button
              id="nav-reviews-btn"
              onClick={onNavigateToReviews}
              className="hover:text-white transition-colors cursor-pointer py-1"
            >
              Testimonials
            </button>
          )}
          <button
            id="nav-faqs-btn"
            onClick={onNavigateToFaqs}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            FAQs
          </button>
        </nav>

        {/* Right Action Controls: Dark Variant Toggle + Orders + Wishlist + Cart + Shop Now */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Subtle Dark Mode Variant Preference Toggle */}
          <button
            id="theme-dark-variant-toggle-btn"
            type="button"
            onClick={handleToggleTheme}
            className={`relative px-2.5 sm:px-3 py-2 border rounded-xl transition-all flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold cursor-pointer shadow-xs active:scale-95 group backdrop-blur-md ${
              themeVariant === 'deep-midnight'
                ? 'border-indigo-500/40 bg-slate-900/80 hover:bg-slate-800 text-indigo-300'
                : 'border-sky-500/40 bg-slate-800/80 hover:bg-slate-700 text-sky-300'
            }`}
            aria-label="Toggle Dark Mode Variant (Deep Midnight vs Soft Slate)"
            title={`Current: ${themeVariant === 'deep-midnight' ? 'Deep Midnight' : 'Soft Slate'} — Click to switch`}
          >
            {themeVariant === 'deep-midnight' ? (
              <Moon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="hidden xl:inline font-mono text-[10px] font-bold">
              {themeVariant === 'deep-midnight' ? 'Midnight' : 'Slate'}
            </span>
          </button>

          {/* Orders Tracking Trigger */}
          <button
            id="orders-tracking-trigger-btn"
            onClick={onOpenOrderHistory}
            className="relative px-2.5 sm:px-3 py-2 border border-slate-700/80 hover:border-sky-400/70 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold cursor-pointer shadow-xs active:scale-95 group backdrop-blur-md rounded-xl"
            aria-label="Track Orders"
            title="Track Orders & View Purchase Status"
          >
            <Truck className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 transition-colors" />
            <span className="hidden md:inline font-bold">Orders</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            id="wishlist-trigger-btn"
            onClick={onOpenWishlist}
            className={`relative px-2.5 sm:px-3 py-2 border rounded-xl transition-all flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold cursor-pointer shadow-xs active:scale-95 group backdrop-blur-md ${
              wishlistCount > 0
                ? 'border-rose-500/40 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300'
                : 'border-slate-700/80 hover:border-rose-400/60 bg-slate-900/80 hover:bg-slate-800 text-slate-300'
            }`}
            aria-label="Saved Wishlist"
            title="View Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                wishlistCount > 0
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-slate-400 group-hover:text-rose-400'
              }`}
            />
            <span className="hidden md:inline font-bold">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="font-mono text-xs text-white bg-rose-500 font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="relative px-3 sm:px-3.5 py-2 border border-slate-700/80 hover:border-sky-400 bg-slate-900/80 hover:bg-slate-800 text-white transition-all flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold cursor-pointer shadow-xs active:scale-95 rounded-xl group backdrop-blur-md"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-400 transition-colors" />
            <span className="hidden md:inline font-bold text-slate-200">Cart</span>
            <span className="font-mono text-xs text-white bg-sky-500 font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
              {totalItemCount}
            </span>
          </button>

          {/* Primary Shop Now Button */}
          <button
            id="header-shop-now-btn"
            onClick={onNavigateToProducts}
            className="hidden lg:inline-flex items-center justify-center bg-white hover:bg-sky-50 text-slate-950 font-black border border-white px-4 sm:px-5 py-2 text-[11px] uppercase tracking-[0.14em] transition-all cursor-pointer shadow-lg hover:shadow-sky-500/20 active:scale-95 rounded-xl"
          >
            Shop Now
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 cursor-pointer shadow-xs active:scale-95 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl">
          {/* Theme Variant Toggle in Mobile Drawer */}
          <button
            id="mobile-theme-toggle-btn"
            type="button"
            onClick={() => {
              handleToggleTheme();
            }}
            className="flex items-center justify-between w-full py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[12px] uppercase tracking-wider font-semibold text-slate-200 font-mono"
          >
            <div className="flex items-center gap-2">
              {themeVariant === 'deep-midnight' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-sky-400" />
              )}
              <span>Theme: {themeVariant === 'deep-midnight' ? 'Deep Midnight' : 'Soft Slate'}</span>
            </div>
            <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              Tap to switch
            </span>
          </button>

          {/* Orders Tracking quick link in mobile drawer */}
          <button
            id="mobile-nav-orders-btn"
            onClick={() => {
              onOpenOrderHistory();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between w-full py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[12px] uppercase tracking-wider font-semibold text-sky-300 font-mono"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Track Orders & History</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">View Status</span>
          </button>

          {/* Wishlist quick link in mobile drawer */}
          <button
            id="mobile-nav-wishlist-btn"
            onClick={() => {
              onOpenWishlist();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between w-full py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[12px] uppercase tracking-wider font-semibold text-rose-300 font-mono"
          >
            <div className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
              <span>Saved Wishlist</span>
            </div>
            <span className="bg-rose-500 text-white font-mono text-xs px-2 py-0.5 rounded-full font-bold">
              {wishlistCount}
            </span>
          </button>

          <button
            id="mobile-nav-products-btn"
            onClick={() => {
              onNavigateToProducts();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-semibold text-slate-200 hover:text-sky-400 transition-colors font-mono"
          >
            Products
          </button>
          <button
            id="mobile-nav-how-it-works-btn"
            onClick={() => {
              onNavigateToHowItWorks();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-semibold text-slate-200 hover:text-sky-400 transition-colors font-mono"
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
              className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-semibold text-slate-200 hover:text-sky-400 transition-colors font-mono"
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
              className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-semibold text-slate-200 hover:text-sky-400 transition-colors font-mono"
            >
              Reviews
            </button>
          )}
          <button
            id="mobile-nav-faqs-btn"
            onClick={() => {
              onNavigateToFaqs();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-semibold text-slate-200 hover:text-sky-400 transition-colors font-mono"
          >
            FAQs
          </button>

          <button
            id="mobile-shop-now-btn"
            onClick={() => {
              onNavigateToProducts();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-950 bg-white hover:bg-sky-50 text-center block transition-colors mt-2 rounded-xl shadow-lg cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      )}
    </header>
  );
};

