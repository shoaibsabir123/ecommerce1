-- ==============================================================================
-- AURA & ARTIFACT: PostgreSQL Schema for Supabase
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2),
  rating NUMERIC(3, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  description TEXT,
  details JSONB DEFAULT '[]'::JSONB,
  specifications JSONB DEFAULT '{}'::JSONB,
  shipping_info TEXT,
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  default_variant_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 2. PRODUCT VARIANTS TABLE (Colors, SKUs, Stock, Images)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  sku TEXT NOT NULL,
  price NUMERIC(10, 2),
  sale_price NUMERIC(10, 2),
  stock INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]'::JSONB
);

-- Index on product_id for fast joins
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  tracking_number TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  customer JSONB,
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB,
  subtotal NUMERIC(10, 2),
  shipping_cost NUMERIC(10, 2),
  discount NUMERIC(10, 2) DEFAULT 0,
  coupon_code TEXT,
  tax NUMERIC(10, 2),
  total NUMERIC(10, 2),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'Paid',
  order_status TEXT DEFAULT 'Processing',
  notes TEXT
);

-- 4. CUSTOMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  phone TEXT,
  saved_addresses JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 5. BLOG ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT,
  published_at TEXT,
  reading_time TEXT,
  cover_image TEXT,
  excerpt TEXT,
  content TEXT,
  published BOOLEAN DEFAULT true
);

-- 6. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  verified_purchase BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);

-- 7. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Package',
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 8. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL,
  announcement_text TEXT,
  support_email TEXT,
  support_phone TEXT,
  currency_symbol TEXT DEFAULT '$',
  free_shipping_threshold NUMERIC(10, 2) DEFAULT 50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Allow customers to read active products, blog, reviews, categories, settings)
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Public can view product variants" ON public.product_variants
  FOR SELECT USING (true);

CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Public can view reviews" ON public.product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view store settings" ON public.store_settings
  FOR SELECT USING (true);

-- ORDERS POLICIES (Allow creating orders from checkout)
CREATE POLICY "Public can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view their own orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Public can update orders" ON public.orders
  FOR UPDATE USING (true);

-- FULL ACCESS POLICIES FOR ADMIN OR ANON CLIENTS IN HYBRID MODE
CREATE POLICY "Full access on products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access on variants" ON public.product_variants
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access on profiles" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access on blog" ON public.blog_posts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access on reviews" ON public.product_reviews
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access on categories" ON public.categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access on store settings" ON public.store_settings
  FOR ALL USING (true) WITH CHECK (true);
