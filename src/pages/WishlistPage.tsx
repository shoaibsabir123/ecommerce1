import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../src/context/WishlistContext';
import { getProducts } from '../../src/services/storage';
import { ProductCard } from '../components/product/ProductCard';

interface WishlistPageProps {
  onSelectProduct: (slug: string) => void;
  onNavigateToShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onNavigateToShop
}) => {
  const { wishlist, clearWishlist } = useWishlist();
  const allProducts = getProducts();

  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      <div className="flex items-end justify-between border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-800">Your Saved Pieces</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Curated Wishlist ({wishlistedProducts.length})
          </h1>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-stone-500 hover:text-rose-600 font-semibold"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900">Your wishlist is currently empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Explore our curated catalog and tap the heart icon on any piece to save it for later.
          </p>
          <button
            onClick={onNavigateToShop}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
