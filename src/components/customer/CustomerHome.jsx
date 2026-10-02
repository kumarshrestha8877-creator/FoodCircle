import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  TrendingDown,
  Leaf,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Flame,
  Clock,
  ChevronLeft,
  ChevronRight,
  Video,
  Star,
  Zap,
  Home,
  HeartHandshake,
  Building2,
  PlusCircle,
} from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';
import FoodCard from './FoodCard';
import FoodDetailModal from './FoodDetailModal';

const PROMO_BANNERS = [
  {
    id: 1,
    tag: '🍗 BANQUET NON-VEG RESCUE • HOT READY',
    title: 'Kolkata Dum Mutton Biryani with Egg & Potato',
    highlight: 'Flat ₹130 • Save 62%',
    subtitle: 'From Aroma Kitchen, Sector V • Royal mutton dum biryani sealed after evening banquet',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
    foodId: 'food_10',
    bgColor: 'from-rose-950/90 via-slate-900/80 to-slate-950',
    expiresIn: 'Ready for Immediate Pickup',
  },
  {
    id: 2,
    tag: '⚡ FLASH RESCUE • BANQUET SURPLUS',
    title: 'Royal Vegetable Dum Biryani with Salan',
    highlight: 'Flat ₹70 • Save 61%',
    subtitle: 'From Aroma Kitchen, Sector V • Freshly chilled & sealed after lunch banquet',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    foodId: 'food_1',
    bgColor: 'from-amber-900/90 via-slate-900/80 to-slate-950',
    expiresIn: '42 mins left',
  },
  {
    id: 3,
    tag: '🍛 TANDOORI CHEF SPECIAL • NON-VEG',
    title: 'Tandoori Butter Chicken & 3 Garlic Butter Naans',
    highlight: 'Full Combo at ₹115 (Save 62%)',
    subtitle: 'Park Street Heritage Diner • VIP banquet batch in insulated trays',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    foodId: 'food_11',
    bgColor: 'from-orange-950/90 via-slate-900/80 to-slate-950',
    expiresIn: 'Ready for Immediate Pickup',
  },
  {
    id: 4,
    tag: '🥐 ARTISAN BAKERY CLEARANCE',
    title: 'Artisan Butter Croissants & Berry Muffins',
    highlight: 'Box of 4 at ₹60 (Save ₹100)',
    subtitle: 'Baked fresh today at Royal Bengal Sweets & Bakery, Gariahat',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    foodId: 'food_3',
    bgColor: 'from-amber-950/90 via-slate-900/80 to-slate-950',
    expiresIn: '1 hr 15 mins left',
  },
  {
    id: 5,
    tag: '🥗 FARM-FRESH ORGANIC RESCUE',
    title: 'Seasonal Himalayan Fruit & Sprout Bowls',
    highlight: 'Nutrient-rich at ₹45 (Save 63%)',
    subtitle: 'Green Earth Organics, New Town • Cold-pressed freshness guaranteed',
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=1200&q=80',
    foodId: 'food_5',
    bgColor: 'from-emerald-950/90 via-slate-900/80 to-slate-950',
    expiresIn: '2 hrs left',
  },
];

const CATEGORY_ITEMS = [
  { name: 'All Surplus', icon: '🍽️', count: '15 items' },
  { name: 'Non-Veg Specials', icon: '🍗', count: '6 items' },
  { name: '🏡 Resident Surplus', icon: '🏡', count: 'Neighbour meals' },
  { name: 'Rice & Biryani', icon: '🍚', count: '3 items' },
  { name: 'Meals', icon: '🍱', count: '5 items' },
  { name: 'Bakery', icon: '🥐', count: '1 box' },
  { name: 'Snacks', icon: '🥪', count: '4 items' },
  { name: 'Fruits & Vegetables', icon: '🥗', count: '2 bowls' },
  { name: 'Packaged Food', icon: '📦', count: '1 pack' },
  { name: 'Other Surplus Food', icon: '🍯', count: '1 matka' },
];

