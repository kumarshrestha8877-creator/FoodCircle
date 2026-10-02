import React from 'react';
import { X, ShieldCheck, MapPin, Clock, UserCheck, Video, CheckCircle2 } from 'lucide-react';
import FoodVideoPlayer from './FoodVideoPlayer';

export default function ViewPickupProofModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const proof = order.pickupVerification;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">Verified Food Collection Proof</h3>
              <p className="text-emerald-100 text-xs font-mono">Order #{order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {proof?.verified ? (
            <>
              {/* Video Player */}
              <FoodVideoPlayer
                src={proof.videoUrl}
                title={`Order #${order.id} Pickup Proof`}
                timestamp={proof.verifiedAt}
                location={proof.locationName || order.pickupLocation}
                autoPlay={true}
              />

              {/* Verification Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Verified by Volunteer:
                  </span>
                  <span className="font-bold text-slate-800">
                    {proof.volunteerName || order.volunteerName || 'Rahul Sharma'}
                  </span>
                </div>

                <div className="flex items-start justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1.5 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Pickup Location:
                  </span>
                  <span className="font-semibold text-slate-800 text-right max-w-[220px]">
                    {proof.locationName || order.pickupLocation}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-mono text-[11px]">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-bold text-emerald-800">
                    {proof.coords ? `${proof.coords.lat.toFixed(4)}° N, ${proof.coords.lng.toFixed(4)}° E` : '22.5804° N, 88.4378° E'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Collection Timestamp:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {proof.verifiedAt || order.timestamp}
                  </span>
                </div>
              </div>

              {proof.note && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 italic">
                  "{proof.note}"
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold">Pickup verification is pending</p>
              <p className="text-xs text-slate-400 mt-1">
                The volunteer will complete camera proof once they reach the pickup location.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Close Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
