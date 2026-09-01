export type Language = 'en' | 'ph';

export interface Translations {
  nav: {
    products: string;
    howItWorks: string;
    craftsmanship: string;
    cart: string;
    shopNow: string;
  };
  hero: {
    techSpec: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    description: string;
    shopBtn: string;
    howItWorksBtn: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    cardBadge: string;
    cardSub: string;
    zeroApp: string;
    contactless: string;
  };
  products: {
    catalogTag: string;
    heading: string;
    subtitle: string;
    inspect: string;
    detailsBtn: string;
    addBtn: string;
    addedBtn: string;
    sizeLabel: string;
    materialLabel: string;
    chipLabel: string;
    fallbackLabel: string;
    freeEncoding: string;
    included: string;
    businessPlaceholder: string;
    linkPlaceholder: string;
    quantity: string;
    buyNow: string;
  };
  productModal: {
    size: string;
    material: string;
    chip: string;
    fallback: string;
    laserQr: string;
    encodingTitle: string;
    encodingStatus: string;
    businessNamePlaceholder: string;
    googleLinkPlaceholder: string;
    quantity: string;
    addedBtn: string;
    addToCartBtn: string;
    buyNowBtn: string;
  };
  howItWorks: {
    workflowTag: string;
    heading: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step1Sub: string;
    step2Title: string;
    step2Desc: string;
    step2Sub: string;
    step3Title: string;
    step3Desc: string;
    step3Sub: string;
    dualTech: string;
    dualTechDesc: string;
    launchSim: string;
  };
  beauty: {
    materialTag: string;
    heading: string;
    subtitle: string;
    spec1: string;
    spec2: string;
    highlights: { label: string; desc: string }[];
  };
  whyUs: {
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
    p4Title: string;
    p4Desc: string;
  };
  finalCta: {
    tag: string;
    headingPart1: string;
    headingHighlight: string;
    description: string;
    shopBtn: string;
  };
  cart: {
    title: string;
    items: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    subtotal: string;
    shipping: string;
    freeShipping: string;
    total: string;
    guarantee: string;
    checkoutBtn: string;
  };
  checkout: {
    title: string;
    step1: string;
    step1Desc: string;
    bizName: string;
    bizPlaceholder: string;
    reviewUrl: string;
    reviewPlaceholder: string;
    step2: string;
    recipientName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    step3: string;
    encrypted: string;
    cardSecure: string;
    bankDetails: string;
    subtotal: string;
    shipping: string;
    total: string;
    submitBtn: string;
    processingBtn: string;
    requiredError: string;
    phoneError: string;
    emailError: string;
    addressError: string;
    cityError: string;
  };
  orderConfirm: {
    successTag: string;
    heading: string;
    description: string;
    orderId: string;
    dateTime: string;
    paymentMethod: string;
    chipTarget: string;
    bizLabel: string;
    targetUrlLabel: string;
    itemsOrdered: string;
    deliveryInfo: string;
    estDelivery: string;
    subtotal: string;
    shipping: string;
    totalPaid: string;
    printBtn: string;
    continueBtn: string;
  };
  simulator: {
    tag: string;
    heading: string;
    subtitle: string;
    tapPrompt: string;
    tapSub: string;
    ratePrompt: string;
    submitReview: string;
    postedHeading: string;
    postedDesc: string;
    resetBtn: string;
    closeBtn: string;
    compatibility: string;
  };
  footer: {
    tagline: string;
    products: string;
    contact: string;
    shipping: string;
    payment: string;
    privacy: string;
    terms: string;
    rights: string;
    hardwareNote: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      products: 'Products',
      howItWorks: 'How It Works',
      craftsmanship: 'Craftsmanship',
      cart: 'Cart',
      shopNow: 'Shop Now',
    },
    hero: {
      techSpec: 'NFC HARDWARE • NTAG213',
      headlinePart1: 'Make Every Review',
      headlineHighlight: 'Just One Tap',
      headlinePart2: 'Away.',
      description:
        "Premium NFC Google Review tools designed to elevate your business's digital reputation instantly with contactless 1-tap technology.",
      shopBtn: 'Shop Solutions',
      howItWorksBtn: 'How It Works',
      step1Title: '01 — TAP',
      step1Desc: 'Customer taps phone',
      step2Title: '02 — OPEN',
      step2Desc: 'Review page launches',
      step3Title: '03 — REVIEW',
      step3Desc: 'Seamless 5-star feedback',
      cardBadge: 'Official Google Ready',
      cardSub: 'Pre-Programmed • NTAG213 Chips',
      zeroApp: 'Zero App Needed',
      contactless: '100% CONTACTLESS',
    },
    products: {
      catalogTag: 'CATALOG // HARDWARE LINEUP',
      heading: 'Choose Your Review Solution',
      subtitle:
        'Engineered with high-grade polished acrylic and matte PVC with integrated NXP contactless chipsets.',
      inspect: 'Inspect',
      detailsBtn: 'Details',
      addBtn: 'Add to Cart',
      addedBtn: 'Added',
      sizeLabel: 'Size',
      materialLabel: 'Material',
      chipLabel: 'NFC Chip',
      fallbackLabel: 'Fallback',
      freeEncoding: 'Free Encoding Service',
      included: 'Included',
      businessPlaceholder: 'Business Name (e.g. Lumina Café)',
      linkPlaceholder: 'Google Review link or Place ID (Optional)',
      quantity: 'Quantity',
      buyNow: 'Buy Now',
    },
    productModal: {
      size: 'Dimensions / Size',
      material: 'Material Grade',
      chip: 'Microchip Type',
      fallback: 'Fallback Tech',
      laserQr: 'Laser QR Code',
      encodingTitle: 'Free Google Link Pre-Programming',
      encodingStatus: 'Free / Optional',
      businessNamePlaceholder: 'Business Name (e.g. Lumina Café BGC)',
      googleLinkPlaceholder: 'Google Maps Link or Place ID (Optional)',
      quantity: 'Quantity',
      addedBtn: 'Added to Cart',
      addToCartBtn: 'Add to Cart',
      buyNowBtn: 'Instant Checkout',
    },
    howItWorks: {
      workflowTag: 'WORKFLOW // FRICTIONLESS FLOW',
      heading: 'How It Works',
      subtitle:
        'No typing URLs or searching through maps. A simple physical tap opens your official review portal.',
      step1Title: 'TAP',
      step1Desc: 'Customer taps phone.',
      step1Sub: 'Works natively with all modern iPhone & Android devices within 3cm range.',
      step2Title: 'OPEN',
      step2Desc: 'Review page launches.',
      step2Sub: 'Directly opens your Google Maps profile with 5-star rating view ready.',
      step3Title: 'REVIEW',
      step3Desc: 'Customer leaves review.',
      step3Sub: 'Fast, frictionless feedback submission in under 5 seconds.',
      dualTech: 'Dual-Technology:',
      dualTechDesc: 'Laser QR code is printed on every unit as a fallback for older devices.',
      launchSim: 'Launch Simulator',
    },
    beauty: {
      materialTag: 'MATERIAL // CRAFTSMANSHIP',
      heading: 'Precision Engineering.',
      subtitle:
        'Clean architectural design for counters, reception desks, tabletops, and checkout areas.',
      spec1: 'Commercial Grade Build • UV Protected',
      spec2: 'NXP NTAG213 • 100k+ Lifetime Reads',
      highlights: [
        { label: 'Acrylic Polish', desc: 'Diamond-polished bevels with ultra-clear optical transparency.' },
        { label: 'Matte PVC', desc: 'Silky matte texture with scratch-resistant coat.' },
        { label: 'NFC Symbol', desc: 'Standardized contactless wave indicator for easy customer recognition.' },
        { label: 'Google 5-Star', desc: 'Official review styling optimized for maximum conversion.' },
        { label: 'Precision QR', desc: 'High-contrast laser printed for instant camera autofocus.' },
        { label: 'Weighted Base', desc: 'Solid, weighted build that stays anchored to any counter surface.' },
      ],
    },
    whyUs: {
      p1Title: 'NFC ENABLED',
      p1Desc: 'Tap to open your review page natively on any modern smartphone.',
      p2Title: 'QR READY',
      p2Desc: 'Dual-fallback laser QR code etched for all camera models.',
      p3Title: 'PREMIUM FINISH',
      p3Desc: 'Diamond-cut acrylic and sleek matte anti-scratch PVC.',
      p4Title: 'FREE ENCODING',
      p4Desc: 'Pre-programmed to your Google Place ID before dispatch.',
    },
    finalCta: {
      tag: 'GET STARTED // ONE TAP REVIEW',
      headingPart1: 'Ready to Make Reviews',
      headingHighlight: 'Effortless?',
      description:
        'Give your customers a fast, modern contactless way to tap, scan, and rate your business 5 stars in seconds.',
      shopBtn: 'Shop Solutions',
    },
    cart: {
      title: 'Cart',
      items: 'Items',
      emptyTitle: 'Cart is empty',
      emptyDesc: 'Select an NFC review solution to begin.',
      exploreBtn: 'Explore Products',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      freeShipping: 'FREE (Orders ₱2,000+)',
      total: 'Total',
      guarantee: 'Pre-programmed & ready out-of-the-box',
      checkoutBtn: 'Proceed to Payment',
    },
    checkout: {
      title: 'Checkout // Secure Gateway & Encoding',
      step1: 'Google Review & Business Setup (Free Encoding)',
      step1Desc: 'Pre-programmed to your Google Maps review URL before dispatch.',
      bizName: 'Business / Store Name (Optional)',
      bizPlaceholder: 'e.g. Lumina Café & Lounge',
      reviewUrl: 'Google Maps Review Link / Place ID',
      reviewPlaceholder: 'https://g.page/r/... or business search name',
      step2: 'Delivery Details',
      recipientName: 'Recipient Full Name *',
      phone: 'Contact Mobile Number *',
      email: 'Email Address for Tracking & Receipt *',
      address: 'Delivery Street Address *',
      city: 'City / Municipality *',
      postalCode: 'Postal Code',
      step3: 'Payment Gateway',
      encrypted: '256-BIT ENCRYPTED',
      cardSecure: 'Card Processing via Stripe / 3D-Secure',
      bankDetails: 'GoTyme Bank: 016846634686 | GCash / Maya: 09764421242 (Account: TAPPY OFFICIAL STORE)',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total Amount',
      submitBtn: 'Complete Order & Submit Encoding',
      processingBtn: 'Processing Payment...',
      requiredError: 'Full name is required',
      phoneError: 'Valid phone number is required',
      emailError: 'Valid email address is required',
      addressError: 'Complete street address is required',
      cityError: 'City is required',
    },
    orderConfirm: {
      successTag: 'SUCCESS // ORDER DISPATCH QUEUE',
      heading: 'Order Confirmed',
      description:
        'Thank you for your order. We have received your payment and are initiating custom NTAG213 microchip encoding.',
      orderId: 'Order ID',
      dateTime: 'Date & Time',
      paymentMethod: 'Payment Method',
      chipTarget: 'NTAG213 Microchip Target:',
      bizLabel: 'Business:',
      targetUrlLabel: 'Target URL:',
      itemsOrdered: 'Items Ordered',
      deliveryInfo: 'Delivery Information',
      estDelivery: 'EST',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      totalPaid: 'Total Paid',
      printBtn: 'Print Receipt',
      continueBtn: 'Continue to Store',
    },
    simulator: {
      tag: 'Interactive Hardware Simulator',
      heading: 'Experience the Tap Flow',
      subtitle: "Click the NFC stand below to simulate a customer holding their phone within 3cm range.",
      tapPrompt: '[ Click to Trigger NFC Webhook ]',
      tapSub: 'NTAG213 13.56 MHz High-Frequency Loop',
      ratePrompt: 'Rate your experience',
      submitReview: 'Submit 5-Star Review',
      postedHeading: 'Review Successfully Posted',
      postedDesc: 'Elapsed time: ~3.8 seconds from tap to submission.',
      resetBtn: 'Reset Simulation',
      closeBtn: 'Close Simulator',
      compatibility: 'COMPATIBLE // iOS 13+ & Android 5.0+',
    },
    footer: {
      tagline: 'NFC GOOGLE REVIEW HARDWARE',
      products: 'Products',
      contact: 'Contact',
      shipping: 'Shipping',
      payment: 'Payment',
      privacy: 'Privacy',
      terms: 'Terms',
      rights: 'ALL RIGHTS RESERVED.',
      hardwareNote: 'GENUINE NXP NTAG213 CONTACTLESS HARDWARE',
    },
  },
  ph: {
    nav: {
      products: 'Mga Produkto',
      howItWorks: 'Paano Gumagana',
      craftsmanship: 'Kalidad at Gawa',
      cart: 'Kariton',
      shopNow: 'Bumili Na',
    },
    hero: {
      techSpec: 'NFC HARDWARE • NTAG213 MICROCHIP',
      headlinePart1: 'Paramihin ang Reviews sa',
      headlineHighlight: 'Isang Tap Lang',
      headlinePart2: 'ng Kostumer.',
      description:
        'Mataas na kalidad na NFC Google Review stands at cards para sa mga tindahan, café, salon, at negosyo sa Pilipinas. 1-tap contactless reviews gamit ang cellphone.',
      shopBtn: 'Tingnan ang Produkto',
      howItWorksBtn: 'Paano Gumagana',
      step1Title: '01 — I-TAP',
      step1Desc: 'Itapat ang cellphone sa stand',
      step2Title: '02 — BUKSAN',
      step2Desc: 'Lalabas agad ang Google Review',
      step3Title: '03 — 5-STAR',
      step3Desc: 'Mabilis na 5-star rating',
      cardBadge: 'Handa sa Google Review',
      cardSub: 'May Libreng Pre-Program • NTAG213 Chips',
      zeroApp: 'Walang Kailangang App',
      contactless: '100% CONTACTLESS TAP',
    },
    products: {
      catalogTag: 'KATALOGO // MGA OPSYON SA NEGOSYO',
      heading: 'Piliin ang Nararapat sa Iyong Negosyo',
      subtitle:
        'Gawa sa de-kalidad na diamond-polished acrylic at scratch-resistant matte PVC na may tunay na NXP NFC microchip.',
      inspect: 'Suriin',
      detailsBtn: 'Detalye',
      addBtn: 'Idagdag sa Cart',
      addedBtn: 'Naidagdag Na',
      sizeLabel: 'Sukat',
      materialLabel: 'Materyales',
      chipLabel: 'NFC Chip',
      fallbackLabel: 'Alternatibo',
      freeEncoding: 'Libreng Pag-Program ng Link',
      included: 'Libre / Kasama Na',
      businessPlaceholder: 'Pangalan ng Negosyo (hal. Lumina Café Manila)',
      linkPlaceholder: 'Google Maps Review link o Place ID (Opsiyonal)',
      quantity: 'Dami (Qty)',
      buyNow: 'Bumili Agad',
    },
    productModal: {
      size: 'Dimensyon / Sukat',
      material: 'Materyales',
      chip: 'Uri ng Microchip',
      fallback: 'Alternatibong QR',
      laserQr: 'Laser QR Code',
      encodingTitle: 'Libreng Pag-Program ng Google Link',
      encodingStatus: 'Libre / Opsiyonal',
      businessNamePlaceholder: 'Pangalan ng Negosyo (hal. Lumina Café BGC)',
      googleLinkPlaceholder: 'Google Maps Link o Place ID (Opsiyonal)',
      quantity: 'Dami (Qty)',
      addedBtn: 'Naidagdag Na',
      addToCartBtn: 'Idagdag sa Cart',
      buyNowBtn: 'Bumili Agad',
    },
    howItWorks: {
      workflowTag: 'PROSESO // MABILIS AT SIMPLE',
      heading: 'Paano Ito Gumagana',
      subtitle:
        'Hindi na kailangan mag-type ng mahabang link o maghanap sa mapa. Isang tap lang ng customer, bukas agad ang review page.',
      step1Title: 'ITAPAT',
      step1Desc: 'Itapat ang cellphone sa stand.',
      step1Sub: 'Gumagana nang kusa sa lahat ng iPhone at Android na may NFC nang walang anumang app.',
      step2Title: 'BUKSAN',
      step2Desc: 'Awtomatikong magbubukas ang Google Maps.',
      step2Sub: 'Didiretso ang customer sa 5-star review page ng iyong opisyal na Google Business profile.',
      step3Title: 'MAG-RATE',
      step3Desc: 'Mag-iiwan ng 5-star review ang kostumer.',
      step3Sub: 'Tapos at posted na ang review sa loob lamang ng 5 segundo.',
      dualTech: 'May Kasamang QR Code:',
      dualTechDesc: 'May laser-engraved QR code din ang bawat unit para sa mga lumang modelo ng telepono.',
      launchSim: 'Subukan ang Simulator',
    },
    beauty: {
      materialTag: 'MATERYALES // PULIDONG GAWA',
      heading: 'Matiyagang Ininhinyero.',
      subtitle:
        'Malinis at modernong disenyo para sa counter, cashier desk, dining tables, at reception area ng iyong negosyo.',
      spec1: 'Pang-Komersyal na Kalidad • UV Protected',
      spec2: 'NXP NTAG213 • Mahigit 100k+ Reads',
      highlights: [
        { label: 'Pinakintab na Acrylic', desc: 'Diamond-polished edges na napakalinaw at eleganteng tingnan.' },
        { label: 'Matte PVC Finish', desc: 'Makinis na matte black texture na hindi madaling magasgasan.' },
        { label: 'Opisyal na NFC Wave', desc: 'Madaling makilala ng mga customer para sa contactless tap.' },
        { label: 'Google 5-Star Branding', desc: 'Disenyong nakapokus upang ma-engganyo ang customer mag-rate.' },
        { label: 'Precision QR Print', desc: 'Matalas na laser-print para mabilis mabasa ng camera ng phone.' },
        { label: 'Matatag na Base', desc: 'Mabigat at matibay na base upang hindi matumba sa ibabaw ng counter.' },
      ],
    },
    whyUs: {
      p1Title: 'NFC ENABLED',
      p1Desc: 'Isang tap lang sa telepono, magbubukas agad ang Google Review form.',
      p2Title: 'MAY QR CODE',
      p2Desc: 'May fallback laser QR code para sa lahat ng uri ng smartphone camera.',
      p3Title: 'MATIBAY AT SOSYAL',
      p3Desc: 'Pinakintab na acrylic at premium matte anti-scratch PVC materials.',
      p4Title: 'LIBRENG PAG-ENCODE',
      p4Desc: 'Ipoprograma na namin ang iyong Google Place ID bago ipadala.',
    },
    finalCta: {
      tag: 'MAGSIMULA NA // 1-TAP REVIEW',
      headingPart1: 'Handa Ka Na Bang Paramihin ang Iyong',
      headingHighlight: '5-Star Reviews?',
      description:
        'Bigyan ang iyong mga kostumer ng pinakamadaling paraan para mag-iwan ng magagandang review sa iyong negosyo.',
      shopBtn: 'Mamili ng Solusyon',
    },
    cart: {
      title: 'Kariton',
      items: 'Aytem',
      emptyTitle: 'Walang laman ang kariton',
      emptyDesc: 'Pumili ng NFC review solution para magsimula.',
      exploreBtn: 'Tingnan ang Produkto',
      subtotal: 'Halaga ng Aytem',
      shipping: 'Bayad sa Pagpapadala',
      freeShipping: 'LIBRE (Higit ₱2,000)',
      total: 'Kabuuang Bayarin',
      guarantee: 'Pre-programmed at handang gamitin pagdating',
      checkoutBtn: 'Pumunta sa Pagbabayad',
    },
    checkout: {
      title: 'Checkout // Ligtas na Gateway at Pag-Program',
      step1: 'Setup ng Google Review at Negosyo (Libre)',
      step1Desc: 'Ipoprograma namin sa inyong Google Maps review link bago ipadala.',
      bizName: 'Pangalan ng Negosyo / Tindahan (Opsiyonal)',
      bizPlaceholder: 'hal. Lumina Café & Lounge',
      reviewUrl: 'Link sa Google Maps Review / Place ID',
      reviewPlaceholder: 'https://g.page/r/... o pangalan ng negosyo',
      step2: 'Detalye ng Paghahatid (Delivery)',
      recipientName: 'Buong Pangalan ng Tatanggap *',
      phone: 'Mobile Phone Number *',
      email: 'Email Address para sa Tracking at Resibo *',
      address: 'Kumpletong Tirahan / Address *',
      city: 'Lungsod / Bayan (City/Municipality) *',
      postalCode: 'Postal Code / Zip Code',
      step3: 'Paraan ng Pagbabayad',
      encrypted: '256-BIT SSL LIGTAS',
      cardSecure: 'Credit/Debit Card via Stripe at 3D-Secure',
      bankDetails: 'GoTyme Bank: 016846634686 | GCash / Maya: 09764421242 (Pangalan: TAPPY OFFICIAL STORE)',
      subtotal: 'Halaga ng Produkto',
      shipping: 'Paghahatid',
      total: 'Kabuuang Babayaran',
      submitBtn: 'Kumpirmahin ang Order at Isumite',
      processingBtn: 'Pinoproseso ang Pagbabayad...',
      requiredError: 'Kinakailangan ang buong pangalan',
      phoneError: 'Maglagay ng wastong numero ng telepono',
      emailError: 'Maglagay ng wastong email address',
      addressError: 'Kinakailangan ang kumpletong address',
      cityError: 'Kinakailangan ang lungsod o bayan',
    },
    orderConfirm: {
      successTag: 'TAGUMPAY // NAKAPILA SA DISPATCH',
      heading: 'Kumpirmado ang Iyong Order',
      description:
        'Maraming salamat! Natanggap na namin ang inyong bayad at sinisimulan na ang pag-program ng inyong NTAG213 chips.',
      orderId: 'Order ID',
      dateTime: 'Petsa at Oras',
      paymentMethod: 'Paraan ng Pagbayad',
      chipTarget: 'Target ng NFC Chip:',
      bizLabel: 'Negosyo:',
      targetUrlLabel: 'Target Link:',
      itemsOrdered: 'Mga Produktong Binili',
      deliveryInfo: 'Impormasyon sa Paghahatid',
      estDelivery: 'EST',
      subtotal: 'Halaga',
      shipping: 'Delivery',
      totalPaid: 'Kabuuang Nabayaran',
      printBtn: 'I-print ang Resibo',
      continueBtn: 'Bumalik sa Tindahan',
    },
    simulator: {
      tag: 'Interactive Hardware Simulator',
      heading: 'Subukan ang 1-Tap Flow',
      subtitle: 'I-click ang NFC stand sa ibaba para maranasan kung paano itinatapat ng kostumer ang telepono.',
      tapPrompt: '[ I-click upang subukan ang NFC Tap ]',
      tapSub: 'NTAG213 13.56 MHz High-Frequency Loop',
      ratePrompt: 'I-rate ang iyong karanasan',
      submitReview: 'Isumite ang 5-Star Review',
      postedHeading: 'Matagumpay na Na-Post ang Review!',
      postedDesc: 'Oras na nagugol: ~3.8 segundo mula tap hanggang submission.',
      resetBtn: 'Subukan Muli',
      closeBtn: 'Isara ang Simulator',
      compatibility: 'GUMAGANA SA // iOS 13+ at Android 5.0+',
    },
    footer: {
      tagline: 'NFC GOOGLE REVIEW HARDWARE SA PILIPINAS',
      products: 'Mga Produkto',
      contact: 'Makipag-ugnayan',
      shipping: 'Paghahatid',
      payment: 'Pagbabayad',
      privacy: 'Patakaran sa Privacy',
      terms: 'Mga Tuntunin',
      rights: 'ALL RIGHTS RESERVED.',
      hardwareNote: 'TUNAY NA NXP NTAG213 CONTACTLESS HARDWARE',
    },
  },
};
