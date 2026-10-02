# Changelog

All notable changes to the **FoodCircle** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-03

### Added
* **Surplus Food Marketplace:**
  - Real-time catalog with dynamic discounts (up to 65% off) for surplus banquet, restaurant, and bakery food.
  - Multi-category food circles: Meals, Rice & Biryani, Banquet Specials, Tandoori Combos, Bakery, Snacks, Fruits & Vegetables, and Resident Surplus.
  - Dietary filters (`All`, `Veg`, `Non-Veg`), real-time search, and distance sorting.
* **Mandatory Live Camera Verification (Anti-Scam Protocol):**
  - Integrated HTML5 `MediaDevices.getUserMedia` for capturing 3-second live collection proofs.
  - Disabled file-system / photo gallery uploads to eliminate food fraud and stale food listing.
  - Custom HTML5 video player with verified badge overlay, timestamp watermark, and pickup location tag.
  - Procedural WebRTC canvas video generator for seamless demonstration on devices without a physical webcam.
* **Resident Surplus & NGO Relief Missions:**
  - Capability for local households, hostels, and home cooks to list surplus food in 60 seconds.
  - Two distribution channels: Sell at affordable prices to neighbors or 100% Free Donation to partner NGOs (Robin Hood Army, The Hope Foundation, Kolkata Food Rescue Mission).
  - Automated volunteer dispatch for doorstep collection of donated portions to shelter centers.
* **Volunteer / Delivery Agent Portal:**
  - Dedicated volunteer dashboard showing active requests, distances, pickup instructions, and earnings/impact points.
  - Geolocation lock (`navigator.geolocation`) requiring volunteers to verify physical arrival at pickup before food collection can be confirmed.
* **Live Delivery Tracking & Maps:**
  - 9-stage delivery status timeline (Order Placed ➔ Volunteer Assigned ➔ Going to Pickup ➔ Reached Pickup ➔ Food Collected ➔ Pickup Verified ➔ In Transit ➔ Arrived ➔ Delivered).
  - Interactive road transit map with rider marker movement and real-time ETA.
  - Direct **Open in Google Maps** integration with auto-populated turn-by-turn navigation coordinates.
* **AI Quality Assistance Preview:**
  - Visual assessment indicator verifying packaging integrity, thermal steam presence, and hygienic sealing.
* **City Admin & Provider Dashboards:**
  - Comprehensive impact statistics: plates rescued, CO₂ emissions averted, partner shelters supported.
  - Audit trail to inspect video recordings and GPS timestamps for every order.

### Fixed
* Fixed modal clipping issue where `<CustomerListSurplusModal>` was trapped inside `<header>` due to CSS `backdrop-filter` containing block rules. Moved modal orchestration to root `App.jsx`.
* Fixed browser module loading when opening `index.html` via `file://` protocol by adding a smart friendly fallback guide and a one-click `Run-FoodCircle.bat` script.

---

## [0.9.0] - 2026-10-02
* Initial prototype architecture with React 19, Tailwind CSS 4, and mock data engine.
* Customer cart, simulated checkout, and order ID generation (`#FC10245`).
