# GlowVAI V2 — Delivery Rules & Serviceability Logic

## 1. Overview & Architectural Principle
GlowVAI V2 operates a dual delivery system within a single, unified catalog and checkout pipeline:
1. **Vijayawada Quick-Commerce**: Hyper-local, expedited delivery (typically 30–60 minutes) serviced via local dark stores/partner pharmacies.
2. **Pan-India Standard E-Commerce**: Standard courier fulfillment across all serviceable Indian pincodes (3–7 business days).

> **CRITICAL RULE**: Serviceability is **never** determined by city text matching alone. It strictly uses exact geographic coordinates, Ray-Casting Point-in-Polygon (PIP) checks against active zone polygons, vendor operational hours, and real-time vendor inventory.

---

## 2. Quick-Commerce Serviceability Algorithm

When a user selects or sets an address `(userLat, userLng)`:

```
Step 1: Coordinate Validation
  Ensure userLat and userLng are valid numeric WGS84 coordinates.

Step 2: Active Zone Polygon Check
  Retrieve all active delivery zones from Firestore (`deliveryZones` where `isActive == true` and `city == 'Vijayawada'`).
  Run Point-in-Polygon (PIP) algorithm:
  - If point is outside all polygons -> Quick-Commerce NOT serviceable -> Route to Standard E-Commerce.
  - If point is inside a zone -> Mark `matchedZoneId = zone.zoneId`.

Step 3: Vendor Availability & Operating Hours Check
  Query vendors linked to `matchedZoneId` (`vendors` where `serviceZoneIds contains matchedZoneId` and `isActive == true`).
  Check current time against vendor `operatingHours`:
  - `currentTime >= vendor.operatingHours.openTime` AND `currentTime < vendor.operatingHours.closeTime`
  - If no vendor is open -> Quick-Commerce unavailable -> Fallback to Standard E-Commerce with clear explanation.

Step 4: Product Eligibility & Vendor Stock Verification
  For each item in the cart:
  - Verify `product.isQuickCommerceEligible == true`
  - Check `vendor.assignedInventory[productId].stock >= requestedQuantity`
  - If any product fails local stock check:
    - Option A: Split fulfillment (show user which items are quick vs standard).
    - Option B: Downgrade order to Pan-India Standard E-Commerce.

Step 5: ETA Calculation & Truthful Delivery Time
  Never hardcode or promise delivery under 60 minutes unless:
  - Vendor distance to user <= maxQuickCommerceRadiusKm (default: 7.5 km)
  - Estimated fulfillment time (Vendor prep time + Transit time based on distance) <= 60 mins.
  Otherwise, dynamically display realistic time (e.g. "Estimated 45–60 mins" or "Standard delivery 3–5 days").
```

---

## 3. Standard E-Commerce Delivery Rules
- **Coverage**: All verified 6-digit Indian Postal PIN codes serviced by courier partners (e.g., Shiprocket / Delhivery / Bluedart).
- **Stock Source**: Centralized warehouse inventory (`product.totalStock`).
- **Delivery Timeline**: Estimated 3–7 business days depending on delivery state and courier tier.
- **Tracking**: Real-time AWB tracking URL and status webhooks.

---

## 4. Fee & Free Delivery Threshold Calculations
- **Quick-Commerce Base Fee**: Configurable per zone (e.g., ₹29 – ₹49).
- **Free Quick-Commerce Threshold**: e.g., Free for orders above ₹499.
- **Pan-India Standard Fee**: Flat ₹40 for orders under ₹699, Free for orders >= ₹699.
- **Dynamic Surge**: Optional admin toggle for peak weather or high-demand conditions.

---

## 5. Edge Cases & Handling
1. **GPS Drift / Inaccurate Pin**: The app prompts user with a visual map pin confirmation modal before saving the delivery address.
2. **Vendor Runs Out of Stock During Checkout**: Re-validate stock in Firestore Transaction / Cloud Function at the exact moment of order placement. If out of stock, reject payment and alert user with retry option.
3. **Store Closing During Checkout**: Cloud Function rejects order if current timestamp is within 15 minutes of store closing time.
