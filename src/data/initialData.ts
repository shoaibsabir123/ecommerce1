import { Product, BlogPost, Coupon, UserProfile, Order, CategoryItem } from '../types';
import { getProductSvg } from '../utils/productImages';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'accessories', name: 'Accessories', slug: 'accessories', icon: 'Glasses', count: 18, image: getProductSvg('sunglasses', '#1E293B', '#D4AF37') },
  { id: 'electronics', name: 'Electronics', slug: 'electronics', icon: 'Headphones', count: 24, image: getProductSvg('headphones', '#18181B', '#CBD5E1') },
  { id: 'home-living', name: 'Home & Living', slug: 'home-living', icon: 'Lamp', count: 32, image: getProductSvg('lamp', '#F59E0B') },
  { id: 'fashion', name: 'Fashion', slug: 'fashion', icon: 'Shirt', count: 45, image: getProductSvg('backpack', '#D4A373') },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', icon: 'Sparkles', count: 19, image: getProductSvg('serum', '#B45309') },
  { id: 'sports', name: 'Sports', slug: 'sports', icon: 'Dumbbell', count: 15, image: getProductSvg('dumbbells', '#334155') },
  { id: 'toys-games', name: 'Toys & Games', slug: 'toys-games', icon: 'Gamepad2', count: 12, image: getProductSvg('teddy', '#92400E') },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Horizon Smart Watch Series 9',
    slug: 'horizon-smart-watch-series-9',
    brand: 'AURA Labs',
    category: 'electronics',
    price: 199.99,
    salePrice: 159.99,
    rating: 4.9,
    reviewCount: 128,
    description: 'Engineered with an edge-to-edge Retina OLED display, advanced biometric sensors, sapphire crystal front glass, and 72-hour battery life in low power mode.',
    details: [
      'Retina LTPO OLED always-on display (2,000 nits)',
      'ECG, Blood Oxygen, and Continuous Heart Rate tracking',
      'Water resistant to 50 meters (ISO 22810:2010)',
      'Fast wireless magnetic charging (0 to 80% in 45 mins)'
    ],
    specifications: {
      'Case Size': '45mm',
      'Battery Life': 'Up to 72 hours',
      'Connectivity': 'Bluetooth 5.3 & Wi-Fi',
      'Compatibility': 'iOS 15+ and Android 10+'
    },
    shippingInfo: 'Ships within 24 hours. Complimentary express courier on orders over $50.',
    featured: true,
    trending: true,
    isNew: true,
    active: true,
    createdAt: '2026-03-01T10:00:00Z',
    defaultVariantId: 'var-1-black',
    variants: [
      {
        id: 'var-1-black',
        colorName: 'Matte Obsidian',
        colorHex: '#18181B',
        sku: 'AUR-W9-OBS',
        stock: 35,
        images: [
          getProductSvg('smartwatch', '#18181B', '#27272A', 0),
          getProductSvg('smartwatch', '#27272A', '#18181B', 1)
        ]
      },
      {
        id: 'var-1-beige',
        colorName: 'Starlight Beige',
        colorHex: '#E5DFD3',
        sku: 'AUR-W9-BEI',
        stock: 18,
        images: [
          getProductSvg('smartwatch', '#E5DFD3', '#D4CCA9', 0),
          getProductSvg('smartwatch', '#D4CCA9', '#E5DFD3', 1)
        ]
      },
      {
        id: 'var-1-blue',
        colorName: 'Midnight Navy',
        colorHex: '#1E293B',
        sku: 'AUR-W9-NAV',
        stock: 12,
        images: [
          getProductSvg('smartwatch', '#1E293B', '#334155', 0),
          getProductSvg('smartwatch', '#334155', '#1E293B', 1)
        ]
      },
      {
        id: 'var-1-sage',
        colorName: 'Alpine Sage',
        colorHex: '#52796F',
        sku: 'AUR-W9-SGE',
        stock: 6,
        images: [
          getProductSvg('smartwatch', '#52796F', '#84A98C', 0),
          getProductSvg('smartwatch', '#84A98C', '#52796F', 1)
        ]
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Nomad Commuter Everyday Backpack',
    slug: 'nomad-commuter-everyday-backpack',
    brand: 'Atelier Nomad',
    category: 'fashion',
    price: 59.99,
    salePrice: 49.99,
    rating: 4.8,
    reviewCount: 96,
    description: 'A weatherproof, minimalist everyday carry pack crafted from recycled ripstop canvas with dedicated padded compartments for 16-inch laptops and magnetic quick-access pockets.',
    details: [
      'Weather-resistant 900D recycled polyester exterior',
      'Suspended 16" laptop pocket with fleece lining',
      'Hidden passport and travel card pocket behind back panel',
      'Ergonomic EVA memory-foam shoulder straps'
    ],
    specifications: {
      'Capacity': '22 Liters',
      'Weight': '820 grams',
      'Dimensions': '46cm x 30cm x 15cm',
      'Hardware': 'Anodized aluminum Fidlock buckles'
    },
    shippingInfo: 'Standard 2-4 business days delivery. Free returns within 30 days.',
    featured: true,
    trending: true,
    isNew: false,
    active: true,
    createdAt: '2026-03-02T11:00:00Z',
    defaultVariantId: 'var-2-khaki',
    variants: [
      {
        id: 'var-2-khaki',
        colorName: 'Desert Khaki',
        colorHex: '#C5A880',
        sku: 'NOM-BP-KHK',
        stock: 22,
        images: [
          getProductSvg('backpack', '#C5A880', '#A68860', 0),
          getProductSvg('backpack', '#A68860', '#C5A880', 1)
        ]
      },
      {
        id: 'var-2-black',
        colorName: 'Stealth Black',
        colorHex: '#18181B',
        sku: 'NOM-BP-BLK',
        stock: 40,
        images: [
          getProductSvg('backpack', '#18181B', '#27272A', 0),
          getProductSvg('backpack', '#27272A', '#18181B', 1)
        ]
      },
      {
        id: 'var-2-olive',
        colorName: 'Tactical Olive',
        colorHex: '#4A5844',
        sku: 'NOM-BP-OLV',
        stock: 14,
        images: [
          getProductSvg('backpack', '#4A5844', '#364032', 0),
          getProductSvg('backpack', '#364032', '#4A5844', 1)
        ]
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Aura Studio Wireless Earbuds',
    slug: 'aura-studio-wireless-earbuds',
    brand: 'AURA Labs',
    category: 'electronics',
    price: 39.99,
    salePrice: 29.99,
    rating: 4.9,
    reviewCount: 243,
    description: 'Immersive sound with custom 11mm beryllium drivers, active hybrid noise cancellation, and a pocketable matte pebble charging case delivering 36 hours of total playtime.',
    details: [
      'Hybrid Active Noise Cancellation with Transparency mode',
      'Quad beamforming microphones with wind-shield mesh',
      'IPX5 water and sweat resistance',
      'Qi wireless charging case'
    ],
    specifications: {
      'Playtime': '8 hrs per charge / 36 hrs total with case',
      'Driver Size': '11mm Custom Dynamic Beryllium',
      'Codecs': 'AAC, SBC, LDAC High-Res audio',
      'Bluetooth': 'Version 5.3 with Multipoint Connect'
    },
    shippingInfo: 'Free shipping on orders above $50. 2-day delivery available at checkout.',
    featured: true,
    trending: true,
    isNew: false,
    active: true,
    createdAt: '2026-03-03T12:00:00Z',
    defaultVariantId: 'var-3-white',
    variants: [
      {
        id: 'var-3-white',
        colorName: 'Chalk White',
        colorHex: '#F8FAFC',
        sku: 'AUR-EB-WHT',
        stock: 50,
        images: [
          getProductSvg('earbuds', '#F8FAFC', '#E2E8F0', 0),
          getProductSvg('earbuds', '#E2E8F0', '#F8FAFC', 1)
        ]
      },
      {
        id: 'var-3-black',
        colorName: 'Matte Obsidian',
        colorHex: '#1E293B',
        sku: 'AUR-EB-BLK',
        stock: 32,
        images: [
          getProductSvg('earbuds', '#1E293B', '#0F172A', 0),
          getProductSvg('earbuds', '#0F172A', '#1E293B', 1)
        ]
      },
      {
        id: 'var-3-sage',
        colorName: 'Eucalyptus Sage',
        colorHex: '#84A98C',
        sku: 'AUR-EB-SGE',
        stock: 19,
        images: [
          getProductSvg('earbuds', '#84A98C', '#52796F', 0),
          getProductSvg('earbuds', '#52796F', '#84A98C', 1)
        ]
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Bleu Royale Eau De Parfum 100ml',
    slug: 'bleu-royale-eau-de-parfum',
    brand: 'Maison Royale',
    category: 'beauty',
    price: 89.99,
    salePrice: 69.99,
    rating: 4.7,
    reviewCount: 75,
    description: 'An alluring, sophisticated extrait de parfum featuring notes of Calabrian bergamot, French lavender, smoky vetiver, and warm amber wood. Hand-poured in Grasse, France.',
    details: [
      'Top Notes: Calabrian Bergamot, Pink Peppercorn, Cardamom',
      'Heart Notes: French Lavender, Geranium, Geranium Leaves',
      'Base Notes: Haitian Vetiver, Cedarwood, Ambergris Accord',
      'Concentration: 24% Extrait de Parfum for 12+ hour sillage'
    ],
    specifications: {
      'Volume': '100 ml / 3.4 fl. oz',
      'Origin': 'Grasse, France',
      'Bottle': 'Heavyweight smoked glass with magnetic cap'
    },
    shippingInfo: 'Ground shipping only due to perfume regulations. Signature required on delivery.',
    featured: true,
    trending: true,
    isNew: false,
    active: true,
    createdAt: '2026-03-04T13:00:00Z',
    defaultVariantId: 'var-4-noir',
    variants: [
      {
        id: 'var-4-noir',
        colorName: 'Noir Amber',
        colorHex: '#18181B',
        sku: 'ROY-PAR-NOIR',
        stock: 25,
        images: [
          getProductSvg('perfume', '#18181B', '#C29B38', 0),
          getProductSvg('perfume', '#27272A', '#18181B', 1)
        ]
      },
      {
        id: 'var-4-sapphire',
        colorName: 'Sapphire Midnight',
        colorHex: '#1E3A8A',
        sku: 'ROY-PAR-SAPH',
        stock: 15,
        images: [
          getProductSvg('perfume', '#1E3A8A', '#3B82F6', 0),
          getProductSvg('perfume', '#172554', '#1E3A8A', 1)
        ]
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Lumina Geometric Moon Ambient Lamp',
    slug: 'lumina-geometric-moon-ambient-lamp',
    brand: 'Nordic Craft',
    category: 'home-living',
    price: 34.99,
    salePrice: 24.99,
    rating: 4.8,
    reviewCount: 58,
    description: '3D-printed celestial surface inspired by lunar topography. Emits a warm, dimmable ambient glow on a solid geometric natural walnut wood interlocking stand.',
    details: [
      '3 lighting modes: 3000K Warm Gold, 4500K Neutral Sun, 6000K Moonlight',
      'Stepless touch dimmer with gentle tap toggle',
      'Solid FSC-certified walnut wood tripod base',
      'Rechargeable 1,500mAh USB-C battery lasts up to 24 hours'
    ],
    specifications: {
      'Diameter': '15 cm (5.9 inches)',
      'Power Source': 'USB-C Rechargeable',
      'Stand Material': 'Solid North American Walnut'
    },
    shippingInfo: 'Carefully packed with custom foam packaging. Ships in 1-2 business days.',
    featured: true,
    trending: true,
    isNew: false,
    active: true,
    createdAt: '2026-03-05T14:00:00Z',
    defaultVariantId: 'var-5-walnut',
    variants: [
      {
        id: 'var-5-walnut',
        colorName: 'Warm Walnut',
        colorHex: '#8B4513',
        sku: 'LUM-MOON-WAL',
        stock: 30,
        images: [
          getProductSvg('lamp', '#F59E0B', '#8B4513', 0),
          getProductSvg('lamp', '#FBBF24', '#A0522D', 1)
        ]
      },
      {
        id: 'var-5-ash',
        colorName: 'Natural Nordic Ash',
        colorHex: '#D4C3A3',
        sku: 'LUM-MOON-ASH',
        stock: 16,
        images: [
          getProductSvg('lamp', '#FEF3C7', '#D4C3A3', 0),
          getProductSvg('lamp', '#FDE68A', '#C5B293', 1)
        ]
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Aviator Polarized Acetate Sunglasses',
    slug: 'aviator-polarized-acetate-sunglasses',
    brand: 'Solstice Optical',
    category: 'accessories',
    price: 85.00,
    salePrice: 68.00,
    rating: 4.9,
    reviewCount: 112,
    description: 'Handcrafted Italian Mazzucchelli acetate frame with polarized category 3 mineral glass lenses providing 100% UV400 protection and glare reduction.',
    details: [
      'Handcrafted Italian acetate with reinforced 5-barrel hinges',
      'Ultra-clear scratch-resistant polarized nylon lenses',
      'Includes premium hard leather travel case and microfiber cloth'
    ],
    specifications: {
      'Frame Size': '52 - 20 - 145 mm',
      'Lens Category': 'Cat 3 (100% UVA/UVB protection)',
      'Weight': '38 grams'
    },
    shippingInfo: 'Fast delivery with tracked shipping. 30-day money-back guarantee.',
    featured: false,
    trending: true,
    isNew: true,
    active: true,
    createdAt: '2026-03-06T15:00:00Z',
    defaultVariantId: 'var-6-tortoise',
    variants: [
      {
        id: 'var-6-tortoise',
        colorName: 'Havana Tortoise',
        colorHex: '#78350F',
        sku: 'SOL-SUN-TOR',
        stock: 20,
        images: [
          getProductSvg('sunglasses', '#78350F', '#D4AF37', 0)
        ]
      },
      {
        id: 'var-6-black',
        colorName: 'Midnight Onyx',
        colorHex: '#18181B',
        sku: 'SOL-SUN-BLK',
        stock: 35,
        images: [
          getProductSvg('sunglasses', '#18181B', '#71717A', 0)
        ]
      },
      {
        id: 'var-6-gold',
        colorName: 'Champagne Gold',
        colorHex: '#D4AF37',
        sku: 'SOL-SUN-GLD',
        stock: 8,
        images: [
          getProductSvg('sunglasses', '#D4AF37', '#92400E', 0)
        ]
      }
    ]
  },
  {
    id: 'prod-7',
    name: 'Atelier Minimalist Low-Top Sneakers',
    slug: 'atelier-minimalist-low-top-sneakers',
    brand: 'Atelier Co.',
    category: 'fashion',
    price: 135.00,
    salePrice: 110.00,
    rating: 4.8,
    reviewCount: 84,
    description: 'Crafted from butter-soft full-grain calfskin leather, vulcanized natural rubber cupsole, and an antibacterial cork-lined footbed for effortless daily comfort.',
    details: [
      'Supple full-grain Italian leather upper',
      'Removable molded insole with natural cork lining',
      'Stitched Margom rubber cupsole for enduring durability',
      'Waxed cotton laces with engraved brass aglets'
    ],
    specifications: {
      'Material': '100% Full-grain calfskin',
      'Sole': 'Natural Vulcanized Rubber',
      'Handcrafted in': 'Porto, Portugal'
    },
    shippingInfo: 'Free worldwide express shipping on luxury footwear.',
    featured: false,
    trending: true,
    isNew: false,
    active: true,
    createdAt: '2026-03-07T16:00:00Z',
    defaultVariantId: 'var-7-white',
    variants: [
      {
        id: 'var-7-white',
        colorName: 'Pure White',
        colorHex: '#FFFFFF',
        sku: 'ATL-SNK-WHT',
        stock: 24,
        images: [
          getProductSvg('sneakers', '#FFFFFF', '#E2E8F0', 0)
        ]
      },
      {
        id: 'var-7-cream',
        colorName: 'Oat Cream & Gum',
        colorHex: '#F5EFEB',
        sku: 'ATL-SNK-CRM',
        stock: 18,
        images: [
          getProductSvg('sneakers', '#F5EFEB', '#C5A880', 0)
        ]
      },
      {
        id: 'var-7-black',
        colorName: 'Triple Noir',
        colorHex: '#18181B',
        sku: 'ATL-SNK-BLK',
        stock: 14,
        images: [
          getProductSvg('sneakers', '#18181B', '#27272A', 0)
        ]
      }
    ]
  },
  {
    id: 'prod-8',
    name: 'HydroPure Vacuum Insulated Stainless Flask 750ml',
    slug: 'hydropure-vacuum-insulated-stainless-flask',
    brand: 'Verve Motion',
    category: 'sports',
    price: 38.00,
    salePrice: 28.00,
    rating: 4.9,
    reviewCount: 165,
    description: 'Double-wall vacuum insulation keeps liquids ice cold for 24 hours or piping hot for 12 hours. Sweat-free powder-coat finish with leakproof magnetic carry cap.',
    details: [
      'Pro-grade 18/8 food-safe stainless steel',
      'TempLock vacuum barrier prevents condensation',
      'Ergonomic flexible carry handle with silicone grip',
      'BPA-free and dishwasher safe'
    ],
    specifications: {
      'Volume': '750 ml / 25 oz',
      'Weight': '370 grams',
      'Height': '27 cm'
    },
    shippingInfo: 'In stock. Ships same day if ordered before 2 PM EST.',
    featured: false,
    trending: true,
    isNew: false,
    active: true,
    createdAt: '2026-03-08T17:00:00Z',
    defaultVariantId: 'var-8-steel',
    variants: [
      {
        id: 'var-8-steel',
        colorName: 'Brushed Steel',
        colorHex: '#CBD5E1',
        sku: 'HYD-FLK-STL',
        stock: 45,
        images: [
          getProductSvg('waterbottle', '#CBD5E1', '#94A3B8', 0)
        ]
      },
      {
        id: 'var-8-white',
        colorName: 'Polar Snow',
        colorHex: '#F8FAFC',
        sku: 'HYD-FLK-WHT',
        stock: 30,
        images: [
          getProductSvg('waterbottle', '#F8FAFC', '#E2E8F0', 0)
        ]
      },
      {
        id: 'var-8-black',
        colorName: 'Matte Obsidian',
        colorHex: '#1E293B',
        sku: 'HYD-FLK-BLK',
        stock: 22,
        images: [
          getProductSvg('waterbottle', '#1E293B', '#0F172A', 0)
        ]
      }
    ]
  },
  {
    id: 'prod-9',
    name: 'Botanical Vitamin C & E Facial Radiance Serum',
    slug: 'botanical-vitamin-c-facial-radiance-serum',
    brand: 'AURA Botanics',
    category: 'beauty',
    price: 45.00,
    salePrice: 36.00,
    rating: 4.9,
    reviewCount: 198,
    description: 'Stabilized 15% L-Ascorbic Acid infused with cold-pressed rosehip seed oil, hyaluronic acid, and ferulic acid to visibly brighten skin tone and combat oxidative stress.',
    details: [
      '15% Pure Vitamin C + 1% Vitamin E + Ferulic Acid',
      'Dermatologist tested, fragrance-free, vegan & cruelty-free',
      'Amber UV-blocking glass preserves potency'
    ],
    specifications: {
      'Volume': '30 ml / 1 fl. oz',
      'Skin Type': 'All skin types, including sensitive',
      'Shelf Life': '12 months after opening'
    },
    shippingInfo: 'Standard 2-3 days shipping. Carbon neutral delivery.',
    featured: false,
    trending: false,
    isNew: true,
    active: true,
    createdAt: '2026-03-09T18:00:00Z',
    defaultVariantId: 'var-9-amber',
    variants: [
      {
        id: 'var-9-amber',
        colorName: 'Pure Amber Glow',
        colorHex: '#D97706',
        sku: 'BOT-SER-AMB',
        stock: 32,
        images: [
          getProductSvg('serum', '#D97706', '#92400E', 0)
        ]
      }
    ]
  },
  {
    id: 'prod-10',
    name: 'Hexa Cast Iron Precision Studio Dumbbells',
    slug: 'hexa-cast-iron-precision-dumbbells',
    brand: 'Verve Motion',
    category: 'sports',
    price: 65.00,
    salePrice: 52.00,
    rating: 4.8,
    reviewCount: 67,
    description: 'Anti-roll hexagonal cast iron weights wrapped in matte tactile silicone finish for floor protection, noise reduction, and superior non-slip knurled grip.',
    details: [
      'Anti-roll hex design stays put on any surface',
      'Knurled ergonomic steel core handles',
      'Impact-resistant protective coating'
    ],
    specifications: {
      'Weight': '10 kg pair (2x 5kg) or 20kg pair',
      'Material': 'Solid cast iron with silicone sleeve'
    },
    shippingInfo: 'Heavy shipping handled via tracked freight. Delivered in 3-5 days.',
    featured: false,
    trending: false,
    isNew: false,
    active: true,
    createdAt: '2026-03-10T19:00:00Z',
    defaultVariantId: 'var-10-matte',
    variants: [
      {
        id: 'var-10-matte',
        colorName: 'Cast Slate Black',
        colorHex: '#1E293B',
        sku: 'HEX-DB-BLK',
        stock: 15,
        images: [
          getProductSvg('dumbbells', '#1E293B', '#475569', 0)
        ]
      },
      {
        id: 'var-10-teal',
        colorName: 'Deep Teal Marine',
        colorHex: '#0F766E',
        sku: 'HEX-DB-TEL',
        stock: 10,
        images: [
          getProductSvg('dumbbells', '#0F766E', '#115E59', 0)
        ]
      }
    ]
  },
  {
    id: 'prod-11',
    name: 'Heritage Mohair Handcrafted Keepsake Bear',
    slug: 'heritage-mohair-handcrafted-keepsake-bear',
    brand: 'Little Heirloom',
    category: 'toys-games',
    price: 54.00,
    salePrice: 42.00,
    rating: 5.0,
    reviewCount: 42,
    description: 'An heirloom-quality collectible teddy bear crafted from plush natural mohair, hand-stitched embroidery, antique glass eyes, and fully articulated limbs.',
    details: [
      'Hand-loomed natural woven mohair fur',
      'Traditional 5-way rotating cotter-pin joints',
      'Hand-embroidered nose and felt paw pads',
      'Includes satin presentation ribbon and certificate of authenticity'
    ],
    specifications: {
      'Height': '32 cm sitting',
      'Material': 'Natural Mohair & Pure Wool stuffing'
    },
    shippingInfo: 'Arrives in a beautiful embossed gift box with ribbon.',
    featured: false,
    trending: false,
    isNew: true,
    active: true,
    createdAt: '2026-03-11T20:00:00Z',
    defaultVariantId: 'var-11-honey',
    variants: [
      {
        id: 'var-11-honey',
        colorName: 'Golden Honey',
        colorHex: '#D97706',
        sku: 'LIL-BEAR-HNY',
        stock: 12,
        images: [
          getProductSvg('teddy', '#D97706', '#B45309', 0)
        ]
      },
      {
        id: 'var-11-cocoa',
        colorName: 'Cocoa Brown',
        colorHex: '#78350F',
        sku: 'LIL-BEAR-CCA',
        stock: 8,
        images: [
          getProductSvg('teddy', '#78350F', '#451A03', 0)
        ]
      }
    ]
  },
  {
    id: 'prod-12',
    name: 'Studio Pro Active Noise-Cancelling Headphones',
    slug: 'studio-pro-active-noise-cancelling-headphones',
    brand: 'AURA Labs',
    category: 'electronics',
    price: 249.99,
    salePrice: 199.99,
    rating: 4.9,
    reviewCount: 189,
    description: 'Masterfully balanced studio acoustic architecture with custom 40mm titanium diaphragm drivers, 4-stage adaptive ANC, ultra-soft memory foam ear cushions, and 45-hour battery life.',
    details: [
      '40mm custom tuned titanium drivers with sub-bass port',
      'Adaptive Hybrid Noise Cancellation with transparency dial',
      'Ultra-soft protein leather ear cushions and lightweight aluminum arms',
      'Lossless USB-C audio streaming and 3.5mm passive aux support'
    ],
    specifications: {
      'Battery Life': '45 hours with ANC enabled',
      'Frequency Response': '10Hz - 40,000Hz (Hi-Res Audio Certified)',
      'Weight': '255 grams'
    },
    shippingInfo: 'Free express courier delivery with hard-shell protective travel case.',
    featured: true,
    trending: true,
    isNew: true,
    active: true,
    createdAt: '2026-03-12T21:00:00Z',
    defaultVariantId: 'var-12-black',
    variants: [
      {
        id: 'var-12-black',
        colorName: 'Matte Obsidian',
        colorHex: '#18181B',
        sku: 'AUR-HP-BLK',
        stock: 28,
        images: [
          getProductSvg('headphones', '#18181B', '#27272A', 0)
        ]
      },
      {
        id: 'var-12-chalk',
        colorName: 'Chalk White & Brass',
        colorHex: '#F5EFEB',
        sku: 'AUR-HP-CHK',
        stock: 14,
        images: [
          getProductSvg('headphones', '#F5EFEB', '#C29B38', 0)
        ]
      },
      {
        id: 'var-12-green',
        colorName: 'Alpine Pine',
        colorHex: '#365314',
        sku: 'AUR-HP-GRN',
        stock: 5, // low stock test
        images: [
          getProductSvg('headphones', '#365314', '#1A2E05', 0)
        ]
      }
    ]
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Art of Considered Objects: Why Less, Better Matters',
    slug: 'art-of-considered-objects',
    category: 'Design Philosophy',
    author: 'Elena Vance',
    authorRole: 'Head of Curation',
    publishedAt: 'March 24, 2026',
    readingTime: '5 min read',
    coverImage: getProductSvg('lamp', '#F59E0B'),
    excerpt: 'In a world saturated with fleeting trends and disposability, choosing enduring materials and thoughtful industrial design transforms how we interact with everyday rituals.',
    content: `
When Dieter Rams formulated his famous ten principles of good design in the late 1970s, he could hardly have anticipated the sheer volume of ephemeral objects that would compete for our attention fifty years later.

Good design is not merely aesthetic ornamentation. It is an intentional reduction of friction. An object should serve its purpose quietly, endure through decades of wear, and develop a patina that chronicles its journey with you.

### The Value of Tactile Materials

Consider the difference between a synthetic resin watch strap and one crafted from vegetable-tanned Italian leather or brushed surgical steel. The former degrades; the latter matures. Every scratch on an anodized aluminum water bottle or full-grain leather backpack tells an authentic story of daily commute and mountain trails.

### Designing for Longevity

At AURA & ARTIFACT, every product undergoes a strict curation rubric:
1. **Material Authenticity**: No simulated veneers or hollow plastics where solid wood, machined aluminum, and natural fibers belong.
2. **Repairability**: Replaceable watch straps, modular headphone cables, and serviceable hinges.
3. **Restrained Elegance**: Neutral tones and balanced geometry that resist the cyclical churn of micro-trends.

By surrounding ourselves with objects we truly respect, we consume less, appreciate more, and cultivate a living space grounded in serenity.
    `,
    published: true
  },
  {
    id: 'post-2',
    title: 'Morning Routines for Deep Focus: Audio, Lighting, and Serenity',
    slug: 'morning-routines-deep-focus',
    category: 'Wellness & Living',
    author: 'Marcus Chen',
    authorRole: 'Acoustic Engineer',
    publishedAt: 'March 18, 2026',
    readingTime: '4 min read',
    coverImage: getProductSvg('headphones', '#18181B'),
    excerpt: 'How sensory curation—from warm 3000K ambient illumination to balanced low-latency acoustics—can prime your mind for uninterrupted creative flow.',
    content: `
The transition from sleep into purposeful work is one of the most fragile periods of the day. The brain in early morning is susceptible to sensory overload: blaring alarm sounds, harsh fluorescent overheads, and immediate notification barrage.

### 1. Calibrate Your Light Spectrum
Avoid cold blue light in the first 30 minutes. Gentle 2700K to 3000K diffuse illumination mimics the dawn horizon and preserves natural melatonin decline without triggering cortisol spikes. A sculptural moon lamp positioned at eye level provides subtle ambient warmth.

### 2. Acoustic Architecture
Active noise cancellation is not just about blocking airplanes—it creates a psychological cocoon. Tuning your studio headphones to gentle binaural soundscapes or minimalist ambient piano signals to your nervous system that you have entered deep work territory.
    `,
    published: true
  },
  {
    id: 'post-3',
    title: 'The Sustainable Commute: Building an Enduring Everyday Carry',
    slug: 'sustainable-commute-everyday-carry',
    category: 'Style & Travel',
    author: 'Soren Lindqvist',
    authorRole: 'Industrial Designer',
    publishedAt: 'March 10, 2026',
    readingTime: '6 min read',
    coverImage: getProductSvg('backpack', '#C5A880'),
    excerpt: 'An architect’s guide to selecting weather-resistant pack materials, modular organizers, and essential EDC gear built to withstand a million subway miles.',
    content: `
Commuting through modern transit requires gear that balances lightweight agility with bombproof weather resistance. When selecting an everyday carry pack, look for high-tenacity recycled ripstop coated with PFC-free water repellent.

Pairing your pack with a double-wall vacuum flask eliminates single-use plastics entirely while ensuring your morning brew stays piping hot through the longest delay.
    `,
    published: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ELEVATE15',
    discountType: 'percentage',
    value: 15,
    description: '15% off your entire order'
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    description: '10% off for new members'
  },
  {
    code: 'SAVE20',
    discountType: 'fixed',
    value: 20,
    minOrder: 100,
    description: '$20 off on orders over $100'
  },
  {
    code: 'FREESHIP',
    discountType: 'shipping',
    value: 100,
    description: 'Complimentary standard shipping'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    name: 'AURA Store Director',
    email: 'admin@aura-artifact.store',
    role: 'admin',
    phone: '+1 (555) 019-2831',
    createdAt: '2026-01-01T00:00:00Z',
    savedAddresses: [
      {
        firstName: 'Store',
        lastName: 'Director',
        email: 'admin@aura-artifact.store',
        phone: '+1 (555) 019-2831',
        street: '742 Evergreen Terrace',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States'
      }
    ]
  },
  {
    id: 'usr-cust-1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'customer',
    phone: '+1 (555) 438-9921',
    createdAt: '2026-02-15T00:00:00Z',
    savedAddresses: [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 438-9921',
        street: '124 Bedford Avenue, Apt 4B',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11211',
        country: 'United States'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-94821',
    trackingNumber: 'TRK-FEDEX-9482103',
    createdAt: '2026-03-27T14:20:00Z',
    updatedAt: '2026-03-28T09:15:00Z',
    customer: {
      userId: 'usr-cust-1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 438-9921'
    },
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 438-9921',
      street: '124 Bedford Avenue, Apt 4B',
      city: 'Brooklyn',
      state: 'NY',
      postalCode: '11211',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Horizon Smart Watch Series 9',
        variantId: 'var-1-black',
        colorName: 'Matte Obsidian',
        sku: 'AUR-W9-OBS',
        image: getProductSvg('smartwatch', '#18181B', '#27272A'),
        unitPrice: 159.99,
        quantity: 1,
        total: 159.99
      },
      {
        productId: 'prod-5',
        productName: 'Lumina Geometric Moon Ambient Lamp',
        variantId: 'var-5-walnut',
        colorName: 'Warm Walnut',
        sku: 'LUM-MOON-WAL',
        image: getProductSvg('lamp', '#F59E0B', '#8B4513'),
        unitPrice: 24.99,
        quantity: 1,
        total: 24.99
      }
    ],
    subtotal: 184.98,
    shippingCost: 0,
    discount: 18.50,
    couponCode: 'WELCOME10',
    tax: 13.32,
    total: 179.80,
    paymentMethod: 'Stripe Test Card (•••• 4242)',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    notes: 'Please leave in package locker if unattended.'
  }
];
