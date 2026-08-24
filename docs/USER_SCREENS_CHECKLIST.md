# GlowVAI V2 — User-Side Screen Checklist & Implementation Tracker

Total Planned User-Side Screens: 125  
Essential MVP Screens: 30  
Architecture Pattern: Feature-Driven Modules (`src/features/*` and `app/(customer)/*`, `app/(auth)/*`)

---

## 🚀 1. Essential MVP Screens (30 Screens)

- [x] 1. Splash screen (`app/index.tsx` / `src/features/onboarding/SplashScreen.tsx`)
- [x] 2. Welcome screen (`app/(auth)/welcome.tsx` / `src/features/onboarding/WelcomeScreen.tsx`)
- [x] 3. Login screen (`app/(auth)/login.tsx` / `src/features/auth/LoginScreen.tsx`)
- [x] 4. OTP verification screen (`app/(auth)/verify-otp.tsx` / `src/features/auth/OtpVerificationScreen.tsx`)
- [ ] 5. Terms and privacy screen (`app/(auth)/terms-privacy.tsx` / `src/features/onboarding/TermsPrivacyScreen.tsx`)
- [ ] 6. Home screen (`app/(customer)/(tabs)/index.tsx` / `src/features/shop/HomeScreen.tsx`)
- [x] 7. Location setup screen (`app/(customer)/location/setup.tsx` / `src/components/modals/LocationPermissionModal.tsx`)
- [ ] 8. Serviceability result screen (`app/(customer)/location/serviceability.tsx` / `src/features/location/ServiceabilityResultScreen.tsx`)
- [ ] 9. Face-scan introduction screen (`app/(customer)/scan/intro.tsx` / `src/features/scan/ScanIntroScreen.tsx`)
- [ ] 10. Camera or upload screen (`app/(customer)/scan/camera.tsx` / `src/features/scan/CameraCaptureScreen.tsx`)
- [ ] 11. Scan-in-progress screen (`app/(customer)/scan/analyzing.tsx` / `src/features/scan/ScanProgressScreen.tsx`)
- [ ] 12. Scan-failed screen (`app/(customer)/scan/failed.tsx` / `src/features/scan/ScanFailedScreen.tsx`)
- [ ] 13. Skin-report overview screen (`app/(customer)/scan/report.tsx` / `src/features/scan/SkinReportScreen.tsx`)
- [ ] 14. Recommendation screen (`app/(customer)/recommendations/index.tsx` / `src/features/recommendations/RecommendationsScreen.tsx`)
- [ ] 15. Product-list screen (`app/(customer)/(tabs)/shop.tsx` / `src/features/shop/ProductListScreen.tsx`)
- [ ] 16. Product-details screen (`app/(customer)/product/[id].tsx` / `src/features/shop/ProductDetailsScreen.tsx`)
- [ ] 17. Cart screen (`app/(customer)/(tabs)/cart.tsx` / `src/features/cart/CartScreen.tsx`)
- [ ] 18. Address screen (`app/(customer)/address/index.tsx` / `src/features/location/AddressListScreen.tsx`)
- [ ] 19. Checkout screen (`app/(customer)/checkout/index.tsx` / `src/features/cart/CheckoutScreen.tsx`)
- [ ] 20. Payment-success screen (`app/(customer)/checkout/success.tsx` / `src/features/cart/PaymentSuccessScreen.tsx`)
- [ ] 21. Payment-failed screen (`app/(customer)/checkout/failed.tsx` / `src/features/cart/PaymentFailedScreen.tsx`)
- [ ] 22. Order-confirmation screen (`app/(customer)/orders/confirmed.tsx` / `src/features/orders/OrderConfirmationScreen.tsx`)
- [ ] 23. Orders screen (`app/(customer)/(tabs)/orders.tsx` / `src/features/orders/OrdersListScreen.tsx`)
- [ ] 24. Support screen (`app/(customer)/support/index.tsx` / `src/features/support/SupportScreen.tsx`)
- [ ] 25. Profile screen (`app/(customer)/(tabs)/profile.tsx` / `src/features/auth/ProfileScreen.tsx`)
- [ ] 26. Privacy controls screen (`app/(customer)/profile/privacy.tsx` / `src/features/auth/PrivacyControlsScreen.tsx`)
- [ ] 27. Referral screen (`app/(customer)/referrals/index.tsx` / `src/features/referrals/ReferralsScreen.tsx`)
- [ ] 28. General error screen (`src/components/ui/ErrorState.tsx`)
- [ ] 29. Offline screen (`src/features/support/OfflineScreen.tsx`)
- [ ] 30. App loading screen (`src/components/ui/LoadingState.tsx`)

