import { BundleOffer, Product } from '../types';
import { ASSET_IMAGES } from './products';

/**
 * Flagship Combo Kits requested by user:
 * 1. TAPPY Starter Kit (TMY-2 + TMY-3 + TMY-4)
 * 2. TAPPY Business Kit ⭐ BEST SELLER (TMY-1 + TMY-3 + TMY-4)
 * 3. TAPPY Premium Suite (TMY-1 + TMY-2 + TMY-3 + TMY-4)
 */
export const COMBO_BUNDLES: BundleOffer[] = [
  {
    id: 'bundle-starter-kit',
    title: 'TAPPY Starter Kit',
    subtitle: 'The entry-level solution for small storefronts to cover counter displays, mobile networking, and fixed wall/POS placements.',
    badge: 'Save ₱291 · Starter Solution',
    originalPrice: 1490,
    discountedPrice: 1199,
    savings: 291,
    discountPercentage: 20,
    category: 'kit',
    unitCount: 3,
    description: 'The entry-level solution for small storefronts to cover counter displays, mobile networking, and fixed wall/POS placements.',
    itemsIncluded: [
      {
        productId: 'acrylic-tag',
        productName: 'TMY-2 Mini Stand',
        quantity: 1,
        format: 'tag',
        description: '40 × 40 mm Crystal Acrylic mini desk stand with NTAG213 NFC chip + QR code',
      },
      {
        productId: 'pvc-card',
        productName: 'TMY-3 NFC Card',
        quantity: 1,
        format: 'card',
        description: '85.6 × 54 mm Matte PVC card with rounded corners for mobile customer taps',
      },
      {
        productId: 'pvc-sticker',
        productName: 'TMY-4 NFC Tag',
        quantity: 1,
        format: 'sticker',
        description: '40 × 40 mm Round PVC adhesive tag with commercial 3M backing for walls & POS',
      },
    ],
    highlights: [
      '1× TMY-2 Mini Stand (40 × 40 mm Acrylic)',
      '1× TMY-3 NFC Card (85.6 × 54 mm Matte PVC)',
      '1× TMY-4 NFC Tag (40 × 40 mm Round 3M Sticker)',
      'Pre-programmed with your business Google Review URL',
      'Zero battery, zero app required, instant 1-tap launch',
    ],
    idealFor: 'Small storefronts, single-counter cafes, boutique studios, pop-up kiosks',
    isPopular: false,
    accentGradient: 'from-sky-500/20 via-cyan-500/10 to-transparent border-sky-500/40',
  },
  {
    id: 'bundle-business-kit',
    title: 'TAPPY Business Kit',
    subtitle: 'Equips your main reception or cashier desk with a premium stand while providing managers a portable card and secondary tag.',
    badge: '⭐ BEST SELLER · Save ₱291',
    originalPrice: 1690,
    discountedPrice: 1399,
    savings: 291,
    discountPercentage: 17,
    category: 'kit',
    unitCount: 3,
    description: 'Our most popular option. Equips your main reception or cashier desk with a premium stand while providing managers a portable card and secondary tag.',
    itemsIncluded: [
      {
        productId: 'acrylic-stand',
        productName: 'TMY-1 Premium Stand',
        quantity: 1,
        format: 'stand',
        description: '90 × 110 mm Crystal Acrylic centerpiece display for cashier & main reception',
      },
      {
        productId: 'pvc-card',
        productName: 'TMY-3 NFC Card',
        quantity: 1,
        format: 'card',
        description: '85.6 × 54 mm Matte PVC portable business card for floor managers & staff',
      },
      {
        productId: 'pvc-sticker',
        productName: 'TMY-4 NFC Tag',
        quantity: 1,
        format: 'sticker',
        description: '40 × 40 mm Round PVC 3M adhesive tag for secondary order counter or exit wall',
      },
    ],
    highlights: [
      '1× TMY-1 Premium Stand (90 × 110 mm Acrylic)',
      '1× TMY-3 NFC Card (85.6 × 54 mm Matte PVC)',
      '1× TMY-4 NFC Tag (40 × 40 mm Round 3M Sticker)',
      'Our #1 top-rated combo for physical retail & hospitality',
      'Includes free URL programming & lifetime tap durability',
    ],
    idealFor: 'Main reception desks, cashier stations, dental/medical clinics, restaurants',
    isPopular: true,
    accentGradient: 'from-sky-600/20 via-blue-500/10 to-transparent border-sky-500/50',
  },
  {
    id: 'bundle-premium-suite',
    title: 'TAPPY Premium Suite',
    subtitle: 'Comprehensive kit for high-traffic stores needing multi-touchpoint customer engagement across counters, tables, and staff.',
    badge: '👑 Complete Hardware Suite · Save ₱481',
    originalPrice: 2380,
    discountedPrice: 1899,
    savings: 481,
    discountPercentage: 20,
    category: 'kit',
    unitCount: 4,
    description: 'Comprehensive kit for high-traffic stores needing multi-touchpoint customer engagement across counters, tables, and staff.',
    itemsIncluded: [
      {
        productId: 'acrylic-stand',
        productName: 'TMY-1 Premium Stand',
        quantity: 1,
        format: 'stand',
        description: '90 × 110 mm Crystal Acrylic centerpiece display for entry/main checkout',
      },
      {
        productId: 'acrylic-tag',
        productName: 'TMY-2 Mini Stand',
        quantity: 1,
        format: 'tag',
        description: '40 × 40 mm Compact Acrylic mini stand for consultation desk or second counter',
      },
      {
        productId: 'pvc-card',
        productName: 'TMY-3 NFC Card',
        quantity: 1,
        format: 'card',
        description: '85.6 × 54 mm Matte PVC card for bill presenter or customer checkout handoff',
      },
      {
        productId: 'pvc-sticker',
        productName: 'TMY-4 NFC Tag',
        quantity: 1,
        format: 'sticker',
        description: '40 × 40 mm Round PVC 3M adhesive sticker for dining table or exit display',
      },
    ],
    highlights: [
      '1× TMY-1 Premium Stand + 1× TMY-2 Mini Stand',
      '1× TMY-3 NFC Card + 1× TMY-4 NFC Tag',
      'All 4 official TAPPY hardware form factors in one complete suite',
      'Multi-touchpoint coverage from entrance to table to bill checkout',
      'Individual pre-programming & QA tap test before dispatch',
    ],
    idealFor: 'High-traffic retail, multi-room clinics, busy bistros, aesthetic studios, hotels',
    isPopular: false,
    accentGradient: 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/40',
  },
];

