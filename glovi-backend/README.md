# 🚀 GloVi (GlowVAI) Backend API

Production-ready Node.js + Express backend powering the GloVi mobile application.

---

## 📁 Directory Structure

```
glovi-backend/
├── package.json              # Express, Cashfree, Firebase-Admin, Google Maps SDKs
├── server.js                 # Complete server logic & all 5 API endpoints
├── .env.example              # Environment variables template
└── README.md                 # Deployment & setup guide
```

---

## 📡 Registered Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/users/save` | Saves user profile, GPS location, and addresses to Firestore |
| `POST` | `/api/orders/create` | Creates Cashfree order server-side and returns `paymentSessionId` |
| `POST` | `/api/orders/verify` | Verifies payment status with Cashfree and updates order status |
| `POST` | `/api/maps/geocode` | Secure server-side Google Maps geocoding & reverse geocoding |
| `POST` | `/api/scan/analyze` | Multi-part face selfie proxy to PyTorch CNN model with diagnostic fallback |
| `GET` | `/health` | Live service health check and configuration audit |

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
cd glovi-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Fill in your `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, and `GOOGLE_MAPS_API_KEY`.

### 3. Start the Server
```bash
node server.js
```
The server will start on `http://localhost:5000`.

---

## ☁️ Deploy to Render (1-Click)

1. Push this folder to your GitHub repository (e.g. `glovi-backend` or root).
2. Open **[Render Dashboard](https://dashboard.render.com)** -> Click **New +** -> **Web Service**.
3. Connect your repository.
4. Set the following build settings:
   - **Root Directory**: `glovi-backend` (or leave blank if repository root)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. In the **Environment Variables** section on Render, add:
   - `CASHFREE_ENVIRONMENT`: `SANDBOX` (or `PRODUCTION`)
   - `CASHFREE_APP_ID`: `TEST1029384756`
   - `CASHFREE_SECRET_KEY`: `cfsk_ma_test_d717ac6fa0c5ab0b1c9d0c144aa7b1c5_2b5bc8c8`
   - `GOOGLE_MAPS_API_KEY`: `your_google_maps_key`
   - `CNN_SERVICE_URL`: `https://glowvai-backend-r7u2.onrender.com/predict`
6. Click **Deploy Web Service**.
