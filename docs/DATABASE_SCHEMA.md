# GlowVAI V2 — Cloud Firestore Database Schema

This document defines the schema, types, indexes, and document relationships across Cloud Firestore collections.

---

## 1. Collections Hierarchy

```
firestore/
├── users/{userId}
│   └── addresses/{addressId}
│   └── scanHistory/{scanId}
│   └── cart/{cartItemId}
│   └── coinTransactions/{txId}
├── products/{productId}
├── categories/{categoryId}
├── vendors/{vendorId}
├── deliveryZones/{zoneId}
├── orders/{orderId}
├── referralPrograms/{programId}
├── studentReferrals/{referralId}
├── beautyProtectionRules/{ruleId}
├── beautyProtectionClaims/{claimId}
└── systemConfig/general
```

---

## 2. Detailed Document Schemas

### 2.1 `users`
```typescript
interface UserDocument {
  uid: string;                         // Primary Key (Firebase Auth UID)
  phoneNumber: string;                 // E.164 format (+91XXXXXXXXXX)
  displayName: string | null;
  email: string | null;
  ageGroup?: 'UNDER_18' | '18_24' | '25_34' | '35_44' | '45_PLUS';
  gender?: 'FEMALE' | 'MALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
  skinProfile?: {
    skinType: 'OILY' | 'DRY' | 'COMBINATION' | 'NORMAL' | 'SENSITIVE';
    primaryConcerns: string[];         // e.g. ['ACNE', 'HYPERPIGMENTATION']
    lastScanAt: FirebaseFirestore.Timestamp;
  };
  isStudentVerified: boolean;
  studentDetails?: {
    collegeName: string;
    studentIdCardUrl?: string;
    verifiedAt: FirebaseFirestore.Timestamp;
  };
  referralCode: string;                // Unique 6-8 alphanumeric code
  referredByCode?: string | null;
  referralCoinBalance: number;         // Total active coin balance (1 coin = ₹1 or defined value)
  consents: {
    cameraAndScanConsent: boolean;
    termsAcceptedAt: FirebaseFirestore.Timestamp;
    privacyAcceptedAt: FirebaseFirestore.Timestamp;
    medicalDisclaimerAcceptedAt: FirebaseFirestore.Timestamp;
  };
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.2 `users/{userId}/addresses/{addressId}`
```typescript
interface AddressDocument {
  addressId: string;
  label: 'HOME' | 'WORK' | 'COLLEGE' | 'OTHER';
  recipientName: string;
  phoneNumber: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  isQuickCommerceServiceable: boolean; // Computed based on zone checks
  zoneId?: string | null;              // Matched deliveryZone ID if within Vijayawada
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.3 `products`
```typescript
interface ProductDocument {
  productId: string;
  sku: string;
  title: string;
  brand: string;
  description: string;
  categoryIds: string[];
  ingredients: string[];
  targetedConcerns: string[];          // e.g. ['ACNE', 'DARK_SPOTS', 'DRYNESS']
  suitableSkinTypes: string[];        // e.g. ['OILY', 'COMBINATION']
  howToUse: string;
  images: string[];
  mrp: number;                        // In INR (Paise or Rupees)
  discountedPrice: number;
  isBeautyProtectionEligible: boolean;
  beautyProtectionFee?: number;
  isQuickCommerceEligible: boolean;   // Admin toggle for local store stocking
  panIndiaAvailable: boolean;
  totalStock: number;
  isActive: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.4 `vendors` (Dark Stores / Partner Pharmacies)
```typescript
interface VendorDocument {
  vendorId: string;
  name: string;
  contactNumber: string;
  address: string;
  city: string;                       // e.g. 'Vijayawada'
  location: {
    latitude: number;
    longitude: number;
  };
  serviceZoneIds: string[];           // Zones this vendor covers
  operatingHours: {
    openTime: string;                 // '08:00'
    closeTime: string;                // '22:00'
    isOpenToday: boolean;
  };
  assignedInventory: {
    [productId: string]: {
      stock: number;
      isAvailable: boolean;
    };
  };
  isActive: boolean;
  averageFulfillmentTimeMinutes: number; // e.g. 25
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 2.5 `deliveryZones` (Geofencing Polygons)
```typescript
interface DeliveryZoneDocument {
  zoneId: string;
  name: string;                       // e.g. 'Vijayawada Central - Benz Circle'
  city: string;                       // 'Vijayawada'
  isActive: boolean;
  polygonCoordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  assignedVendorIds: string[];
  maxQuickCommerceRadiusKm: number;
  estimatedDeliveryTimeMinutes: number; // e.g. 45
  deliveryFee: number;
  freeDeliveryThreshold: number;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.6 `orders`
```typescript
interface OrderDocument {
  orderId: string;
  userId: string;
  deliveryType: 'QUICK_COMMERCE' | 'STANDARD_ECOMMERCE';
  vendorId?: string | null;           // For Quick-Commerce
  zoneId?: string | null;
  items: Array<{
    productId: string;
    title: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;
    hasBeautyProtection: boolean;
    beautyProtectionFee: number;
  }>;
  shippingAddress: AddressDocument;
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    coinsRedeemed: number;
    beautyProtectionTotal: number;
    grandTotal: number;
  };
  payment: {
    method: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    paidAt?: FirebaseFirestore.Timestamp;
  };
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  tracking: {
    carrierName?: string;
    trackingNumber?: string;
    estimatedDeliveryTime?: FirebaseFirestore.Timestamp;
    riderDetails?: {
      name: string;
      phone: string;
      currentLocation?: { latitude: number; longitude: number };
    };
  };
  referralProcessed: boolean;
  referralCodeUsed?: string | null;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.7 `beautyProtectionClaims`
```typescript
interface BeautyProtectionClaimDocument {
  claimId: string;
  orderId: string;
  userId: string;
  productId: string;
  claimReason: 'ADVERSE_REACTION' | 'DAMAGED_IN_TRANSIT' | 'PRODUCT_INEFFECTIVE';
  description: string;
  evidenceImages: string[];
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  adminNotes?: string;
  refundAmount?: number;
  reviewedBy?: string;
  reviewedAt?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
}
```

---

## 3. Indexing Requirements

1. **`orders`**: Composite index on `userId` (ASC) + `createdAt` (DESC) for user order history.
2. **`orders`**: Composite index on `deliveryType` (ASC) + `status` (ASC) + `createdAt` (DESC) for rider/vendor dispatch.
3. **`products`**: Composite index on `isQuickCommerceEligible` (ASC) + `isActive` (ASC) + `categoryIds` (ARRAY-CONTAINS).
4. **`products`**: Composite index on `targetedConcerns` (ARRAY-CONTAINS) + `isActive` (ASC).
5. **`deliveryZones`**: Composite index on `city` (ASC) + `isActive` (ASC).
