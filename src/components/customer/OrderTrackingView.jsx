import React, { useState } from 'react';
import {
  ShoppingBag,
  UserCheck,
  Navigation,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Bike,
  Home,
  CheckCircle2,
  Clock,
  Phone,
  Eye,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Leaf,
  Globe,
  ExternalLink,
  HeartHandshake,
  Building2,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';
import LiveTrackingMap from '../common/LiveTrackingMap';
import ViewPickupProofModal from '../common/ViewPickupProofModal';

export default function OrderTrackingView({ orderId }) {
  const {
    orders,
    activeOrderId,
    updateRiderProgress,
    confirmDelivery,
    setViewingProofOrder,
    setImpactCelebrationOrder,
    setCurrentView,
    ORDER_STAGES,
  } = useFoodCircle();

  const targetOrderId = orderId || activeOrderId || 'FC10245';
  const order = orders.find((o) => o.id === targetOrderId) || orders[0];

  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <p className="text-slate-500">Order not found.</p>
        <button
          onClick={() => setCurrentView('marketplace')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const currentStatusCode = order.statusCode || 1;
  const isDelivered = currentStatusCode === 9;
  const isPickupVerified = order.pickupVerification?.verified;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Navigation & Order ID Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('my_orders')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
            title="Back to My Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {order.isNgoDelivery ? `NGO Relief Run #${order.id}` : `Order #${order.id}`}
              </h1>
              {order.isNgoDelivery && (
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                  NGO Shelter Delivery
                </span>
              )}
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {order.isNgoDelivery ? 'Humanitarian Relief Mission' : 'Placed'} on {order.timestamp} • {order.items?.length || 1} surplus item(s)
            </p>
          </div>
        </div>

        {/* ETA & Quick Actions */}
        <div className="flex items-center gap-2">
          {!isDelivered && (
            <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 animate-spin text-emerald-200" />
              <span>
                Estimated Arrival: <strong>{order.estimatedMinutes || 12} mins</strong>
              </span>
            </div>
          )}

          {isPickupVerified && (
            <button
              onClick={() => setIsProofModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              View Pickup Proof ✓
            </button>
          )}
        </div>
      </div>

      {/* Prominent NGO Mission Banner if this order is delivering to an NGO */}
      {order.isNgoDelivery && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border border-rose-300 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Rider Carrying Food to {order.targetNgoName || 'Partner NGO Shelter'}
                  </h3>
                  <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Direct NGO Mission
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Shelter: <strong>{order.ngoShelterAddress || order.destination}</strong> • Coordinator: {order.coordinatorName || 'Shelter In-Charge'} ({order.coordinatorPhone || '+91 98300 11223'})
                </p>
              </div>
            </div>

            <div className="bg-white/80 border border-rose-200 rounded-xl px-3 py-1.5 text-center flex-shrink-0">
              <span className="text-[10px] font-bold text-rose-600 uppercase block">Impact Reach</span>
              <span className="text-xs font-extrabold text-slate-900">
                ❤️ Feeds ~{order.beneficiaryCount || 50} Beneficiaries
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Blinkit-Style Layout: Map & Rider Card on Left, 9-Stage Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Map & Delivery Card */}
        <div className="lg:col-span-7 space-y-4">
          {/* Map Area */}
          <div className="relative">
            <LiveTrackingMap
              order={order}
              height="380px"
              interactive={true}
              onProgressUpdate={(progress, coords) => {
                updateRiderProgress(order.id, progress, coords);
              }}
              onDeliveryReached={() => {
                confirmDelivery(order.id);
              }}
            />
          </div>

          {/* Google Maps Route Navigation Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${order.isNgoDelivery ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                {order.isNgoDelivery ? <HeartHandshake className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-slate-800 block">
                  {order.isNgoDelivery ? `Google Maps Route to ${order.targetNgoName || 'NGO Shelter'}` : 'Google Maps Turn-by-Turn Route'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {order.pickupLocation?.split(',')[0]} → {order.isNgoDelivery ? (order.ngoShelterAddress?.split(',')[0] || order.targetNgoName) : order.destination?.split(',')[0]} (Kolkata)
                </span>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${order.pickupCoords?.lat || 22.5804},${order.pickupCoords?.lng || 88.4378}&destination=${order.destinationCoords?.lat || 22.5435},${order.destinationCoords?.lng || 88.3685}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs text-white ${
                order.isNgoDelivery ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>{order.isNgoDelivery ? 'Navigate to Shelter' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Blinkit-Style Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              {/* Volunteer Info */}
              <div className="flex items-center gap-3">
                <img
                  src={order.volunteerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={order.volunteerName}
                  className={`w-12 h-12 rounded-full object-cover border-2 shadow-sm ${
                    order.isNgoDelivery ? 'border-rose-500' : 'border-emerald-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-800">
                      {order.volunteerName || 'Volunteer Rider'}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                      order.isNgoDelivery
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {order.isNgoDelivery ? 'NGO Relief Courier' : 'Verified Rider'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.volunteerVehicle || 'Two-Wheeler'} • {order.volunteerPhone}
                  </p>
                  {order.isNgoDelivery && (
                    <span className="text-[11px] font-bold text-rose-600 block mt-0.5">
                      🏛️ Mission: Handover to {order.targetNgoName} coordinator ({order.coordinatorName || 'Shelter In-Charge'})
                    </span>
                  )}
                </div>
              </div>

              {/* Call Volunteer Button */}
              <a
                href={`tel:${order.volunteerPhone}`}
                className="p-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-xl transition border border-slate-200"
                title="Call Volunteer"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Status Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Food Collected</span>
              </div>
              <div className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                isPickupVerified
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isPickupVerified ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span>Pickup Verified</span>
              </div>
              <div className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                currentStatusCode >= 7
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${currentStatusCode >= 7 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span>Rider on Way</span>
              </div>
              <div className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                isDelivered
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                  : currentStatusCode >= 8
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-emerald-600' : currentStatusCode >= 8 ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                <span>{isDelivered ? 'Delivered ✓' : 'Arriving'}</span>
              </div>
            </div>

            {/* Food item preview */}
            <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={order.items?.[0]?.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80'}
                  alt="food"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <span className="font-bold text-slate-800 block">{order.items?.[0]?.name}</span>
                  <span className="text-slate-500">
                    {order.isNgoDelivery
                      ? `Feeds ~${order.beneficiaryCount || 50} children/residents • Free NGO Donation`
                      : `Qty: ${order.items?.[0]?.quantity || 1} • Saved ₹${order.savedAmount || 110}`}
                  </span>
                </div>
              </div>
              <span className={`font-extrabold ${order.isNgoDelivery ? 'text-rose-600' : 'text-emerald-700'}`}>
                {order.isNgoDelivery ? 'FREE DONATION' : `₹${order.total}`}
              </span>
            </div>

            {/* Handover Action: Delivery PIN and Confirmation */}
            {!isDelivered ? (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    {order.isNgoDelivery ? 'Shelter Handover PIN:' : 'Share PIN with Rider:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {['4', '8', '2', '1'].map((digit, i) => (
                      <span
                        key={i}
                        className={`w-6 h-7 rounded-md font-extrabold text-xs flex items-center justify-center shadow-xs text-white ${
                          order.isNgoDelivery ? 'bg-rose-700' : 'bg-slate-900'
                        }`}
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => confirmDelivery(order.id)}
                  className={`px-4 py-2 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                    order.isNgoDelivery ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {order.isNgoDelivery
                      ? 'Confirm Handover at NGO Shelter (Mark Delivered ✓)'
                      : 'Confirm Handover (Mark Delivered ✓)'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {order.isNgoDelivery
                      ? `Surplus Food Delivered to ${order.targetNgoName || 'NGO Shelter'} ✓`
                      : 'Food Delivered Successfully ✓'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {order.deliveredAt || 'Delivered'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 9-Stage Progress Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800">
                Order Rescue Timeline
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Stage {currentStatusCode} of 9
              </span>
            </div>

            {/* Delivered Success Celebration Box */}
            {isDelivered && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-4 text-white shadow-md space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span className="font-extrabold text-sm">Order Delivered Successfully ✓</span>
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-xs text-emerald-100">
                  Thank you for helping rescue surplus food and preventing food waste!
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-200">
                    Handover: {order.deliveredAt || 'Today'}
                  </span>
                  <button
                    onClick={() => setImpactCelebrationOrder(order)}
                    className="px-3 py-1 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-lg text-xs transition shadow-sm cursor-pointer"
                  >
                    View Impact Certificate 🎉
                  </button>
                </div>
              </div>
            )}

            {/* 9 Stages List */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ORDER_STAGES.map((stage) => {
                const isDeliveredFinal = stage.code === 9 && currentStatusCode === 9;
                const isCompleted = currentStatusCode > stage.code || isDeliveredFinal;
                const isCurrent = currentStatusCode === stage.code && !isDeliveredFinal;
                const isPending = currentStatusCode < stage.code;

                return (
                  <div key={stage.code} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-white border-emerald-600 text-emerald-600 ring-4 ring-emerald-100'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : (
                        stage.code
                      )}
                    </div>

                    <div className="pl-2">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isDeliveredFinal || isCurrent
                              ? 'text-emerald-700'
                              : isCompleted
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </h4>

                        {/* Special Badges for mandatory pickup verification */}
                        {stage.code === 6 && isPickupVerified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Verified ✓
                          </span>
                        )}

                        {/* Special Badge for Delivered */}
                        {stage.code === 9 && isDeliveredFinal && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                            Delivered ✓
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[11px] mt-0.5 leading-snug ${
                          isCurrent
                            ? 'text-slate-600 font-medium'
                            : isCompleted
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.desc}
                      </p>

                      {/* Interactive Button directly on Stage 6 if verified */}
                      {stage.code === 6 && isPickupVerified && (
                        <button
                          onClick={() => setIsProofModalOpen(true)}
                          className="mt-1 text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Inspect Camera Recording & GPS
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Food Rescue Impact Card */}
          <div className={`rounded-2xl p-5 text-white shadow-md space-y-3 ${
            order.isNgoDelivery
              ? 'bg-gradient-to-br from-rose-900 via-slate-900 to-teal-900 border border-rose-500/30'
              : 'bg-gradient-to-br from-emerald-600 to-teal-700'
          }`}>
            <div className="flex items-center gap-2">
              {order.isNgoDelivery ? (
                <HeartHandshake className="w-5 h-5 text-rose-300" />
              ) : (
                <Leaf className="w-5 h-5 text-emerald-200" />
              )}
              <h4 className="font-bold text-sm">
                {order.isNgoDelivery ? 'Humanitarian Relief & Hunger Impact' : 'Your Environmental Impact'}
              </h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {order.isNgoDelivery
                ? `Surplus food rescued directly from donors and carried by volunteer riders to feed underprivileged beneficiaries at ${order.targetNgoName || 'partner NGO shelters'}.`
                : 'By purchasing this surplus meal, you prevented edible food from entering landfills, directly reducing greenhouse methane emissions.'}
            </p>
            <div className={`grid gap-3 pt-2 text-xs ${order.isNgoDelivery ? 'grid-cols-3 border-t border-rose-500/30' : 'grid-cols-2 border-t border-emerald-500/40'}`}>
              {order.isNgoDelivery && (
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                  <span className="text-rose-200 block text-[10px] uppercase font-bold">Feeds</span>
                  <span className="text-lg font-extrabold text-amber-300">~{order.beneficiaryCount || 45} souls</span>
                </div>
              )}
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-emerald-200 block text-[10px] uppercase font-bold">Food Rescued</span>
                <span className="text-lg font-extrabold">{order.foodWeightKg || 1.5} kg</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-emerald-200 block text-[10px] uppercase font-bold">CO₂ Prevented</span>
                <span className="text-lg font-extrabold">{((order.foodWeightKg || 1.5) * 2.5).toFixed(1)} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Proof Modal */}
      <ViewPickupProofModal
        order={order}
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
      />
    </div>
  );
}
