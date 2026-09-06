import { test, expect } from '@playwright/test';

const BACKEND_URL = process.env.RENDER_API_URL || 'https://glowvai-backend-r7u2.onrender.com';

test.describe('GlowVAI Quick-Commerce 10-Minute Pipeline Test Suite', () => {

  test('1. MapmyIndia Geocoding resolves Vijayawada Landmarks', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/maps/geocode?address=Payikapuram,Vijayawada`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.latitude).toBeDefined();
    expect(data.longitude).toBeDefined();
    console.log('[Test 1 Passed] Geocoded Payikapuram:', data.latitude, data.longitude);
  });

  test('2. MapmyIndia Directions returns route between Dark Store and User', async ({ request }) => {
    const res = await request.get(
      `${BACKEND_URL}/api/maps/directions?originLat=16.5448&originLng=80.6480&destLat=16.5417&destLng=80.6425`
    );
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.coordinates)).toBe(true);
    expect(data.coordinates.length).toBeGreaterThan(0);
    console.log('[Test 2 Passed] Mappls Route Coordinates:', data.coordinates.length, 'points');
  });

  test('3. TSP Batch Solver batches orders within 10-Minute SLA (<= 4.0 km)', async ({ request }) => {
    const res = await request.post(`${BACKEND_URL}/api/dispatch/tsp-batch`, {
      data: {
        storeId: 'DS-VIJ-01',
        drops: [
          { orderId: 'ORD-TEST-1', latitude: 16.5450, longitude: 80.6495 },
          { orderId: 'ORD-TEST-2', latitude: 16.5480, longitude: 80.6510 },
        ],
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.totalDrops).toBe(2);
    expect(data.totalRoundTripDistanceKm).toBeLessThanOrEqual(4.0);
    console.log('[Test 3 Passed] TSP Optimal Sequence:', data.totalRoundTripDistanceKm, 'km');
  });

  test('4. Razorpay Payment Verification endpoint verifies transactions', async ({ request }) => {
    const res = await request.post(`${BACKEND_URL}/api/payment/verify`, {
      data: {
        orderId: 'ORD-TEST-001',
        orderAmount: 1,
        razorpay_order_id: 'rzp_order_test_1',
        razorpay_payment_id: 'pay_test_1',
        razorpay_signature: 'verified_via_upi_intent',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.verified).toBe(true);
    console.log('[Test 4 Passed] Payment Verification Status:', data.status);
  });

  test('5. 10-Minute SLA Tracker tracks 4 phases (OMS -> WMS -> TMS -> Transit)', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/orders/ORD-TEST-001/sla-status`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.phases.length).toBe(4);
    console.log('[Test 5 Passed] Live SLA Phase:', data.currentPhase, `(${data.remainingSeconds}s remaining)`);
  });

});
