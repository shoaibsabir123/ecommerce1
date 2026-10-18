import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '../types';
import { validateCoupon } from '../services/storage';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aura_cart_v1';
const COUPON_STORAGE_KEY = 'aura_coupon_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(COUPON_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const cartItemId = `${product.id}-${variant.id}`;
    const effectivePrice = variant.salePrice || variant.price || product.salePrice || product.price;
    const variantImage = variant.images?.[0] || '';

    setItems(prevItems => {
      const existing = prevItems.find(item => item.cartItemId === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, variant.stock);
        return prevItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem: CartItem = {
          cartItemId,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          brand: product.brand,
          category: product.category,
          variantId: variant.id,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          sku: variant.sku,
          price: effectivePrice,
          image: variantImage,
          quantity: Math.min(quantity, variant.stock),
          stock: variant.stock
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const applyCouponCode = (code: string) => {
    const coupon = validateCoupon(code);
    if (!coupon) {
      return { success: false, message: 'Invalid promotional code.' };
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Order must be at least $${coupon.minOrder} to use this coupon.`
      };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  // Free shipping threshold: $50 or FREESHIP coupon
  const isFreeShipping = subtotal >= 50 || appliedCoupon?.discountType === 'shipping';
  const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : 9.99;

  // 8% sales tax on taxable amount
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = items.length === 0 ? 0 : taxableAmount * 0.08;

  const total = items.length === 0 ? 0 : Math.max(0, taxableAmount + shipping + tax);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
