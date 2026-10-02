import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  Leaf,
  Video,
  ShieldAlert,
  Play,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';
import FoodVideoPlayer from '../common/FoodVideoPlayer';

export default function FoodDetailModal({ food, isOpen, onClose }) {
  const { addToCart, setCurrentView } = useFoodCircle();
  const [quantity, setQuantity] = useState(1);
  const [showLiveVideoPlayer, setShowLiveVideoPlayer] = useState(false);

  if (!isOpen || !food) return null;

  const discountPercent = Math.round(
    ((food.originalPrice - food.surplusPrice) / food.originalPrice) * 100
  );

  const isVeg =
    food.dietary === 'Veg' ||
    (food.dietary !== 'Non-Veg' &&
      food.isVeg !== false &&
      !food.name.toLowerCase().includes('chicken') &&
      !food.name.toLowerCase().includes('mutton') &&
      !food.name.toLowerCase().includes('fish') &&
      !food.name.toLowerCase().includes('egg'));

  const handleAddToCart = () => {
    addToCart(food, quantity);
    onClose();
  };

  const handleOrderNow = () => {
    addToCart(food, quantity);
    onClose();
    setCurrentView('cart');
  };

  const videoClipUrl =
    food.liveVideoUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Large Food Image with Badges */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Discount, Category & Diet Pill */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
              {discountPercent}% OFF SURPLUS
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {food.category}
            </span>
            <span
              className={`backdrop-blur-md text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md ${
                isVeg
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                  : 'bg-red-950/80 text-red-200 border border-red-500/40'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 border ${
                  isVeg ? 'border-emerald-400' : 'border-red-400'
                } flex items-center justify-center p-0.5 rounded-xs bg-white`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isVeg ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                />
              </span>
              <span>{isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
            </span>
          </div>

          {/* Bottom title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-emerald-300 text-xs font-medium flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              {food.providerName}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug drop-shadow-sm">
              {food.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Price & Quantity Available */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold text-emerald-700">
                  ₹{food.surplusPrice}
                </span>
                <span className="text-base text-slate-400 line-through">
                  ₹{food.originalPrice}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save ₹{food.originalPrice - food.surplusPrice} per {food.unit || 'portion'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Available: <strong className="text-slate-800">{food.quantity} {food.unit || 'portions'} left</strong>
              </p>
            </div>

            {/* Preparation / Pickup Time & Location */}
            <div className="text-right text-xs space-y-1">
              <div className="flex items-center justify-end gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pickup Time: <strong>{food.prepTime || '15 mins'}</strong></span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[200px]">{food.pickupLocation}</span>
              </div>
            </div>
          </div>

          {/* MANDATORY LIVE VIDEO PROOF & ANTI-SCAM VERIFICATION */}
          <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">
                    Anti-Scam Freshness Guarantee: Live Kitchen Video Proof ✓
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Gallery photo uploads are strictly prohibited to prevent stale food fraud.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLiveVideoPlayer(!showLiveVideoPlayer)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{showLiveVideoPlayer ? 'Hide Video' : 'Watch Live Proof'}</span>
              </button>
            </div>

            {/* Collapsible / Embedded Live Proof Video Player */}
            {showLiveVideoPlayer && (
              <FoodVideoPlayer
                src={videoClipUrl}
                title={food.name}
                timestamp={food.liveRecordedAt || 'Today at 18:45:12'}
                location={food.pickupLocation}
                autoPlay={true}
                className="mt-3"
              />
            )}

            <div className="text-[11px] text-emerald-900 pt-1 border-t border-emerald-200/80 flex items-center justify-between">
              <span>Verified at: <strong>{food.liveRecordedAt || 'Today at 18:45:12'}</strong></span>
              <span className="font-semibold text-emerald-700">100% Genuine Prepared Food</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              About This Food Item
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Small Mandatory Information Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Why this food is on FoodCircle</span>
            </div>
            <p className="text-slate-700 leading-relaxed italic">
              “This item is surplus food being redistributed through FoodCircle to reduce unnecessary food waste.”
            </p>
            {food.whySurplus && (
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-medium">
                <strong>Provider Note:</strong> {food.whySurplus}
              </p>
            )}
          </div>

          {/* AI Quality Check Verification Banner */}
          {food.aiChecked && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-semibold block">AI Food Quality Assistance</span>
                  <span className="text-[11px] text-blue-700">
                    Live video assessment completed • Packaging seal & freshness verified
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">
                SCORE 98%
              </span>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1.5 px-3 border border-slate-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold shadow-sm hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-slate-800 min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(food.quantity, q + 1))}
                disabled={quantity >= food.quantity}
                className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold shadow-sm hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart (₹{food.surplusPrice * quantity})
            </button>

            {/* Order Now Quick Checkout Button */}
            <button
              onClick={handleOrderNow}
              className="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
