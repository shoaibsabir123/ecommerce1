import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../../src/context/CartContext';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { createOrder } from '../../src/services/storage';
import { ShippingAddress, Order } from '../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToShop,
  onOrderCompleted
}) => {
  const { items, subtotal, discount, shipping, tax, total, clearCart, appliedCoupon } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : 'Jane');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : 'Doe');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 438-9921');

  // Address
  const defaultSaved = user?.savedAddresses?.[0];
  const [street, setStreet] = useState(defaultSaved?.street || '124 Bedford Avenue, Apt 4B');
  const [apartment, setApartment] = useState(defaultSaved?.apartment || '');
  const [city, setCity] = useState(defaultSaved?.city || 'Brooklyn');
  const [state, setState] = useState(defaultSaved?.state || 'NY');
  const [postalCode, setPostalCode] = useState(defaultSaved?.postalCode || '11211');
  const [country, setCountry] = useState(defaultSaved?.country || 'United States');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);

  // Delivery options
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const additionalExpressCost = shippingMethod === 'express' ? 14.99 : 0;
  const effectiveShipping = shipping + additionalExpressCost;
  const grandTotal = total + additionalExpressCost;

  // Stripe Test Card Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('11211');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Helper to fill Stripe standard test card
  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('242');
    setCardZip('11211');
    setPaymentError('');
    showToast('Stripe test card details filled!', 'info');
  };

  const handleCardNumberChange = (val: string) => {
    // Format card with spaces every 4 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const parts = cleaned.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : cleaned);
  };

  const handleExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (items.length === 0) {
      showToast('Your bag is empty.', 'error');
      return;
    }

    if (!cardNumber.replace(/\s/g, '').startsWith('4242') && cardNumber.replace(/\s/g, '').length < 15) {
      setPaymentError('Please enter a valid credit card (or click "Auto-fill Stripe Test Card").');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate real Stripe payment authorization (1.2s delay)
      await new Promise(resolve => setTimeout(resolve, 1400));

      const shippingAddress: ShippingAddress = {
        firstName,
        lastName,
        email,
        phone,
        street,
        apartment,
        city,
        state,
        postalCode,
        country
      };

      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        variantId: item.variantId,
        colorName: item.colorName,
        sku: item.sku,
        image: item.image,
        unitPrice: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      // Create order and reduce database stock!
      const newOrder = createOrder({
        customer: {
          userId: user?.id,
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone
        },
        shippingAddress,
        billingAddress: sameBillingAddress ? shippingAddress : undefined,
        items: orderItems,
        subtotal,
        shippingCost: effectiveShipping,
        discount,
        couponCode: appliedCoupon?.code,
        tax,
        total: grandTotal,
        paymentMethod: `Stripe Test Card (•••• ${cardNumber.slice(-4) || '4242'})`,
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        notes: `Delivery via ${shippingMethod === 'express' ? 'Priority Overnight' : 'Standard Courier'}.`
      });

      clearCart();
      setIsProcessing(false);
      showToast(`Order #${newOrder.id} authorized & created!`, 'success');
      onOrderCompleted(newOrder);

    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError('Payment processing failed. Please check your card credentials.');
      showToast('Payment failed. Please retry.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Customer details, address, payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* 1. Customer Information */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center justify-between">
              <span>1. Contact Information</span>
              {user && (
                <span className="text-xs font-sans font-normal text-stone-500">
                  Signed in as <strong>{user.email}</strong>
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              2. Shipping Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="House number and street name"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State / Province</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              3. Delivery Method
            </h3>

            <div className="space-y-2">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-slate-900 bg-amber-50/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-slate-900"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Standard Insured Courier (3-5 Business Days)</p>
                    <p className="text-[11px] text-stone-500">Tracked with signature on delivery</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-slate-900 bg-amber-50/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-slate-900"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Priority Air Overnight (1-2 Business Days)</p>
                    <p className="text-[11px] text-stone-500">Expedited warehouse handling</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 tabular-nums">+$14.99</span>
              </label>
            </div>
          </div>

          {/* 4. Stripe Payment Integration (Test Mode) */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-700" />
                <span>4. Payment via Stripe</span>
              </h3>
              
              <button
                type="button"
                onClick={fillTestCard}
                className="px-3 py-1.5 bg-amber-100/80 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-fill Test Card
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Stripe Test Gateway Active:</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Use test number <code>4242 •••• •••• 4242</code> with any future expiry date and any 3-digit CVC.
                </p>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => handleCardNumberChange(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Expiration</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={e => handleExpiryChange(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">CVC Code</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Postal / ZIP</label>
                  <input
                    type="text"
                    required
                    value={cardZip}
                    onChange={e => setCardZip(e.target.value)}
                    placeholder="ZIP"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={sameBillingAddress}
                  onChange={e => setSameBillingAddress(e.target.checked)}
                  className="accent-slate-900"
                />
                <span>Billing address matches shipping destination</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 sticky top-28 shadow-sm">
          <h3 className="font-serif font-bold text-xl text-slate-900 pb-3 border-b border-stone-100 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-sans font-normal text-stone-500 tabular-nums">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </h3>

          {/* Purchased Items List */}
          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1 space-y-3">
            {items.map(item => (
              <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3 text-left">
                <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{item.productName}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block" style={{ backgroundColor: item.colorHex }} />
                    <span>{item.colorName}</span>
                    <span>·</span>
                    <span>Qty: <strong className="text-slate-900">{item.quantity}</strong></span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 tabular-nums mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="tabular-nums">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping & Handling</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {effectiveShipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${effectiveShipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-semibold text-slate-900 tabular-nums">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-stone-200">
              <span>Total Due</span>
              <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Payment CTA */}
          <button
            type="submit"
            disabled={isProcessing || items.length === 0}
            className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isProcessing || items.length === 0
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-[#0F172A] hover:bg-slate-800'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Stripe Payment...</span>
              </div>
            ) : (
              <span>Authorize & Place Order (${grandTotal.toFixed(2)})</span>
            )}
          </button>

          <p className="text-[11px] text-stone-400 text-center">
            By placing this order, you authorize AURA & ARTIFACT to charge the card on file.
          </p>
        </div>

      </form>

    </div>
  );
};
