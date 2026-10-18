import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { getCategories } from '../services/storage';

interface ShopPageProps {
  products: Product[];
  initialCategory?: string;
  onSelectProduct: (slug: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  products, 
  initialCategory = 'all', 
  onSelectProduct 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(300);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [storedCategories, setStoredCategories] = useState(() => getCategories());

  useEffect(() => {
    const handleUpdate = () => setStoredCategories(getCategories());
    window.addEventListener('aura_store_updated', handleUpdate);
    return () => window.removeEventListener('aura_store_updated', handleUpdate);
  }, []);

  const categories = useMemo(() => [
    { id: 'all', label: 'All Products' },
    ...storedCategories.map(c => ({ id: c.id, label: c.name }))
  ], [storedCategories]);

  // Distinct color names extracted from catalog
  const colorOptions = useMemo(() => {
    const colorsMap = new Map<string, string>();
    products.forEach(p => {
      p.variants.forEach(v => {
        if (!colorsMap.has(v.colorName)) {
          colorsMap.set(v.colorName, v.colorHex);
        }
      });
    });
    return Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Active status
      if (!product.active) return false;

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }

      // Price filter
      const effectivePrice = product.salePrice || product.price;
      if (effectivePrice > priceRange) return false;

      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = product.variants.some(
          v => v.colorName.toLowerCase() === selectedColor.toLowerCase()
        );
        if (!hasColor) return false;
      }

      // Stock filter
      if (inStockOnly) {
        const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        if (totalStock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-low') {
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'featured'
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceRange, selectedColor, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedColor('all');
    setPriceRange(300);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    searchQuery !== '' || 
    selectedColor !== 'all' || 
    priceRange < 300 || 
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">Catalogue & Catalog</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Shop All Products
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Showing <strong className="text-slate-900 tabular-nums">{filteredProducts.length}</strong> thoughtfully crafted products
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-800" />
              Refine Catalog
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Product keyword..."
                className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Categories</label>
            <div className="space-y-1">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === 'all' 
                  ? products.length 
                  : products.filter(p => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] tabular-nums ${isSelected ? 'text-amber-300' : 'text-stone-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Max Price</label>
              <span className="text-xs font-bold text-slate-900 tabular-nums">${priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>$20</span>
              <span>$300+</span>
            </div>
          </div>

          {/* Color Palette Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Color Variation</label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                  selectedColor === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                All
              </button>
              {colorOptions.map(({ name, hex }) => {
                const isSelected = selectedColor.toLowerCase() === name.toLowerCase();
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedColor(isSelected ? 'all' : name)}
                    title={name}
                    className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110 border-white'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <Check className={`w-3 h-3 ${hex === '#FFFFFF' || hex === '#F8FAFC' || hex === '#E5DFD3' ? 'text-slate-950' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid (3 columns on desktop) */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-100/70 rounded-xl text-xs">
              <span className="text-stone-500 font-semibold">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 bg-white rounded-md border border-stone-300 text-stone-800 flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedColor !== 'all' && (
                <span className="px-2.5 py-1 bg-white rounded-md border border-stone-300 text-stone-800 flex items-center gap-1">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange < 300 && (
                <span className="px-2.5 py-1 bg-white rounded-md border border-stone-300 text-stone-800 flex items-center gap-1">
                  Under ${priceRange}
                  <button onClick={() => setPriceRange(300)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="px-2.5 py-1 bg-white rounded-md border border-stone-300 text-stone-800 flex items-center gap-1">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-amber-800 hover:underline font-semibold ml-auto text-xs"
              >
                Clear all
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">No products match your filters</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range, clearing specific color tags, or resetting all filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-serif font-bold text-base text-slate-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-stone-500">Categories</label>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                        selectedCategory === cat.id ? 'bg-slate-900 text-white font-semibold' : 'text-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-500">Max Price:</span>
                  <span className="font-bold">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="accent-slate-900"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
