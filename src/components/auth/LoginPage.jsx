import React, { useState } from 'react';
import {
  Leaf,
  ShieldCheck,
  User,
  Bike,
  Building,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function LoginPage() {
  const { setCurrentUser, setCurrentView, showToast, users } = useFoodCircle();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'volunteer', 'provider', 'admin'
  const [identifier, setIdentifier] = useState('ananya@foodcircle.org');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'customer') {
      setIdentifier('ananya@foodcircle.org');
    } else if (role === 'volunteer') {
      setIdentifier('rahul@foodcircle.org');
    } else if (role === 'provider') {
      setIdentifier('aroma@foodcircle.org');
    } else if (role === 'admin') {
      setIdentifier('admin@foodcircle.org');
    }
  };

  const handleQuickDemoLogin = (userObj) => {
    setCurrentUser(userObj);
    if (userObj.role === 'customer') setCurrentView('marketplace');
    else if (userObj.role === 'volunteer') setCurrentView('volunteer_dashboard');
    else if (userObj.role === 'provider') setCurrentView('provider_dashboard');
    else if (userObj.role === 'admin') setCurrentView('admin_dashboard');

    showToast(`Logged in as ${userObj.name} (${userObj.role.toUpperCase()})`, 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'login') {
      // Find matching user or fallback to matching role
      const matched =
        users.find((u) => u.email === identifier || u.role === selectedRole) ||
        users[0];

      setCurrentUser(matched);
      if (matched.role === 'customer') setCurrentView('marketplace');
      else if (matched.role === 'volunteer') setCurrentView('volunteer_dashboard');
      else if (matched.role === 'provider') setCurrentView('provider_dashboard');
      else if (matched.role === 'admin') setCurrentView('admin_dashboard');

      showToast(`Welcome back, ${matched.name}!`, 'success');
    } else {
      // Simulated account creation
      const newUser = {
        id: `user_${Date.now()}`,
        name: name || 'Demo User',
        email: identifier,
        phone: phone || '+91 98300 12345',
        role: selectedRole,
        address: 'Kolkata, West Bengal',
      };
      setCurrentUser(newUser);
      if (selectedRole === 'customer') setCurrentView('marketplace');
      else if (selectedRole === 'volunteer') setCurrentView('volunteer_dashboard');
      else if (selectedRole === 'provider') setCurrentView('provider_dashboard');
      else if (selectedRole === 'admin') setCurrentView('admin_dashboard');

      showToast(`Account created successfully for ${newUser.name}!`, 'success');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-8 text-white text-center space-y-2 relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 mb-1">
            <Leaf className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">FoodCircle</h1>
          <p className="text-xs text-emerald-200 font-medium max-w-xs mx-auto">
            AI-powered smart food rescue and redistribution platform
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Role Selection Segmented Control */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { role: 'customer', label: 'Customer', icon: User },
                { role: 'volunteer', label: 'Volunteer', icon: Bike },
                { role: 'provider', label: 'Food Provider', icon: Building },
                { role: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    selectedRole === role
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      selectedRole === role ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-[11px] leading-none">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick 1-Click Demo Login Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              ⚡ Quick Demo 1-Click Login (Prototype Accounts)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u)}
                  className="px-2 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 transition truncate"
                  title={`Login as ${u.name} (${u.role})`}
                >
                  {u.name.split(' ')[0]} ({u.role[0].toUpperCase()})
                </button>
              ))}
            </div>
          </div>

          {/* Form Tabs: Login / Create Account */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-2.5 flex-1 text-center transition border-b-2 ${
                activeTab === 'login'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`pb-2.5 flex-1 text-center transition border-b-2 ${
                activeTab === 'signup'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name / Organization</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sen / Aroma Foods"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98300 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email or Phone</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@foodcircle.org or phone"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{activeTab === 'login' ? 'Login' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm">Account Password Help</h3>
            <p className="text-xs text-slate-500">
              For testing and quick access, you can sign in with your email or phone using default password: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-bold">demo1234</code>.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
