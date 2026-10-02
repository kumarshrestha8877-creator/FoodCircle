import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Bike,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';
import ViewPickupProofModal from '../common/ViewPickupProofModal';

export default function MyOrders() {
  const { orders, setActiveOrderId, setCurrentView } = useFoodCircle();
  const [selectedProofOrder, setSelectedProofOrder] = useState(null);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My FoodCircle Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your surplus food rescues and verified volunteer deliveries
          </p>
        </div>
        <button
          onClick={() => setCurrentView('marketplace')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
        >
          + Rescue More Food
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Orders Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Discover affordable surplus meals in your locality and start saving food.
          </p>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.statusCode === 9;
            const isPickupVerified = order.pickupVerification?.verified;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isDelivered
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">{order.timestamp}</span>
                </div>

                {/* Items & Volunteer Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Food Thumbnail & Name */}
                  <div className="md:col-span-6 flex items-center gap-3">
                    <img
                      src={
                        order.items?.[0]?.image ||
                        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80'
                      }
                      alt="food"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                        {order.items?.[0]?.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {order.items?.length > 1
                          ? `+${order.items.length - 1} other item(s)`
                          : `Qty: ${order.items?.[0]?.quantity || 1} portion(s)`}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">
                        Saved ₹{order.savedAmount || 110} on surplus
                      </p>
                    </div>
                  </div>

                  {/* Volunteer & Verification badge */}
                  <div className="md:col-span-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Bike className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.volunteerName || 'Volunteer Rider'}</span>
                    </div>

                    {isPickupVerified ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pickup Verified ✓</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Verification Pending</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2">
                    <span className="font-extrabold text-base text-slate-900">
                      ₹{order.total}
                    </span>

                    <div className="flex items-center gap-2">
                      {isPickupVerified && (
                        <button
                          onClick={() => setSelectedProofOrder(order)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                          title="View Recorded Video Proof"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Proof
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveOrderId(order.id);
                          setCurrentView('live_tracking');
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1"
                      >
                        <span>{isDelivered ? 'View Order' : 'Track Order'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proof Modal */}
      <ViewPickupProofModal
        order={selectedProofOrder}
        isOpen={!!selectedProofOrder}
        onClose={() => setSelectedProofOrder(null)}
      />
    </div>
  );
}
