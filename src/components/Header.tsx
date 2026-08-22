import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onNavigateToProducts: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToMaterials: () => void;
  onNavigateToFaqs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onNavigateToProducts,
  onNavigateToHowItWorks,
  onNavigateToMaterials,
  onNavigateToFaqs,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5'
          : 'bg-[#050505] border-b border-white/5 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Name / Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col text-left group focus:outline-none cursor-pointer"
        >
          <span className="font-display text-base sm:text-lg font-bold tracking-[0.14em] uppercase text-[#E0E0E0] group-hover:text-white transition-colors">
            TAPREVIEWNFC
          </span>
          <span className="text-[9px] font-mono tracking-[0.18em] text-[#949494] uppercase -mt-0.5">
            NFC GOOGLE REVIEW
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-wider text-[#949494] font-medium">
          <button
            id="nav-products-btn"
            onClick={onNavigateToProducts}
            className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
          >
            Products
          </button>
          <button
            id="nav-how-it-works-btn"
            onClick={onNavigateToHowItWorks}
            className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          <button
            id="nav-materials-btn"
            onClick={onNavigateToMaterials}
            className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
          >
            Materials
          </button>
          <button
            id="nav-faqs-btn"
            onClick={onNavigateToFaqs}
            className="hover:text-[#E0E0E0] transition-colors cursor-pointer py-1"
          >
            FAQs
          </button>
        </nav>

        {/* Right Action Controls: Cart + Shop Now */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart Trigger */}
          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="relative px-3.5 py-2 border border-white/10 hover:border-white/20 bg-[#0E0E0E] hover:bg-[#141414] text-[#E0E0E0] transition-all flex items-center gap-2 text-[11px] uppercase tracking-wider font-medium cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#E0E0E0]" />
            <span className="hidden sm:inline">Cart</span>
            <span className="font-mono text-[#2DD4BF] font-semibold">({totalItemCount})</span>
          </button>

          {/* Primary Shop Now Button */}
          <button
            id="header-shop-now-btn"
            onClick={onNavigateToProducts}
            className="hidden sm:inline-flex items-center justify-center bg-[#E0E0E0] text-[#050505] hover:bg-white px-5 py-2 text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer active:scale-95"
          >
            Shop Now
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-[#0E0E0E] border border-white/10 text-[#E0E0E0] hover:bg-[#141414] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl">
          <button
            id="mobile-nav-products-btn"
            onClick={() => {
              onNavigateToProducts();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-medium text-[#949494] hover:text-[#E0E0E0] transition-colors"
          >
            Products
          </button>
          <button
            id="mobile-nav-how-it-works-btn"
            onClick={() => {
              onNavigateToHowItWorks();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-medium text-[#949494] hover:text-[#E0E0E0] transition-colors"
          >
            How It Works
          </button>
          <button
            id="mobile-nav-materials-btn"
            onClick={() => {
              onNavigateToMaterials();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-medium text-[#949494] hover:text-[#E0E0E0] transition-colors"
          >
            Materials
          </button>
          <button
            id="mobile-nav-faqs-btn"
            onClick={() => {
              onNavigateToFaqs();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[12px] uppercase tracking-wider font-medium text-[#949494] hover:text-[#E0E0E0] transition-colors"
          >
            FAQs
          </button>

          <button
            id="mobile-shop-now-btn"
            onClick={() => {
              onNavigateToProducts();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#050505] bg-[#E0E0E0] hover:bg-white text-center block transition-colors mt-2"
          >
            Shop Now
          </button>
        </div>
      )}
    </header>
  );
};