---

## 📋 2. Complete Planned 125 User-Side Screens Breakdown

### Category 1: App Launch & Lifecycle
- [ ] Splash screen
- [ ] App loading screen
- [ ] App update required screen
- [ ] Maintenance screen
- [ ] Offline mode screen
- [ ] Server unavailable screen
- [ ] Slow connection screen
- [ ] Unexpected error screen

### Category 2: Welcome & Onboarding
- [ ] Welcome screen
- [ ] Glowvai introduction screen
- [ ] How Glowvai works screen
- [ ] Face scan explanation screen
- [ ] Skin report explanation screen
- [ ] Product recommendation explanation screen
- [ ] Quick-commerce explanation screen
- [ ] E-commerce explanation screen
- [ ] Verified beauty partner explanation screen
- [ ] Privacy and safety introduction screen
- [ ] Personalization introduction screen
- [ ] Onboarding completion screen

### Category 3: Account & Authentication
- [ ] Login screen
- [ ] Sign-up screen
- [ ] Phone-number entry screen
- [ ] Email entry screen
- [ ] OTP verification screen
- [ ] OTP expired screen
- [ ] Resend OTP screen
- [ ] Incorrect OTP screen
- [ ] Forgot-password screen
- [ ] Reset-password screen
- [ ] Account-recovery screen
- [ ] Account-created success screen
- [ ] Login failure screen
- [ ] Logout confirmation screen
- [ ] Session-expired screen

### Category 4: Permission & Consent
- [ ] Camera-permission explanation screen
- [ ] Camera permission denied screen
- [ ] Location-permission explanation screen
- [ ] Location permission denied screen
- [ ] Notification-permission explanation screen
- [ ] Notification permission denied screen
- [ ] Face-image consent screen
- [ ] Marketing-consent screen
- [ ] Terms and conditions screen
- [ ] Privacy policy screen
- [ ] Data-use explanation screen
- [ ] Consent withdrawal screen

### Category 5: Location & Serviceability
- [ ] Location setup screen
- [ ] Use current location screen
- [ ] Search location screen
- [ ] Manual address entry screen
- [ ] Map location picker screen
- [ ] Confirm location screen
- [ ] Add new address screen
- [ ] Saved addresses screen
- [ ] Serviceability checking screen
- [ ] Quick-commerce available screen
- [ ] E-commerce-only available screen
- [ ] Quick-commerce unavailable screen
- [ ] No service available screen
- [ ] Delivery-zone explanation screen
- [ ] Change location screen
- [ ] Location accuracy warning screen

### Category 6: Home & Navigation
- [ ] New-user home screen
- [ ] Returning-user home screen
- [ ] Location selector
- [ ] Quick-commerce availability banner
- [ ] Start face scan card
- [ ] Latest report card
- [ ] Recommended products section
- [ ] Shop by concern section
- [ ] E-commerce entry screen
- [ ] Quick-commerce entry screen
- [ ] Search screen
- [ ] Notifications entry screen
- [ ] Referral entry screen
- [ ] Support entry screen
- [ ] Home empty state

