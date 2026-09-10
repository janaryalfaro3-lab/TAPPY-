export type ProductFormat = 'stand' | 'tag' | 'card' | 'sticker';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  size: string;
  material: string;
  chipType: string;
  format: ProductFormat;
  features: string[];
  price: number;
  image: string;
  badge?: string;
  idealFor: string;
  isBundle?: boolean;
  bundleItems?: BundleItemDetail[];
  originalPrice?: number;
  savings?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customGoogleLink?: string;
  businessName?: string;
}

export type PaymentMethodId = 'gcash' | 'maya' | 'card' | 'bank_transfer';

export interface PaymentOption {
  id: PaymentMethodId;
  name: string;
  description: string;
  badge?: string;
  iconName: string;
}

export interface CustomerInfo {
  businessName: string;
  googleReviewUrlOrPlace: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export interface BundleItemDetail {
  productId: string;
  productName: string;
  quantity: number;
  format: ProductFormat;
  description: string;
}

export interface BundleOffer {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  discountPercentage: number;
  description: string;
  itemsIncluded: BundleItemDetail[];
  highlights: string[];
  idealFor: string;
  isPopular?: boolean;
  accentGradient: string;
  category?: 'kit' | 'bulk';
  unitCount?: number;
  perPiecePrice?: number;
  skuCode?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethodId;
  customerInfo: CustomerInfo;
  status: OrderStatus;
  estimatedDelivery: string;
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  smsNotification?: {
    sent: boolean;
    recipient: string;
    timestamp?: string;
    messageId?: string;
  };
}
