import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Phone,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function CartCheckout() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartOriginalTotal,
    cartSavedAmount,
    deliveryFee,
    platformFee,
    cartGrandTotal,
    cartEstimatedWeightKg,
    currentUser,
    placeOrder,
    setCurrentView,
    setActiveOrderId,
  } = useFoodCircle();

  const [address, setAddress] = useState(
    currentUser?.address || 'Flat 4B, Sunflower Apts, Park Circus 7-Point, Kolkata 700017'
  );
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98305 67890');
  const [paymentMethod, setPaymentMethod] = useState('Simulated UPI (Google Pay / PhonePe)');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsPlacing(true);

    setTimeout(() => {
      const order = placeOrder({
        address,
        phone,
        paymentMethod,
      });
      setIsPlacing(false);
      if (order) {
        setActiveOrderId(order.id);
        setCurrentView('live_tracking');
      }
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your FoodCircle Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Rescue delicious surplus food at up to 65% off from your favorite Kolkata restaurants, cafes, and bakeries.
        </p>
        <button
          onClick={() => setCurrentView('marketplace')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition"
        >
          Explore Surplus Food Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Food Rescue Cart & Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your surplus items and proceed to volunteer-supported delivery
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-4">
          {/* Impact Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
            <div className="p-2 bg-emerald-500 text-white rounded-xl">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold block text-sm">Rescuing ~{cartEstimatedWeightKg} kg of Food Waste!</span>
              <span>
                You are saving ₹{cartSavedAmount} and directly supporting zero-waste redistribution in Kolkata.
              </span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cart.map(({ food, quantity }) => (
              <div key={food.id} className="p-4 flex items-center gap-4">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{food.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{food.providerName}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ₹{food.surplusPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{food.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => updateCartQuantity(food.id, quantity - 1)}
                    className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-slate-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs text-slate-800 min-w-[18px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(food.id, quantity + 1)}
                    disabled={quantity >= food.quantity}
                    className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-slate-50 disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[65px]">
                  <span className="font-bold text-slate-800 text-sm">
                    ₹{food.surplusPrice * quantity}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(food.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Delivery Address & Contact Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Delivery Destination (Kolkata)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, apartment, locality"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 Phone number for volunteer handover"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Payment */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Original Menu Value</span>
                <span className="line-through text-slate-400">₹{cartOriginalTotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                <span>Surplus Savings</span>
                <span>-₹{cartSavedAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Volunteer Delivery Fee</span>
                <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Food Rescue Platform Contribution</span>
                <span className="font-semibold text-slate-800">₹{platformFee}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total to Pay</span>
                <span className="font-extrabold text-xl text-emerald-700">₹{cartGrandTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Payment Method (Simulated Prototype)
              </label>
              {[
                'Simulated UPI (Google Pay / PhonePe)',
                'Simulated Card (Visa / Mastercard)',
                'Cash on Handover',
              ].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                    paymentMethod === method
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-emerald-600"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>

            {/* Mandatory Verification Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                FoodCircle Volunteer will capture mandatory camera proof & GPS coordinates at pickup before dispatch.
              </span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isPlacing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order (₹{cartGrandTotal})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
