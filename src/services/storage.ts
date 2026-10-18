import {
  Product,
  Order,
  BlogPost,
  UserProfile,
  Coupon,
  ProductReview,
  ProductVariant,
  CategoryItem,
  StoreSettings
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_BLOG_POSTS,
  INITIAL_USERS,
  INITIAL_COUPONS
} from '../data/initialData';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_products_v1',
  CATEGORIES: 'aura_categories_v1',
  SETTINGS: 'aura_settings_v1',
  ORDERS: 'aura_orders_v1',
  BLOG: 'aura_blog_v1',
  USERS: 'aura_users_v1',
  CURRENT_USER: 'aura_current_user_v1',
  REVIEWS: 'aura_reviews_v1',
  SUPABASE_SYNC: 'aura_supabase_synced_v1',
  DELETED_PRODUCTS: 'aura_deleted_products_v1',
};

export function getDeletedProductIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordDeletedProductId(id: string) {
  if (typeof window === 'undefined') return;
  const ids = getDeletedProductIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(STORAGE_KEYS.DELETED_PRODUCTS, JSON.stringify(ids));
  }
}

export function unrecordDeletedProductId(id: string) {
  if (typeof window === 'undefined') return;
  const ids = getDeletedProductIds().filter(i => i !== id);
  localStorage.setItem(STORAGE_KEYS.DELETED_PRODUCTS, JSON.stringify(ids));
}

function safeExecute(fn: () => PromiseLike<any>) {
  try {
    Promise.resolve(fn()).catch((err: unknown) => {
      console.warn('Supabase background operation notice:', err);
    });
  } catch (err) {
    console.warn('Supabase synchronous notice:', err);
  }
}

function emitStoreUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aura_store_updated'));
  }
}

// Map database row to Product TypeScript type
function mapDbProduct(row: any, variants: ProductVariant[] = []): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    category: row.category,
    price: parseFloat(row.price),
    salePrice: row.sale_price ? parseFloat(row.sale_price) : undefined,
    rating: parseFloat(row.rating || 5.0),
    reviewCount: parseInt(row.review_count || 0),
    description: row.description || '',
    details: Array.isArray(row.details) ? row.details : [],
    specifications: typeof row.specifications === 'object' && row.specifications !== null ? row.specifications : {},
    shippingInfo: row.shipping_info || '',
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    isNew: Boolean(row.is_new),
    active: Boolean(row.active),
    defaultVariantId: row.default_variant_id || (variants[0]?.id || ''),
    createdAt: row.created_at || new Date().toISOString(),
    variants
  };
}

// Map database row to ProductVariant TypeScript type
function mapDbVariant(row: any): ProductVariant {
  return {
    id: row.id,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    price: row.price ? parseFloat(row.price) : undefined,
    salePrice: row.sale_price ? parseFloat(row.sale_price) : undefined,
    stock: parseInt(row.stock || 0),
    images: Array.isArray(row.images) ? row.images : []
  };
}

let isStorageInitialized = false;

// Initial bootstrap for local cache
export function initStorage() {
  if (typeof window === 'undefined') return;
  if (isStorageInitialized) return;
  isStorageInitialized = true;

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_STORE_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOG)) {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    const sampleReviews: ProductReview[] = [
      {
        id: 'rev-1',
        productId: 'prod-1',
        authorName: 'David K.',
        rating: 5,
        title: 'Exquisite build quality & battery life',
        comment: 'The OLED screen is brilliant even under harsh afternoon sunlight. The titanium crown and ceramic rear finish feel significantly better than mass market watches.',
        createdAt: '2026-03-20T10:00:00Z',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        productId: 'prod-1',
        authorName: 'Sarah M.',
        rating: 5,
        title: 'Minimalist perfection',
        comment: 'Love the Alpine Sage strap! Battery comfortably lasts 3 days without needing a charge.',
        createdAt: '2026-03-22T14:30:00Z',
        verifiedPurchase: true
      },
      {
        id: 'rev-3',
        productId: 'prod-2',
        authorName: 'Julian T.',
        rating: 5,
        title: 'Best daily backpack I have ever owned',
        comment: 'The Fidlock magnetic buckles are so satisfying to use. It holds my 16" MacBook Pro, mirrorless camera, and water flask without bulging.',
        createdAt: '2026-03-15T09:12:00Z',
        verifiedPurchase: true
      }
    ];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(sampleReviews));
  }

  // Trigger background sync if Supabase is active
  syncWithSupabase();
}

