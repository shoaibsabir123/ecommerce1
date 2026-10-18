import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { Product } from '../../types';
import { getProducts } from '../../services/storage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productSlug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const products = useMemo(() => getProducts(), [isOpen]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const q = query.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesQuery =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-stone-200 p-4 sm:p-5 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search watches, backpacks, audio, lamps, fragrances..."
            autoFocus
            className="w-full text-base sm:text-lg text-slate-900 placeholder-stone-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Category Filters */}
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Filters:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'electronics', label: 'Electronics' },
            { id: 'fashion', label: 'Fashion' },
            { id: 'home-living', label: 'Home & Living' },
            { id: 'beauty', label: 'Beauty' },
            { id: 'accessories', label: 'Accessories' },
            { id: 'sports', label: 'Sports' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-100 p-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-semibold text-stone-700">No matching products found</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for keywords like "watch", "backpack", "black", or "lamp"</p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const defaultVariant = product.variants[0];
              const displayImage = defaultVariant?.images[0] || '';
              const effectivePrice = product.salePrice || product.price;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product.slug);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 cursor-pointer group transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200 p-1 flex items-center justify-center">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">{product.brand}</p>
                    <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-amber-800 transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        ${effectivePrice.toFixed(2)}
                      </span>
                      {product.salePrice && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400 capitalize">· {product.category.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="p-2 text-stone-400 group-hover:text-slate-900 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
