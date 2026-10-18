import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus, 
  ArrowLeft,
  Share2,
  ChevronDown
} from 'lucide-react';
import { Product, ProductVariant, ProductReview } from '../types';
import { useCart } from '../../src/context/CartContext';
import { useWishlist } from '../../src/context/WishlistContext';
import { useToast } from '../../src/context/ToastContext';
import { getReviewsForProduct, addProductReview, getProducts } from '../../src/services/storage';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (slug: string) => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onNavigateToCheckout
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  // Find initial variant
  const initialVariant = product.variants.find(v => v.id === product.defaultVariantId) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>(() => getReviewsForProduct(product.id));
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // When product prop changes, reset to default variant
  useEffect(() => {
    const v = product.variants.find(item => item.id === product.defaultVariantId) || product.variants[0];
    setSelectedVariant(v);
    setActiveImageIndex(0);
    setQuantity(1);
    setReviews(getReviewsForProduct(product.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // When selected variant changes:
  // Reset active image index to 0 so main display shows that variant's primary image
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setActiveImageIndex(0);
    // If quantity exceeds new variant stock, clamp it
    if (quantity > variant.stock && variant.stock > 0) {
      setQuantity(variant.stock);
    }
  };

  const isFavorited = isInWishlist(product.id);

  // Dynamic pricing for selected variant
  const effectivePrice = selectedVariant.salePrice || selectedVariant.price || product.salePrice || product.price;
  const originalPrice = (selectedVariant.salePrice || product.salePrice) ? (selectedVariant.price || product.price) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100) : null;

  // Variant images gallery
  const galleryImages = selectedVariant.images && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : [product.variants[0]?.images[0] || ''];

  const currentDisplayImage = galleryImages[activeImageIndex] || galleryImages[0];
  const currentStock = selectedVariant.stock;

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      showToast('This variation is currently out of stock.', 'error');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    showToast(`Added ${quantity} × ${product.name} (${selectedVariant.colorName}) to your bag!`, 'success');
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) {
      showToast('This variation is currently out of stock.', 'error');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    onNavigateToCheckout();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and review comment.', 'error');
      return;
    }

    const newRev = addProductReview({
      productId: product.id,
      authorName: reviewAuthor.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Exceptional Quality',
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });

    setReviews(prev => [newRev, ...prev]);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  // Related products
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>Home</span>
          <span>/</span>
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid: Gallery on left, purchase module on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Gallery Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image Canvas */}
          <div className="relative aspect-square w-full bg-[#F4EFEB] rounded-3xl border border-stone-200/90 overflow-hidden p-8 sm:p-12 flex items-center justify-center">
            {discountPercent && (
              <span className="absolute top-4 left-4 z-10 bg-[#0F172A] text-white text-xs font-bold tracking-tight px-3 py-1 rounded-lg">
                SAVE {discountPercent}%
              </span>
            )}

            <button
              onClick={() => {
                const added = toggleWishlist(product.id);
                showToast(added ? `Saved to wishlist` : `Removed from wishlist`, 'info');
              }}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-500 shadow-sm'
                  : 'bg-white/80 backdrop-blur-sm text-stone-500 hover:text-rose-500 hover:bg-white'
              }`}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Displayed Image with Dynamic Color Variation */}
            <img
              src={currentDisplayImage}
              alt={`${product.name} - ${selectedVariant.colorName}`}
              className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
            />
          </div>

          {/* Thumbnails (for multiple images of this variant) */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-[#F4EFEB] border-2 p-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-slate-900 shadow-sm'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail view" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase & Details Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                {product.brand}
              </span>
              <span className="font-mono text-xs text-stone-400">SKU: {selectedVariant.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
              {product.name}
            </h1>

            {/* Rating & Social Proof */}
            <div className="flex items-center gap-3 mt-2 text-xs text-stone-600">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-stone-300'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-900 tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">·</span>
              <a href="#reviews" className="underline hover:text-slate-900">{reviews.length} Customer Reviews</a>
            </div>
          </div>

          {/* Pricing Module */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                ${effectivePrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-base text-stone-400 line-through tabular-nums">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock indicator badge */}
            <div>
              {currentStock <= 0 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                  Sold Out
                </span>
              ) : currentStock <= 5 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Low Stock: Only {currentStock} left
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock ({currentStock} available)
                </span>
              )}
            </div>
          </div>

          {/* Brief Description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* COLOR VARIATION SELECTOR (Mandatory Behavior) */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900">
                Selected Color: <strong className="text-amber-800">{selectedVariant.colorName}</strong>
              </span>
              <span className="text-stone-500 font-mono text-[11px]">{selectedVariant.sku}</span>
            </div>

            <div className="flex items-center gap-3">
              {product.variants.map(variant => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleVariantSelect(variant)}
                    className={`group relative flex items-center justify-center p-1 rounded-full transition-all ${
                      isSelected
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={`${variant.colorName} (${variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'})`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-stone-300 block"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 absolute ${
                        variant.colorHex === '#FFFFFF' || variant.colorHex === '#F8FAFC' || variant.colorHex === '#E5DFD3' 
                          ? 'text-slate-950' 
                          : 'text-white'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper & Actions */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-3 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="px-3 py-3 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                  currentStock <= 0
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>{currentStock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Buy Now Button (Instant checkout) */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all border ${
                currentStock <= 0
                  ? 'border-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-100/70 border-amber-300 text-amber-950 hover:bg-amber-200'
              }`}
            >
              Instant Buy Now with Stripe
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Complimentary shipping over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-800 shrink-0" />
              <span>30-Day risk-free returns</span>
            </div>
          </div>

          {/* Accordion Tabs for Details / Specs / Shipping */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed py-2">
              {activeTab === 'details' && (
                <ul className="space-y-1.5 list-disc pl-4">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="divide-y divide-stone-100">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="py-1.5 flex justify-between">
                      <span className="font-semibold text-stone-700">{key}</span>
                      <span className="text-stone-500">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <p>{product.shippingInfo}</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="pt-12 border-t border-stone-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Customer Reviews</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified feedback from discerning customers who own this piece.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors shadow-xs"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Submit Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4 max-w-xl">
            <h4 className="font-serif font-bold text-sm text-slate-900">Share your experience</h4>
            
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-500"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={e => setReviewAuthor(e.target.value)}
                  placeholder="e.g. David Thorne"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  placeholder="e.g. Masterpiece of craftsmanship"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Review</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on build quality, tactile feel, performance, and longevity..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Post Verified Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-xs text-stone-400">
              No reviews written yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map(rev => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h5 className="font-semibold text-sm text-slate-900">{rev.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500">
                  <span className="font-medium text-slate-800">{rev.authorName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-900">You May Also Appreciate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard
                key={rp.id}
                product={rp}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
