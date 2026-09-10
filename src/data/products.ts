import { Product } from '../types';

import heroImg from '../assets/images/lineup_tabletop_16_9.jpg';
import standImg from '../assets/images/stand_individual_look_1789054874490.jpg';
import tagImg from '../assets/images/tag_individual_look_1789054891888.jpg';
import cardImg from '../assets/images/card_individual_look_1789054908528.jpg';
import stickerImg from '../assets/images/sticker_individual_look_1789054924469.jpg';
import suiteBundleImg from '../assets/images/lineup_tabletop_16_9.jpg';
import starterBundleImg from '../assets/images/tappy_bundle_starter_hd.jpg';
import businessBundleImg from '../assets/images/tappy_bundle_business_hd.jpg';
import tabletopImg from '../assets/images/lineup_tabletop_16_9.jpg';
import posterImg from '../assets/images/master_full_banner.jpg';
import logoMintImg from '../assets/images/tappy_mint_logo.png';
import logoTransparentImg from '../assets/images/tappy_logo_transparent.png';

export const ASSET_IMAGES = {
  hero: heroImg,
  poster: posterImg,
  stand: standImg,
  tag: tagImg,
  card: cardImg,
  sticker: stickerImg,
  bundleSuite: suiteBundleImg,
  bundleStarter: starterBundleImg,
  bundleBusiness: businessBundleImg,
  beauty: tabletopImg,
  tabletop: tabletopImg,
  logoMint: logoMintImg,
  logoTransparent: logoTransparentImg,
};

export const PRODUCTS: Product[] = [
  {
    id: 'acrylic-stand',
    name: 'TMY-1 Premium Stand (Acrylic)',
    tagline: '90 × 110 mm · Crystal Acrylic (with NTAG213 NFC)',
    description: 'A premium clear acrylic countertop display stand for reception desks, cafés, restaurants, salons and hotel lobbies.',
    size: '90 × 110 mm',
    material: 'Acrylic',
    chipType: 'NTAG213 NFC',
    format: 'stand',
    features: ['90 × 110 mm', 'Crystal Acrylic', 'NTAG213 NFC', 'QR Code Fallback'],
    price: 1490,
    image: standImg,
    badge: 'TMY-1 Premium',
    idealFor: 'Countertops, reception desks, checkout desks, hotel lobbies',
  },
  {
    id: 'acrylic-tag',
    name: 'TMY-2 Mini Stand (Acrylic Tag)',
    tagline: '40 × 40 mm · Crystal Acrylic (with NTAG213 NFC)',
    description: 'A compact square clear acrylic review standee with NTAG213 NFC chip and QR code for minimal counter setups.',
    size: '40 × 40 mm',
    material: 'Acrylic',
    chipType: 'NTAG213 NFC',
    format: 'tag',
    features: ['40 × 40 mm', 'Square Acrylic', 'NTAG213 NFC', 'QR Code'],
    price: 590,
    image: tagImg,
    badge: 'TMY-2 Mini',
    idealFor: 'Counters, POS terminals, compact dining tables',
  },
  {
    id: 'pvc-card',
    name: 'TMY-3 NFC Card (PVC Business Card)',
    tagline: '85.6 × 54 mm · Matte PVC (with NTAG213 NFC)',
    description: 'A slim, durable matte PVC card with rounded corners. Easy to hand to customers, slide into bill folders, or set at checkout.',
    size: '85.6 × 54 mm',
    material: 'PVC',
    chipType: 'NTAG213 NFC',
    format: 'card',
    features: ['85.6 × 54 mm', 'Matte PVC', 'NTAG213 NFC', 'QR Code'],
    price: 490,
    image: cardImg,
    badge: 'TMY-3 Card',
    idealFor: 'Checkout counters, bill presenters, staff handouts',
  },
  {
    id: 'pvc-sticker',
    name: 'TMY-4 NFC Tag (Round PVC Sticker)',
    tagline: '40 × 40 mm · PVC (with NTAG213 NFC)',
    description: 'A compact circular adhesive NFC sticker with strong backing for dining tables, glass doors, takeout menus, and counters.',
    size: '40 × 40 mm (Round)',
    material: 'PVC',
    chipType: 'NTAG213 NFC',
    format: 'sticker',
    features: ['40 × 40 mm (Round)', 'Durable PVC', 'NTAG213 NFC', 'QR Code', 'Strong Adhesive'],
    price: 350,
    image: stickerImg,
    badge: 'TMY-4 Tag',
    idealFor: 'Tables, counters, doors, menus, window displays',
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'gcash',
    name: 'GCash',
    description: 'Send payment to 09764421242 (TAPPY OFFICIAL STORE). Instant verification.',
    badge: '09764421242',
    iconName: 'Smartphone'
  },
  {
    id: 'maya',
    name: 'Maya',
    description: 'Send payment to 09764421242 (TAPPY OFFICIAL STORE). Maya Wallet & QR.',
    badge: '09764421242',
    iconName: 'Zap'
  },
  {
    id: 'bank_transfer',
    name: 'GoTyme Bank Transfer',
    description: 'GoTyme Bank: 016846634686 (TAPPY OFFICIAL STORE) via InstaPay / PESONet.',
    badge: 'Acc: 016846634686',
    iconName: 'Building'
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, JCB, and American Express processed securely.',
    badge: 'Encrypted',
    iconName: 'CreditCard'
  }
] as const;
