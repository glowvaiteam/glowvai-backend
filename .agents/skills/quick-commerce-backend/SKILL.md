---
name: quick-commerce-backend
description: End-to-end backend engineering cheatsheet, data schemas, and state machines for 10-minute quick-commerce dark store operations (Blinkit/Zepto architecture).
---

# Quick-Commerce (Blinkit / Zepto) Backend Engineering Skill

## 1. 4-Phase Micro-Fulfillment Pipeline (Strict 10-Min SLA)

| Phase | Time Allotted | System | Core Backend Action |
|---|---|---|---|
| **Phase 1: Ingress & Inventory Lock** | `0:00 - 0:15` (15s) | **OMS** | 1. Geospatial dark store binding ($\le 2.5\text{ km}$).<br>2. Atomic in-memory inventory decrement in Redis (`REDIS_INVENTORY_CACHE`).<br>3. Order record persisted in DB (`status: 'STORE_ASSIGNED'`). |
| **Phase 2: Handheld Picking** | `0:15 - 2:00` (105s) | **WMS** | 1. Generate pick list sorted by physical bin frequency (`BIN-A-01-02-01`).<br>2. Staff routed via shortest walking path on warehouse handheld scanner.<br>3. Items scanned and placed into tote bag. |
| **Phase 3: Staging & Dispatch** | `2:00 - 2:30` (30s) | **TMS** | 1. Pre-assign closest idle Ather 450X EV rider based on GPS & battery ($\ge 20\%$).<br>2. Tote bag moved to Staging Bay (`BAY-03`).<br>3. Rider scans QR on bag to accept custody. |
| **Phase 4: Hyperlocal Geo-Transit** | `2:30 - 10:00` (450s) | **Telematics & Routing** | 1. MapmyIndia (Mappls) turn-by-turn navigation with TSP batching optimizer.<br>2. Real-time telemetry broadcast (speed, battery, live ETA).<br>3. Customer OTP verification (`deliveryOtp`) before handing over bag. |

---

## 2. Standard Backend API Endpoints & Payload Contracts

### A. Dark Store Routing & Inventory Check
`POST /api/inventory/check`
```json
{
  "storeId": "DS-VIJ-01",
  "productId": "prod-01"
}
```
**Response:**
```json
{
  "ok": true,
  "storeId": "DS-VIJ-01",
  "productId": "prod-01",
  "inStock": true,
  "availableQuantity": 24
}
```

### B. TSP Multi-Drop Batch Solver
`POST /api/dispatch/tsp-batch`
```json
{
  "storeId": "DS-VIJ-01",
  "drops": [
    { "orderId": "ORD-101", "latitude": 16.5450, "longitude": 80.6495, "customer": "Customer A (Main Road)" },
    { "orderId": "ORD-102", "latitude": 16.5480, "longitude": 80.6510, "customer": "Customer B (Singh Nagar)" }
  ]
}
```
**Response:**
```json
{
  "ok": true,
  "storeId": "DS-VIJ-01",
  "totalDrops": 2,
  "totalRoundTripDistanceKm": 2.8,
  "slaCompliance": "100% (Within 10-Min SLA)",
  "optimalSequence": [ ... ]
}
```

### C. Live SLA Status Polling
`GET /api/orders/:orderId/sla-status`
**Response:**
```json
{
  "ok": true,
  "orderId": "ORD-101",
  "elapsedSeconds": 95,
  "remainingSeconds": 505,
  "progressPercent": 16,
  "currentPhase": "WMS_PICKING",
  "phaseDescription": "WMS Handheld Picking: Frequency-sorted shelf routing (0:15 - 2:00)",
  "phases": [
    { "id": "CHECKOUT_OMS", "label": "OMS Lock", "window": "0:00 - 0:15", "isDone": true },
    { "id": "WMS_PICKING", "label": "WMS Picking", "window": "0:15 - 2:00", "isDone": false },
    { "id": "TMS_DISPATCH", "label": "TMS Dispatch", "window": "2:00 - 2:30", "isDone": false },
    { "id": "GEO_TRANSIT", "label": "Geo Transit", "window": "2:30 - 10:00", "isDone": false }
  ]
}
```

---

## 3. Strict Payment Gate Invariant
- **No Dispatch Without Verification**: All digital orders must pass `POST /api/payment/verify` (HMAC SHA-256) before entering Phase 1 inventory lock and order dispatch.
- **Payee VPA**: `8977855998@ibl` (`glowvai`).
- **Support Hotline**: `8977855998`.