// Background sync from live Supabase PostgreSQL database
export async function syncWithSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const [prodRes, varRes, orderRes, blogRes, revRes, catRes, setRes] = await Promise.all([
      client.from('products').select('*'),
      client.from('product_variants').select('*'),
      client.from('orders').select('*').order('created_at', { ascending: false }),
      client.from('blog_posts').select('*'),
      client.from('product_reviews').select('*'),
      client.from('categories').select('*'),
      client.from('store_settings').select('*').limit(1)
    ]);

    if (!prodRes.error && prodRes.data) {
      if (prodRes.data.length > 0) {
        const deletedIds = getDeletedProductIds();
        const rawProducts = prodRes.data.filter((p: any) => !deletedIds.includes(p.id));
        const rawVariants = varRes.data || [];

        const mergedProducts: Product[] = rawProducts.map(p => {
          const itemVariants = rawVariants
            .filter(v => v.product_id === p.id)
            .map(mapDbVariant);
          return mapDbProduct(p, itemVariants);
        });

        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mergedProducts));
      }
    }

    if (!orderRes.error && orderRes.data && orderRes.data.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orderRes.data));
    }

    if (!catRes.error && catRes.data && catRes.data.length > 0) {
      const cats: CategoryItem[] = catRes.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.id,
        icon: c.icon || 'Package',
        description: c.description || '',
        image: c.image || ''
      }));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    }

    if (!setRes.error && setRes.data && setRes.data.length > 0) {
      const s = setRes.data[0];
      const settings: StoreSettings = {
        storeName: s.store_name || DEFAULT_STORE_SETTINGS.storeName,
        announcementText: s.announcement_text || DEFAULT_STORE_SETTINGS.announcementText,
        supportEmail: s.support_email || DEFAULT_STORE_SETTINGS.supportEmail,
        supportPhone: s.support_phone || DEFAULT_STORE_SETTINGS.supportPhone,
        currencySymbol: s.currency_symbol || DEFAULT_STORE_SETTINGS.currencySymbol,
        freeShippingThreshold: typeof s.free_shipping_threshold === 'number' ? s.free_shipping_threshold : (parseFloat(s.free_shipping_threshold) || 50)
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    if (!blogRes.error && blogRes.data && blogRes.data.length > 0) {
      const blogs: BlogPost[] = blogRes.data.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        category: b.category,
        author: b.author,
        authorRole: b.author_role || '',
        publishedAt: b.published_at || '',
        readingTime: b.reading_time || '4 min read',
        coverImage: b.cover_image || '',
        excerpt: b.excerpt || '',
        content: b.content || '',
        published: Boolean(b.published)
      }));
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blogs));
    }

    if (!revRes.error && revRes.data && revRes.data.length > 0) {
      const revs: ProductReview[] = revRes.data.map(r => ({
        id: r.id,
        productId: r.product_id,
        authorName: r.author_name,
        rating: r.rating,
        title: r.title || '',
        comment: r.comment,
        createdAt: r.created_at,
        verifiedPurchase: Boolean(r.verified_purchase)
      }));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(revs));
    }

    emitStoreUpdate();
  } catch (err) {
    console.warn('Supabase sync notice:', err);
  }
}

// Reset data to defaults
export function resetDatabase() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_STORE_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(INITIAL_BLOG_POSTS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.removeItem(STORAGE_KEYS.DELETED_PRODUCTS);
  emitStoreUpdate();
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'AURA & ARTIFACT',
  announcementText: 'Complimentary courier shipping on orders over $50 · Use code WELCOME10 for 10% off',
  supportEmail: 'support@auracraft.com',
  supportPhone: '+1 (800) 555-0199',
  currencySymbol: '$',
  freeShippingThreshold: 50
};

