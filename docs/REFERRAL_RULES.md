# GlowVAI V2 — Student Referral Program & Coin System

## 1. Objectives & Value Proposition
The GlowVAI Student Referral Program incentivizes college students to share personalized skincare routines with peers, earning **GlowVAI Referral Coins** redeemable for discounts on future orders.

---

## 2. Student Verification Workflow
1. User submits college details:
   - College / University Name
   - Student ID Card photo or college email (.edu / .ac.in)
2. Status set to `PENDING_VERIFICATION`.
3. Admin reviews or automated domain check approves the user:
   - `isStudentVerified` becomes `true`.
   - Generates personalized student referral link & code (e.g., `GLOW-RAJESH-10`).

---

## 3. Referral Mechanics & Coin Awarding Pipeline

### 3.1 New User Onboarding via Referral
- When a new referee registers using a referral code/link:
  - `referredByCode` is stored in the referee's `users` document.
  - Referee gets a welcome discount (e.g., 10% off first order up to ₹100).

### 3.2 Earning Rules for Referrer
- Coins are **NOT** awarded immediately on order placement to prevent fraud.
- **Trigger**: The referee's order status transitions to `DELIVERED`.
- **Holding / Cooling Period**: 7-day return window must expire without cancellation or return request.
- **Award Calculation**:
  - Direct Reward: 50 GlowVAI Coins per completed referee order >= ₹399 minimum cart value.
  - Value: 1 GlowVAI Coin = ₹1.00 store discount credit.
- **Cloud Function Execution**: A scheduled Cloud Function processes eligible deliveries daily, calculates coins, writes to `users/{userId}/coinTransactions`, and updates `referralCoinBalance`.

---

## 4. Coin Redemption Constraints
- **Maximum Redemption**: Coins can cover up to 20% of an order's subtotal (prevents 100% free order abuse).
- **Minimum Cart Value**: Minimum ₹299 cart value required to redeem coins.
- **Stackability**: Coins can be combined with free delivery thresholds, but cannot be combined with certain exclusive coupon codes unless permitted by admin rules.
- **Expiration**: Coins expire 180 days from the date of issue if unused.

---

## 5. Anti-Fraud & Abuse Prevention
1. **Self-Referral Prevention**: Cloud Functions reject referral claims where referrer UID == referee UID, or when payment instrument / device fingerprint matches.
2. **Device Limits**: Maximum of 2 referred accounts registered per physical Android device ID.
3. **Cancelled / Returned Orders**: If an order is returned or refunded under Beauty Protection, referral coins are voided / clawed back automatically.
4. **Daily / Monthly Caps**: A single student referrer cannot earn more than 2,000 coins per calendar month without manual admin tier escalation.
