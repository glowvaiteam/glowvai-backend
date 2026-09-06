# 🚀 GlowVAI Backend API (https://github.com/glowvaiteam/glowvai-backend)

Production-ready Node.js + Express backend powering the GlowVAI mobile application.

---

## 📁 Directory Structure

```
glowvai-backend/
├── package.json              # Express, Cashfree PG, Firebase-Admin, Google Maps SDK
├── server.js                 # Complete server logic & all 7 API endpoints
├── .env.example              # Environment variables template
└── README.md                 # Deployment & setup guide
```

---

## 📡 Registered Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/health` | Live service health check and configuration audit |
| `POST` | `/api/users/save` | Saves user profile, GPS location, and addresses to Firestore |
| `POST` | `/api/orders/create` | Creates Cashfree order server-side and returns `payment_session` |
| `POST` | `/api/orders/verify` | Verifies Cashfree payment and updates order status in Firestore |
| `GET` | `/api/maps/geocode` | Secure server-side Google Maps geocoding & reverse geocoding |
| `POST` | `/api/scan/analyze` | Proxies face selfie to PyTorch CNN model with diagnostic fallback |
| `POST` | `/api/billing/verify-purchase` | Verifies Google Play In-App Purchase & Subscription tokens |

---

## 🛠️ Local Development

```bash
cd glowvai-backend
npm install
node server.js
```
Server runs on `http://localhost:5000`.
