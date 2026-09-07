/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order } from './types';

import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustBanner } from './components/TrustBanner';
import { ProductSection } from './components/ProductSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { NumbersThatMatterSection } from './components/NumbersThatMatterSection';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { FAQSection } from './components/FAQSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { InteractiveTapDemo } from './components/InteractiveTapDemo';
import { SupportFloatingActionButton } from './components/SupportFloatingActionButton';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { ToastProvider, useToast } from './components/ToastProvider';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WishlistModal } from './components/WishlistModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { BackToTop } from './components/BackToTop';
import { OrderTrackingPage } from './components/OrderTrackingPage';

function StorefrontApp() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isTapDemoOpen, setIsTapDemoOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  const { themeVariant } = useTheme();
  const { showCartToast, showToast } = useToast();

  // Check URL query param for shared product link (?product=...) or direct tracking link (?track=... or ?order=...)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const trackParam = params.get('track') || params.get('order');
      if (trackParam) {
        setActiveTrackingOrderId(trackParam.toUpperCase());
        return;
      }

      const productId = params.get('product');
      if (productId) {
        const found = PRODUCTS.find((p) => p.id === productId);
        if (found) {
          setSelectedProduct(found);
          setTimeout(() => {
            const el = document.getElementById('products-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    } catch (e) {
      console.warn('Could not read product/tracking URL param', e);
    }
  }, []);

  const handleOpenTrackingPage = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    setActiveTrackingOrderId(clean);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('track', clean);
      window.history.pushState({}, '', url.toString());
    } catch (e) {}
  };

  const handleBackFromTracking = () => {
    setActiveTrackingOrderId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('track');
      url.searchParams.delete('order');
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    customLink?: string,
    businessName?: string
  ) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        if (customLink) updated[existingIndex].customGoogleLink = customLink;
        if (businessName) updated[existingIndex].businessName = businessName;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            quantity,
            customGoogleLink: customLink,
            businessName,
          },
        ];
      }
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1800);

    // Trigger instant global toast notification
    showCartToast(product, quantity, () => setIsCartOpen(true));
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBuyNow = (
    product: Product,
    quantity = 1,
    customLink?: string,
    businessName?: string
  ) => {
    handleAddToCart(product, quantity, customLink, businessName);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setConfirmedOrder(order);
    setIsCheckoutOpen(false);
    setCartItems([]); // clear cart

    // Persist to local storage order history
    try {
      const stored = localStorage.getItem('tapreviewnfc_order_history');
      const currentOrders: Order[] = stored ? JSON.parse(stored) : [];
      const updated = [order, ...currentOrders.filter((o) => o.id !== order.id)];
      localStorage.setItem('tapreviewnfc_order_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save order to localStorage', e);
    }
  };

  const handleReorder = (items: CartItem[]) => {
    items.forEach((item) => {
      handleAddToCart(
        item.product,
        item.quantity,
        item.customGoogleLink,
        item.businessName
      );
    });
    setIsCartOpen(true);
  };

  // Scroll Navigation
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (activeTrackingOrderId) {
    return (
      <div className={`min-h-screen text-slate-100 flex flex-col font-sans antialiased relative transition-colors duration-300 ${
        themeVariant === 'deep-midnight' ? 'bg-slate-950 theme-deep-midnight' : 'bg-slate-900 theme-soft-slate'
      }`}>
        <OrderTrackingPage
          orderId={activeTrackingOrderId}
          onBackToStore={handleBackFromTracking}
          onOpenChatWithOrder={(orderId) => {
            // Can open chatbot and ask
          }}
        />
        <SupportFloatingActionButton onOpenTrackingPage={handleOpenTrackingPage} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200 font-sans antialiased relative transition-colors duration-300 ${
      themeVariant === 'deep-midnight' ? 'bg-slate-950 theme-deep-midnight' : 'bg-slate-900 theme-soft-slate'
    }`}>
      {/* 0. Viewport Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 1. Header */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onNavigateToProducts={() => scrollToSection('products-section')}
        onNavigateToHowItWorks={() => scrollToSection('how-it-works-section')}
        onNavigateToImpact={() => scrollToSection('numbers-that-matter-section')}
        onNavigateToReviews={() => scrollToSection('testimonials-section')}
        onNavigateToFaqs={() => scrollToSection('faqs-section')}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          onShopClick={() => scrollToSection('products-section')}
          onHowItWorksClick={() => scrollToSection('how-it-works-section')}
        />

        {/* 3. Trust Banner */}
        <TrustBanner />

        {/* 4. Products Section (4 main products: Stand, Tag, Card, Sticker) */}
        <ProductSection
          products={PRODUCTS}
          onAddToCart={(product, qty = 1) => handleAddToCart(product, qty)}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

        {/* 5. How It Works (3 clear human steps) */}
        <HowItWorksSection onTryTapDemo={() => setIsTapDemoOpen(true)} />

        {/* 6. Numbers That Matter (Animated Counter Impact Section) */}
        <NumbersThatMatterSection
          onExploreProducts={() => scrollToSection('products-section')}
        />

        {/* 7. Customer Testimonials Carousel with Background Video */}
        <CustomerTestimonials />

        {/* 8. FAQs (Clean Accordion) */}
        <FAQSection />

        {/* 9. Final Product CTA */}
        <FinalCTA onShopClick={() => scrollToSection('products-section')} />
      </main>

      {/* Persistent Floating Action Button (FAB) for WhatsApp & Messenger Support */}
      <SupportFloatingActionButton onOpenTrackingPage={handleOpenTrackingPage} />

      {/* 9. Minimal Footer */}
      <Footer
        onNavigateToProducts={() => scrollToSection('products-section')}
        onNavigateToHowItWorks={() => scrollToSection('how-it-works-section')}
        onNavigateToImpact={() => scrollToSection('numbers-that-matter-section')}
        onNavigateToReviews={() => scrollToSection('testimonials-section')}
        onNavigateToFaqs={() => scrollToSection('faqs-section')}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
      />

      {/* Modals & Drawers */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, qty, link, biz) => handleAddToCart(product, qty, link, biz)}
        onBuyNow={handleBuyNow}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onShopProducts={() => scrollToSection('products-section')}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Confirmation Screen */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onOpenTrackingPage={handleOpenTrackingPage}
        onContinueShopping={() => {
          setConfirmedOrder(null);
          scrollToSection('products-section');
        }}
      />

      {/* Interactive NFC Tap Simulator */}
      <InteractiveTapDemo
        isOpen={isTapDemoOpen}
        onClose={() => setIsTapDemoOpen(false)}
      />

      {/* Policy Modal (Shipping, Contact, Terms, etc.) */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Local Storage Saved Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onAddToCart={(product, qty, e) => handleAddToCart(product, qty)}
        onNavigateToProducts={() => scrollToSection('products-section')}
      />

      {/* Local Storage Order History & Live Tracking Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onReorder={handleReorder}
        onNavigateToProducts={() => scrollToSection('products-section')}
        onOpenTrackingPage={handleOpenTrackingPage}
      />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <WishlistProvider>
          <StorefrontApp />
        </WishlistProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

