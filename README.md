# GlowVAI V2 — AI-Powered Skincare & Quick-Commerce Platform

Welcome to **GlowVAI V2**! This is a production-grade React Native Android application powered by Expo, Firebase, Google Maps Platform, and Computer Vision for AI skin diagnostics.

---

## 🌟 Key Features
1. **Phone-Number Authentication**: Secure SMS OTP login via Firebase Auth.
2. **AI Face Scan & Diagnostic Report**: Camera-based skin analysis (acne, hydration, texture, dark spots) with clear cosmetic explainability.
3. **Personalized Recommendations**: Ingredient-matched skincare routines backed by dermatological logic.
4. **Hybrid Delivery Engine**:
   - **Vijayawada Quick-Commerce**: 30–60 min delivery in supported zones/polygons with real-time stock checks.
   - **Pan-India Standard Delivery**: Reliable courier delivery across all Indian pin codes.
5. **Student Referral & Coin System**: Verified college students earn GlowVAI Coins after verified referee order completion.
6. **Admin-Controlled Beauty Protection**: Optional reassurance warranty on eligible formulations.
7. **Backoffice Operations**: Admin controls for vendors, dark stores, polygon geofences, catalog, and claims.

---

## 📁 Repository Structure

```
GlowVAI-V2/
├── app/                  # React Native (Expo Router) Android mobile application
├── functions/            # Firebase Cloud Functions (TypeScript backend)
├── admin/                # Web Admin Portal for catalog, vendors, & operations
├── ml-model/             # CNN skin diagnostic model files & preprocessing specs
├── docs/                 # Complete architecture, schema, and business rules
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── TECH_STACK.md
│   ├── DATABASE_SCHEMA.md
│   ├── DELIVERY_RULES.md
│   ├── REFERRAL_RULES.md
│   ├── BEAUTY_PROTECTION_RULES.md
│   └── SECURITY_AND_PRIVACY.md
├── designs/              # UI/UX specifications, mockups, design tokens
├── assets/               # Branding assets, icons, splash images
├── research/             # Ingredient safety research and skin classification docs
├── scripts/              # Local dev seed scripts and emulator launchers
├── tests/                # Unit, integration, and security rule tests
├── logs/                 # Chronological development logs and decision records (ADRs)
│   ├── DEVELOPMENT_LOG.md
│   └── DECISIONS.md
├── .agents/              # Agent engineering rules & custom workflows
│   └── rules/
│       └── glowvai-engineering.md
├── .env.example          # Environment variables template
├── .gitignore            # Git exclusion rules (Strict zero-secrets policy)
└── README.md             # Project documentation
```

---

## 🔒 Engineering Standards & Zero-Dummy Policy
- **No Mock Stubs in Final Code**: We do not create fake login screens, hard-coded fake orders, or simulated diagnostic results.
- **Authentic States**: Every network or Firebase call handles Loading, Success, Error, Empty, and Offline states.
- **Strict Privacy**: Zero storage of raw face geometry embeddings without user consent.
- **Zero Secrets**: No API keys, passwords, or service-account JSON files committed to Git.

---

## 🚀 Getting Started (Prerequisites)
1. **Node.js**: v18.x or v20.x LTS installed.
2. **Expo CLI & Android Studio**: For Android Virtual Device (AVD) emulation.
3. **Firebase CLI**: `npm install -g firebase-tools`
4. **Environment Setup**: Copy `.env.example` to `.env` and provide your real Firebase & Google Maps keys.
