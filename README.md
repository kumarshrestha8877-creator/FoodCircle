# 🍲 FoodCircle — AI-Powered Smart Food Rescue & Redistribution Platform

> **"Rescue Good Food. Reduce Waste. Create Impact."**
> A modern web application connecting restaurants, banquet halls, hostels, and local residents with customers and partner NGOs to eliminate urban food waste at affordable prices.

---

## 📚 Repository Documentation Index

| Document | Purpose |
| :--- | :--- |
| 🏗️ **[System Architecture](docs/ARCHITECTURE.md)** | State machine (Stages 1-9), camera proof pipeline & map routing design |
| 🗄️ **[Data Models & Schemas](docs/DATA_MODELS.md)** | TypeScript interfaces for Users, Food Items, Orders, and NGO Missions |
| 🤝 **[Contributing Guide](CONTRIBUTING.md)** | Development workflow, branching model, and PR guidelines |
| 📜 **[Code of Conduct](CODE_OF_CONDUCT.md)** | Community pledge and standards (Contributor Covenant 2.0) |
| 🛡️ **[Security Policy](SECURITY.md)** | Anti-scam verification protocols, privacy, and vulnerability reporting |
| 📝 **[Changelog](CHANGELOG.md)** | Version 1.0.0 release notes, new features, and bug fixes |
| ⚖️ **[License (MIT)](LICENSE)** | Open-source MIT software license |

---

## 👥 Demo Accounts & Roles

FoodCircle comes preloaded with realistic demonstration profiles. You can switch between them instantly using the floating **App Portal Switcher** in the bottom-right corner or on the login screen:

* **Customer:** `ananya.sen@example.com` (Orders meals, tracks live delivery, inspects pickup video proofs)
* **Volunteer / Delivery Rider:** `rahul.mukherjee@example.com` (Accepts requests, locks GPS, records live camera proof)
* **Food Provider / Banquet:** `manager@aromakitchen.com` (Lists surplus meals, tracks revenue, reviews rescue metrics)
* **City Administrator:** `admin@foodcircle.org` (Audits camera proofs, monitors city-wide CO₂ reduction)

## 🌟 Key Features

### 1. 🛒 Customer Surplus Food Marketplace
* **Affordable Surplus Orders:** Up to 65% off on freshly prepared surplus meals from top restaurants, banquet caterers, bakeries, and organic farms.
* **Diverse Cuisine & Categories:** Kolkata Dum Biryani, Banquet Specials, Tandoori Combos, Rice & Curries, Snacks, Bakery Boxes, and Fresh Produce.
* **Dietary Filtering & Search:** Quick toggle between All, Pure Veg, and Non-Veg items with instant keyword search and distance sorting.

### 2. 🛡️ Mandatory Live Video Verification (Anti-Scam Protocol)
* **Live Camera Access Only:** Providers and local residents must capture a real-time 3-second live video proof of the food package.
* **Strict Anti-Fraud Protection:** File picker / photo gallery uploads are completely disabled to prevent fraudulent uploads of stale or fake food images.
* **Inspection Details:** Embedded watermarks showing timestamp, GPS coordinates, and camera verification seals.
* **AI Quality Assistance:** Visual freshness, temperature indicators, and hygienic packaging analysis.

### 3. 🏡 Local Resident Surplus & NGO Rescue Missions
* **Hostels & Home Cooks:** Any resident can list extra food in under 60 seconds with live camera verification.
* **Neighbor Marketplace:** Sell surplus home-cooked portions to verified neighbors at nominal prices.
* **100% Free NGO Donations:** Option to donate food directly to partner shelters (*Robin Hood Army*, *The Hope Foundation*, *Kolkata Food Rescue Mission*).
* **Volunteer Rider Dispatch:** Automatic dispatch of volunteer riders to pick up donated food from home doors and deliver straight to orphanages and shelter homes.

### 4. 🚴 Volunteer & Delivery Agent Dashboard
* **Real-Time Delivery Requests:** Distance, pickup restaurant/home, destination address, and urgency tags.
* **Step-by-Step Flow:** Accept Delivery ➔ Going to Pickup ➔ Reached Pickup ➔ Mandatory Pickup Verification ➔ Transit ➔ Confirm Delivery.
* **Live Geolocation Verification:** Volunteer location is locked via HTML5 Geolocation with timestamp before food collection can be confirmed.