// CATEGORIES API (Full customizable category management)
export function getCategories(): CategoryItem[] {
  initStorage();
  let categories: CategoryItem[] = INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      categories = JSON.parse(raw);
    }
  } catch {
    categories = INITIAL_CATEGORIES;
  }

  // Calculate live assigned product counts
  const products = getProducts();
  return categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.id).length
  }));
}

export function getCategoryById(id: string): CategoryItem | undefined {
  const categories = getCategories();
  return categories.find(c => c.id === id);
}

export function saveCategory(category: CategoryItem): CategoryItem {
  initStorage();
  const rawList = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  })();

  const cleanId = category.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const cleanCategory: CategoryItem = {
    ...category,
    id: cleanId,
    name: category.name.trim(),
    slug: category.slug || cleanId,
    icon: category.icon || 'Package',
    description: category.description || '',
    image: category.image || ''
  };

  const existingIndex = rawList.findIndex((c: any) => c.id === cleanCategory.id);
  let updatedList: CategoryItem[];
  if (existingIndex >= 0) {
    updatedList = [...rawList];
    updatedList[existingIndex] = { ...rawList[existingIndex], ...cleanCategory };
  } else {
    updatedList = [...rawList, cleanCategory];
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedList));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(async () => {
      await client.from('categories').upsert({
        id: cleanCategory.id,
        name: cleanCategory.name,
        slug: cleanCategory.slug || cleanCategory.id,
        icon: cleanCategory.icon,
        description: cleanCategory.description,
        image: cleanCategory.image
      });
    });
  }

  return cleanCategory;
}

export function deleteCategory(categoryId: string): { success: boolean; message: string; affectedCount: number } {
  initStorage();
  const rawList = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  })();

  const products = getProducts();
  const affectedCount = products.filter(p => p.category === categoryId).length;

  const updatedList = rawList.filter((c: any) => c.id !== categoryId);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedList));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(async () => {
      await client.from('categories').delete().eq('id', categoryId);
    });
  }

  return {
    success: true,
    affectedCount,
    message: affectedCount > 0
      ? `Deleted category "${categoryId}". ${affectedCount} product(s) still use this category identifier.`
      : `Deleted category "${categoryId}" successfully.`
  };
}

// STORE SETTINGS & CUSTOMIZABLE DATA API
export function getStoreSettings(): StoreSettings {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_STORE_SETTINGS;
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  const current = getStoreSettings();
  const updated: StoreSettings = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(async () => {
      await client.from('store_settings').upsert({
        id: 'default',
        store_name: updated.storeName,
        announcement_text: updated.announcementText,
        support_email: updated.supportEmail,
        support_phone: updated.supportPhone,
        currency_symbol: updated.currencySymbol,
        free_shipping_threshold: updated.freeShippingThreshold,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    });
  }

  return updated;
}

// FULL STORE DATA EXPORT & IMPORT
export function exportAllStoreData(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    storeSettings: getStoreSettings(),
    categories: getCategories(),
    products: getProducts(),
    orders: getOrders(),
    blogPosts: getBlogPosts()
  };
  return JSON.stringify(data, null, 2);
}

export function importStoreData(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Provided content is not valid JSON.');
    }

    if (Array.isArray(parsed.products) && parsed.products.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(parsed.products));
    }
    if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed.categories));
    }
    if (Array.isArray(parsed.orders)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(parsed.orders));
    }
    if (Array.isArray(parsed.blogPosts)) {
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(parsed.blogPosts));
    }
    if (parsed.storeSettings && typeof parsed.storeSettings === 'object') {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.storeSettings));
    }

    localStorage.removeItem(STORAGE_KEYS.DELETED_PRODUCTS);
    emitStoreUpdate();

    return {
      success: true,
      message: 'Successfully imported store data! Catalog, categories, and settings updated.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to import store data.'
    };
  }
}

