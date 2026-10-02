# FoodCircle Data Models & Schemas

This document defines the core data schemas and state structures used throughout the FoodCircle platform.

---

## 1. User (`users`)

```typescript
interface User {
  id: string;               // e.g., 'usr_customer_1', 'usr_vol_1'
  name: string;             // e.g., 'Ananya Sen', 'Rahul Mukherjee'
  email: string;            // e.g., 'ananya.sen@example.com'
  phone: string;            // e.g., '+91 98301 23456'
  role: 'customer' | 'volunteer' | 'provider' | 'admin';
  avatar: string;           // Image URL
  address: string;          // Formatted address
  rating?: number;          // e.g., 4.9
  deliveriesCompleted?: number; // For volunteers
  mealsRescued?: number;    // Impact metric
}
```

---

## 2. Food Item (`food_items`)

```typescript
interface FoodItem {
  id: string;               // e.g., 'food_1', 'res_surplus_1'
  providerId: string;       // References Provider or User ID
  providerName: string;     // e.g., 'Aroma Kitchen', 'Mrs. Priya Roy (Resident)'
  providerType: 'restaurant' | 'banquet' | 'bakery' | 'hostel' | 'resident';
  name: string;             // e.g., 'Royal Vegetable Dum Biryani with Salan'
  category: string;         // 'Meals', 'Rice & Biryani', 'Snacks', 'Bakery', etc.
  dietary: 'Veg' | 'Non-Veg';
  isVeg: boolean;
  description: string;
  originalPrice: number;    // In INR (₹)
  surplusPrice: number;     // In INR (₹) (0 for direct NGO donations)
  discountPercent: number;  // e.g., 61%
  quantity: number;         // Available portions
  unit: string;             // 'portions', 'boxes', 'packets'
  pickupLocation: string;
  distanceKm: number;       // Relative distance
  prepTime: string;         // e.g., 'Ready now (banquet pack)'
  expiresIn: string;        // e.g., '42 mins left'
  image: string;            // Showcase photo URL
  liveProofVideoUrl?: string; // Blob URL or procedural stream
  liveVerified: boolean;    // Anti-scam verification status
  whySurplus: string;       // Reason for surplus listing
  isResidentSurplus?: boolean; // Listed by a local citizen
  isDirectNgoDonation?: boolean; // 100% free food rescue for shelters
}
```

---

## 3. Order (`orders`)

```typescript
interface Order {
  id: string;               // e.g., 'FC10245', 'NGO-RESCUE-901'
  customerId: string;       // Recipient User ID or Shelter ID
  customerName: string;
  customerPhone: string;
  items: Array<{
    foodId: string;
    name: string;
    quantity: number;
    surplusPrice: number;
    image: string;
  }>;
  totalAmount: number;      // Total in INR (₹)
  statusCode: number;       // Stage number from 1 to 9
  statusName: string;       // 'Order Placed', 'Food in Transit', 'Delivered', etc.
  volunteerId?: string;     // Assigned rider
  volunteerName?: string;
  volunteerPhone?: string;
  pickupLocation: string;
  destinationAddress: string;
  pickupCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
  riderCoords?: { lat: number; lng: number };
  etaMinutes: number;       // Estimated time of arrival
  orderedAt: string;        // ISO 8601 timestamp
  deliveredAt?: string;     // ISO 8601 timestamp
  pickupVerification?: {
    verified: boolean;
    timestamp: string;
    videoUrl: string;
    latitude: number;
    longitude: number;
    volunteerNotes?: string;
  };
  isNgoDelivery?: boolean;  // True if heading to a partner NGO
  ngoDetails?: {
    id: string;
    name: string;
    beneficiaries: string;
  };
}
```

---

## 4. Partner NGO (`partner_ngos`)

```typescript
interface PartnerNGO {
  id: string;               // e.g., 'ngo_1'
  name: string;             // e.g., 'Robin Hood Army - Salt Lake Chapter'
  tagline: string;          // e.g., 'Zero-waste volunteer community feeding shelters'
  beneficiaries: string;    // e.g., '120 children & senior citizens'
  address: string;
  contactPerson: string;
  contactPhone: string;
  verified: boolean;
}
```

---

## 5. Pickup Verification (`pickup_verifications`)

```typescript
interface PickupVerification {
  id: string;               // e.g., 'VERIF_FC10245'
  orderId: string;          // References Order
  volunteerId: string;
  videoBlobUrl: string;     // 3-second live camera recording
  capturedLatitude: number;
  capturedLongitude: number;
  accuracyMeters: number;
  capturedTimestamp: string;
  verificationStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
}
```
