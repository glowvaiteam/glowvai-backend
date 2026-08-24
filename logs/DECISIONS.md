# GlowVAI V2 — Architectural Decision Records (ADRs)

This document tracks all critical architectural, structural, and technology decisions made throughout the GlowVAI V2 lifecycle.

---

## ADR-001: Technology Stack & Mobile Framework Selection
- **Date**: 2026-08-24
- **Decision**: Use React Native with Expo (TypeScript Strict Mode) and Expo Router.
- **Context**: The client requires a real, high-performance Android mobile application with phone-number authentication, camera capture for AI skin diagnostics, Google Maps geolocation, and quick-commerce ordering.
- **Alternatives Considered**:
  - *Flutter / Dart*: Rejected per explicit technical constraints.
  - *Pure Native Kotlin*: High development overhead for unified e-commerce & admin code-sharing.
- **Consequences**: Fast feedback loop, strong type safety with TypeScript strict mode, easy integration with Firebase SDKs and TensorFlow Lite / ONNX runtimes.

---

## ADR-002: Dual Quick-Commerce & Pan-India Unified Architecture
- **Date**: 2026-08-24
- **Decision**: Unify quick-commerce (Vijayawada) and pan-India standard delivery into a single catalog, cart, and checkout pipeline, dynamically resolved by exact coordinates and polygon ray-casting.
- **Context**: Avoid maintaining two separate mobile apps or bifurcated cart pipelines.
- **Consequences**: Delivery eligibility is computed seamlessly on coordinate changes or checkout. Vendor inventory and operating hours gate quick-commerce; failure triggers graceful fallback to standard courier e-commerce.

---

## ADR-003: Anti-Dummy & Zero Fake Stubs Policy
- **Date**: 2026-08-24
- **Decision**: Absolutely no hard-coded fake products, simulated mock logins, fake orders, or hallucinated AI scan results in production code paths.
- **Context**: Reliable software engineering requires real error states, typed repositories, schema validation, and Firebase Emulator support for local development.
- **Consequences**: Missing credentials display actionable configuration setup screens. All network, auth, and AI states implement proper loading, error, empty, and retry boundaries.

---

## ADR-004: Zero Secrets in Source Code
- **Date**: 2026-08-24
- **Decision**: Strict environment variable isolation via `.env.example`, `.gitignore`, and Google Secret Manager / Firebase Functions environment for server credentials.
- **Consequences**: Prevents catastrophic credential leaks, protects user data and payment gateways.

---

## ADR-005: Role-Based Access Control (RBAC) & Firestore Security Separation
- **Date**: 2026-08-24
- **Decision**: Implement strict 3-role segregation (`customer`, `vendor`, `admin`) enforced at both TypeScript service level and Cloud Firestore Security Rules.
- **Context**: Customers, vendors, and admins must access separate slices of the data model without privilege escalation risks.
- **Consequences**:
  - Customers cannot modify their own `role` or `referralCoinBalance`.
  - Vendors can only read and process orders assigned to their `vendorId` and manage their store inventory.
  - Admins retain operational authority for vendor approval, product catalog creation, and delivery partner dispatch.

---

## ADR-006: Vendor Onboarding & Order State Pipeline
- **Date**: 2026-08-24
- **Decision**: Separate vendor onboarding into `vendorApplications` (pending review) and activated `vendors`, with a multi-step order lifecycle:
  `PLACED` → `VENDOR_PENDING` → `VENDOR_ACCEPTED` (or `VENDOR_REJECTED`) → `PACKED` → `READY_FOR_PICKUP` → `OUT_FOR_DELIVERY` → `DELIVERED`.
- **Context**: Provides verifiable audit trails for quick-commerce partner pharmacies/dark stores without requiring a separate delivery driver app.
- **Consequences**: Clear accountability for store fulfillment times and smooth transition to admin-assigned riders with WhatsApp dispatch deep-links.