### Category 7: Face Scan & AI Capture
- [ ] Face-scan introduction screen
- [ ] Face-scan instructions screen
- [ ] Camera preview screen
- [ ] Capture selfie screen
- [ ] Upload image screen
- [ ] Image preview screen
- [ ] Retake image screen
- [ ] Confirm image screen
- [ ] Lighting instructions screen
- [ ] Face-position instructions screen
- [ ] Image-uploading screen
- [ ] Scan-starting screen
- [ ] Analysis-in-progress screen
- [ ] Analysis-taking-longer screen
- [ ] No-face-detected screen
- [ ] Multiple-faces-detected screen
- [ ] Face-too-far screen
- [ ] Face-too-close screen
- [ ] Face-partially-covered screen
- [ ] Poor-lighting screen
- [ ] Blurry-image screen
- [ ] Unsupported-image screen
- [ ] Image-too-large screen
- [ ] Scan-failed screen
- [ ] Retry-scan screen
- [ ] Scan-cancelled screen
- [ ] Scan-success screen
- [ ] Delete-scan-confirmation screen

### Category 8: Skin Report & Diagnostics
- [ ] Report-generating screen
- [ ] Report-ready screen
- [ ] Report-overview screen
- [ ] Skin-type screen
- [ ] Skin-tone screen
- [ ] Skin-concern summary screen
- [ ] Acne indicator screen
- [ ] Texture indicator screen
- [ ] Pigmentation indicator screen
- [ ] Hydration indicator screen
- [ ] Oiliness indicator screen
- [ ] Dryness indicator screen
- [ ] Sensitivity indicator screen
- [ ] Report explanation screen
- [ ] Confidence and limitation screen
- [ ] What-to-do-next screen
- [ ] Recommended-routine screen
- [ ] Report-disclaimer screen
- [ ] Save-report screen
- [ ] Download-report screen
- [ ] Share-report screen
- [ ] Report-feedback screen
- [ ] Incorrect-report request screen
- [ ] Rescan screen
- [ ] Previous-reports screen
- [ ] Report-not-available screen

### Category 9: Recommendations
- [ ] Recommendation overview screen
- [ ] Products recommended for concern screen
- [ ] Beginner routine screen
- [ ] Morning routine screen
- [ ] Night routine screen
- [ ] Ingredient explanation screen
- [ ] Product-usage instruction screen
- [ ] Patch-test warning screen
- [ ] Product-alternatives screen
- [ ] Recommendation-disclaimer screen
- [ ] Recommendation-feedback screen
- [ ] Incorrect-recommendation report screen
- [ ] Product-interest screen
- [ ] Notify-me-about-product screen

### Category 10: E-Commerce & Quick-Commerce Catalogue
- [ ] All-products screen
- [ ] Product-search screen
- [ ] Search-results screen
- [ ] Search-no-results screen
- [ ] Product-categories screen
- [ ] Skincare-category screen
- [ ] Cosmetics-category screen
- [ ] Haircare-category screen
- [ ] Fragrance-category screen
- [ ] Personal-care-category screen
- [ ] Product-filter screen
- [ ] Product-sort screen
- [ ] Brand-list screen
- [ ] Brand-details screen
- [ ] Product-details screen
- [ ] Product-image-gallery screen
- [ ] Product-ingredients screen
- [ ] Product-how-to-use screen
- [ ] Product-authenticity screen
- [ ] Product-reviews screen
- [ ] Product-questions screen
- [ ] Related-products screen
- [ ] Wishlist screen
- [ ] Product-saved-success screen
- [ ] Product-unavailable screen
- [ ] Product-out-of-stock screen
- [ ] Quick-commerce home screen
- [ ] Quick-commerce service-area screen
- [ ] Fast-delivery product-list screen
- [ ] Nearby-availability screen
- [ ] Delivery-time-estimate screen
- [ ] Quick-commerce product-details screen
- [ ] Quick-commerce product-filter screen
- [ ] Quick-commerce out-of-stock screen
- [ ] Quick-commerce unavailable screen
- [ ] Quick-commerce closed-hours screen
- [ ] Quick-commerce delivery-capacity screen
- [ ] Quick-commerce cart screen
- [ ] Quick-commerce address screen
- [ ] Quick-commerce delivery-instructions screen
- [ ] Quick-commerce order-review screen
- [ ] Quick-commerce payment screen
- [ ] Quick-commerce order-confirmation screen

