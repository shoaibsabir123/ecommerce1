export type ProductCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  image?: string;
  count?: number;
}

export interface StoreSettings {
  storeName: string;
  announcementText: string;
  supportEmail: string;
  supportPhone: string;
  currencySymbol: string;
  freeShippingThreshold: number;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  sku: string;
  price?: number; // Override base price if different
  salePrice?: number;
  stock: number;
  images: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  specifications: Record<string, string>;
  shippingInfo: string;
  featured: boolean;
  trending: boolean;
  isNew?: boolean;
  active: boolean;
  variants: ProductVariant[];
  defaultVariantId: string;
  createdAt: string;
}

export interface CartItem {
  cartItemId: string; // unique item id in cart (productId + variantId)
  productId: string;
  productName: string;
  productSlug: string;
  brand: string;
  category: ProductCategory;
  variantId: string;
  colorName: string;
  colorHex: string;
  sku: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  sku: string;
  image: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
  savedAddresses?: ShippingAddress[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readingTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  value: number; // e.g., 15 for 15% or 10 for $10
  minOrder?: number;
  description: string;
}