export default function CustomerHome() {
  const { foodItems, setCurrentView, setActiveOrderId, addToCart, setIsCustomerListModalOpen } = useFoodCircle();

  const [selectedCategory, setSelectedCategory] = useState('All Surplus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('ALL'); // 'ALL', 'Veg', 'Non-Veg'
  const [onlyLiveVideo, setOnlyLiveVideo] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Auto-rotate promo banners like real consumer apps
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeBanner = PROMO_BANNERS[bannerIndex];

  // Helper to detect Non-Veg
  const isFoodNonVeg = (food) =>
    food.dietary === 'Non-Veg' ||
    food.isVeg === false ||
    food.name.toLowerCase().includes('chicken') ||
    food.name.toLowerCase().includes('mutton') ||
    food.name.toLowerCase().includes('fish') ||
    food.name.toLowerCase().includes('egg');

  // Filter & Sort Foods
  const filteredFoods = foodItems
    .filter((food) => {
      const isNonVeg = isFoodNonVeg(food);
      const matchesCategory =
        selectedCategory === 'All Surplus'
          ? true
          : selectedCategory === 'Non-Veg Specials'
          ? isNonVeg
          : selectedCategory === '🏡 Resident Surplus'
          ? !!food.isCustomerListing
          : food.category === selectedCategory;

      const matchesSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isNonVeg && searchQuery.toLowerCase().includes('non veg')) ||
        (isNonVeg && searchQuery.toLowerCase().includes('non-veg'));

      const matchesDiet =
        selectedDiet === 'ALL'
          ? true
          : selectedDiet === 'Veg'
          ? !isNonVeg
          : isNonVeg;

      const matchesVideo = !onlyLiveVideo || !!food.liveVideoUrl;

      return matchesCategory && matchesSearch && matchesDiet && matchesVideo;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.surplusPrice - b.surplusPrice;
      if (sortBy === 'discount') {
        const discA = (a.originalPrice - a.surplusPrice) / a.originalPrice;
        const discB = (b.originalPrice - b.surplusPrice) / b.originalPrice;
        return discB - discA;
      }
      return 0;
    });

  // Non-Veg Surplus Ready for Pickup items
  const nonVegReadyForPickup = foodItems.filter((f) => isFoodNonVeg(f));

  // Urgent Flash Rescues (items with low remaining stock)
  const flashDeals = foodItems.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6">
      {/* 1. APP HERO: PROMOTIONAL CAROUSEL BANNER (Commercial E-Commerce App Style) */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px] w-full overflow-hidden">
          <img
            src={activeBanner.image}
            alt={activeBanner.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${activeBanner.bgColor} opacity-90`} />

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-between text-white max-w-2xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/90 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                  {activeBanner.tag}
                </span>
                <span className="bg-black/40 text-emerald-300 font-semibold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeBanner.expiresIn}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {activeBanner.title}
              </h2>

              <p className="text-sm sm:text-base font-bold text-emerald-300">
                {activeBanner.highlight}
              </p>

              <p className="text-xs text-slate-300 hidden sm:block line-clamp-1">
                {activeBanner.subtitle}
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  const match = foodItems.find((f) => f.id === activeBanner.foodId) || foodItems[0];
                  setSelectedFoodForModal(match);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Rescue This Dish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-200 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Camera Verified</span>
              </div>
            </div>
          </div>

          {/* Banner Dot Indicators */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
            {PROMO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBannerIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  bannerIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. LOCAL RESIDENT SURPLUS & NGO RESCUE PROMINENT BANNER */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-5 sm:p-6 text-white border border-emerald-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                Local Residents & Hostels
              </span>
              <span className="bg-rose-500/20 text-rose-300 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-rose-400/30 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                Riders Carrying to NGOs
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
              Have Extra Food at Home or Hostel? Share with Neighbors or Donate to NGO Shelters!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cooked extra food or have party leftovers? List in 60 seconds with mandatory live camera verification (strictly no gallery photos). Offer to neighbors at affordable prices, or choose 100% Free Donation to partner shelters (Robin Hood Army, Hope Foundation) with volunteer riders dispatched for pickup!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => setIsCustomerListModalOpen(true)}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Share Home Surplus / Donate to NGO</span>
            </button>

            <button
              onClick={() => setSelectedCategory('🏡 Resident Surplus')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 backdrop-blur-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Neighbor Dishes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. APP CATEGORIES: REAL FOOD CIRCLES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Surplus Food Circles
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Verified fresh batches in Kolkata</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`group flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 flex-shrink-0 w-24 sm:w-28 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1.5 shadow-2xs transition-transform duration-300 group-hover:scale-110 ${
                    isSelected ? 'bg-emerald-600 scale-105' : 'bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                </div>
                <span
                  className={`text-xs font-bold leading-tight truncate w-full ${
                    isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-800'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. APP FILTER & SEARCH CONTROL BAR */}
      <section className="bg-white p-3.5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surplus biryani, artisan bake boxes, salads, combo meals..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs pb-1 md:pb-0">
            {/* All Diet Button */}
            <button
              onClick={() => {
                setSelectedDiet('ALL');
                setSelectedCategory('All Surplus');
              }}
              className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedDiet === 'ALL' && selectedCategory !== '🏡 Resident Surplus'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>All Items</span>
            </button>

            {/* Indian FSSAI Pure Veg Toggle */}
            <button
              onClick={() => setSelectedDiet(selectedDiet === 'Veg' ? 'ALL' : 'Veg')}
              className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedDiet === 'Veg'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              </span>
              <span>Pure Veg</span>
            </button>

            {/* Non-Veg Ready for Pickup Toggle */}
            <button
              onClick={() => setSelectedDiet(selectedDiet === 'Non-Veg' ? 'ALL' : 'Non-Veg')}
              className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedDiet === 'Non-Veg'
                  ? 'bg-red-50 text-red-900 border-red-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-3.5 h-3.5 border-2 border-red-600 flex items-center justify-center rounded-xs">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
              </span>
              <span>Non-Veg ({nonVegReadyForPickup.length})</span>
            </button>

            {/* Neighbor Surplus Quick Filter */}
            <button
              onClick={() => {
                if (selectedCategory === '🏡 Resident Surplus') {
                  setSelectedCategory('All Surplus');
                } else {
                  setSelectedCategory('🏡 Resident Surplus');
                }
              }}
              className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedCategory === '🏡 Resident Surplus'
                  ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>🏡 Neighbor Kitchens</span>
            </button>

            {/* Live Video Verified Filter */}
            <button
              onClick={() => setOnlyLiveVideo(!onlyLiveVideo)}
              className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                onlyLiveVideo
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-emerald-500" />
              <span>Live Video Only</span>
            </button>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Rescues</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="discount">Highest Savings %</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. DEDICATED SHOWCASE: MORE SURPLUS FOOD READY FOR PICKUP (NON-VEG SPECIALS) */}
      {selectedCategory === 'All Surplus' && selectedDiet === 'ALL' && !searchQuery && (
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 rounded-3xl p-5 sm:p-6 border border-red-500/30 text-white shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Hot & Fresh
                  </span>
                  <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                    More Surplus Food Ready for Pickup
                  </h3>
                </div>
                <p className="text-xs text-red-200/80">
                  Fresh royal mutton biryani, butter chicken & fish kalia • Strictly live camera verified • Ready for instant courier pickup
                </p>
              </div>

              <button
                onClick={() => setSelectedDiet('Non-Veg')}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>View All Non-Veg ({nonVegReadyForPickup.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Non-Veg Food Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {nonVegReadyForPickup.slice(0, 3).map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onOpenDetails={(item) => setSelectedFoodForModal(item)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. MAIN SURPLUS FOOD PRODUCT GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {selectedCategory === 'All Surplus'
                ? selectedDiet === 'Non-Veg'
                  ? 'Non-Veg Surplus Ready for Pickup'
                  : selectedDiet === 'Veg'
                  ? 'Pure Veg Surplus Meals Ready for Pickup'
                  : 'All Surplus Meals Ready for Pickup'
                : selectedCategory}
            </h2>
            <p className="text-xs text-slate-500">
              Cooked fresh today • Strictly zero gallery stock photos • Verified live camera proof
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredFoods.length} Available
          </span>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Leaf className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Surplus Items Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try clearing your filters or selecting "All Surplus" to view today's rescued batches.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Surplus');
                setSelectedDiet('ALL');
                setOnlyLiveVideo(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onOpenDetails={(item) => setSelectedFoodForModal(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Food Details Modal */}
      <FoodDetailModal
        food={selectedFoodForModal}
        isOpen={!!selectedFoodForModal}
        onClose={() => setSelectedFoodForModal(null)}
      />
    </div>
  );
}
