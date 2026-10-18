import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Search, 
  X, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Database,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  AlertCircle,
  RefreshCw,
  FolderTree,
  Settings,
  Download,
  Upload,
  Layers,
  Tags,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Order, BlogPost, ProductVariant, ProductCategory, CategoryItem, StoreSettings } from '../types';
import { 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getCategories,
  saveCategory,
  deleteCategory,
  getStoreSettings,
  saveStoreSettings,
  exportAllStoreData,
  importStoreData,
  getOrders, 
  updateOrderStatus, 
  updateOrderPaymentStatus,
  getBlogPosts,
  saveBlogPost,
  deleteBlogPost,
  getUsers,
  resetDatabase,
  seedSupabaseDatabase
} from '../../src/services/storage';
import { getSupabaseStatus } from '../../src/lib/supabase';
import { useToast } from '../../src/context/ToastContext';
import { getProductSvg } from '../../src/utils/productImages';

interface AdminPageProps {
  onNavigateToStorefront: () => void;
  onSelectProduct: (slug: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToStorefront, onSelectProduct }) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'blog' | 'settings'>('overview');

  // Real-time state from database
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [categories, setCategories] = useState<CategoryItem[]>(() => getCategories());
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => getStoreSettings());
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getBlogPosts());
  const [customers, setCustomers] = useState(() => getUsers());

  // Supabase states
  const supabaseStatus = getSupabaseStatus();
  const [isSeedingSupabase, setIsSeedingSupabase] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const refreshData = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setStoreSettings(getStoreSettings());
    setOrders(getOrders());
    setBlogPosts(getBlogPosts());
    setCustomers(getUsers());
  };

  const handleSeedSupabase = async () => {
    setIsSeedingSupabase(true);
    const result = await seedSupabaseDatabase();
    setIsSeedingSupabase(false);
    refreshData();
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const handleCopySql = () => {
    const sqlText = `-- Supabase Schema for AURA & ARTIFACT
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

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  phone TEXT,
  saved_addresses JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

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

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Package',
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Full access on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access on variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access on blog" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access on reviews" ON public.product_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access on store settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    showToast('SQL Schema copied to clipboard!', 'info');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Listen to store updates in real-time
  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener('aura_store_updated', handleUpdate);
    return () => window.removeEventListener('aura_store_updated', handleUpdate);
  }, []);

  // Product Filters & Search State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'active' | 'inactive' | 'low-stock'>('all');
  const [productSortBy, setProductSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'name-asc'>('newest');

  // Confirmation Modals State (replaces blocked window.confirm)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  // Product Edit / Add State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Selected Order for status update modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Blog Edit / Add State
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);

  // Filtered and Sorted Products calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.variants.some(v => v.sku.toLowerCase().includes(q) || v.colorName.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (productCategoryFilter !== 'all') {
      result = result.filter(p => p.category === productCategoryFilter);
    }

    // Status / Inventory filter
    if (productStatusFilter === 'active') {
      result = result.filter(p => p.active);
    } else if (productStatusFilter === 'inactive') {
      result = result.filter(p => !p.active);
    } else if (productStatusFilter === 'low-stock') {
      result = result.filter(p => p.variants.some(v => v.stock <= 5));
    }

    // Sorting
    if (productSortBy === 'price-asc') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (productSortBy === 'price-desc') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (productSortBy === 'stock-asc') {
      result.sort((a, b) => {
        const stockA = a.variants.reduce((acc, v) => acc + v.stock, 0);
        const stockB = b.variants.reduce((acc, v) => acc + v.stock, 0);
        return stockA - stockB;
      });
    } else if (productSortBy === 'stock-desc') {
      result.sort((a, b) => {
        const stockA = a.variants.reduce((acc, v) => acc + v.stock, 0);
        const stockB = b.variants.reduce((acc, v) => acc + v.stock, 0);
        return stockB - stockA;
      });
    } else if (productSortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Newest first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, productSearch, productCategoryFilter, productStatusFilter, productSortBy]);

  // Statistics calculations
  const totalSales = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + o.total, 0);

  const lowStockProducts = products.flatMap(p => 
    p.variants
      .filter(v => v.stock <= 5)
      .map(v => ({ product: p, variant: v }))
  );

  // Handle Order Status change
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    const updated = updateOrderStatus(orderId, newStatus);
    if (updated) {
      refreshData();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Order #${orderId} status set to ${newStatus}`, 'success');
    }
  };

  // Handle Payment Status change
  const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: Order['paymentStatus']) => {
    const updated = updateOrderPaymentStatus(orderId, newPaymentStatus);
    if (updated) {
      refreshData();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Order #${orderId} payment status updated`, 'success');
    }
  };

  // Delete Product confirmed from in-app modal (100% reliable in iframes)
  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    deleteProduct(id);
    refreshData();
    setProductToDelete(null);
    showToast(`Product "${name}" deleted from database`, 'info');
  };

  // Quick toggle active state directly from the table
  const handleToggleProductActive = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: Product = { ...prod, active: !prod.active };
    saveProduct(updated);
    refreshData();
    showToast(`"${prod.name}" is now ${updated.active ? 'active' : 'inactive'}`, 'info');
  };

  // Handle Save Product
  const handleSaveProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const cleanSlug = (editingProduct.slug?.trim() || editingProduct.name)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');

    const toSave: Product = {
      ...editingProduct,
      slug: cleanSlug,
      defaultVariantId: editingProduct.defaultVariantId || editingProduct.variants[0]?.id || ''
    };

    saveProduct(toSave);
    refreshData();
    setEditingProduct(null);
    setIsAddingProduct(false);
    showToast(`Saved "${toSave.name}" successfully!`, 'success');
  };

  // Helper to open Add Product
  const handleStartAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const defaultVar: ProductVariant = {
      id: `var-${Date.now()}-1`,
      colorName: 'Matte Obsidian',
      colorHex: '#18181B',
      sku: `AUR-NEW-${Math.floor(100 + Math.random() * 900)}`,
      stock: 25,
      images: [getProductSvg('smartwatch', '#18181B')]
    };

    const newProd: Product = {
      id: newId,
      name: 'New Artisanal Product',
      slug: `new-product-${Date.now()}`,
      brand: 'AURA Labs',
      category: 'electronics',
      price: 99.99,
      salePrice: 79.99,
      rating: 5.0,
      reviewCount: 1,
      description: 'Handcrafted premium design with enduring tactile materials.',
      details: ['Precision engineering', 'Sustainable packaging', '2-year warranty'],
      specifications: { 'Material': 'Aluminum & Glass', 'Origin': 'Handmade' },
      shippingInfo: 'Ships within 24 hours via express courier.',
      featured: true,
      trending: true,
      active: true,
      createdAt: new Date().toISOString(),
      variants: [defaultVar],
      defaultVariantId: defaultVar.id
    };

    setEditingProduct(newProd);
    setIsAddingProduct(true);
  };

  // Helper to reset sample database (confirmed via in-app modal)
  const handleConfirmResetDatabase = () => {
    resetDatabase();
    refreshData();
    setShowResetConfirm(false);
    showToast('Catalog restored to default seed state!', 'success');
  };

  // Helper to delete blog post (confirmed via in-app modal)
  const handleConfirmDeleteBlogPost = () => {
    if (!blogToDelete) return;
    deleteBlogPost(blogToDelete.id);
    refreshData();
    setBlogToDelete(null);
    showToast('Article deleted', 'info');
  };

  // Category management states
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [categorySearch, setCategorySearch] = useState('');

  // Store data import / export states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Filtered categories calculation
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase().trim();
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, categorySearch]);

  const handleStartAddCategory = () => {
    const newId = `cat-${Date.now().toString().slice(-4)}`;
    const newCat: CategoryItem = {
      id: newId,
      name: '',
      slug: newId,
      icon: 'Sparkles',
      description: 'Curated artisanal collection matching the AURA design philosophy.',
      image: getProductSvg('lamp', '#F59E0B')
    };
    setEditingCategory(newCat);
    setIsAddingCategory(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      showToast('Please provide a valid category name.', 'error');
      return;
    }
    const cleanSlug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const toSave: CategoryItem = {
      ...editingCategory,
      id: editingCategory.id || cleanSlug,
      slug: cleanSlug
    };
    const saved = saveCategory(toSave);
    refreshData();
    setEditingCategory(null);
    setIsAddingCategory(false);
    showToast(`Category "${saved.name}" saved successfully!`, 'success');
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const result = deleteCategory(categoryToDelete.id);
    refreshData();
    setCategoryToDelete(null);
    showToast(result.message, result.affectedCount > 0 ? 'info' : 'success');
  };

  const handleSaveStoreSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveStoreSettings(storeSettings);
    refreshData();
    showToast('Store settings and announcement banner saved!', 'success');
  };

  const handleExportData = () => {
    const jsonStr = exportAllStoreData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aura-store-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Complete store data downloaded as JSON backup!', 'success');
  };

  const handleImportDataSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const res = importStoreData(importJsonText);
    if (res.success) {
      refreshData();
      setShowImportModal(false);
      setImportJsonText('');
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-[#0F172A] text-white p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase font-mono tracking-widest text-amber-300 font-bold">Admin Portal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Store Administration Dashboard</h1>
          <p className="text-xs text-stone-400">Manage products, variation inventory, customer orders, and content in real-time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportData}
            title="Download full JSON backup of products, categories, orders, and settings"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export JSON</span>
            <span className="sm:hidden">Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            title="Import custom JSON catalog or backup data"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Import JSON</span>
            <span className="sm:hidden">Import</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={onNavigateToStorefront}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {/* Supabase PostgreSQL Integration Status Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            supabaseStatus.configured 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-slate-900">Supabase PostgreSQL Database</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                supabaseStatus.configured 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {supabaseStatus.configured ? 'Connected & Active' : 'Fallback / Local Cache'}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono mt-0.5 truncate max-w-md">
              {supabaseStatus.url}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>View SQL Schema</span>
          </button>

          <button
            onClick={handleSeedSupabase}
            disabled={isSeedingSupabase}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
          >
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span>{isSeedingSupabase ? 'Seeding...' : 'Seed Supabase PostgreSQL'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'blog', label: `Blog Journal (${blogPosts.length})`, icon: FileText },
          { id: 'settings', label: 'Store Settings & Data', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Sales</span>
              <p className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tabular-nums">
                ${totalSales.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">Stripe test verified</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Orders</span>
              <p className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tabular-nums">
                {orders.length}
              </p>
              <span className="text-[11px] text-stone-500">Live order records</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Active Products</span>
              <p className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tabular-nums">
                {products.filter(p => p.active).length}
              </p>
              <span className="text-[11px] text-stone-500">Across 7 departments</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Low Stock Alerts</span>
              <p className="text-2xl sm:text-3xl font-bold font-serif text-amber-700 tabular-nums">
                {lowStockProducts.length}
              </p>
              <span className="text-[11px] text-amber-800 font-medium">≤ 5 units remaining</span>
            </div>
          </div>

          {/* Low Stock Alerts Banner */}
          {lowStockProducts.length > 0 && (
            <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Low Inventory Variations Requiring Restock</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.map(({ product, variant }, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                      <p className="text-stone-500">Color: {variant.colorName} ({variant.sku})</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold tabular-nums">
                      {variant.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-slate-900">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Order Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map(ord => (
                    <tr key={ord.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-slate-900">#{ord.id}</td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-900">{ord.customer.name}</p>
                        <p className="text-stone-400 text-[11px]">{ord.customer.email}</p>
                      </td>
                      <td className="py-3 text-stone-600">{ord.items.length} items</td>
                      <td className="py-3 font-bold text-slate-900 tabular-nums">${ord.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-semibold text-[11px]">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px]"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-slate-900">Product Catalog Management</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                  {products.length} Total
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Add, search, edit specifications, manage variation inventories, or delete products.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleStartAddProduct}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Sorting Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search name, brand, SKU..."
                  className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-900 placeholder:text-stone-400 focus:outline-hidden focus:border-slate-900 focus:bg-white transition-colors"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={productCategoryFilter}
                  onChange={e => setProductCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map(c => {
                    const count = products.filter(p => p.category === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Inventory / Status Filter */}
              <div>
                <select
                  value={productStatusFilter}
                  onChange={e => setProductStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive / Hidden</option>
                  <option value="low-stock">Low Stock (≤ 5 units)</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={productSortBy}
                  onChange={e => setProductSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="name-asc">Sort: Name (A-Z)</option>
                  <option value="price-asc">Sort: Price (Low to High)</option>
                  <option value="price-desc">Sort: Price (High to Low)</option>
                  <option value="stock-asc">Sort: Stock (Low to High)</option>
                  <option value="stock-desc">Sort: Stock (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Filter Summary & Quick Reset */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
              <span>
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
                <strong className="text-slate-900">{products.length}</strong> products
              </span>

              {(productSearch || productCategoryFilter !== 'all' || productStatusFilter !== 'all' || productSortBy !== 'newest') && (
                <button
                  onClick={() => {
                    setProductSearch('');
                    setProductCategoryFilter('all');
                    setProductStatusFilter('all');
                    setProductSortBy('newest');
                  }}
                  className="text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">No products found</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    {products.length === 0
                      ? 'Your catalog is currently empty. Add your first product or click Reset Demo Data to restore sample items.'
                      : 'No items match your active search and filter criteria. Try adjusting or clearing your filters.'}
                  </p>
                </div>
                <div className="pt-2">
                  {products.length === 0 ? (
                    <button
                      onClick={handleStartAddProduct}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Product</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setProductSearch('');
                        setProductCategoryFilter('all');
                        setProductStatusFilter('all');
                      }}
                      className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Clear Search Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Variants</th>
                      <th className="py-3.5 px-4">Total Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map(prod => {
                      const totalVariantStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 p-1 shrink-0 flex items-center justify-center">
                                <img
                                  src={prod.variants[0]?.images[0] || getProductSvg(prod.category, '#18181B')}
                                  alt={prod.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 text-sm line-clamp-1">{prod.name}</p>
                                <p className="text-stone-400 text-[11px]">
                                  {prod.brand} · SKU: {prod.variants[0]?.sku || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stone-600 capitalize">
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-medium text-[11px]">
                              {prod.category.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 tabular-nums">
                              ${(prod.salePrice || prod.price).toFixed(2)}
                            </span>
                            {prod.salePrice && (
                              <span className="text-stone-400 line-through text-[11px] block tabular-nums">
                                ${prod.price.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {prod.variants.map(v => (
                                <span
                                  key={v.id}
                                  className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block shadow-2xs"
                                  style={{ backgroundColor: v.colorHex }}
                                  title={`${v.colorName}: ${v.stock} in stock`}
                                />
                              ))}
                              <span className="text-[11px] text-stone-500 font-medium ml-1">
                                ({prod.variants.length})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-semibold tabular-nums inline-flex items-center gap-1 ${
                                totalVariantStock <= 5 ? 'text-amber-700 font-bold' : 'text-slate-800'
                              }`}
                            >
                              {totalVariantStock <= 5 && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                              {totalVariantStock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => handleToggleProductActive(prod, e)}
                              title="Click to toggle Active / Inactive"
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                                prod.active
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200 border border-stone-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${prod.active ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                              <span>{prod.active ? 'Active' : 'Hidden'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onSelectProduct(prod.slug)}
                                className="p-1.5 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors"
                                title="View on Live Storefront"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProduct(JSON.parse(JSON.stringify(prod)));
                                  setIsAddingProduct(false);
                                }}
                                className="p-1.5 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                                title="Edit Product & Variations"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(prod)}
                                className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATEGORIES MANAGEMENT TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-slate-900">Category Architecture & Taxonomies</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                  {categories.length} Total
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Create and manage custom departments, taxonomy slugs, descriptions, and storefront visual cards.
              </p>
            </div>

            <button
              onClick={handleStartAddCategory}
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Category</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                placeholder="Search categories by name, slug, or description..."
                className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-900 placeholder:text-stone-400 focus:outline-hidden focus:border-slate-900 focus:bg-white transition-colors"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-stone-500 hidden sm:block">
              Showing <strong className="text-slate-900">{filteredCategories.length}</strong> of{' '}
              <strong className="text-slate-900">{categories.length}</strong> categories
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map(cat => {
              const assignedCount = products.filter(p => p.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-xs hover:border-stone-300 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                        ) : (
                          <FolderTree className="w-5 h-5 text-stone-600" />
                        )}
                      </div>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 font-semibold truncate max-w-[150px]">
                        #{cat.id}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">{cat.name}</h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setProductCategoryFilter(cat.id);
                        setActiveTab('products');
                      }}
                      className="text-amber-800 hover:text-amber-900 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>{assignedCount} product{assignedCount !== 1 ? 's' : ''} assigned</span>
                      <span>→</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(JSON.parse(JSON.stringify(cat)));
                          setIsAddingCategory(false);
                        }}
                        className="p-1.5 hover:bg-stone-100 text-stone-700 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900">Customer Orders</h2>
              <p className="text-xs text-stone-500">Track fulfillments, dispatch updates, and update order statuses.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Order ID & Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items & Variations</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Fulfillment Status</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map(ord => (
                    <tr key={ord.id} className="hover:bg-stone-50/80">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">#{ord.id}</span>
                        <span className="text-[11px] text-stone-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{ord.customer.name}</p>
                        <p className="text-stone-400 text-[11px]">{ord.customer.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <p key={idx} className="text-stone-700">
                              {it.quantity}× {it.productName} <span className="text-stone-400">({it.colorName})</span>
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={e => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.paymentStatus}
                          onChange={e => handleUpdatePaymentStatus(ord.id, e.target.value as any)}
                          className="bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Refunded">Refunded</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CUSTOMERS MANAGEMENT TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-slate-900">Registered Customers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map(cust => {
              const custOrders = orders.filter(o => o.customer.email.toLowerCase() === cust.email.toLowerCase());
              const totalSpent = custOrders.reduce((acc, o) => acc + o.total, 0);

              return (
                <div key={cust.id} className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{cust.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {cust.role}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{cust.email}</p>
                  <div className="pt-2 border-t border-stone-100 flex justify-between text-xs text-stone-600">
                    <span>Orders Placed: <strong className="text-slate-900">{custOrders.length}</strong></span>
                    <span>Total Spent: <strong className="text-slate-900 tabular-nums">${totalSpent.toFixed(2)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. BLOG JOURNAL MANAGEMENT TAB */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900">Journal Articles</h2>
              <p className="text-xs text-stone-500">Publish design stories, craft narratives, and lifestyle guides.</p>
            </div>
            <button
              onClick={() => {
                const newPost: BlogPost = {
                  id: `post-${Date.now()}`,
                  title: 'New Design Journal Article',
                  slug: `journal-${Date.now()}`,
                  category: 'Philosophy',
                  author: 'AURA Editorial',
                  authorRole: 'Senior Curator',
                  publishedAt: new Date().toLocaleDateString(),
                  readingTime: '4 min read',
                  coverImage: getProductSvg('lamp', '#F59E0B'),
                  excerpt: 'Thoughts on intentional manufacturing and timeless materiality.',
                  content: 'Full article text here...',
                  published: true
                };
                setEditingPost(newPost);
                setIsAddingPost(true);
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.map(post => (
              <div key={post.id} className="p-5 bg-white rounded-2xl border border-stone-200 flex justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-800">{post.category}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingPost(JSON.parse(JSON.stringify(post)));
                      setIsAddingPost(false);
                    }}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setBlogToDelete(post)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded text-rose-600 transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STORE SETTINGS & CUSTOMIZABLE DATA TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Store Configuration & Data Customization</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize store identity, announcement banner messages, fulfillment thresholds, and manage full JSON catalog backups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Store Information Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <Settings className="w-4 h-4 text-slate-900" />
                <h3 className="font-serif font-bold text-base text-slate-900">Store Identity & Announcements</h3>
              </div>

              <form onSubmit={handleSaveStoreSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.storeName}
                    onChange={e => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Top Announcement Banner Text</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.announcementText}
                    onChange={e => setStoreSettings({ ...storeSettings, announcementText: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">Displayed across the top header of your storefront.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      required
                      value={storeSettings.supportEmail}
                      onChange={e => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Support Telephone</label>
                    <input
                      type="text"
                      required
                      value={storeSettings.supportPhone}
                      onChange={e => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      required
                      value={storeSettings.currencySymbol}
                      onChange={e => setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Free Shipping Order Threshold ($)</label>
                    <input
                      type="number"
                      required
                      value={storeSettings.freeShippingThreshold}
                      onChange={e => setStoreSettings({ ...storeSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Complete Data Backup & Management */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <Database className="w-4 h-4 text-slate-900" />
                  <h3 className="font-serif font-bold text-base text-slate-900">Data Portability & Backup</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-stone-500 leading-relaxed">
                    Export your full store dataset (products, custom categories, orders, blog articles, and settings) as a portable JSON file.
                  </p>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      onClick={handleExportData}
                      className="w-full py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export All Data (JSON)</span>
                    </button>

                    <button
                      onClick={() => setShowImportModal(true)}
                      className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-200"
                    >
                      <Upload className="w-4 h-4 text-sky-600" />
                      <span>Import Data (JSON)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Seed or Reset Catalog */}
              <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200/80 space-y-3">
                <h4 className="font-serif font-bold text-sm text-slate-900">Restore or Reset Catalog</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Need to restore the initial curated lifestyle products, sample orders, and standard department categories?
                </p>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-xl text-slate-900">
                {isAddingProduct ? 'Add New Product' : `Edit: ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={e => {
                      const newName = e.target.value;
                      const autoSlug = newName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
                      setEditingProduct({
                        ...editingProduct,
                        name: newName,
                        slug: isAddingProduct && (!editingProduct.slug || editingProduct.slug.startsWith('new-product-')) ? autoSlug : editingProduct.slug
                      });
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Product Slug (URL)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const autoSlug = (editingProduct.name || '')
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, '-')
                          .replace(/-+/g, '-');
                        setEditingProduct({ ...editingProduct, slug: autoSlug });
                      }}
                      className="text-[10px] text-amber-800 hover:underline font-semibold"
                    >
                      Auto from Name
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. titanium-watch-series-9"
                    value={editingProduct.slug || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Category</label>
                    <button
                      type="button"
                      onClick={() => handleStartAddCategory()}
                      className="text-[11px] text-amber-800 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> New
                    </button>
                  </div>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.salePrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              {/* VARIATIONS MANAGEMENT SECTION */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">Color Variations & Card Illustrations</h4>
                    <p className="text-[11px] text-stone-500">Each variation can have its own custom uploaded image or card illustration.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVar: ProductVariant = {
                        id: `var-${Date.now()}`,
                        colorName: 'Slate Grey',
                        colorHex: '#64748B',
                        sku: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
                        stock: 20,
                        images: [editingProduct.variants[0]?.images[0] || getProductSvg('smartwatch', '#64748B')]
                      };
                      setEditingProduct({
                        ...editingProduct,
                        variants: [...editingProduct.variants, newVar]
                      });
                    }}
                    className="text-xs text-amber-800 font-semibold hover:underline flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Variation
                  </button>
                </div>

                <div className="space-y-4">
                  {editingProduct.variants.map((v, vIdx) => {
                    const currentImg = v.images[0] || getProductSvg(editingProduct.category || 'smartwatch', v.colorHex);
                    return (
                      <div key={v.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                        {/* Variant details row */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                          <div>
                            <label className="text-[10px] text-stone-500 font-semibold block mb-1">Color Name</label>
                            <input
                              type="text"
                              value={v.colorName}
                              onChange={e => {
                                const vars = [...editingProduct.variants];
                                vars[vIdx].colorName = e.target.value;
                                setEditingProduct({ ...editingProduct, variants: vars });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-stone-500 font-semibold block mb-1">Hex Swatch</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={v.colorHex}
                                onChange={e => {
                                  const vars = [...editingProduct.variants];
                                  vars[vIdx].colorHex = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: vars });
                                }}
                                className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0.5 bg-white"
                              />
                              <input
                                type="text"
                                value={v.colorHex}
                                onChange={e => {
                                  const vars = [...editingProduct.variants];
                                  vars[vIdx].colorHex = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: vars });
                                }}
                                className="w-24 px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-stone-500 font-semibold block mb-1">SKU</label>
                            <input
                              type="text"
                              value={v.sku}
                              onChange={e => {
                                const vars = [...editingProduct.variants];
                                vars[vIdx].sku = e.target.value;
                                setEditingProduct({ ...editingProduct, variants: vars });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <label className="text-[10px] text-stone-500 font-semibold block mb-1">Stock Qty</label>
                              <input
                                type="number"
                                value={v.stock}
                                onChange={e => {
                                  const vars = [...editingProduct.variants];
                                  vars[vIdx].stock = parseInt(e.target.value) || 0;
                                  setEditingProduct({ ...editingProduct, variants: vars });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold tabular-nums"
                              />
                            </div>
                            {editingProduct.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const vars = editingProduct.variants.filter((_, idx) => idx !== vIdx);
                                  setEditingProduct({ ...editingProduct, variants: vars });
                                }}
                                className="mt-4 p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove Variant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Card illustration & image upload controls for this variant */}
                        <div className="pt-2.5 border-t border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                              <img
                                src={currentImg}
                                alt={v.colorName}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 text-xs block">
                                Card Illustration & Photo
                              </span>
                              <span className="text-[10px] text-stone-400">
                                Displayed on storefront cards and product gallery
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                              <Upload className="w-3.5 h-3.5 text-amber-300" />
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = evt => {
                                      const res = evt.target?.result as string;
                                      if (res) {
                                        const vars = [...editingProduct.variants];
                                        vars[vIdx].images = [res, ...(vars[vIdx].images.slice(1))];
                                        setEditingProduct({ ...editingProduct, variants: vars });
                                        showToast(`Uploaded ${file.name} for ${v.colorName}!`, 'success');
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                const presetSvg = getProductSvg(editingProduct.category || 'smartwatch', v.colorHex);
                                const vars = [...editingProduct.variants];
                                vars[vIdx].images = [presetSvg];
                                setEditingProduct({ ...editingProduct, variants: vars });
                                showToast(`Vector illustration set for ${v.colorName}`, 'info');
                              }}
                              className="px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg text-[11px] font-medium"
                            >
                              Preset Vector
                            </button>

                            <input
                              type="text"
                              placeholder="Or paste image URL..."
                              value={v.images[0]?.startsWith('data:') ? '' : (v.images[0] || '')}
                              onChange={e => {
                                const vars = [...editingProduct.variants];
                                vars[vIdx].images = [e.target.value || getProductSvg(editingProduct.category, v.colorHex)];
                                setEditingProduct({ ...editingProduct, variants: vars });
                              }}
                              className="w-36 sm:w-44 px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status toggles */}
              <div className="flex gap-4 pt-3 border-t border-stone-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.active}
                    onChange={e => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                    className="accent-slate-900"
                  />
                  <span>Active on Storefront</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.trending}
                    onChange={e => setEditingProduct({ ...editingProduct, trending: e.target.checked })}
                    className="accent-slate-900"
                  />
                  <span>Feature in Trending</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-stone-400">Tracking: {selectedOrder.trackingNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <p className="font-semibold text-slate-900">Customer: {selectedOrder.customer.name}</p>
                <p className="text-stone-600">{selectedOrder.customer.email} · {selectedOrder.customer.phone}</p>
                <p className="text-stone-600">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold text-slate-900">Purchased Items & Selected Variations:</h5>
                <div className="divide-y divide-stone-100 border rounded-xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <p className="font-bold text-slate-900">{it.productName}</p>
                        <p className="text-stone-500">Color: <strong>{it.colorName}</strong> · SKU: {it.sku}</p>
                        <p className="text-stone-400">Qty: {it.quantity} @ ${it.unitPrice.toFixed(2)}</p>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">${it.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t">
                <span>Grand Total</span>
                <span className="tabular-nums">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BLOG POST MODAL */}
      {editingPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-serif font-bold text-lg text-slate-900">{isAddingPost ? 'New Article' : 'Edit Article'}</h3>
              <button onClick={() => setEditingPost(null)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPost.category}
                    onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Author</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Content</label>
                <textarea
                  rows={4}
                  value={editingPost.content}
                  onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setEditingPost(null)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
              <button
                onClick={() => {
                  saveBlogPost(editingPost);
                  refreshData();
                  setEditingPost(null);
                  showToast('Article saved!', 'success');
                }}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SQL SCHEMA MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-lg text-slate-900">Supabase PostgreSQL Schema</h3>
              </div>
              <button onClick={() => setShowSqlModal(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Paste this schema into your <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query</strong> to create the tables and security policies.
            </p>

            <div className="flex-1 overflow-y-auto bg-slate-950 text-stone-300 p-4 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
              <pre className="whitespace-pre">{`-- 1. PRODUCTS TABLE
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

-- 2. PRODUCT VARIANTS TABLE
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

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Full access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Full access on store settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);`}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-xs text-stone-500 font-mono">File: /supabase/schema.sql</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE PRODUCT MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900">Delete Product</h3>
                <p className="text-xs text-stone-500">
                  Are you sure you want to delete this product? This action removes all inventory records and cannot be undone.
                </p>
              </div>
            </div>

            {/* Product summary preview */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 p-1 shrink-0 flex items-center justify-center">
                <img
                  src={productToDelete.variants[0]?.images[0] || getProductSvg(productToDelete.category, '#18181B')}
                  alt={productToDelete.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-slate-900 text-xs truncate">{productToDelete.name}</h4>
                <p className="text-[11px] text-stone-500">
                  {productToDelete.brand} · {productToDelete.variants.length} color variant{productToDelete.variants.length > 1 ? 's' : ''}
                </p>
                <p className="font-bold text-slate-900 text-xs mt-0.5 tabular-nums">
                  ${(productToDelete.salePrice || productToDelete.price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET DEMO DATA MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900">Reset Demo Catalog?</h3>
                <p className="text-xs text-stone-500">
                  This will restore the original products, categories, sample customer orders, and blog articles. Any custom items created will be reset.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetDatabase}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restore Default Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE BLOG ARTICLE MODAL */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900">Delete Journal Article</h3>
                <p className="text-xs text-stone-500">
                  Are you sure you want to delete <strong className="text-slate-900">"{blogToDelete.title}"</strong>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBlogPost}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <FolderTree className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {isAddingCategory ? 'Create New Category' : `Edit Category: ${editingCategory.name}`}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Define store department taxonomy, description, icon, and visual artwork.
                  </p>
                </div>
              </div>
              <button onClick={() => setEditingCategory(null)} className="p-1 hover:bg-stone-100 rounded-lg">
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fine Jewelry, Mechanical Keyboards, Outerwear"
                  value={editingCategory.name}
                  onChange={e => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
                    setEditingCategory({
                      ...editingCategory,
                      name: newName,
                      slug: isAddingCategory && (!editingCategory.slug || editingCategory.slug.startsWith('cat-')) ? autoSlug : editingCategory.slug
                    });
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-stone-700">
                      Slug / URL Identifier <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const auto = (editingCategory.name || '')
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, '-')
                          .replace(/-+/g, '-');
                        setEditingCategory({ ...editingCategory, slug: auto });
                      }}
                      className="text-[10px] text-amber-800 hover:underline font-semibold"
                    >
                      Auto from Name
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. jewelry"
                    value={editingCategory.slug || ''}
                    onChange={e => setEditingCategory({
                      ...editingCategory,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-')
                    })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-hidden focus:border-slate-900"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Used in URL /shop?category=... and product tags</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Badge Icon Style</label>
                  <select
                    value={editingCategory.icon || 'Package'}
                    onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-slate-900"
                  >
                    <option value="Sparkles">Sparkles (Artisanal / Featured)</option>
                    <option value="Package">Package (Standard Goods)</option>
                    <option value="FolderTree">FolderTree (Department)</option>
                    <option value="ShoppingBag">ShoppingBag (Retail)</option>
                    <option value="Layers">Layers (Collections)</option>
                    <option value="Tags">Tags (Labels & Promo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Department Description</label>
                <textarea
                  rows={2}
                  placeholder="A short sentence summarizing this department for the storefront..."
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-slate-900"
                />
              </div>

              {/* Artwork & Visual Card Illustration Upload & Presets */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-semibold text-slate-900">Card Illustration / Department Artwork</label>
                    <p className="text-[11px] text-stone-500">
                      Upload an image file from your device, choose an artisanal vector preset, or enter an image URL.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Upload Card Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = evt => {
                              const res = evt.target?.result as string;
                              if (res) {
                                setEditingCategory({ ...editingCategory, image: res });
                                showToast(`Uploaded ${file.name} for category card!`, 'success');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {editingCategory.image && (
                      <button
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, image: '' })}
                        className="px-2.5 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-600 rounded-xl text-xs transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset Vector Illustrations */}
                <div>
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Or Choose an Artisanal Preset Illustration:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[
                      { id: 'smartwatch', label: 'Tech' },
                      { id: 'backpack', label: 'Bags' },
                      { id: 'shoes', label: 'Footwear' },
                      { id: 'perfume', label: 'Beauty' },
                      { id: 'lamp', label: 'Home' },
                      { id: 'bottle', label: 'Drink' },
                      { id: 'sunglasses', label: 'Eyewear' },
                      { id: 'headphones', label: 'Audio' },
                    ].map(preset => {
                      const presetSvg = getProductSvg(preset.id as any, '#18181B');
                      const isSelected = editingCategory.image === presetSvg;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setEditingCategory({ ...editingCategory, image: presetSvg })}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-amber-50/50 ring-2 ring-slate-900/10'
                              : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                          }`}
                          title={preset.label}
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img src={presetSvg} alt={preset.label} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-medium text-stone-600 truncate w-full text-center">
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] text-stone-500 mb-1">Custom Image / SVG Data URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://... or data:image/..."
                    value={editingCategory.image || ''}
                    onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border border-stone-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  {editingCategory.image ? (
                    <img src={editingCategory.image} alt={editingCategory.name || 'Preview'} className="w-full h-full object-contain" />
                  ) : (
                    <FolderTree className="w-6 h-6 text-stone-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-slate-900 text-sm truncate">
                      {editingCategory.name || 'Untitled Category'}
                    </h4>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700">
                      #{editingCategory.slug || editingCategory.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {editingCategory.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAddingCategory ? 'Create Category' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE CATEGORY MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900">Delete Category</h3>
                <p className="text-xs text-stone-500">
                  Are you sure you want to delete <strong className="text-slate-900">"{categoryToDelete.name}"</strong>?
                </p>
              </div>
            </div>

            {(() => {
              const assignedCount = products.filter(p => p.category === categoryToDelete.id).length;
              return (
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Category Identifier:</span>
                    <span className="font-mono font-semibold text-slate-800">#{categoryToDelete.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Products currently assigned:</span>
                    <span className={`font-bold tabular-nums ${assignedCount > 0 ? 'text-amber-800' : 'text-stone-700'}`}>
                      {assignedCount} product{assignedCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {assignedCount > 0 && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 leading-relaxed">
                      Notice: Products assigned to this category will not be deleted, but they will maintain this category tag until reassigned in the Products tab.
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT FULL STORE JSON DATA MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Upload className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Import Store Catalog & Settings (JSON)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Upload a JSON file or paste customized catalog data to bulk update products, categories, or settings.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1 hover:bg-stone-100 rounded-lg">
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleImportDataSubmit} className="space-y-4 text-xs">
              {/* File upload button */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-stone-500" />
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Choose a .json backup file</p>
                    <p className="text-[11px] text-stone-400">Loads products, categories, orders, and store settings</p>
                  </div>
                </div>
                <div>
                  <input
                    type="file"
                    id="import-file-input"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = evt => {
                          const content = evt.target?.result as string;
                          if (content) {
                            setImportJsonText(content);
                            showToast(`Loaded ${file.name} successfully! Click Import to apply.`, 'info');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="import-file-input"
                    className="cursor-pointer px-3.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    Browse File
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-900">JSON Data Payload</label>
                  <button
                    type="button"
                    onClick={() => {
                      setImportJsonText(exportAllStoreData());
                      showToast('Loaded current catalog data into editor as customizable template!', 'info');
                    }}
                    className="text-amber-800 hover:text-amber-900 font-semibold hover:underline text-[11px]"
                  >
                    Load Current Store as Template
                  </button>
                </div>
                <textarea
                  rows={8}
                  placeholder={`{\n  "categories": [\n    { "id": "fine-jewelry", "name": "Fine Jewelry", "slug": "fine-jewelry" }\n  ],\n  "products": [\n    ...\n  ]\n}`}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  className="w-full p-3 bg-slate-950 text-stone-200 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!importJsonText.trim()}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Import & Apply Catalog Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
