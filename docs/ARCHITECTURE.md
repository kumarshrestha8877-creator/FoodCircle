# FoodCircle System Architecture

This document provides a detailed technical overview of the architecture, data models, state machines, and verification pipelines implemented in **FoodCircle**.

---

## 🏛️ High-Level System Architecture

```mermaid
flowchart TD
    subgraph Users & Portals
        C[Customer Portal]
        V[Volunteer / Rider Portal]
        P[Food Provider Portal]
        A[City Admin Console]
        R[Resident & Hostel Cook]
    end

    subgraph State & Context Layer
        FC[FoodCircleContext]
        LS[(Browser LocalStorage Persistence)]
        FC <--> LS
    end

    subgraph Core Engines
        VM[Anti-Scam Video Proof Engine\ngetUserMedia + WebRTC Canvas]
        GPS[Geolocation & Live Route Engine\nHTML5 Geo + Leaflet + Google Maps]
        AI[AI Quality Assistant Preview\nVisual Assessment]
        SM[Order Lifecycle State Machine\nStages 1 to 9]
    end

    subgraph Distribution Destinations
        BUYER[Local Customers]
        NGO[Partner Shelter Homes\nRobin Hood Army / Hope Foundation]
    end

    C --> FC
    V --> FC
    P --> FC
    A --> FC
    R --> FC

    FC --> VM
    FC --> GPS
    FC --> AI
    FC --> SM

    SM --> BUYER
    SM --> NGO
```

---

## 🔄 Order Lifecycle State Machine

Every order moves through a strict 9-stage sequence with enforced verification checkpoints:

```mermaid
stateDiagram-v2
    [*] --> Stage1_OrderPlaced: Customer / NGO Mission Created
    Stage1_OrderPlaced --> Stage2_VolunteerAssigned: Rider accepts delivery
    Stage2_VolunteerAssigned --> Stage3_GoingToPickup: Rider navigates to kitchen
    Stage3_GoingToPickup --> Stage4_ReachedPickup: Geolocation within proximity
    Stage4_ReachedPickup --> Stage5_FoodCollected: Live Camera Video Recorded
    Stage5_FoodCollected --> Stage6_PickupVerified: Proof sealed with GPS & Timestamp
    Stage6_PickupVerified --> Stage7_InTransit: Live Road Tracking active
    Stage7_InTransit --> Stage8_ArrivingAtDestination: Rider within 500m
    Stage8_ArrivingAtDestination --> Stage9_Delivered: Recipient confirmation
    Stage9_Delivered --> [*]: Confetti Celebration & Impact Logged
```

### Stage Details

| Code | Stage Name | Description | Enforced Action / Checkpoint |
| ---- | ---------- | ----------- | ---------------------------- |
| **1** | `Order Placed` | Customer places order or household lists NGO donation. | Order ID generated (`#FC10245`). |
| **2** | `Volunteer Assigned` | Volunteer reviews pickup address, distance, and accepts. | Assigned volunteer ID mapped to order. |
| **3** | `Volunteer Going to Pickup` | Rider starts transit toward provider or resident kitchen. | Route calculated; ETA displayed to customer. |
| **4** | `Volunteer Reached Pickup Location` | Rider physically arrives at the pickup address. | Location verified via browser Geolocation. |
| **5** | `Food Collected` | Food handed over to rider. | **Locked:** Cannot collect without recording proof. |
| **6** | `Pickup Verified` | Live 3-second video recorded and location coordinates stamped. | Proof watermark generated; viewable by customer & admin. |
| **7** | `Food in Transit` | Rider journeys toward customer address or NGO shelter. | Real-time map rider movement and Google Maps route link. |
| **8** | `Arriving at Destination` | Rider reaches destination perimeter. | Final delivery reminder sent. |
| **9** | `Delivered` | Recipient accepts package. | Confetti celebration modal & environmental impact counter updated. |

---

## 🛡️ Anti-Scam Live Video Verification Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Provider as Food Provider / Resident
    participant App as FoodCircle UI
    participant Browser as Browser MediaDevices API
    participant Engine as WebRTC Video Engine
    participant Context as FoodCircleContext

    Provider->>App: Click "+ Share Surplus" or "Verify Pickup"
    App->>Browser: Request camera permission (navigator.mediaDevices.getUserMedia)
    alt Permission Granted
        Browser-->>App: Return MediaStream (Webcam/Mobile Camera)
        App->>Provider: Display Live Camera Preview (No Gallery Input)
        Provider->>App: Record 3-Second Food Video
        App->>Engine: Stream video frames to MediaRecorder
        Engine-->>App: Produce video blob + snapshot thumbnail
    else Permission Denied / No Camera
        App->>Engine: Fallback to procedural WebRTC Canvas Generator
        Engine-->>App: Generate timestamped sample food video stream
    end
    App->>Context: Save proof with GPS coords, timestamp & verification seal
    Context-->>App: Mark listing / pickup as "Live Verified ✓"
```

---

## 🗺️ Live Delivery Tracking & Google Maps Architecture

The tracking subsystem combines two complementary approaches:
1. **Interactive In-App Road Route Map:**
   * Utilizes Leaflet coordinates across Kolkata metropolitan checkpoints (Salt Lake Sector V, Park Street, New Town, Gariahat).
   * Renders pulsating origin (pickup), destination (customer/shelter), and dynamic rider vehicle marker with animated SVG paths.
2. **Direct Google Maps Deep Link:**
   * Generates dynamic routing URLs:
     `https://www.google.com/maps/dir/?api=1&origin={lat},{lng}&destination={destLat},{destLng}&travelmode=two_wheeler`
   * Gives riders and customers real-time turn-by-turn navigation in native Google Maps with a single click.

---

## 📂 Source Code Structure

* `src/context/FoodCircleContext.jsx`: Single source of truth managing users, listings, cart, orders, and modal visibility states.
* `src/components/customer/CustomerListSurplusModal.jsx`: Full-screen dialog with direct camera integration for resident food sharing and NGO donation dispatch.
* `src/components/volunteer/PickupVerificationModal.jsx`: Rider pickup verification requiring live camera proof before status advancement.
* `src/components/common/LiveTrackingMap.jsx`: Dual-mode live route tracking (visual map canvas + external Google Maps routing).
* `src/utils/videoProofGenerator.js`: Procedural canvas video synthesizer ensuring testability on development machines lacking hardware webcams.
