import React from 'react';
import {
  Plus,
  Clock,
  MapPin,
  Building,
  Check,
  Leaf,
  Video,
  ShieldCheck,
  Star,
  Minus,
  Play,
  Zap,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function FoodCard({ food, onOpenDetails }) {
  const { cart, addToCart, updateCartQuantity } = useFoodCircle();

  const cartItem = cart.find((item) => item.food.id === food.id);
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

  const isImmediate = food.prepTime?.toLowerCase().includes('immediate') || food.prepTime?.toLowerCase().includes('ready');

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* 1. Food Image, Gradient & Anti-Scam Verification Badges */}
      <div>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
          onClick={() => onOpenDetails(food)}
        >
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/30 opacity-90 group-hover:opacity-95 transition-opacity" />

          {/* Top Left: Savings Pill & FSSAI Dietary Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="bg-emerald-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-tight">
              <span className="text-[10px]">SAVE</span> {discountPercent}%
            </span>

            {/* Indian FSSAI Veg / Non-Veg Standard Mark */}
            <span
              className={`w-4 h-4 border ${
                isVeg ? 'border-emerald-600' : 'border-red-600'
              } flex items-center justify-center p-0.5 rounded-xs bg-white shadow-xs`}
              title={isVeg ? 'Pure Vegetarian (FSSAI)' : 'Non-Vegetarian (FSSAI)'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isVeg ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              />
            </span>

            {food.isCustomerListing && (
              <span className="bg-purple-950/90 border border-purple-400/50 text-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs">
                🏡 Neighbor Kitchen
              </span>
            )}
          </div>

          {/* Top Right: Rating Pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{food.rating || '4.9'}</span>
            </span>
          </div>

          {/* Bottom Overlay: Anti-Scam Live Camera Proof Capsule & Urgency Stock */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(food);
              }}
              className="bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-400/50 text-emerald-200 px-2.5 py-1 rounded-xl backdrop-blur-md font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Click to view live counter camera recording"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <Play className="w-2.5 h-2.5 text-emerald-300 fill-emerald-300" />
              <span>Live Video Proof</span>
            </button>

            <span className="bg-black/60 border border-white/15 text-slate-200 px-2 py-1 rounded-xl backdrop-blur-md font-extrabold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{food.quantity} left</span>
            </span>
          </div>
        </div>

        {/* 2. Card Content & Kitchen Metadata */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <p className="font-bold text-emerald-800 flex items-center gap-1.5 truncate">
              {food.isCustomerListing ? (
                <span className="text-purple-700 font-extrabold flex items-center gap-1">
                  <span>🏡</span>
                  <span className="truncate">{food.providerName}</span>
                </span>
              ) : (
                <>
                  <Building className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{food.providerName}</span>
                </>
              )}
            </p>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
              {food.category}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(food)}
            className="font-extrabold text-sm text-slate-900 line-clamp-1 hover:text-emerald-700 transition cursor-pointer leading-snug"
            title={food.name}
          >
            {food.name}
          </h3>

          {/* Anti-Scam Guarantee Notice */}
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 px-2 py-1 rounded-xl font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">Cooked today • Strictly no gallery stock photos</span>
          </div>

          {/* Pickup Timing & Neighborhood */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span
              className={`flex items-center gap-1 font-bold ${
                isImmediate
                  ? 'text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg'
                  : 'text-slate-600'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-600" />
              <span>{isImmediate ? 'Hot & Ready' : food.prepTime || '15 mins'}</span>
            </span>

            <span className="flex items-center gap-1 text-slate-500 font-medium truncate max-w-[140px]" title={food.pickupLocation}>
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>{food.pickupLocation.split(',')[0]}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pricing & Tactile Add-to-Cart Action */}
      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-emerald-800 tracking-tight">
              ₹{food.surplusPrice}
            </span>
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{food.originalPrice}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-extrabold block">
            Save ₹{food.originalPrice - food.surplusPrice}
          </span>
        </div>

        {/* Tactile Add Button or Quantity Stepper */}
        {cartItem ? (
          <div className="flex items-center bg-emerald-600 text-white rounded-2xl overflow-hidden shadow-md shadow-emerald-600/20">
            <button
              onClick={() => updateCartQuantity(food.id, cartItem.quantity - 1)}
              className="px-2.5 py-1.5 hover:bg-emerald-700 font-extrabold text-xs transition cursor-pointer active:scale-95"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 py-1 text-xs font-black bg-emerald-700 text-white min-w-[24px] text-center">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(food.id, cartItem.quantity + 1)}
              className="px-2.5 py-1.5 hover:bg-emerald-700 font-extrabold text-xs transition cursor-pointer active:scale-95"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(food, 1)}
            className="px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-sm hover:shadow-md bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  );
}