// Seed the live Supabase PostgreSQL database with the complete initial catalog
export async function seedSupabaseDatabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    };
  }

  try {
    // 0. Insert Categories
    const categoriesToInsert = getCategories().map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug || c.id,
      icon: c.icon || 'Package',
      description: c.description || '',
      image: c.image || ''
    }));
    try {
      await client.from('categories').upsert(categoriesToInsert, { onConflict: 'id' });
    } catch (e) {
      console.warn('Category table optional notice:', e);
    }

    // 1. Insert Products
    const productsToInsert = INITIAL_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      category: p.category,
      price: p.price,
      sale_price: p.salePrice || null,
      rating: p.rating,
      review_count: p.reviewCount,
      description: p.description,
      details: p.details,
      specifications: p.specifications,
      shipping_info: p.shippingInfo,
      featured: p.featured,
      trending: p.trending,
      is_new: p.isNew || false,
      active: p.active,
      default_variant_id: p.defaultVariantId,
      created_at: p.createdAt
    }));

    const { error: pErr } = await client.from('products').upsert(productsToInsert, { onConflict: 'id' });
    if (pErr) throw pErr;

    // 2. Insert Variants
    const variantsToInsert = INITIAL_PRODUCTS.flatMap(p =>
      p.variants.map(v => ({
        id: v.id,
        product_id: p.id,
        color_name: v.colorName,
        color_hex: v.colorHex,
        sku: v.sku,
        price: v.price || null,
        sale_price: v.salePrice || null,
        stock: v.stock,
        images: v.images
      }))
    );

    const { error: vErr } = await client.from('product_variants').upsert(variantsToInsert, { onConflict: 'id' });
    if (vErr) throw vErr;

    // 3. Insert Blog Posts
    const blogToInsert = INITIAL_BLOG_POSTS.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      author: b.author,
      author_role: b.authorRole,
      published_at: b.publishedAt,
      reading_time: b.readingTime,
      cover_image: b.coverImage,
      excerpt: b.excerpt,
      content: b.content,
      published: b.published
    }));
    await client.from('blog_posts').upsert(blogToInsert, { onConflict: 'id' });

    // 4. Insert Initial Orders
    const ordersToInsert = INITIAL_ORDERS.map(o => ({
      id: o.id,
      first_name: o.shippingAddress.firstName,
      last_name: o.shippingAddress.lastName,
      email: o.customer.email,
      street_address: o.shippingAddress.street,
      city: o.shippingAddress.city,
      zip_code: o.shippingAddress.postalCode,
      product_name: o.items.map(i => `${i.productName} (${i.colorName}) x${i.quantity}`).join(', '),
      total_amount: o.total,
      tracking_number: o.trackingNumber,
      created_at: o.createdAt,
      updated_at: o.updatedAt,
      customer: o.customer,
      shipping_address: o.shippingAddress,
      billing_address: o.billingAddress || null,
      items: o.items,
      subtotal: o.subtotal,
      shipping_cost: o.shippingCost,
      discount: o.discount,
      coupon_code: o.couponCode || null,
      tax: o.tax,
      total: o.total,
      payment_method: o.paymentMethod,
      payment_status: o.paymentStatus,
      order_status: o.orderStatus,
      notes: o.notes || null
    }));
    await client.from('orders').upsert(ordersToInsert, { onConflict: 'id' });

    await syncWithSupabase();

    return {
      success: true,
      message: `Successfully seeded ${INITIAL_PRODUCTS.length} products, ${variantsToInsert.length} color variants, and sample orders to Supabase PostgreSQL!`
    };
  } catch (err: any) {
    console.error('Error seeding Supabase database:', err);
    return {
      success: false,
      message: err.message || 'Failed to seed Supabase database. Ensure SQL schema is created first.'
    };
  }
}

// PRODUCTS API
export function getProducts(): Product[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const list: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    const deletedIds = getDeletedProductIds();
    return list.filter(p => !deletedIds.includes(p.id));
  } catch {
    const deletedIds = getDeletedProductIds();
    return INITIAL_PRODUCTS.filter(p => !deletedIds.includes(p.id));
  }
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.slug === slug || p.id === slug);
}