### 5. 🗺️ Live Delivery Tracking with Interactive Map & Google Maps
* **Live Rider Transit:** Visual progress marker moving along an interactive road path from pickup to doorstep.
* **Direct Google Maps Access:** One-click button to open exact turn-by-turn directions in Google Maps (`https://www.google.com/maps/dir/...`).
* **Delivery Timeline:** 9-stage progression tracker with real-time status badges, estimated arrival times, and rider contact options.
* **View Pickup Proof:** Customers can inspect the volunteer's video recording and collection timestamp before the food arrives.

### 6. 🏢 Food Provider & Banquet Portal
* **Listing Management:** Add surplus meals with expiration countdown timers, discounted pricing, and portion caps.
* **Quick Metrics:** Active surplus items, portions rescued, revenue recovered, and food waste averted (in kg).

### 7. 📊 City Administration Console
* **City Impact Dashboard:** Real-time statistics across total orders, active volunteer fleet, partner NGOs, and CO₂ emissions prevented.
* **Audit & Proof Log:** Full oversight of every delivery's camera verification video and GPS coordinates.

---

## 🛠️ Tech Stack

* **Framework:** React 19 + Vite 8
* **Styling:** Tailwind CSS 4
* **Icons:** Lucide React
* **Media & Verification:** HTML5 MediaDevices API (`getUserMedia`), Canvas WebRTC recording engine, and custom HTML5 video player with verified badge overlay
* **Mapping:** Leaflet & Google Maps external routing integration
* **Celebration Effects:** Canvas Confetti

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 1. Clone or Download Repository
```bash
git clone https://github.com/your-username/foodcircle.git
cd foodcircle
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production assets will be built in the `dist/` directory.

---

## 📂 Project Structure

```
foodcircle/
├── public/                     # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/                 # App banners and logo assets
│   ├── components/
│   │   ├── admin/              # Admin console and verification audit logs
│   │   │   └── AdminDashboard.jsx
│   │   ├── auth/               # Role-based login and demo account switcher
│   │   │   └── LoginPage.jsx
│   │   ├── common/             # Reusable UI components
│   │   │   ├── AppPortalSwitcher.jsx  # Floating quick role switcher
│   │   │   ├── FoodVideoPlayer.jsx    # Custom video player with proof watermarks
│   │   │   ├── LiveTrackingMap.jsx    # Interactive map with Google Maps integration
│   │   │   ├── Navbar.jsx             # Top bar with Cart, City selector & Surplus share
│   │   │   ├── Toast.jsx              # System alert toasts
│   │   │   └── ViewPickupProofModal.jsx # Customer popup to inspect collection proof
│   │   ├── customer/           # Customer marketplace & ordering
│   │   │   ├── CartCheckout.jsx
│   │   │   ├── CustomerHome.jsx
│   │   │   ├── CustomerListSurplusModal.jsx # Resident surplus + live camera listing
│   │   │   ├── FoodCard.jsx
│   │   │   ├── FoodDetailModal.jsx
│   │   │   ├── ImpactModal.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   └── OrderTrackingView.jsx
│   │   ├── provider/           # Restaurant surplus management
│   │   │   └── ProviderDashboard.jsx
│   │   └── volunteer/          # Rider pickup & delivery flow
│   │       ├── PickupVerificationModal.jsx # Live camera recording for volunteers
│   │       └── VolunteerDashboard.jsx
│   ├── context/
│   │   └── FoodCircleContext.jsx # Global state management & order lifecycle
│   ├── data/
│   │   └── mockData.js         # Realistic surplus dishes, NGOs, and demo orders
│   ├── utils/
│   │   └── videoProofGenerator.js # Procedural fallback video generator with canvas
│   ├── App.css
│   ├── App.jsx                 # App root and modal orchestration
│   ├── index.css               # Global Tailwind CSS configurations
│   └── main.jsx
├── .gitignore                  # Git ignore rules (node_modules, dist, logs)
├── index.html                  # HTML entrypoint
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

---

## 🌿 Impact Metrics Simulated

* **Meals Rescued:** 1,280+ plates
* **CO₂ Emissions Prevented:** 3,200+ kg
* **Partner NGOs Fed:** 12 shelter centers across Kolkata & New Town
* **Active Community Rescuers:** 420+ restaurants & households

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
