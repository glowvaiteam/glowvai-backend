# GlowVAI V2 — Security, Privacy, & Compliance Standards

## 1. Zero Secrets & Credential Protection (MANDATORY)
1. **Never Commit Secrets to Git**:
   - `.env`, `.env.local`, `.env.production` are strictly listed in `.gitignore`.
   - Firebase Service Account JSON files (`*service-account*.json`, `google-services.json` containing sensitive keys) must never be committed to public or private repos without encryption/safeguards.
   - Payment gateway secret keys (Razorpay/Stripe/Cashfree) must ONLY reside in Firebase Cloud Functions environment variables / Google Secret Manager.
2. **Client-Side Key Restrictions**:
   - Google Maps API keys used on Android must be restricted in Google Cloud Console by **Android Package Name** (`com.glowvai.app`) and **SHA-1 Signing Certificate Fingerprint**.
   - Public Firebase Web config is safe for client reading, but all data access is gated strictly by Firestore & Storage Security Rules.

---

## 2. Firestore & Storage Security Rules Architecture

### 2.1 Principle of Least Privilege
- Users can ONLY read and write their own documents (`request.auth.uid == userId`).
- Public catalog (`products`, `categories`) is **read-only** for authenticated/unauthenticated clients, and **writeable only by verified admins or Cloud Functions**.
- `orders` collection: Users can create an order only if `request.resource.data.userId == request.auth.uid`. Status updates (`OUT_FOR_DELIVERY`, `DELIVERED`, `REFUNDED`) are restricted to Cloud Functions or authenticated Admin roles.
- `vendors` and `deliveryZones` are read-only for clients to perform geofence queries; writes are strictly admin-only.

### 2.2 Sample Firestore Security Blueprint
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    // Public catalogue
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // User personal profiles & subcollections
    match /users/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
      
      match /addresses/{addressId} {
        allow read, write: if isOwner(userId);
      }
      match /cart/{cartItemId} {
        allow read, write: if isOwner(userId);
      }
      match /scanHistory/{scanId} {
        allow read, write: if isOwner(userId);
      }
    }

    // Orders
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 3. Biometric & Camera Privacy (AI Skin Scan)
1. **Explicit Prior Consent**: Before triggering the camera, user must view and accept the Camera & Skin Health Privacy notice.
2. **Ephemeral & Secure Processing**:
   - Raw facial photos are processed locally on-device via the embedded CNN whenever possible.
   - If Cloud Function inference is used, uploads go to a secure, private bucket path with TTL auto-deletion after 24 hours.
   - We store only diagnostic score vectors (e.g. acne score: 0.24, hydration: 0.65), never facial geometry for identity tracking.
3. **Medical Disclaimer**:
   - The app explicitly declares: *"GlowVAI is a cosmetic analysis tool and does not provide medical or dermatological diagnosis. For severe or persistent skin conditions, consult a licensed dermatologist."*

---

## 4. Payment & Transaction Security
- No credit card numbers, CVVs, or bank credentials ever touch GlowVAI servers.
- Payment is executed via RBI-compliant payment SDKs (e.g., Razorpay/Cashfree/UPI Intent).
- Order verification and signature validation are performed strictly inside Firebase Cloud Functions before updating order status to `PAID`.
