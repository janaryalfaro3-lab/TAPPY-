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

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'in_production' | 'shipped' | 'delivered';

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
