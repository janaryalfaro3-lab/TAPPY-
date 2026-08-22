import { Product } from '../types';

import heroImg from '../assets/images/hero_nfc_products_1787383054839.jpg';
import standImg from '../assets/images/acrylic_stand_1787383072787.jpg';
import tagImg from '../assets/images/acrylic_tag_1787383087133.jpg';
import cardImg from '../assets/images/pvc_card_1787383105360.jpg';
import stickerImg from '../assets/images/pvc_sticker_1787383126222.jpg';
import beautyImg from '../assets/images/beauty_macro_details_1787383143898.jpg';

export const ASSET_IMAGES = {
  hero: heroImg,
  stand: standImg,
  tag: tagImg,
  card: cardImg,
  sticker: stickerImg,
  beauty: beautyImg,
};

export const PRODUCTS: Product[] = [
  {
    id: 'acrylic-stand',
    name: 'Acrylic Google Review Standee',
    tagline: '90 × 110 mm · Acrylic (with NTAG213 NFC)',
    description: 'A premium clear acrylic countertop display stand for reception desks, cafés, restaurants, salons and hotel lobbies.',
    size: '90 × 110 mm',
    material: 'Acrylic',
    chipType: 'NTAG213 NFC',
    format: 'stand',
    features: ['90 × 110 mm', 'Crystal Acrylic', 'NTAG213 NFC', 'QR Code Fallback'],
    price: 1490,
    image: standImg,
    badge: '2 Acrylic Samples',
    idealFor: 'Countertops, reception desks, checkout desks, hotel lobbies'
  },
  {
    id: 'acrylic-tag',
    name: 'Acrylic NFC Tag (Square)',
    tagline: '40 × 40 mm · Acrylic (with NTAG213 NFC)',
    description: 'A compact square clear acrylic review standee with NTAG213 NFC chip and QR code for minimal counter setups.',
    size: '40 × 40 mm',
    material: 'Acrylic',
    chipType: 'NTAG213 NFC',
    format: 'tag',
    features: ['40 × 40 mm', 'Square Acrylic', 'NTAG213 NFC', 'QR Code'],
    price: 590,
    image: tagImg,
    badge: '2 Acrylic Samples',
    idealFor: 'Counters, POS terminals, compact dining tables'
  },
  {
    id: 'pvc-card',
    name: 'PVC NFC Business Card',
    tagline: '85.6 × 54 mm · PVC (with NTAG213 NFC)',
    description: 'A slim, durable matte PVC card with rounded corners. Easy to hand to customers, slide into bill folders, or set at checkout.',
    size: '85.6 × 54 mm',
    material: 'PVC',
    chipType: 'NTAG213 NFC',
    format: 'card',
    features: ['85.6 × 54 mm', 'Matte PVC', 'NTAG213 NFC', 'QR Code'],
    price: 490,
    image: cardImg,
    badge: '2 PVC Samples',
    idealFor: 'Checkout counters, bill presenters, staff handouts'
  },
  {
    id: 'pvc-sticker',
    name: 'PVC NFC Sticker (Round)',
    tagline: '40 × 40 mm · PVC (with NTAG213 NFC)',
    description: 'A compact circular adhesive NFC sticker with strong backing for dining tables, glass doors, takeout menus, and counters.',
    size: '40 × 40 mm (Round)',
    material: 'PVC',
    chipType: 'NTAG213 NFC',
    format: 'sticker',
    features: ['40 × 40 mm (Round)', 'Durable PVC', 'NTAG213 NFC', 'QR Code', 'Strong Adhesive'],
    price: 350,
    image: stickerImg,
    badge: '2 PVC Samples',
    idealFor: 'Tables, counters, doors, menus, window displays'
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'gcash',
    name: 'GCash',
    description: 'Instant mobile wallet payment via QR or mobile number.',
    badge: 'Fastest in PH',
    iconName: 'Smartphone'
  },
  {
    id: 'maya',
    name: 'Maya',
    description: 'Pay with Maya wallet, Maya QR, or Maya credit.',
    badge: 'Direct Pay',
    iconName: 'Zap'
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, JCB, and American Express processed securely.',
    badge: 'Encrypted',
    iconName: 'CreditCard'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct transfer via BDO, BPI, UnionBank, or InstaPay.',
    badge: 'Zero Processing Fee',
    iconName: 'Building'
  }
] as const;
