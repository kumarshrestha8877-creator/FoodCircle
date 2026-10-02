import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_PROVIDERS,
  INITIAL_VOLUNTEERS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  PARTNER_NGOS,
  ORDER_STAGES,
} from '../data/mockData';

const FoodCircleContext = createContext(null);

export const useFoodCircle = () => {
  const context = useContext(FoodCircleContext);
  if (!context) {
    throw new Error('useFoodCircle must be used within a FoodCircleProvider');
  }
  return context;
};

export const FoodCircleProvider = ({ children }) => {
  // 1. Current logged-in user (default to Customer for clean initial experience)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fc_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Customer
  });

  // 2. Food items list (Ensure non-veg surplus items are merged into state)
  const [foodItems, setFoodItems] = useState(() => {
    const saved = localStorage.getItem('fc_food_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasNonVeg = parsed.some((f) => f.dietary === 'Non-Veg' || f.isVeg === false);
        if (hasNonVeg && parsed.length >= INITIAL_FOOD_ITEMS.length) {
          return parsed;
        }
        // Merge missing surplus non-veg items into existing storage
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingItems = INITIAL_FOOD_ITEMS.filter((item) => !existingIds.has(item.id));
        return [...parsed, ...missingItems];
      } catch (e) {
        return INITIAL_FOOD_ITEMS;
      }
    }
    return INITIAL_FOOD_ITEMS;
  });

  // 3. Providers list
  const [providers, setProviders] = useState(() => {
    const saved = localStorage.getItem('fc_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  // 4. Volunteers list
  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('fc_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  // 5. Orders list (Ensure NGO relief missions are merged into state)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('fc_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasNgoRun = parsed.some((o) => o.isNgoDelivery || o.id?.startsWith('NGO'));
        if (hasNgoRun) return parsed;
        const existingIds = new Set(parsed.map((o) => o.id));
        const missingNgoOrders = INITIAL_ORDERS.filter((o) => !existingIds.has(o.id));
        return [...missingNgoOrders, ...parsed];
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // 6. Partner NGOs list
  const [partnerNgos, setPartnerNgos] = useState(() => {
    const saved = localStorage.getItem('fc_partner_ngos');
    return saved ? JSON.parse(saved) : PARTNER_NGOS;
  });

  // 7. Shopping Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('fc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 7. Active tracked order ID (for quick jumps)
  const [activeOrderId, setActiveOrderId] = useState(() => {
    const saved = localStorage.getItem('fc_active_order_id');
    return saved || 'FC10245'; // default to active demonstration delivery
  });

  // 8. Navigation state
  const [currentView, setCurrentView] = useState('marketplace'); // 'marketplace', 'food_detail', 'cart', 'my_orders', 'live_tracking', 'volunteer_dashboard', 'provider_dashboard', 'admin_dashboard', 'login'
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [viewingProofOrder, setViewingProofOrder] = useState(null);
  const [impactCelebrationOrder, setImpactCelebrationOrder] = useState(null);
  const [isCustomerListModalOpen, setIsCustomerListModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('fc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fc_food_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('fc_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('fc_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('fc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fc_active_order_id', activeOrderId);
  }, [activeOrderId]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch Role Helper
  const switchRole = (role) => {
    const target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
    if (role === 'customer') {
      setCurrentView('marketplace');
    } else if (role === 'volunteer') {
      setCurrentView('volunteer_dashboard');
    } else if (role === 'provider') {
      setCurrentView('provider_dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin_dashboard');
    }
    showToast(`Switched view to ${target.name} (${role.toUpperCase()})`, 'info');
  };

  // Cart operations
  const addToCart = (food, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
    showToast(`Added ${food.name} to cart!`);
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const updateCartQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Cart financial computations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.food.surplusPrice * item.quantity,
    0
  );
  const cartOriginalTotal = cart.reduce(
    (sum, item) => sum + item.food.originalPrice * item.quantity,
    0
  );
  const cartSavedAmount = cartOriginalTotal - cartSubtotal;
  const deliveryFee = cart.length > 0 ? 15 : 0;
  const platformFee = cart.length > 0 ? 5 : 0;
  const cartGrandTotal = cartSubtotal + deliveryFee + platformFee;
  const cartEstimatedWeightKg = (cart.reduce((sum, item) => sum + item.quantity, 0) * 0.75).toFixed(1);

  // Place Order
  const placeOrder = ({ address, phone, paymentMethod }) => {
    if (cart.length === 0) return null;

    const newOrderNumber = Math.floor(10247 + Math.random() * 900);
    const orderId = `FC${newOrderNumber}`;
    const primaryItem = cart[0].food;

    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newOrder = {
      id: orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: phone || currentUser.phone,
      destination: address || currentUser.address || 'Park Circus 7-Point, Kolkata',
      destinationCoords: { lat: 22.5435, lng: 88.3685 },
      items: cart.map((c) => ({
        foodId: c.food.id,
        name: c.food.name,
        quantity: c.quantity,
        price: c.food.surplusPrice,
        originalPrice: c.food.originalPrice,
        providerId: c.food.providerId,
        providerName: c.food.providerName,
        image: c.food.image,
      })),
      itemTotal: cartSubtotal,
      deliveryFee,
      platformFee,
      total: cartGrandTotal,
      savedAmount: cartSavedAmount,
      foodWeightKg: parseFloat(cartEstimatedWeightKg),
      paymentMethod: paymentMethod || 'Simulated UPI (foodcircle@icici)',
      status: 'Order Placed',
      statusCode: 1, // Order Placed
      volunteerId: null,
      volunteerName: 'Awaiting volunteer',
      pickupLocation: primaryItem.pickupLocation,
      pickupCoords: primaryItem.pickupCoords,
      distanceKm: (3.0 + Math.random() * 2.5).toFixed(1),
      estimatedMinutes: 20,
      timestamp: timeString,
      pickupVerification: null,
      trackingProgress: 0,
      trackingMode: 'demo',
      currentRiderCoords: primaryItem.pickupCoords,
    };

    // Deduct stock
    setFoodItems((prev) =>
      prev.map((f) => {
        const cartMatch = cart.find((c) => c.food.id === f.id);
        if (cartMatch) {
          return { ...f, quantity: Math.max(0, f.quantity - cartMatch.quantity) };
        }
        return f;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderId(orderId);
    showToast(`Order #${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  // Volunteer operations
  const volunteerAcceptOrder = (orderId, volunteer = volunteers[0]) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'Volunteer Assigned',
            statusCode: 2,
            volunteerId: volunteer.id,
            volunteerName: volunteer.name,
            volunteerPhone: volunteer.phone,
            volunteerVehicle: volunteer.vehicle,
            volunteerAvatar: volunteer.avatar,
          };
        }
        return ord;
      })
    );
    showToast(`Order #${orderId} accepted by ${volunteer.name}!`);
  };

  const volunteerGoingToPickup = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'Volunteer Going to Pickup', statusCode: 3 }
          : ord
      )
    );
    showToast(`Rider heading to food provider location`);
  };

  const volunteerReachedPickup = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'Volunteer Reached Pickup Location', statusCode: 4 }
          : ord
      )
    );
    showToast(`Rider arrived at pickup! Mandatory camera verification required.`);
  };

  // Mandatory Pickup Proof Submission
  const submitPickupProof = (orderId, proofData) => {
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const verification = {
            verified: true,
            verifiedAt: timeString,
            volunteerId: ord.volunteerId || 'vol_1',
            volunteerName: ord.volunteerName || 'Rahul Sharma',
            coords: proofData.coords || ord.pickupCoords,
            locationName: proofData.locationName || ord.pickupLocation,
            videoUrl: proofData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            videoDurationSec: proofData.videoDurationSec || 4.5,
            note: proofData.note || 'Food container seal and temperature inspected. Verified in accordance with FoodCircle protocol.',
            isRealUpload: !!proofData.isRealUpload,
          };

          return {
            ...ord,
            pickupVerification: verification,
            status: 'Food in Transit', // Step 7
            statusCode: 7,
            trackingProgress: 0.1,
            currentRiderCoords: ord.pickupCoords,
          };
        }
        return ord;
      })
    );
    showToast('Pickup Proof Submitted & Verified ✓ Food in Transit!', 'success');
  };

  // Update Rider Location along route
  const updateRiderProgress = (orderId, progress, coords) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let newStatus = ord.status;
          let newCode = ord.statusCode;

          if (progress >= 0.98) {
            newStatus = 'Delivered';
            newCode = 9;
          } else if (progress >= 0.8) {
            newStatus = 'Arriving at Destination';
            newCode = 8;
          } else {
            newStatus = 'Food in Transit';
            newCode = 7;
          }

          const now = new Date();
          const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

          const updated = {
            ...ord,
            status: newStatus,
            statusCode: newCode,
            trackingProgress: progress,
            currentRiderCoords: coords || ord.currentRiderCoords,
            estimatedMinutes: newCode === 9 ? 0 : Math.max(1, Math.round(15 * (1 - progress))),
            deliveredAt: newCode === 9 ? (ord.deliveredAt || timeString) : ord.deliveredAt,
          };

          // If freshly transitioned to Delivered, trigger impact celebration modal
          if (newCode === 9 && ord.statusCode !== 9) {
            setTimeout(() => {
              setImpactCelebrationOrder(updated);
            }, 300);
          }

          return updated;
        }
        return ord;
      })
    );
  };

  // Confirm Delivery
  const confirmDelivery = (orderId) => {
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let completedOrder = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          completedOrder = {
            ...ord,
            status: 'Delivered',
            statusCode: 9,
            trackingProgress: 1.0,
            deliveredAt: timeString,
          };
          return completedOrder;
        }
        return ord;
      })
    );

    if (completedOrder) {
      setImpactCelebrationOrder(completedOrder);
    }
    showToast('Food Delivered Successfully ✓ Waste Reduced!', 'success');
  };

  // Food Provider Operations
  const addFoodItem = (newItem) => {
    const id = `food_${Date.now()}`;
    const item = {
      ...newItem,
      id,
      aiChecked: true,
      aiAssessment: {
        status: 'Visual quality assessment completed',
        score: 97,
        packaging: 'Sealed food container verified',
        freshnessVisual: 'Optimal color and packaging integrity',
        timestamp: new Date().toLocaleTimeString(),
      },
    };
    setFoodItems((prev) => [item, ...prev]);
    showToast(`"${newItem.name}" added to surplus listings!`);
  };

  // Local Customer Food Listing & NGO Dispatch
  const listCustomerSurplus = (foodData, directNgo = false, targetNgoId = 'ngo_1') => {
    const newFoodId = `cust_food_${Date.now()}`;
    const selectedNgo = partnerNgos.find((n) => n.id === targetNgoId) || partnerNgos[0];

    const newItem = {
      id: newFoodId,
      providerId: currentUser.id,
      providerName: `${currentUser.name} (Local Resident / Neighbor)`,
      isCustomerListing: true,
      name: foodData.name,
      category: foodData.category || 'Meals',
      description: foodData.description,
      originalPrice: Number(foodData.originalPrice) || 120,
      surplusPrice: directNgo ? 0 : (Number(foodData.surplusPrice) || 30),
      quantity: Number(foodData.quantity) || 2,
      unit: foodData.unit || 'boxes',
      prepTime: 'Immediate Pickup',
      pickupLocation: foodData.pickupLocation || currentUser.address || 'Kolkata, WB',
      pickupCoords: foodData.pickupCoords || currentUser.coords || { lat: 22.5435, lng: 88.3685 },
      availableUntil: foodData.availableUntil || 'Today, 11:00 PM',
      dietary: foodData.dietary || 'Veg',
      isVeg: foodData.dietary !== 'Non-Veg',
      image: foodData.snapshotUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      liveVideoUrl: foodData.liveVideoUrl,
      antiScamVerified: true,
      liveRecordedAt: foodData.liveTimestamp || 'Just Now (Live Camera)',
      whySurplus: foodData.whySurplus || 'Home-cooked surplus shared to eliminate edible food waste.',
      aiChecked: true,
      aiAssessment: {
        status: 'Visual quality assessment completed',
        score: 97,
        packaging: 'Clean food-grade home container',
        freshnessVisual: 'Live camera verified • Freshly prepared',
        timestamp: 'Just Now',
      },
    };

    setFoodItems((prev) => [newItem, ...prev]);

    // If direct to NGO, immediately spawn an NGO rescue delivery run for volunteer riders!
    if (directNgo) {
      const ngoRunId = `NGO-RUN-${Math.floor(100 + Math.random() * 900)}`;
      const now = new Date();
      const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const ngoOrder = {
        id: ngoRunId,
        orderType: 'ngo_rescue',
        isNgoDelivery: true,
        ngoId: selectedNgo.id,
        ngoName: selectedNgo.name,
        ngoCoordinator: selectedNgo.coordinator,
        beneficiaries: selectedNgo.beneficiaries,
        destination: selectedNgo.address,
        destinationCoords: selectedNgo.coords,
        customerName: `${currentUser.name} (Resident Donation)`,
        customerPhone: currentUser.phone,
        pickupLocation: newItem.pickupLocation,
        pickupCoords: newItem.pickupCoords,
        items: [
          {
            foodId: newItem.id,
            name: newItem.name,
            quantity: newItem.quantity,
            price: 0,
            originalPrice: newItem.originalPrice,
            providerId: currentUser.id,
            providerName: newItem.providerName,
            image: newItem.image,
          },
        ],
        itemTotal: 0,
        deliveryFee: 0,
        platformFee: 0,
        total: 0,
        savedAmount: newItem.originalPrice * newItem.quantity,
        foodWeightKg: (newItem.quantity * 0.5).toFixed(1),
        paymentMethod: 'Free Community Rescue Donation to NGO',
        status: 'Order Placed',
        statusCode: 1,
        volunteerId: null,
        volunteerName: 'Awaiting volunteer rider',
        distanceKm: 3.5,
        estimatedMinutes: 15,
        timestamp: timeString,
        pickupVerification: null,
      };

      setOrders((prev) => [ngoOrder, ...prev]);
      setActiveOrderId(ngoRunId);
      showToast(`Surplus listed & NGO Rescue Run #${ngoRunId} dispatched!`, 'success');
      return { food: newItem, ngoOrder };
    }

    showToast(`Your surplus food is now live in the FoodCircle Marketplace!`, 'success');
    return { food: newItem };
  };

  const createNgoRescueMission = (params) => {
    const ngoRunId = `NGO-RUN-${Math.floor(100 + Math.random() * 900)}`;
    const selectedNgo = partnerNgos.find((n) => n.id === params.ngoId) || partnerNgos[0];
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const ngoOrder = {
      id: ngoRunId,
      orderType: 'ngo_rescue',
      isNgoDelivery: true,
      ngoId: selectedNgo.id,
      ngoName: selectedNgo.name,
      ngoCoordinator: selectedNgo.coordinator,
      beneficiaries: selectedNgo.beneficiaries,
      destination: selectedNgo.address,
      destinationCoords: selectedNgo.coords,
      customerName: params.donorName || `${currentUser.name} (Surplus Donation)`,
      customerPhone: currentUser.phone || '+91 98300 00000',
      pickupLocation: params.pickupLocation || 'Sector V, Salt Lake, Kolkata',
      pickupCoords: params.pickupCoords || { lat: 22.5804, lng: 88.4378 },
      items: params.items || [],
      itemTotal: 0,
      deliveryFee: 0,
      platformFee: 0,
      total: 0,
      savedAmount: params.savedAmount || 1500,
      foodWeightKg: params.foodWeightKg || 5.0,
      paymentMethod: 'Free NGO Sponsorship (FoodCircle Impact Fund)',
      status: 'Order Placed',
      statusCode: 1,
      volunteerId: null,
      volunteerName: 'Awaiting volunteer rider',
      distanceKm: 4.5,
      estimatedMinutes: 15,
      timestamp: timeString,
      pickupVerification: null,
    };

    setOrders((prev) => [ngoOrder, ...prev]);
    setActiveOrderId(ngoRunId);
    showToast(`Dispatched NGO Rescue Mission #${ngoRunId} to ${selectedNgo.name}!`, 'success');
    return ngoOrder;
  };

  const removeFoodItem = (id) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Listing removed successfully');
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    localStorage.clear();
    setFoodItems(INITIAL_FOOD_ITEMS);
    setProviders(INITIAL_PROVIDERS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setCurrentUser(INITIAL_USERS[0]);
    setActiveOrderId('FC10245');
    setCurrentView('marketplace');
    showToast('Reset to pristine demonstration data!', 'info');
  };

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  return (
    <FoodCircleContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users: INITIAL_USERS,
        foodItems,
        providers,
        volunteers,
        partnerNgos,
        orders,
        activeOrderId,
        setActiveOrderId,
        activeOrder,
        currentView,
        setCurrentView,
        selectedFoodItem,
        setSelectedFoodItem,
        viewingProofOrder,
        setViewingProofOrder,
        impactCelebrationOrder,
        setImpactCelebrationOrder,
        isCustomerListModalOpen,
        setIsCustomerListModalOpen,
        toastMessage,
        showToast,
        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartOriginalTotal,
        cartSavedAmount,
        deliveryFee,
        platformFee,
        cartGrandTotal,
        cartEstimatedWeightKg,
        // Actions
        placeOrder,
        volunteerAcceptOrder,
        volunteerGoingToPickup,
        volunteerReachedPickup,
        submitPickupProof,
        updateRiderProgress,
        confirmDelivery,
        addFoodItem,
        listCustomerSurplus,
        createNgoRescueMission,
        removeFoodItem,
        resetToDemoData,
        ORDER_STAGES,
      }}
    >
      {children}
    </FoodCircleContext.Provider>
  );
};
