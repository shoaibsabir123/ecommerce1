import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (productSlug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  // Selected variant state on this card (defaults to first variant or defaultVariantId)
  const initialVariant = product.variants.find(v => v.id === product.defaultVariantId) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);

  const isFavorited = isInWishlist(product.id);

  // Price calculation
  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.price;
  const originalPrice = (selectedVariant?.salePrice || product.salePrice) ? (selectedVariant?.price || product.price) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;

  const currentImage = selectedVariant?.images?.[0] || product.variants[0]?.images?.[0] || '';
  const currentStock = selectedVariant?.stock ?? 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStock <= 0) {
      showToast('This colorway is currently out of stock', 'error');
      return;
    }
    addToCart(product, selectedVariant, 1);
    showToast(`Added ${product.name} (${selectedVariant.colorName}) to cart!`, 'success');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    showToast(added ? `Saved ${product.name} to wishlist` : `Removed from wishlist`, 'info');
  };

  const handleColorSelect = (e: React.MouseEvent, variant: ProductVariant) => {
    e.stopPropagation();
    setSelectedVariant(variant);
  };

  return (
    <div
      onClick={() => onSelectProduct(product.slug)}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300 cursor-pointer text-left relative"
    >
      {/* Visual Canvas Container */}
      <div className="relative aspect-square w-full bg-[#F4EFEB] overflow-hidden p-6 flex items-center justify-center">
        {/* Subtle Discount or New text (quiet, no heavy candy pill) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {discountPercent && (
            <span className="bg-[#0F172A] text-white text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-md">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && !discountPercent && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 backdrop-blur-sm text-stone-500 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image reflecting selected color variation */}
        <img
          src={currentImage}
          alt={`${product.name} - ${selectedVariant?.colorName}`}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick Add To Cart Hover Action */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={currentStock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-colors ${
              currentStock <= 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-[#0F172A] text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            {currentStock <= 0 ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Stock status line */}
          <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
            <span className="uppercase tracking-wider font-semibold text-[11px]">{product.brand}</span>
            {currentStock <= 0 ? (
              <span className="text-rose-500 text-[11px] font-medium">Sold Out</span>
            ) : currentStock <= 5 ? (
              <span className="text-amber-600 text-[11px] font-medium">Only {currentStock} left</span>
            ) : (
              <span className="text-emerald-600 text-[11px] font-medium">In Stock</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-medium text-slate-900 text-sm sm:text-base mt-1 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-semibold text-slate-900 tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Interactive Color Swatches */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Prices */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              ${currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Variation Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1 shrink-0" title="Select color">
              {product.variants.slice(0, 4).map(v => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={e => handleColorSelect(e, v)}
                    title={v.colorName}
                    style={{ backgroundColor: v.colorHex }}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      isSelected
                        ? 'ring-2 ring-slate-900 ring-offset-1 scale-110 border-white'
                        : 'border-stone-300 hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Select ${v.colorName}`}
                  />
                );
              })}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-stone-400 font-medium">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mobile quick add button */}
        <div className="sm:hidden pt-2">
          <button
            onClick={handleQuickAdd}
            disabled={currentStock <= 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              currentStock <= 0
                ? 'bg-stone-200 text-stone-500'
                : 'bg-slate-900 text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {currentStock <= 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
