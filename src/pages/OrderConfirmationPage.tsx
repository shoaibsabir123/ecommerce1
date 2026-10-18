import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Printer, 
  ArrowRight, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  onNavigateToShop: () => void;
  onNavigateToAccount: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigateToShop,
  onNavigateToAccount
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-left">
      
      {/* Success Hero Header */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-amber-800">
          Payment Authorized & Confirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Thank you for your order, {order.shippingAddress.firstName}!
        </h1>

        <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          We have received your order <strong className="text-slate-900 font-mono">#{order.id}</strong>. A confirmation email with full receipt details has been dispatched to <strong>{order.customer.email}</strong>.
        </p>

        {/* Tracking info badge */}
        <div className="inline-flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700">
          <Truck className="w-4 h-4 text-amber-800" />
          <span>Tracking ID: <strong className="font-mono text-slate-900">{order.trackingNumber}</strong></span>
          <span className="text-stone-300">|</span>
          <span className="text-emerald-700 font-semibold">Status: Preparing Shipment</span>
        </div>
      </div>

      {/* Itemized Order Receipt Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Receipt Details</h2>
            <p className="text-xs text-stone-400 mt-0.5">Order Placed: {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Ordered items breakdown */}
        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>Color: <strong>{item.colorName}</strong></span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-stone-400">{item.sku}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  ${item.total.toFixed(2)}
                </span>
                <p className="text-[11px] text-stone-400">${item.unitPrice.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Calculations breakdown */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900 tabular-nums">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount</span>
              <span className="tabular-nums">-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {order.shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${order.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Sales Tax (8%)</span>
            <span className="font-semibold text-slate-900 tabular-nums">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-stone-200">
            <span>Total Paid</span>
            <span className="tabular-nums">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address & payment card summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-200 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <MapPin className="w-3.5 h-3.5 text-amber-800" />
              <span>Shipping Destination</span>
            </div>
            <p className="text-stone-700 font-medium">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-stone-500">
              {order.shippingAddress.street} {order.shippingAddress.apartment}
            </p>
            <p className="text-stone-500">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-stone-500">{order.shippingAddress.country}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <CreditCard className="w-3.5 h-3.5 text-amber-800" />
              <span>Payment Authorized</span>
            </div>
            <p className="text-stone-700 font-medium">{order.paymentMethod}</p>
            <p className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Payment Status: Paid
            </p>
            <p className="text-stone-400 mt-1">Stripe Authorization Code: auth_live_94810283</p>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={onNavigateToAccount}
          className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-slate-900 rounded-xl text-xs font-semibold transition-colors"
        >
          View in My Account & Track
        </button>

        <button
          onClick={onNavigateToShop}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
