# GlowVAI V2 — Technology Stack & Architectural Blueprint

## 1. Core Technology Choices

| Layer | Technology | Rationale & Specifications |
| :--- | :--- | :--- |
| **Mobile Client** | React Native (Expo SDK 51+) | Native cross-platform performance with rapid iteration, deep Android API integration. |
| **App Routing** | Expo Router (File-based) | Type-safe URL-based routing, deep linking support, standard Android back navigation. |
| **Language** | TypeScript (Strict Mode) | Strong compile-time typing, strict null checks, prevention of runtime `undefined` bugs. |
| **Authentication** | Firebase Authentication | Phone Number login with OTP verification, recaptcha verification on Android. |
| **Primary Database** | Cloud Firestore | Real-time listeners for order tracking, highly scalable NoSQL document structure. |
| **Cloud Storage** | Firebase Storage | Secure storage for product images, user skin scan captures (temporary/protected), and claim proofs. |
| **Server Logic** | Firebase Cloud Functions (Node.js/TS) | Protected server-side execution for payments, referral validations, and geofence resolution. |
| **Mapping & Location** | Google Maps Platform | Maps SDK for Android, Places API (Autocomplete & Geocoding), Geometry library for point-in-polygon checks. |
| **AI / Machine Learning** | CNN (Computer Vision) | Local TensorFlow Lite (`react-native-fast-tflite` / ONNX) or Cloud Functions inference with rigorous preprocessing. |
| **Admin Portal** | React / Next.js or Expo Web Admin | Secure administrative backoffice for catalog, vendors, zones, and claims. |
| **Testing** | Jest + React Native Testing Library | Unit & integration tests for delivery algorithms, referral logic, and pricing calculations. |

---

## 2. Directory Architecture

```
GlowVAI-V2/
├── app/                  # Expo Router mobile application source
│   ├── (auth)/           # Authentication screens (Phone Login, OTP verification)
│   ├── (tabs)/           # Main bottom-tab screens (Home, Scan, Cart, Orders, Profile)
│   ├── (modals)/         # Modal dialogs (Address picker, Scan result details, Claim form)
│   ├── components/       # Reusable atomic UI components (Buttons, Inputs, Cards)
│   ├── services/         # Typed Firebase repositories & API services
│   ├── hooks/            # Custom React hooks (useLocation, useCart, useAuth)
│   ├── types/            # Strict TypeScript interfaces and domain models
│   ├── utils/            # Geofencing helpers, date formatters, currency logic
│   └── _layout.tsx       # Root layout & providers
├── functions/            # Firebase Cloud Functions (TypeScript)
│   ├── src/
│   │   ├── orders/       # Order creation, status webhooks, invoice generation
│   │   ├── delivery/     # Server-side polygon resolution & vendor matching
│   │   ├── referrals/    # Fraud prevention & referral coin awarding
│   │   ├── ml/           # Cloud-based ML fallback inference endpoint
│   │   └── index.ts      # Functions entry point
├── admin/                # Web Admin Dashboard for operations
├── ml-model/             # CNN model files, metadata, labels, and preprocessing specs
├── docs/                 # Engineering, product, and schema documentation
├── designs/              # UI/UX design specifications, wireframes, and tokens
├── assets/               # Static icons, splash screens, and illustrations
├── research/             # Ingredient datasets, skin classification research
├── scripts/              # Dev seed scripts, emulator launchers, validation scripts
├── tests/                # Unit, integration, and rule tests
├── logs/                 # Development logs and architectural decision records (ADRs)
└── .agents/              # Agent rules, workflows, and customized skills
```

---

## 3. Environment & Dependency Standards
- **Zero Mock / Anti-Dummy Standard**: No mock responses in production code. Missing API keys or Firebase connections must trigger clear diagnostic error boundaries.
- **Environment Isolation**: `.env.development`, `.env.staging`, `.env.production` managed with `expo-constants` and never checked into source control.
- **Offline Resilience**: Offline caching via Firestore offline persistence; optimistic UI updates for cart items with server-side reconciliation.
