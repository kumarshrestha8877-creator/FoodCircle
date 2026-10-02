import React, { useState } from 'react';
import {
  ShoppingBag,
  Bike,
  Building2,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function AppPortalSwitcher() {
  const { currentUser, switchRole, resetToDemoData, currentView, setCurrentView } = useFoodCircle();
  const [isOpen, setIsOpen] = useState(false);

  const portals = [
    {
      role: 'customer',
      label: 'Customer App',
      sub: 'Browse surplus food & track orders',
      icon: ShoppingBag,
      color: 'bg-emerald-600',
      badge: 'Marketplace',
    },
    {
      role: 'volunteer',
      label: 'Volunteer Rider',
      sub: 'Accept pickups & camera verification',
      icon: Bike,
      color: 'bg-blue-600',
      badge: 'Courier Fleet',
    },
    {
      role: 'provider',
      label: 'Kitchen Merchant',
      sub: 'List fresh surplus with camera video',
      icon: Building2,
      color: 'bg-amber-600',
      badge: 'Restaurants',
    },
    {
      role: 'admin',
      label: 'City Ops Console',
      sub: 'Live city monitoring & video audit',
      icon: ShieldCheck,
      color: 'bg-purple-600',
      badge: 'Central Hub',
    },
  ];

  const currentPortal = portals.find((p) => p.role === currentUser.role) || portals[0];
  const CurrentIcon = currentPortal.icon;

  return (
    <aside aria-label="Portal Navigation" className="fixed bottom-5 right-5 z-50 select-none">
      {/* Expanded Switcher Sheet */}
      {isOpen && (
        <div className="bg-slate-950/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/15 p-3.5 mb-3 w-80 space-y-3 animate-fade-in text-white text-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-white text-[11px] uppercase tracking-wider">
                Switch Role / Portal
              </span>
            </div>
            <button
              onClick={() => {
                resetToDemoData();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[10px] font-bold bg-white/5 hover:bg-white/15 px-2 py-1 rounded-lg"
              title="Reset sample Kolkata data"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Data
            </button>
          </div>

          <div className="space-y-1.5">
            {portals.map(({ role, label, sub, icon: Icon, color, badge }) => {
              const isActive = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-2xl text-left transition flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-white/15 border border-emerald-400/50 shadow-inner'
                      : 'hover:bg-white/10 border border-transparent text-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${color} shadow-sm flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="block text-xs font-bold leading-tight truncate text-white">
                        {label}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 px-1.5 py-0.2 rounded bg-white/10">
                        {badge}
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-400 font-normal truncate mt-0.5">
                      {sub}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Kolkata Urban Pilot</span>
            <span className="text-emerald-400 font-bold">FoodCircle v2.0</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill Dock */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-950/90 hover:bg-slate-900 text-white backdrop-blur-xl px-4 py-3 rounded-full shadow-2xl border border-white/15 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-black/10"
        title="Click to Switch Portal (Customer / Rider / Merchant / Ops)"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${currentPortal.color} shadow-xs`}>
          <CurrentIcon className="w-3.5 h-3.5" />
        </div>
        <div className="text-left text-xs pr-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
            Active Portal
          </span>
          <span className="font-extrabold block text-xs text-white leading-tight mt-0.5">
            {currentPortal.label}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </aside>
  );
}
