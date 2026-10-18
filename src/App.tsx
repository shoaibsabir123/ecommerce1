import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

import { Product, Order } from './types';
import { getProducts, getProductBySlug } from './services/storage';

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => getProducts());

  // Listen to store updates from admin or orders
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getProducts());
    };
    window.addEventListener('aura_store_updated', handleUpdate);
    return () => window.removeEventListener('aura_store_updated', handleUpdate);
  }, []);

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      setSelectedProductSlug(slug);
      setCurrentPath('/product');
      return;
    }

    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      setSelectedArticleSlug(slug);
      setCurrentPath('/blog-post');
      return;
    }

    setSelectedProductSlug(null);
    setSelectedArticleSlug(null);
    setCurrentPath(path);
  };

  const handleSelectProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentPath('/product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setCurrentPath('/blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: Order) => {
    setCompletedOrder(order);
    setCurrentPath('/order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find product if in PDP
  const activeProduct = selectedProductSlug 
    ? getProductBySlug(selectedProductSlug) 
    : products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-900 font-sans selection:bg-amber-100 selection:text-slate-900">
      {/* Global Navigation Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Page Render */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigate}
          />
        )}

        {currentPath.startsWith('/shop') && (
          <ShopPage
            products={products}
            initialCategory={
              currentPath.includes('category=')
                ? currentPath.split('category=')[1].split('&')[0]
                : 'all'
            }
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPath === '/product' && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            onBack={() => navigate('/shop')}
            onSelectProduct={handleSelectProduct}
            onNavigateToCheckout={() => navigate('/checkout')}
          />
        )}

        {currentPath === '/checkout' && (
          <CheckoutPage
            onBackToShop={() => navigate('/shop')}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {currentPath === '/order-confirmation' && completedOrder && (
          <OrderConfirmationPage
            order={completedOrder}
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToAccount={() => navigate('/account')}
          />
        )}

        {currentPath === '/account' && (
          <AccountPage
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToAdmin={() => navigate('/admin')}
          />
        )}

        {currentPath === '/wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onNavigateToShop={() => navigate('/shop')}
          />
        )}

        {currentPath === '/collections' && (
          <CollectionsPage
            onNavigateToCategory={(cat) => navigate(`/shop?category=${cat}`)}
          />
        )}

        {currentPath === '/about' && (
          <AboutPage
            onNavigateToShop={() => navigate('/shop')}
          />
        )}

        {currentPath === '/blog' && (
          <BlogPage
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentPath === '/blog-post' && selectedArticleSlug && (
          <BlogPostPage
            slug={selectedArticleSlug}
            onBack={() => navigate('/blog')}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentPath === '/contact' && (
          <ContactPage />
        )}

        {currentPath === '/admin' && (
          <AdminPage
            onNavigateToStorefront={() => navigate('/')}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Global Modals & Slide-overs */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <CartDrawer
        onNavigateToCheckout={() => navigate('/checkout')}
        onNavigateToShop={() => navigate('/shop')}
      />

      {/* Global Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