export function saveProduct(product: Product): Product {
  unrecordDeletedProductId(product.id);
  const current = getProducts();
  const existingIndex = current.findIndex(p => p.id === product.id);

  let updated: Product[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...product };
  } else {
    updated = [product, ...current];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  emitStoreUpdate();

  // If Supabase is connected, persist remotely in background
  const client = getSupabaseClient();
  if (client) {
    safeExecute(async () => {
      await client.from('products').upsert({
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category,
        price: product.price,
        sale_price: product.salePrice || null,
        rating: product.rating,
        review_count: product.reviewCount,
        description: product.description,
        details: product.details,
        specifications: product.specifications,
        shipping_info: product.shippingInfo,
        featured: product.featured,
        trending: product.trending,
        is_new: product.isNew || false,
        active: product.active,
        default_variant_id: product.defaultVariantId,
        created_at: product.createdAt
      });

      const variantsToUpsert = product.variants.map(v => ({
        id: v.id,
        product_id: product.id,
        color_name: v.colorName,
        color_hex: v.colorHex,
        sku: v.sku,
        price: v.price || null,
        sale_price: v.salePrice || null,
        stock: v.stock,
        images: v.images
      }));
      await client.from('product_variants').upsert(variantsToUpsert);
    });
  }

  return product;
}

export function deleteProduct(productId: string): boolean {
  recordDeletedProductId(productId);
  const current = getProducts();
  const updated = current.filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(async () => {
      // 1. Delete associated child variants first to satisfy foreign keys
      await client.from('product_variants').delete().eq('product_id', productId);
      // 2. Delete associated reviews
      await client.from('product_reviews').delete().eq('product_id', productId);
      // 3. Delete parent product
      const res = await client.from('products').delete().eq('id', productId);
      if (res.error) {
        console.warn('Supabase product deletion warning:', res.error);
      }
    });
  }

  return true;
}

// ORDERS API
export function getOrders(): Order[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find(o => o.id === id);
}

export function getOrdersByCustomer(email: string): Order[] {
  const orders = getOrders();
  return orders.filter(o => o.customer.email.toLowerCase() === email.toLowerCase());
}

export function createOrder(orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Order {
  const products = getProducts();

  // Validate and reduce stock for each purchased variant
  const updatedProducts = products.map(product => {
    const matchingItems = orderData.items.filter(item => item.productId === product.id);
    if (matchingItems.length === 0) return product;

    const newVariants = product.variants.map(variant => {
      const purchased = matchingItems.find(item => item.variantId === variant.id);
      if (purchased) {
        return {
          ...variant,
          stock: Math.max(0, variant.stock - purchased.quantity)
        };
      }
      return variant;
    });

    return {
      ...product,
      variants: newVariants
    };
  });

  // Save updated product stock to database
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));

  // Generate unique order ID and tracking
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `ORD-${randomSuffix}`;
  const trackingNumber = `TRK-USPS-${Math.floor(1000000 + Math.random() * 9000000)}`;

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    trackingNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const orders = getOrders();
  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  emitStoreUpdate();

  // If Supabase is connected, persist to live PostgreSQL
  const client = getSupabaseClient();
  if (client) {
    const summaryProductName = newOrder.items
      .map(i => `${i.productName} (${i.colorName}) x${i.quantity}`)
      .join(', ');

    safeExecute(() =>
      client.from('orders').insert({
        id: newOrder.id,
        first_name: newOrder.shippingAddress.firstName,
        last_name: newOrder.shippingAddress.lastName,
        email: newOrder.customer.email,
        street_address: newOrder.shippingAddress.street,
        city: newOrder.shippingAddress.city,
        zip_code: newOrder.shippingAddress.postalCode,
        product_name: summaryProductName,
        total_amount: newOrder.total,
        created_at: newOrder.createdAt,
        tracking_number: newOrder.trackingNumber,
        updated_at: newOrder.updatedAt,
        customer: newOrder.customer,
        shipping_address: newOrder.shippingAddress,
        billing_address: newOrder.billingAddress || null,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        shipping_cost: newOrder.shippingCost,
        discount: newOrder.discount,
        coupon_code: newOrder.couponCode || null,
        tax: newOrder.tax,
        total: newOrder.total,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        order_status: newOrder.orderStatus,
        notes: newOrder.notes || null
      })
    );

    // Decrement stock in Supabase variants table
    orderData.items.forEach(it => {
      safeExecute(async () => {
        try {
          await client.rpc('decrement_variant_stock', {
            variant_id: it.variantId,
            qty: it.quantity
          });
        } catch {
          // Fallback standard update
          const matchingProd = products.find(p => p.id === it.productId);
          const matchingVar = matchingProd?.variants.find(v => v.id === it.variantId);
          if (matchingVar) {
            await client.from('product_variants')
              .update({ stock: Math.max(0, matchingVar.stock - it.quantity) })
              .eq('id', it.variantId);
          }
        }
      });
    });
  }

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return undefined;

  orders[index] = {
    ...orders[index],
    orderStatus: status,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(() =>
      client.from('orders').update({
        order_status: status,
        updated_at: new Date().toISOString()
      }).eq('id', orderId)
    );
  }

  return orders[index];
}

