import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Leaf, Heart, ArrowRight, X, Sparkles } from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function ImpactModal({ order, isOpen, onClose }) {
  const { setCurrentView } = useFoodCircle();

  useEffect(() => {
    if (isOpen) {
      // Fire confetti bursts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#6EE7B7'],
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const foodKg = order.foodWeightKg || 1.5;
  const co2Kg = (foodKg * 2.5).toFixed(1);
  const moneySaved = order.savedAmount || 110;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Headlines */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Food Delivered Successfully ✓
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 pt-2">
            Thank you for helping rescue food with FoodCircle.
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto pt-1">
            You helped rescue surplus food and reduce food waste.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold uppercase text-emerald-700 block">Food Rescued</span>
            <span className="text-lg font-extrabold text-emerald-900">{foodKg} kg</span>
          </div>

          <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100">
            <span className="text-[10px] font-bold uppercase text-teal-700 block">CO₂ Prevented</span>
            <span className="text-lg font-extrabold text-teal-900">{co2Kg} kg</span>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold uppercase text-amber-700 block">You Saved</span>
            <span className="text-lg font-extrabold text-amber-900">₹{moneySaved}</span>
          </div>
        </div>

        {/* Volunteer Appreciation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3 text-left text-xs">
          <img
            src={
              order.volunteerAvatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
            }
            alt={order.volunteerName}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <span className="text-slate-500 text-[11px] block">Delivered by volunteer:</span>
            <span className="font-bold text-slate-800">{order.volunteerName || 'Rahul Sharma'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              setCurrentView('marketplace');
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
          >
            <span>Explore More Surplus Meals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
