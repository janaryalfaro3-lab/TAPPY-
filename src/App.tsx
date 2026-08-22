/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order } from './types';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustBanner } from './components/TrustBanner';
import { ProductSection } from './components/ProductSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { BeautySection } from './components/BeautySection';
import { FAQSection } from './components/FAQSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { InteractiveTapDemo } from './components/InteractiveTapDemo';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { PolicyModal, PolicyType } from './components/PolicyModal';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isTapDemoOpen, setIsTapDemoOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

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
  };

  // Scroll Navigation
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectMaterialProduct = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    } else {
      scrollToSection('products-section');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col selection:bg-[#62D8D0]/30 selection:text-[#F5F5F5] font-sans antialiased">
      {/* 1. Header */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateToProducts={() => scrollToSection('products-section')}
        onNavigateToHowItWorks={() => scrollToSection('how-it-works-section')}
        onNavigateToMaterials={() => scrollToSection('materials-section')}
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

        {/* 6. Materials / Finishes (Acrylic vs PVC visual comparison) */}
        <BeautySection
          onSelectStand={() => handleSelectMaterialProduct('acrylic-stand')}
          onSelectCard={() => handleSelectMaterialProduct('pvc-card')}
        />

        {/* 7. FAQs (Clean Accordion) */}
        <FAQSection />

        {/* 8. Final Product CTA */}
        <FinalCTA onShopClick={() => scrollToSection('products-section')} />
      </main>

      {/* 9. Minimal Footer */}
      <Footer
        onNavigateToProducts={() => scrollToSection('products-section')}
        onNavigateToHowItWorks={() => scrollToSection('how-it-works-section')}
        onNavigateToFaqs={() => scrollToSection('faqs-section')}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
      />

      {/* Modals & Drawers */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
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
    </div>
  );
}