export function updateOrderPaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Order | undefined {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return undefined;

  orders[index] = {
    ...orders[index],
    paymentStatus,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(() =>
      client.from('orders').update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      }).eq('id', orderId)
    );
  }

  return orders[index];
}

// USERS & AUTH API
export function getUsers(): UserProfile[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function getCurrentUser(): UserProfile | null {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : INITIAL_USERS[1];
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
  emitStoreUpdate();
}

export function registerUser(email: string, name: string, role: 'customer' | 'admin' = 'customer'): UserProfile {
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    setCurrentUser(existing);
    return existing;
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
    savedAddresses: []
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(() =>
      client.from('profiles').upsert({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        saved_addresses: []
      })
    );
  }

  return newUser;
}

export function switchDemoUser(role: 'customer' | 'admin'): UserProfile {
  const users = getUsers();
  const target = users.find(u => u.role === role) || users[0];
  setCurrentUser(target);
  return target;
}

// BLOG API
export function getBlogPosts(): BlogPost[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOG);
    return raw ? JSON.parse(raw) : INITIAL_BLOG_POSTS;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find(p => p.slug === slug || p.id === slug);
}

export function saveBlogPost(post: BlogPost): BlogPost {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p.id === post.id);
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.unshift(post);
  }
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(posts));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(() =>
      client.from('blog_posts').upsert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        author: post.author,
        author_role: post.authorRole,
        published_at: post.publishedAt,
        reading_time: post.readingTime,
        cover_image: post.coverImage,
        excerpt: post.excerpt,
        content: post.content,
        published: post.published
      })
    );
  }

  return post;
}

export function deleteBlogPost(id: string): boolean {
  const posts = getBlogPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(posts));
  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(() => client.from('blog_posts').delete().eq('id', id));
  }

  return true;
}

// REVIEWS API
export function getReviewsForProduct(productId: string): ProductReview[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const allReviews: ProductReview[] = raw ? JSON.parse(raw) : [];
    return allReviews.filter(r => r.productId === productId);
  } catch {
    return [];
  }
}

export function addProductReview(review: Omit<ProductReview, 'id' | 'createdAt'>): ProductReview {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  const allReviews: ProductReview[] = raw ? JSON.parse(raw) : [];

  const newReview: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  allReviews.unshift(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));

  // Update product average rating & review count
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === review.productId);
  if (productIndex >= 0) {
    const productReviews = allReviews.filter(r => r.productId === review.productId);
    const avg = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
    products[productIndex] = {
      ...products[productIndex],
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: productReviews.length
    };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  emitStoreUpdate();

  const client = getSupabaseClient();
  if (client) {
    safeExecute(() =>
      client.from('product_reviews').insert({
        id: newReview.id,
        product_id: newReview.productId,
        author_name: newReview.authorName,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        created_at: newReview.createdAt,
        verified_purchase: newReview.verifiedPurchase
      })
    );
  }

  return newReview;
}

// COUPONS API
export function validateCoupon(code: string): Coupon | null {
  const normalized = code.trim().toUpperCase();
  const match = INITIAL_COUPONS.find(c => c.code.toUpperCase() === normalized);
  return match || null;
}