/**
 * Bulk Savings Bundles (Single Product Packs) requested by user:
 * TMY-1 (5-Pack & 10-Pack)
 * TMY-2 (5-Pack & 10-Pack)
 * TMY-3 (5-Pack & 10-Pack)
 * TMY-4 (5-Pack & 10-Pack)
 */
export const BULK_BUNDLES: BundleOffer[] = [
  {
    id: 'bulk-tmy1-5pack',
    title: 'TMY-1 Premium Stand (5-Pack)',
    subtitle: 'Outfits up to 5 checkout counters or main reception desks.',
    badge: 'Save ₱551 · ₱779/pc',
    skuCode: 'TMY-1',
    originalPrice: 4450,
    discountedPrice: 3899,
    savings: 551,
    discountPercentage: 12,
    unitCount: 5,
    perPiecePrice: 779,
    category: 'bulk',
    description: 'Outfits up to 5 checkout counters or main reception desks with crystal-clear 90 × 110 mm acrylic Google review standees.',
    itemsIncluded: [
      {
        productId: 'acrylic-stand',
        productName: 'TMY-1 Premium Stand',
        quantity: 5,
        format: 'stand',
        description: '90 × 110 mm Crystal Acrylic Google Review Standee with NTAG213 NFC + QR code',
      },
    ],
    highlights: [
      '5 Units TMY-1 Premium Stand (90 × 110 mm)',
      'Only ₱779 per piece (Save ₱551 total)',
      'Pre-programmed with your business Google Review URL',
      'Dual-action NTAG213 NFC chip + high-contrast QR code',
    ],
    idealFor: 'Outfits up to 5 checkout counters or main reception desks',
    isPopular: false,
    accentGradient: 'from-sky-500/20 to-transparent border-sky-400/40',
  },
  {
    id: 'bulk-tmy1-10pack',
    title: 'TMY-1 Premium Stand (10-Pack)',
    subtitle: 'Ideal for venue-wide coverage across multiple tables or service stations.',
    badge: '🔥 Save ₱1,701 · ₱720/pc',
    skuCode: 'TMY-1',
    originalPrice: 8900,
    discountedPrice: 7199,
    savings: 1701,
    discountPercentage: 19,
    unitCount: 10,
    perPiecePrice: 720,
    category: 'bulk',
    description: 'Ideal for venue-wide coverage across multiple tables or service stations. Maximum visibility at high-volume checkpoints.',
    itemsIncluded: [
      {
        productId: 'acrylic-stand',
        productName: 'TMY-1 Premium Stand',
        quantity: 10,
        format: 'stand',
        description: '90 × 110 mm Crystal Acrylic Google Review Standee with NTAG213 NFC + QR code',
      },
    ],
    highlights: [
      '10 Units TMY-1 Premium Stand (90 × 110 mm)',
      'Only ₱720 per piece (Save ₱1,701 total)',
      'Bulk pre-programmed and QA verified for instant deployment',
      'Durable crystal bevel acrylic with sturdy non-slip base',
    ],
    idealFor: 'Ideal for venue-wide coverage across multiple tables or service stations',
    isPopular: true,
    accentGradient: 'from-blue-600/20 to-transparent border-blue-500/50',
  },
  {
    id: 'bulk-tmy2-5pack',
    title: 'TMY-2 Mini Stand (5-Pack)',
    subtitle: 'Compact layout setup across multiple dining tables or cashier lanes.',
    badge: 'Save ₱451 · ₱600/pc',
    skuCode: 'TMY-2',
    originalPrice: 3450,
    discountedPrice: 2999,
    savings: 451,
    discountPercentage: 13,
    unitCount: 5,
    perPiecePrice: 600,
    category: 'bulk',
    description: 'Compact layout setup across multiple dining tables or cashier lanes. Minimal desk footprint with maximum tap convenience.',
    itemsIncluded: [
      {
        productId: 'acrylic-tag',
        productName: 'TMY-2 Mini Stand',
        quantity: 5,
        format: 'tag',
        description: '40 × 40 mm Square Crystal Acrylic Mini Stand with NTAG213 NFC chip + QR code',
      },
    ],
    highlights: [
      '5 Units TMY-2 Mini Stand (40 × 40 mm)',
      'Only ₱600 per piece (Save ₱451 total)',
      'Space-saving square acrylic profile for compact counters',
      'Pre-programmed and ready to collect 5-star customer feedback',
    ],
    idealFor: 'Compact layout setup across multiple dining tables or cashier lanes',
    isPopular: false,
    accentGradient: 'from-cyan-500/20 to-transparent border-cyan-400/40',
  },
  {
    id: 'bulk-tmy2-10pack',
    title: 'TMY-2 Mini Stand (10-Pack)',
    subtitle: 'Maximizes customer interaction at every table in cafes or small spaces.',
    badge: '🔥 Save ₱1,401 · ₱550/pc',
    skuCode: 'TMY-2',
    originalPrice: 6900,
    discountedPrice: 5499,
    savings: 1401,
    discountPercentage: 20,
    unitCount: 10,
    perPiecePrice: 550,
    category: 'bulk',
    description: 'Maximizes customer interaction at every table in cafes or small spaces. Perfect table-by-table review acquisition.',
    itemsIncluded: [
      {
        productId: 'acrylic-tag',
        productName: 'TMY-2 Mini Stand',
        quantity: 10,
        format: 'tag',
        description: '40 × 40 mm Square Crystal Acrylic Mini Stand with NTAG213 NFC chip + QR code',
      },
    ],
    highlights: [
      '10 Units TMY-2 Mini Stand (40 × 40 mm)',
      'Only ₱550 per piece (Save ₱1,401 total)',
      'Equip 10 dining tables or bar seats simultaneously',
      'Waterproof crystal acrylic with crystal beveled edges',
    ],
    idealFor: 'Maximizes customer interaction at every table in cafes or small spaces',
    isPopular: false,
    accentGradient: 'from-teal-500/20 to-transparent border-teal-400/40',
  },
  {
    id: 'bulk-tmy3-5pack',
    title: 'TMY-3 NFC Card (5-Pack)',
    subtitle: 'Outfits your core sales team or management with smart digital business cards.',
    badge: 'Save ₱351 · ₱380/pc',
    skuCode: 'TMY-3',
    originalPrice: 2250,
    discountedPrice: 1899,
    savings: 351,
    discountPercentage: 16,
    unitCount: 5,
    perPiecePrice: 380,
    category: 'bulk',
    description: 'Outfits your core sales team or management with smart digital business cards for on-the-go review collection.',
    itemsIncluded: [
      {
        productId: 'pvc-card',
        productName: 'TMY-3 NFC Card',
        quantity: 5,
        format: 'card',
        description: '85.6 × 54 mm Matte PVC Business Card with rounded corners and NTAG213 NFC',
      },
    ],
    highlights: [
      '5 Units TMY-3 NFC Business Card (85.6 × 54 mm)',
      'Only ₱380 per piece (Save ₱351 total)',
      'Slim, scratch-resistant matte PVC easily fits into wallets or pockets',
      'Great for field agents, consultants, barbers, and service techs',
    ],
    idealFor: 'Outfits your core sales team or management with smart digital business cards',
    isPopular: false,
    accentGradient: 'from-indigo-500/20 to-transparent border-indigo-400/40',
  },
  {
    id: 'bulk-tmy3-10pack',
    title: 'TMY-3 NFC Card (10-Pack)',
    subtitle: 'Perfect for equipping full sales teams, agents, or staff members.',
    badge: '🔥 Save ₱1,001 · ₱350/pc',
    skuCode: 'TMY-3',
    originalPrice: 4500,
    discountedPrice: 3499,
    savings: 1001,
    discountPercentage: 22,
    unitCount: 10,
    perPiecePrice: 350,
    category: 'bulk',
    description: 'Perfect for equipping full sales teams, agents, or staff members. Slide into guest bill folders or carry on service calls.',
    itemsIncluded: [
      {
        productId: 'pvc-card',
        productName: 'TMY-3 NFC Card',
        quantity: 10,
        format: 'card',
        description: '85.6 × 54 mm Matte PVC Business Card with rounded corners and NTAG213 NFC',
      },
    ],
    highlights: [
      '10 Units TMY-3 NFC Business Card (85.6 × 54 mm)',
      'Only ₱350 per piece (Save ₱1,001 total)',
      'Slide inside bill presenters or hand directly to happy clients',
      'Pre-programmed and individually verified for seamless tap execution',
    ],
    idealFor: 'Perfect for equipping full sales teams, agents, or staff members',
    isPopular: false,
    accentGradient: 'from-violet-500/20 to-transparent border-violet-400/40',
  },
  {
    id: 'bulk-tmy4-5pack',
    title: 'TMY-4 NFC Tag (5-Pack)',
    subtitle: 'Low-cost option for multi-point display placement across product shelves or walls.',
    badge: 'Save ₱251 · ₱300/pc',
    skuCode: 'TMY-4',
    originalPrice: 1750,
    discountedPrice: 1499,
    savings: 251,
    discountPercentage: 14,
    unitCount: 5,
    perPiecePrice: 300,
    category: 'bulk',
    description: 'Low-cost option for multi-point display placement across product shelves, counters, or walls with heavy-duty 3M backing.',
    itemsIncluded: [
      {
        productId: 'pvc-sticker',
        productName: 'TMY-4 NFC Tag',
        quantity: 5,
        format: 'sticker',
        description: '40 × 40 mm Round PVC Adhesive NFC Tag with 3M Commercial Backing',
      },
    ],
    highlights: [
      '5 Units TMY-4 NFC Round Tags (40 × 40 mm)',
      'Only ₱300 per piece (Save ₱251 total)',
      'Waterproof, weather-resistant PVC with industrial-grade 3M adhesive',
      'Stick onto glass entrance doors, POS terminals, mirrors, or product shelves',
    ],
    idealFor: 'Low-cost option for multi-point display placement across product shelves or walls',
    isPopular: false,
    accentGradient: 'from-emerald-500/20 to-transparent border-emerald-400/40',
  },
  {
    id: 'bulk-tmy4-10pack',
    title: 'TMY-4 NFC Tag (10-Pack)',
    subtitle: 'High-density multi-point placement across store locations, dining tables, or shelves.',
    badge: '🔥 Save ₱801 · ₱270/pc',
    skuCode: 'TMY-4',
    originalPrice: 3500,
    discountedPrice: 2699,
    savings: 801,
    discountPercentage: 23,
    unitCount: 10,
    perPiecePrice: 270,
    category: 'bulk',
    description: 'Bulk tag solution for high-density venue placement across multiple dining tables, display cases, takeout pickup counters, and franchises.',
    itemsIncluded: [
      {
        productId: 'pvc-sticker',
        productName: 'TMY-4 NFC Tag',
        quantity: 10,
        format: 'sticker',
        description: '40 × 40 mm Round PVC Adhesive NFC Tag with 3M Commercial Backing',
      },
    ],
    highlights: [
      '10 Units TMY-4 NFC Round Tags (40 × 40 mm)',
      'Only ₱270 per piece (Save ₱801 total)',
      'Equip 10 tables or display zones at the lowest per-unit price',
      'Spill-resistant and UV-stable commercial grade adhesive',
    ],
    idealFor: 'Venue-wide dining tables, high-density shelves, and multi-branch retail',
    isPopular: false,
    accentGradient: 'from-teal-500/20 to-transparent border-teal-400/40',
  },
];

