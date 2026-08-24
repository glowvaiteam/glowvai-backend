# GlowVAI V2 — Beauty Protection Rules & Warranty Framework

## 1. Concept & Scope
**Beauty Protection** is an optional assurance policy offered on select high-efficacy skincare products (e.g., active serums, clinical exfoliants, dermatological creams). It gives users peace of mind when trying new skincare formulations recommended by the AI.

---

## 2. Product Eligibility & Configuration
- **Admin Control**: Products must have `isBeautyProtectionEligible: true` in Firestore.
- **Protection Fee**: Configurable per product (typically ₹29 – ₹59 or 5–10% of product price).
- **Opt-in Flow**: During cart review or product page, user can check/uncheck the "Add Beauty Protection" toggle.

---

## 3. Covered Events & Guarantee Policy

| Coverage Reason | Criteria & Evidence Required | Resolution |
| :--- | :--- | :--- |
| **Adverse Reaction (Allergy/Breakout)** | User experienced visible irritation within 14 days of delivery. Must provide clear photo evidence and description. | 100% product refund or replacement voucher. |
| **Transit Damage / Leakage** | Damaged bottle, broken seal, or leaked liquid upon opening. Photo of packaging + batch number required within 48h. | Immediate free replacement or full refund. |
| **Authenticity / Seal Tamper** | Packaging shows signs of tampering. | Full refund + incident report to vendor. |

### Exclusions:
- Products not flagged with Beauty Protection at checkout.
- Claims filed after the 14-day protection window.
- Normal, expected mild purging without severe irritation (clear guide provided to user).
- Subjective scent or color dissatisfaction when product is intact and as advertised.

---

## 4. Claims Processing Flow
1. **User Submission**: User goes to Order Details → "File Beauty Protection Claim", selects reason, uploads photos, and writes notes.
2. **Firestore Document Created**: Added to `beautyProtectionClaims` collection with `status: 'SUBMITTED'`.
3. **Admin Review Portal**: Operations/Dermatology support team reviews photos and notes within 24–48 hours.
4. **Resolution**:
   - `APPROVED`: Automated refund initiated via payment gateway webhook / GlowVAI Wallet credit.
   - `REJECTED`: Clear explanatory email and push notification sent to user with reasoning.
   - `REFUNDED`: Final state once banking/gateway confirms payout.