### Category 11: Cart, Checkout, Orders & Delivery
- [ ] Cart screen
- [ ] Empty-cart screen
- [ ] Cart-item-details screen
- [ ] Quantity-update screen
- [ ] Remove-item confirmation screen
- [ ] Save-for-later screen
- [ ] Coupon-code screen
- [ ] Invalid-coupon screen
- [ ] Delivery-mode selection screen
- [ ] Address-selection screen
- [ ] Add-address screen
- [ ] Delivery-instructions screen
- [ ] Delivery-fee screen
- [ ] Tax-and-total screen
- [ ] Checkout-review screen
- [ ] Payment-method screen
- [ ] UPI-payment screen
- [ ] Card-payment screen
- [ ] Net-banking screen
- [ ] Cash-on-delivery screen
- [ ] Payment-processing screen
- [ ] Payment-success screen
- [ ] Payment-failed screen
- [ ] Payment-retry screen
- [ ] Duplicate-payment warning screen
- [ ] Order-confirmation screen
- [ ] Orders-list screen
- [ ] Empty-orders screen
- [ ] Active-order screen
- [ ] Order-details screen
- [ ] Order-status screen
- [ ] Order-tracking screen
- [ ] Order-accepted screen
- [ ] Order-preparing screen
- [ ] Order-ready screen
- [ ] Out-for-delivery screen
- [ ] Delivered screen
- [ ] Delivery-delayed screen
- [ ] Delivery-failed screen
- [ ] Address-not-found screen
- [ ] Contact-support screen
- [ ] Cancel-order screen
- [ ] Cancellation-success screen
- [ ] Return-request screen
- [ ] Return-status screen
- [ ] Refund-request screen
- [ ] Refund-status screen
- [ ] Invoice screen
- [ ] Payment-receipt screen
- [ ] Reorder screen
- [ ] Rate-order screen
- [ ] Missing-item screen
- [ ] Damaged-item screen

### Category 12: Referrals, Notifications, Profile, Privacy & Support
- [ ] Referral-introduction screen
- [ ] Personal-referral-code screen
- [ ] Referral-share screen
- [ ] Referral-link-copied screen
- [ ] Referral-progress screen
- [ ] Successful-referrals screen
- [ ] Pending-referrals screen
- [ ] Reward-earned screen
- [ ] Reward-history screen
- [ ] Referral-terms screen
- [ ] Duplicate-referral warning screen
- [ ] Referral-failure screen
- [ ] Notification-permission screen
- [ ] Notifications-inbox screen
- [ ] Notification-preferences screen
- [ ] Empty-notifications screen
- [ ] Profile-overview screen
- [ ] Edit-profile screen
- [ ] Name-edit screen
- [ ] Phone-number screen
- [ ] Email-address screen
- [ ] Saved-addresses screen
- [ ] Saved-products screen
- [ ] Previous-scans screen
- [ ] Orders-history screen
- [ ] Referral-account screen
- [ ] Notification-settings screen
- [ ] Privacy-settings screen
- [ ] Camera-permission settings screen
- [ ] Location-permission settings screen
- [ ] Data-consent screen
- [ ] Delete-face-images screen
- [ ] Delete-account screen
- [ ] Terms screen
- [ ] Privacy-policy screen
- [ ] Refund-policy screen
- [ ] Delivery-policy screen
- [ ] Help-center screen
- [ ] FAQ screen
- [ ] Contact-support screen
- [ ] Create-support-ticket screen
- [ ] My-support-tickets screen
- [ ] Report-problem screen
- [ ] App-rating screen
- [ ] Product-rating screen
