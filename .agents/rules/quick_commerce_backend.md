# Quick-Commerce (Blinkit / Zepto) Backend Ordering Invariants

## 1. 10-Minute Order Lifecycle Timeline (Strict SLA Partitioning)
Every order lifecycle in GlowVAI must strictly adhere to the 4-phase micro-fulfillment pipeline:
1. **0:00 - 0:15 (OMS Ingress & Inventory Lock)**:
   - Geospatial dark store binding (2 to 4 km radius).
   - Atomic inventory reservation in Redis in-memory cache to prevent race-condition stockouts.
2. **0:15 - 2:00 (WMS Handheld Picking)**:
   - Warehouse Management System generates shelf-frequency sorted pick-lists (`BIN-A-01-02-01`).
   - High-velocity SKUs positioned nearest to packaging station.
3. **2:00 - 2:30 (TMS Pre-Assignment & Staging Bay)**:
   - Transport Management System pre-assigns Ather 450X EV rider before bagging completes.
   - Bag routed to physical staging bay (e.g. `BAY-03`).
4. **2:30 - 10:00 (Hyperlocal Geo-Routing Transit)**:
   - MapmyIndia (Mappls) turn-by-turn routing with live rider telemetry (speed, battery, OTP verification).

## 2. Dark Store Mesh Topology
- Micro-fulfillment centers restricted to 2.0–4.0 km coverage to maintain low transit latency and viable unit economics.
- Dark stores active in Vijayawada: `DS-VIJ-01` (Payikapuram), `DS-VIJ-02` (Benz Circle), `DS-VIJ-03` (Governorpet).

## 3. Traveling Salesperson Problem (TSP) Multi-Drop Batching
- Up to 2–3 orders sharing the same geohash are batched to a single rider.
- The route optimizer (`POST /api/dispatch/tsp-batch`) must ensure cumulative round-trip distance $\le 4.0\text{ km}$ to guarantee zero SLA breach.

## 4. Payment Verification Gate
- No digital order is dispatched or advanced to the delivery map without cryptographic verification (`POST /api/payment/verify`) via Razorpay HMAC-SHA256 signature check.
- UPI Payee VPA is `8977855998@ibl` (`glowvai`).
