import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Percent, 
  Gift, 
  CheckCircle2 
} from 'lucide-react';
import { Product, CategoryItem } from '../types';
import { getCategories } from '../services/storage';
import { ProductCard } from '../components/product/ProductCard';
import { getProductSvg } from '../utils/productImages';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onSelectProduct, onNavigate }) => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => getCategories());

  useEffect(() => {
    const handleUpdate = () => setCategories(getCategories());
    window.addEventListener('aura_store_updated', handleUpdate);
    return () => window.removeEventListener('aura_store_updated', handleUpdate);
  }, []);

  const trendingProducts = products.filter(p => p.trending && p.active).slice(0, 8);
  const featuredProducts = products.filter(p => p.featured && p.active).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION (Inspired by reference layout) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFEB] to-[#FAF9F5] border-b border-stone-200/60 pt-8 pb-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-stone-200 text-stone-700 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Curated Everyday Artifacts</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.08] text-balance">
                  EVERYTHING.<br />
                  FOR EVERYONE.
                </h1>
                <p className="font-serif italic text-2xl sm:text-3xl text-amber-700 font-normal">
                  Best Quality, Best Prices.
                </p>
              </div>

              <p className="text-stone-600 text-base sm:text-lg max-w-lg leading-relaxed">
                Discover a wide range of top-quality products handpicked just for you. From precision audio to timeless travel gear and sculptural home essentials.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/shop')}
                  className="px-7 py-3.5 bg-[#0F172A] text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/collections')}
                  className="px-6 py-3.5 bg-white text-stone-800 border border-stone-300 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors shadow-xs"
                >
                  Explore Collections
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-200/80 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Free Shipping</strong>
                    <span className="text-[11px] text-stone-500">Orders over $50</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Easy Returns</strong>
                    <span className="text-[11px] text-stone-500">30-day policy</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Secure Payment</strong>
                    <span className="text-[11px] text-stone-500">100% verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Lifestyle Composition */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Promotional Discount Badge */}
              <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0F172A] text-white flex flex-col items-center justify-center shadow-xl border-2 border-white/20 transform -rotate-6">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300">Up To</span>
                <span className="text-xl sm:text-2xl font-bold font-serif leading-none">50%</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-stone-300 uppercase">OFF</span>
              </div>

              {/* Main Showcase Card Container */}
              <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-stone-200/90 overflow-hidden flex items-center justify-center">
                {/* Background Studio Podium Tone */}
                <div className="absolute inset-0 bg-radial from-amber-50/50 via-stone-50 to-[#F5EFEB]/80" />

                {/* Hero Showcase SVG Composition (Bag, sneakers, bottle, sunglasses) */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src={getProductSvg('backpack', '#D4A373', '#18181B')}
                    alt="AURA Lifestyle Collection"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Floating Product Highlight Card */}
                <div 
                  onClick={() => onSelectProduct('horizon-smart-watch-series-9')}
                  className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-stone-200 flex items-center gap-3 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 p-1 flex items-center justify-center">
                    <img
                      src={getProductSvg('smartwatch', '#18181B')}
                      alt="Horizon Series 9"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Best Seller</span>
                    <p className="text-xs font-semibold text-slate-900">Horizon Series 9</p>
                    <p className="text-xs font-bold text-slate-900">$159.99</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <h2 className="text-xs font-bold tracking-widest text-stone-500 uppercase">Explore the Catalog</h2>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">BROWSE BY CATEGORY</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onNavigate(`/shop?category=${category.id}`)}
              className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-400 hover:shadow-md transition-all text-center focus:outline-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-100/80 p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                {category.name}
              </span>
              <span className="text-[11px] text-stone-400 font-medium mt-0.5">
                {category.count} items
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-stone-500 uppercase">Handpicked Favorites</h2>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">TRENDING PRODUCTS</h3>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-800 flex items-center gap-1.5 transition-colors group"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-column responsive product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL FEATURE BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1: Free Shipping */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A] text-white flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">Complimentary</span>
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-white">Free Courier Delivery</h4>
              <p className="text-xs text-stone-300 mt-1">On all domestic orders over $50 with doorstep tracking.</p>
            </div>
            <button
              onClick={() => onNavigate('/shop')}
              className="text-xs font-semibold text-amber-300 hover:text-white flex items-center gap-1.5 pt-2"
            >
              <span>Shop Qualifying Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner 2: Special Offer */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#C5A880] text-slate-950 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center text-slate-950">
                <Percent className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-950/70 font-bold">Seasonal</span>
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-slate-950">Special Member Offers</h4>
              <p className="text-xs text-amber-950/80 mt-1">Save up to 50% across electronics and luggage essentials.</p>
            </div>
            <button
              onClick={() => onNavigate('/shop?sale=true')}
              className="text-xs font-bold text-slate-950 hover:text-white flex items-center gap-1.5 pt-2"
            >
              <span>Grab The Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner 3: Member Benefits */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 text-slate-900 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Gift className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">Privileges</span>
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-slate-900">AURA Guild Rewards</h4>
              <p className="text-xs text-stone-500 mt-1">Unlock exclusive early drop access, birthday gifts, and priority concierge.</p>
            </div>
            <button
              onClick={() => onNavigate('/account')}
              className="text-xs font-semibold text-slate-900 hover:text-amber-800 flex items-center gap-1.5 pt-2"
            >
              <span>Join Guild Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. FEATURED CURATED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] rounded-3xl p-8 sm:p-12 border border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-4 text-left">
              <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">Curator's Spotlight</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                The Audio & Living Collection
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Acoustic precision meets serene sculpture. Elevate your everyday rituals with tactile materials, deep noise-cancellation, and ambient warm lighting.
              </p>
              <button
                onClick={() => onNavigate('/shop?category=electronics')}
                className="px-6 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Acoustic Gear</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.slice(0, 2).map(prod => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod.slug)}
                  className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center group"
                >
                  <div className="w-24 h-24 rounded-xl bg-stone-100 p-2 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={prod.variants[0]?.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{prod.brand}</span>
                    <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-amber-800 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{prod.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        ${(prod.salePrice || prod.price).toFixed(2)}
                      </span>
                      {prod.salePrice && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          ${prod.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. SOCIAL PROOF & CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-stone-200 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-slate-900">TRUSTED BY OVER 25,000+ CUSTOMERS</h4>
              <p className="text-xs text-stone-500 mt-0.5">Verified purchasers across 42 countries worldwide.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Customer Avatars Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              {['#C5A880', '#18181B', '#52796F', '#78350F'].map((col, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold font-serif"
                  style={{ backgroundColor: col }}
                >
                  {['J', 'M', 'S', 'D'][idx]}
                </div>
              ))}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="font-bold text-slate-900 text-sm ml-1 tabular-nums">4.9 / 5.0</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">Based on 2,500+ verified customer reviews</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
