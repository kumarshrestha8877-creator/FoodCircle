import React, { useState } from 'react';
import {
  Bike,
  MapPin,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Play,
  Phone,
  ArrowRight,
  Sparkles,
  Heart,
  Building,
  Users,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';
import PickupVerificationModal from './PickupVerificationModal';
import LiveTrackingMap from '../common/LiveTrackingMap';
import ViewPickupProofModal from '../common/ViewPickupProofModal';

export default function VolunteerDashboard() {
  const {
    orders,
    currentUser,
    volunteerAcceptOrder,
    volunteerGoingToPickup,
    volunteerReachedPickup,
    submitPickupProof,
    updateRiderProgress,
    confirmDelivery,
    setActiveOrderId,
    setCurrentView,
  } = useFoodCircle();

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedProofOrder, setSelectedProofOrder] = useState(null);
  const [requestFilter, setRequestFilter] = useState('ALL'); // 'ALL', 'CUSTOMER', 'NGO'

  // Find active delivery for the current volunteer (or the demo active delivery)
  const activeDelivery = orders.find(
    (o) =>
      (o.volunteerId === currentUser.id || o.id === 'FC10245' || o.id === 'NGO-RUN-801') &&
      o.statusCode >= 2 &&
      o.statusCode < 9
  );

  // Available requests waiting for volunteer
  const availableRequests = orders.filter(
    (o) => o.statusCode === 1 || !o.volunteerId
  );

  const handleStartPickupTrip = (orderId) => {
    volunteerGoingToPickup(orderId);
  };

  const handleArrivedAtPickup = (orderId) => {
    volunteerReachedPickup(orderId);
    setIsVerificationModalOpen(true);
  };

  const handleVerificationDone = (proofData) => {
    if (activeDelivery) {
      submitPickupProof(activeDelivery.id, proofData);
      setIsVerificationModalOpen(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Volunteer Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
            }
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{currentUser.name}</h1>
              <span className="text-xs font-semibold bg-emerald-500/80 px-2.5 py-0.5 rounded-full border border-white/20">
                Active Volunteer
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Vehicle: {currentUser.vehicle || 'Honda Activa (WB-02-AK-4412)'} • Rating: 4.95 ★
            </p>
          </div>
        </div>

        {/* Quick Volunteer Impact Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Deliveries</span>
            <span className="text-base font-extrabold">64</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Food Rescued</span>
            <span className="text-base font-extrabold">142 kg</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">CO₂ Saved</span>
            <span className="text-base font-extrabold">355 kg</span>
          </div>
        </div>
      </div>

      {/* ACTIVE DELIVERY PANEL */}
      {activeDelivery ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Active Assignment in Progress
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Order #{activeDelivery.id} — {activeDelivery.items?.[0]?.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                {activeDelivery.status}
              </span>
              {activeDelivery.pickupVerification?.verified && (
                <button
                  onClick={() => setSelectedProofOrder(activeDelivery)}
                  className="px-2.5 py-1 bg-white border border-emerald-500 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Proof Verified ✓
                </button>
              )}
            </div>
          </div>

          {/* Workflow Action Steps for Volunteer */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Delivery Progress Action Steps
            </h4>

            {/* Step Status Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step A: Go to Pickup */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  activeDelivery.statusCode === 2
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : activeDelivery.statusCode > 2
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">1. Navigate to Pickup</span>
                  {activeDelivery.statusCode > 2 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 truncate">{activeDelivery.pickupLocation}</p>
                {activeDelivery.statusCode === 2 && (
                  <button
                    onClick={() => handleStartPickupTrip(activeDelivery.id)}
                    className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[11px] hover:bg-emerald-700 transition"
                  >
                    Start Navigation
                  </button>
                )}
              </div>

              {/* Step B: Mandatory Pickup Verification */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  activeDelivery.statusCode === 3 || activeDelivery.statusCode === 4
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-emerald-500'
                    : activeDelivery.statusCode >= 6
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">2. Mandatory Verification</span>
                  {activeDelivery.statusCode >= 6 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  {activeDelivery.pickupVerification?.verified
                    ? 'Video & GPS verified ✓'
                    : 'Record camera proof & GPS at venue'}
                </p>
                {activeDelivery.statusCode === 3 && (
                  <button
                    onClick={() => handleArrivedAtPickup(activeDelivery.id)}
                    className="w-full py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[11px] hover:bg-blue-700 transition"
                  >
                    I Have Reached Pickup
                  </button>
                )}
                {activeDelivery.statusCode === 4 && (
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[11px] hover:bg-emerald-700 transition flex items-center justify-center gap-1 animate-pulse"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Record Pickup Proof
                  </button>
                )}
              </div>

              {/* Step C: Deliver to Customer or NGO */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  activeDelivery.statusCode >= 7
                    ? activeDelivery.isNgoDelivery
                      ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-500'
                      : 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-emerald-500'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {activeDelivery.isNgoDelivery ? (
                      <>
                        <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        <span>3. Handover to NGO Shelter</span>
                      </>
                    ) : (
                      <span>3. Deliver to Customer</span>
                    )}
                  </span>
                  {activeDelivery.statusCode === 9 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-700 font-medium truncate">
                  {activeDelivery.isNgoDelivery ? (
                    <span className="text-rose-900 font-bold block">
                      {activeDelivery.ngoName}
                    </span>
                  ) : null}
                  <span>{activeDelivery.destination}</span>
                </p>
                {activeDelivery.isNgoDelivery && activeDelivery.beneficiaries && (
                  <p className="text-[10px] text-rose-700 font-semibold">
                    Beneficiaries: {activeDelivery.beneficiaries}
                  </p>
                )}
                {activeDelivery.statusCode >= 7 && activeDelivery.statusCode < 9 && (
                  <button
                    onClick={() => confirmDelivery(activeDelivery.id)}
                    className={`w-full py-1.5 font-bold rounded-lg text-[11px] transition flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
                      activeDelivery.isNgoDelivery
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {activeDelivery.isNgoDelivery
                        ? 'Confirm Handover at NGO Shelter ✓'
                        : 'Confirm Delivery'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Route Map with Rider Simulator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                Live Volunteer Route Navigation (Pickup → {activeDelivery.isNgoDelivery ? activeDelivery.ngoName : 'Destination'})
              </span>
              <span className="text-xs text-slate-500">
                ETA: <strong>{activeDelivery.estimatedMinutes || 10} mins</strong>
              </span>
            </div>
            <LiveTrackingMap
              order={activeDelivery}
              height="340px"
              interactive={true}
              onProgressUpdate={(progress, coords) => {
                updateRiderProgress(activeDelivery.id, progress, coords);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <Bike className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Active Delivery Right Now</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You are ready to accept nearby surplus food rescue requests or NGO relief runs below.
          </p>
        </div>
      )}

      {/* AVAILABLE DELIVERY REQUESTS (CUSTOMER & NGO RELIEF RUNS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Delivery Requests</h2>
            <p className="text-xs text-slate-500">
              Nearby surplus food batches awaiting pickup for customers & partner NGO shelters
            </p>
          </div>

          {/* Assignment Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setRequestFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                requestFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({availableRequests.length})
            </button>
            <button
              onClick={() => setRequestFilter('CUSTOMER')}
              className={`px-3 py-1.5 rounded-lg transition ${
                requestFilter === 'CUSTOMER'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛍️ Customer Orders ({availableRequests.filter((r) => !r.isNgoDelivery).length})
            </button>
            <button
              onClick={() => setRequestFilter('NGO')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                requestFilter === 'NGO'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>NGO Relief ({availableRequests.filter((r) => r.isNgoDelivery).length})</span>
            </button>
          </div>
        </div>

        {/* Requests List */}
        {availableRequests.filter((req) => {
          if (requestFilter === 'CUSTOMER') return !req.isNgoDelivery;
          if (requestFilter === 'NGO') return !!req.isNgoDelivery;
          return true;
        }).length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No matching delivery requests waiting right now in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRequests
              .filter((req) => {
                if (requestFilter === 'CUSTOMER') return !req.isNgoDelivery;
                if (requestFilter === 'NGO') return !!req.isNgoDelivery;
                return true;
              })
              .map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between space-y-4 ${
                    req.isNgoDelivery
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          #{req.id}
                        </span>
                        {req.isNgoDelivery && (
                          <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-extrabold text-[10px] flex items-center gap-1 shadow-2xs">
                            <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                            <span>NGO Relief Run</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        {req.distanceKm} km trip
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm mt-2 line-clamp-1">
                      {req.items?.[0]?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Qty: {req.items?.[0]?.quantity || 1} portion(s) • Est. {req.estimatedMinutes || 20} mins
                    </p>

                    {/* Beneficiary Highlight if NGO */}
                    {req.isNgoDelivery && req.beneficiaries && (
                      <div className="mt-2 p-2 bg-rose-50/80 rounded-xl border border-rose-200 text-[11px] text-rose-900 font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>Feeds: {req.beneficiaries}</span>
                      </div>
                    )}

                    {/* Route points */}
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></span>
                        <div>
                          <span className="font-semibold text-slate-700 block">Pickup:</span>
                          <span className="text-slate-500">{req.pickupLocation}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-slate-600">
                        <span
                          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                            req.isNgoDelivery ? 'bg-rose-500' : 'bg-blue-500'
                          }`}
                        ></span>
                        <div>
                          <span className="font-semibold text-slate-700 block">
                            {req.isNgoDelivery ? `Drop-off (NGO Shelter):` : `Destination:`}
                          </span>
                          <span className={req.isNgoDelivery ? 'text-rose-950 font-bold' : 'text-slate-500'}>
                            {req.isNgoDelivery && req.ngoName ? `${req.ngoName} — ` : ''}
                            {req.destination}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <button
                    onClick={() => volunteerAcceptOrder(req.id, currentUser)}
                    className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      req.isNgoDelivery
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'
                    }`}
                  >
                    {req.isNgoDelivery ? (
                      <>
                        <Heart className="w-4 h-4 fill-white" />
                        <span>Accept NGO Relief Mission</span>
                      </>
                    ) : (
                      <>
                        <Bike className="w-4 h-4" />
                        <span>Accept Delivery</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mandatory Verification Modal */}
      {activeDelivery && (
        <PickupVerificationModal
          order={activeDelivery}
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerificationComplete={handleVerificationDone}
        />
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