/**
 * Combined list of all bundles available across the store
 */
export const BUNDLE_OFFERS: BundleOffer[] = [...COMBO_BUNDLES, ...BULK_BUNDLES];

/**
 * Converts a BundleOffer into a standardized Product object so it can seamlessly
 * integrate with CartItem, CartDrawer, CheckoutModal, and Order submission.
 */
export function convertBundleToProduct(bundle: BundleOffer): Product {
  const itemsSummary = bundle.itemsIncluded
    .map((item) => `${item.quantity}× ${item.productName}`)
    .join(' + ');

  // Determine appropriate image asset
  let imageAsset = ASSET_IMAGES.bundleSuite;
  if (bundle.id === 'bundle-business-kit') {
    imageAsset = ASSET_IMAGES.bundleBusiness;
  } else if (bundle.id === 'bundle-starter-kit') {
    imageAsset = ASSET_IMAGES.bundleStarter;
  } else if (bundle.id === 'bundle-premium-suite') {
    imageAsset = ASSET_IMAGES.bundleSuite;
  } else if (bundle.skuCode === 'TMY-1') {
    imageAsset = ASSET_IMAGES.stand;
  } else if (bundle.skuCode === 'TMY-2') {
    imageAsset = ASSET_IMAGES.tag;
  } else if (bundle.skuCode === 'TMY-3') {
    imageAsset = ASSET_IMAGES.card;
  } else if (bundle.skuCode === 'TMY-4') {
    imageAsset = ASSET_IMAGES.sticker;
  }

  return {
    id: bundle.id,
    name: bundle.title,
    tagline: bundle.category === 'bulk' && bundle.perPiecePrice
      ? `${bundle.unitCount} Units Pack · ₱${bundle.perPiecePrice}/pc (Save ₱${bundle.savings.toLocaleString()})`
      : `${itemsSummary} (Bundle Pack · Save ₱${bundle.savings.toLocaleString()})`,
    description: bundle.description,
    size: bundle.unitCount ? `${bundle.unitCount} Units Bundle Pack` : 'Multi-product bundle set',
    material: bundle.skuCode === 'TMY-1' || bundle.skuCode === 'TMY-2'
      ? 'Crystal Acrylic (with NTAG213 NFC)'
      : bundle.skuCode === 'TMY-3' || bundle.skuCode === 'TMY-4'
      ? 'Matte PVC (with NTAG213 NFC)'
      : 'Premium Acrylic & Matte PVC Mix',
    chipType: 'NTAG213 NFC (Pre-encoded)',
    format: bundle.itemsIncluded[0]?.format || 'stand',
    features: bundle.highlights,
    price: bundle.discountedPrice,
    originalPrice: bundle.originalPrice,
    savings: bundle.savings,
    isBundle: true,
    bundleItems: bundle.itemsIncluded,
    image: imageAsset,
    badge: bundle.badge,
    idealFor: bundle.idealFor,
  };
}
