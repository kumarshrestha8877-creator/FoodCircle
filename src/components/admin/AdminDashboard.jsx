import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  Bike,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  MapPin,
  TrendingUp,
  Leaf,
  Filter,
  HeartHandshake,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';
import ViewPickupProofModal from '../common/ViewPickupProofModal';

export default function AdminDashboard() {
  const {
    orders,
    foodItems,
    volunteers,
    providers,
    setActiveOrderId,
    setCurrentView,
  } = useFoodCircle();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedProofOrder, setSelectedProofOrder] = useState(null);

  // Compute live KPI metrics
  const totalOrdersCount = orders.length;
  const foodItemsListedCount = foodItems.length;
  const totalFoodRescuedKg = orders
    .reduce((sum, o) => sum + (o.foodWeightKg || 1.2), 0)
    .toFixed(1);
  const activeDeliveriesCount = orders.filter(
    (o) => o.statusCode >= 2 && o.statusCode < 9
  ).length;
  const completedDeliveriesCount = orders.filter(
    (o) => o.statusCode === 9
  ).length;
  const activeVolunteersCount = volunteers.length;
  const ngoReliefRunsCount = orders.filter((o) => o.isNgoDelivery).length;

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ACTIVE') return o.statusCode >= 1 && o.statusCode < 9;
    if (filterStatus === 'DELIVERED') return o.statusCode === 9;
    if (filterStatus === 'VERIFIED') return o.pickupVerification?.verified;
    if (filterStatus === 'NGO RELIEF') return !!o.isNgoDelivery;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">FoodCircle Central Admin</h1>
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              City Operations • Kolkata
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring of surplus food listings, volunteer pickups, camera verifications & deliveries
          </p>
        </div>
      </div>

      {/* Top Stat KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalOrdersCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold block">↑ 100% fulfill rate</span>
        </div>

        {/* Food Items Listed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Food Items</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{foodItemsListedCount}</p>
          <span className="text-[10px] text-slate-500 block">Across 4 providers</span>
        </div>

        {/* Food Rescued */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Food Rescued</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-700">{totalFoodRescuedKg} <span className="text-sm font-semibold">kg</span></p>
          <span className="text-[10px] text-teal-600 font-semibold block">{(totalFoodRescuedKg * 2.5).toFixed(0)} kg CO₂ prevented</span>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Transit</span>
            <Bike className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-700">{activeDeliveriesCount}</p>
          <span className="text-[10px] text-blue-600 font-semibold block">Live tracked</span>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{completedDeliveriesCount}</p>
          <span className="text-[10px] text-slate-500 block">Verified handovers</span>
        </div>

        {/* NGO Relief Runs */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">NGO Relief</span>
            <HeartHandshake className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700">{ngoReliefRunsCount}</p>
          <span className="text-[10px] text-rose-600 font-semibold block">Partner Shelters</span>
        </div>

        {/* Active Volunteers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Volunteers</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700">{activeVolunteersCount}</p>
          <span className="text-[10px] text-purple-600 block">Kolkata fleet</span>
        </div>
      </div>

      {/* Order Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Order Management & Verification Audit</h2>
            <p className="text-xs text-slate-500">
              Audit mandatory video collection proof, GPS coords, and live delivery timeline
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
            {['ALL', 'ACTIVE', 'VERIFIED', 'NGO RELIEF', 'DELIVERED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter)}
                className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
                  filterStatus === filter
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Food Item</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Pickup Verification</th>
                <th className="py-3 px-4">Pickup Location</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const isVerified = order.pickupVerification?.verified;

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>#{order.id}</span>
                        {order.isNgoDelivery && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded w-fit mt-0.5 border border-rose-200">
                            🏛️ NGO Relief
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Food */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-[160px]">
                        {order.items?.[0]?.name}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {order.isNgoDelivery ? (
                          <span className="text-rose-600 font-bold">Feeds ~{order.beneficiaryCount || 45} people • Free</span>
                        ) : (
                          `Qty: ${order.items?.[0]?.quantity || 1} • ₹${order.total}`
                        )}
                      </span>
                    </td>

                    {/* Customer / Destination */}
                    <td className="py-3 px-4">
                      {order.isNgoDelivery ? (
                        <div>
                          <div className="font-bold text-rose-900">{order.targetNgoName || 'Partner NGO'}</div>
                          <span className="text-[10px] text-rose-600 font-medium truncate block max-w-[130px]">
                            Coord: {order.coordinatorName || 'Shelter'}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-slate-800">{order.customerName}</div>
                          <span className="text-[10px] text-slate-400 truncate block max-w-[120px]">
                            {order.destination.split(',')[0]}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Volunteer */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">
                        {order.volunteerName || 'Awaiting assignment'}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {order.volunteerVehicle || 'Two-Wheeler'}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4">
                      {isVerified ? (
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified ✓
                          </span>
                          <button
                            onClick={() => setSelectedProofOrder(order)}
                            className="text-emerald-700 hover:text-emerald-900 underline text-[10px] font-bold"
                          >
                            Watch
                          </button>
                        </div>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Pending Proof
                        </span>
                      )}
                    </td>

                    {/* Pickup Location */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="truncate block max-w-[140px]" title={order.pickupLocation}>
                        {order.pickupLocation.split(',')[0]}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {order.timestamp?.split(' ')?.[1] || order.timestamp}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isVerified && (
                          <button
                            onClick={() => setSelectedProofOrder(order)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            title="Inspect Pickup Video Proof"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveOrderId(order.id);
                            setCurrentView('live_tracking');
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <span>Track</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Modal */}
      <ViewPickupProofModal
        order={selectedProofOrder}
        isOpen={!!selectedProofOrder}
        onClose={() => setSelectedProofOrder(null)}
      />
    </div>
  );
}
