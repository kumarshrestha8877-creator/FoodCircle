# Contributing to FoodCircle

Thank you for your interest in contributing to **FoodCircle** — the AI-powered smart surplus-food rescue and redistribution platform! We welcome contributions from developers, designers, sustainability advocates, and food rescue volunteers.

---

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## 🛠️ Development Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher) or **pnpm**
* A modern browser with WebRTC and MediaDevices camera support (Chrome, Edge, Firefox, Brave)

### Getting Started

1. **Fork the Repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/foodcircle.git
   cd foodcircle
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.
5. **Verify the Build**:
   ```bash
   npm run build
   ```

---

## 🌿 Branching Strategy & Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/camera-watermark-enhancement
   # or
   git checkout -b fix/tracking-eta-calculation
   ```
2. Commit your changes using conventional commit messages:
   * `feat: add live video duration countdown timer`
   * `fix: prevent modal clipping in blurred containers`
   * `docs: update API documentation for order stages`
   * `style: polish hero banner button spacing`
3. Push to your fork:
   ```bash
   git push origin feature/camera-watermark-enhancement
   ```
4. Open a **Pull Request** against the `main` branch.

---

## 📐 Coding Standards & Guidelines

* **Component Architecture:** Reusable components reside in `src/components/common/`, while domain-specific components reside in `src/components/customer/`, `src/components/volunteer/`, `src/components/provider/`, and `src/components/admin/`.
* **State Management:** Core business logic, order progression, and cross-component modals are orchestrated via `src/context/FoodCircleContext.jsx`.
* **Anti-Scam Integrity:** **Never** provide gallery image upload fallbacks for food collection or resident surplus proofs. Camera access must always be requested via standard browser `navigator.mediaDevices.getUserMedia` to uphold food freshness verification standards.
* **Styling:** Use Tailwind CSS utility classes. Avoid arbitrary inline styles unless calculating dynamic layout coordinates (e.g. Map projection markers).
* **Linting:** Run `npm run lint` (`oxlint`) before submitting PRs.

---

## 🧪 Testing Checklist Before Submitting a PR

- [ ] Does `npm run build` succeed with exit code `0`?
- [ ] Does the Live Camera Verification work with browser permissions?
- [ ] Do simulated fallbacks function gracefully when testing on machines without a camera?
- [ ] Does the delivery stage progress correctly from Order Placed (1) to Delivered (9)?
- [ ] Does the direct Google Maps link open properly with valid latitude/longitude coordinates?
- [ ] Is the UI fully responsive across mobile, tablet, and desktop viewports?

---

## 💬 Getting Help & Discussions

* Open an issue using our [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) or [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) templates.
* Share suggestions in GitHub Discussions or join our community mission to eliminate urban food waste!
