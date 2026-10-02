import React from 'react';
import { FoodCircleProvider, useFoodCircle } from './context/FoodCircleContext';
import AppPortalSwitcher from './components/common/AppPortalSwitcher';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import CustomerHome from './components/customer/CustomerHome';
import CartCheckout from './components/customer/CartCheckout';
import MyOrders from './components/customer/MyOrders';
import OrderTrackingView from './components/customer/OrderTrackingView';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard';
import ProviderDashboard from './components/provider/ProviderDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/auth/LoginPage';
import ImpactModal from './components/customer/ImpactModal';
import CustomerListSurplusModal from './components/customer/CustomerListSurplusModal';
import { Leaf, Heart, ShieldCheck, Sparkles } from 'lucide-react';

function AppContent() {
  const {
    currentView,
    setCurrentView,
    impactCelebrationOrder,
    setImpactCelebrationOrder,
    isCustomerListModalOpen,
    setIsCustomerListModalOpen,
  } = useFoodCircle();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Top Application Navigation */}
      {currentView !== 'login' && <Navbar />}

      {/* 2. Main Dynamic Content View */}
      <main className="flex-1">
        {currentView === 'marketplace' && <CustomerHome />}
        {currentView === 'cart' && <CartCheckout />}
        {currentView === 'my_orders' && <MyOrders />}
        {currentView === 'live_tracking' && <OrderTrackingView />}
        {currentView === 'volunteer_dashboard' && <VolunteerDashboard />}
        {currentView === 'provider_dashboard' && <ProviderDashboard />}
        {currentView === 'admin_dashboard' && <AdminDashboard />}
        {currentView === 'login' && <LoginPage />}
      </main>

      {/* 3. Delivery Impact Celebration Modal */}
      <ImpactModal
        order={impactCelebrationOrder}
        isOpen={!!impactCelebrationOrder}
        onClose={() => setImpactCelebrationOrder(null)}
      />

      {/* 4. Customer Surplus Listing Modal (Root level to avoid CSS backdrop-filter containing block trap) */}
      <CustomerListSurplusModal
        isOpen={isCustomerListModalOpen}
        onClose={() => setIsCustomerListModalOpen(false)}
      />

      {/* 4. App Portal Switcher (Floating Quick Switch) */}
      <AppPortalSwitcher />

      {/* 5. System Toast */}
      <Toast />

      {/* 6. Clean Platform Footer */}
      {currentView !== 'login' && (
        <footer className="bg-white border-t border-slate-200 mt-16 py-8 px-4 sm:px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-slate-800 text-sm">FoodCircle</span>
              <span>— AI-powered smart food rescue and redistribution platform</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>Kolkata Urban Food Redistribution Prototype</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Zero Hunger & Zero Waste</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FoodCircleProvider>
      <AppContent />
    </FoodCircleProvider>
  );
}
