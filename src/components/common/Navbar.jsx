import React, { useState } from 'react';
import {
  Leaf,
  ShoppingBag,
  MapPin,
  User,
  ChevronDown,
  Bike,
  ShieldCheck,
  Building,
  Menu,
  X,
  LogOut,
  Navigation,
  PlusCircle,
  Heart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function Navbar() {
  const {
    currentUser,
    setCurrentUser,
    currentView,
    setCurrentView,
    cart,
    cartSubtotal,
    orders,
    activeOrderId,
    setActiveOrderId,
    setIsCustomerListModalOpen,
  } = useFoodCircle();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCityLocality, setSelectedCityLocality] = useState('Salt Lake, Kolkata');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check if there is an active delivery order
  const activeOrder = orders.find(
    (o) => o.statusCode >= 2 && o.statusCode < 9
  );

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => {
              if (currentUser.role === 'customer') setCurrentView('marketplace');
              else if (currentUser.role === 'volunteer') setCurrentView('volunteer_dashboard');
              else if (currentUser.role === 'provider') setCurrentView('provider_dashboard');
              else if (currentUser.role === 'admin') setCurrentView('admin_dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            {/* Circular Rescue Emblem with subtle orbital border */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 rounded-2xl border border-emerald-400/30"></div>
              <Leaf className="w-5 h-5 text-emerald-200" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-900 shadow-2xs">
                ↻
              </span>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-2">
                FoodCircle
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300/80 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Kolkata
                </span>
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block truncate max-w-[280px]">
                Smart food rescue & redistribution platform
              </p>
            </div>
          </div>

          {/* Location Dropdown with ETA Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-100/80 border border-slate-200/90 px-3 py-1.5 rounded-2xl shadow-2xs hover:border-emerald-300 transition">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <select
              value={selectedCityLocality}
              onChange={(e) => setSelectedCityLocality(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option>Salt Lake, Kolkata</option>
              <option>Park Street, Kolkata</option>
              <option>Gariahat, Kolkata</option>
              <option>New Town, Kolkata</option>
              <option>Ballygunge, Kolkata</option>
              <option>Jadavpur, Kolkata</option>
            </select>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              ⚡ 15-20 min
            </span>
          </div>

          {/* Role Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
            {currentUser.role === 'customer' && (
              <>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'marketplace'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home & Surplus
                </button>
                <button
                  onClick={() => setCurrentView('my_orders')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'my_orders'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    if (activeOrder) setActiveOrderId(activeOrder.id);
                    setCurrentView('live_tracking');
                  }}
                  className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    currentView === 'live_tracking'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live Tracking</span>
                  {activeOrder && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  )}
                </button>
                <button
                  onClick={() => setIsCustomerListModalOpen(true)}
                  className="px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 font-extrabold cursor-pointer shadow-2xs"
                  title="List and share your surplus home food or donate to NGO"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+ Share Surplus</span>
                </button>
              </>
            )}

            {currentUser.role === 'volunteer' && (
              <>
                <button
                  onClick={() => setCurrentView('volunteer_dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'volunteer_dashboard'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Volunteer Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('volunteer_dashboard')}
                  className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  Deliveries
                </button>
                <button
                  onClick={() => setCurrentView('volunteer_dashboard')}
                  className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  Pickup Verification
                </button>
              </>
            )}

            {currentUser.role === 'provider' && (
              <>
                <button
                  onClick={() => setCurrentView('provider_dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'provider_dashboard'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Provider Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('provider_dashboard')}
                  className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  List Food
                </button>
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  Orders
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'admin_dashboard'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Admin Console
                </button>
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  Audits & Verification
                </button>
              </>
            )}
          </nav>

          {/* Right Actions: Cart & Profile */}
          <div className="flex items-center gap-3">
            {/* Customer Cart Trigger (Swiggy / Blinkit style) */}
            {currentUser.role === 'customer' && (
              <button
                onClick={() => setCurrentView('cart')}
                className={`relative px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs ${
                  cartItemsCount > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title="View Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemsCount > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <span>₹{cartSubtotal}</span>
                    <span className="opacity-60">•</span>
                    <span>{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}</span>
                  </span>
                ) : (
                  <span>Cart</span>
                )}
              </button>
            )}

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                }
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-500"
              />
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-slate-800 block leading-tight truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-700">
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Switch to Login / Logout */}
            <button
              onClick={() => setCurrentView('login')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              title="Switch Account / Sign In"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 text-xs font-semibold">
          <button
            onClick={() => {
              setCurrentView('marketplace');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 block"
          >
            Surplus Food Marketplace
          </button>
          <button
            onClick={() => {
              setCurrentView('my_orders');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 block"
          >
            My Orders
          </button>
          <button
            onClick={() => {
              if (activeOrder) setActiveOrderId(activeOrder.id);
              setCurrentView('live_tracking');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 block"
          >
            Live Tracking
          </button>
          <button
            onClick={() => {
              setCurrentView('volunteer_dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 block"
          >
            Volunteer Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentView('provider_dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 block"
          >
            Food Provider Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentView('admin_dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 block"
          >
            Admin Dashboard
          </button>
          <button
            onClick={() => {
              setIsCustomerListModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ Share Surplus Food / Donate</span>
          </button>
        </div>
      )}
    </header>
  );
}
