# GlowVAI V2 — Product Requirements Document (PRD)

## 1. Executive Summary & Product Vision
GlowVAI V2 is an AI-powered personalized skincare e-commerce & quick-commerce mobile platform built for Android using React Native (Expo) and Firebase.
The app combines computer vision skin analysis with hyper-personalized skincare product recommendations, delivering orders through:
- **Quick-Commerce (Vijayawada Only)**: Ultra-fast local delivery for serviceable pin codes / geofence polygons, supported vendors, and in-stock items.
- **Standard E-Commerce (Pan-India)**: National delivery for all other areas across India.
- **Student Referral Program**: Tiered rewards and referral coins upon verified order completion.
- **Admin-Controlled Beauty Protection**: Optional warranty/guarantee on eligible skincare products.

---

## 2. Core Product Capabilities

### 2.1 Authentication & Profile Management
- **Phone-Number Authentication**: Secure Firebase Phone Auth with OTP verification.
- **User Profile**: Name, gender, age range, skin profile history, saved addresses with coordinates, notification preferences.
- **Consent & Onboarding**: Explicit consent prompts for camera access, location permissions, terms of service, privacy policy, and medical disclaimer.

### 2.2 AI Face Scan & Skin Health Diagnostics
- **Guided Capture Flow**: Real-time camera framing guidance (lighting, centering, distance).
- **CNN Inference**: Local or Cloud Function-backed Convolutional Neural Network analyzing:
  - Acne severity & type
  - Hyperpigmentation / Dark spots
  - Oiliness vs. Dryness levels
  - Texture & pore health
- **Explainable Skin Report**:
  - Visual breakdown with identified areas of concern.
  - Transparent explanations (why a condition was flagged).
  - Medical Disclaimer: "GlowVAI provides cosmetic analysis, not clinical medical diagnosis."
- **Strict Anti-Dummy Standard**: No randomized or hard-coded diagnostic mockups. If the model or image input fails, report authentic error states.

### 2.3 Skincare Product Recommendations
- Dynamic matching of user diagnostic vectors to certified skincare ingredients and products.
- Clear ingredient breakdown and explainability ("Recommended because your scan indicated dry patches...").
- Integrated catalogue supporting both quick-commerce and standard delivery.

### 2.4 Hybrid Delivery System (Quick-Commerce vs. Pan-India)
- **Vijayawada Quick-Commerce**:
  - Active only within verified geospatial polygons / coordinates in Vijayawada.
  - Dependent on local partner store stock, vendor operational status, and active delivery hours.
  - Transparent realistic time estimates (only promises <60 mins if verified operational capacity exists).
- **Pan-India Standard Delivery**:
  - Covers all valid Indian pin codes.
  - Estimated delivery: 3–7 business days via national courier integration.
- **Unified Checkout**: Unified cart experience seamlessly determining delivery tier per product/vendor availability.

### 2.5 Student Referral Program
- Unique student referral codes/links.
- Referral Coin wallet credited only **after** qualifying purchase is delivered and return window elapses.
- Coin redemption rules (max discount percentage per order).

### 2.6 Beauty Protection Program
- Admin-configured optional protection plan on select eligible high-value skincare products.
- Covers verified adverse skin reactions, damaged goods during transit, or authenticity issues.
- Transparent claims submission flow requiring photo proof and order details.

### 2.7 Order Lifecycle & Real-Time Tracking
- Order status pipeline: `PLACED` → `CONFIRMED` → `PACKED` → `OUT_FOR_DELIVERY` → `DELIVERED` / `CANCELLED`.
- Live location tracking for quick-commerce delivery riders when active.
- Detailed invoice, receipt generation, and SMS/push notification updates.

### 2.8 Administrative Control Center
- Management of catalogue (SKUs, ingredients, pricing, stock levels).
- Vendor & Dark Store management (locations, polygons, operating hours, active toggles).
- Geofence polygon configuration for Vijayawada delivery zones.
- Order monitoring and manual dispatch/cancellation triggers.
- Beauty Protection claim review & approval dashboard.
- Analytics: Scan volume, conversion rate, top concerns, referral metrics.

---

## 3. Non-Functional Requirements
- **Performance**: Scan analysis < 3 seconds; cold app start < 2.5 seconds.
- **Security & Privacy**: Zero storage of raw face biometric embeddings without user consent; strict Firestore security rules preventing unauthorized data reads.
- **Reliability**: Graceful offline handling, retry mechanisms for flaky network conditions, clear error messaging.
- **Accessibility**: High-contrast text, clear typography, screen-reader compatibility for core shopping flows.
