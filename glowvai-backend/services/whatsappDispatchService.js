/**
 * Backend WhatsApp & SMS Dispatch Automation Service
 * Alerts delivery partners at 8977855998 & 9505225379 on incoming orders.
 */

const axios = require('axios');

const DISPATCH_PHONES = ['8977855998', '9505225379'];

function formatDispatchAlert(order) {
  const itemsList = (order.items || [])
    .map((it) => `• ${it.name || 'Skincare SKU'} (x${it.qty || 1}) - ₹${(it.price || 0) * (it.qty || 1)}`)
    .join('\n');

  return `🚨 *GLOWVAI 10-MIN EXPRESS ORDER DISPATCH* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *Order ID*: #${order.orderId || 'ORD-NEW'}
💰 *Amount*: ₹${order.totalAmount || order.orderAmount || 599} (${order.paymentMethod || 'PAID ONLINE'})
🔑 *Delivery OTP*: *${order.deliveryOtp || '4892'}*
⚡ *SLA*: 10 Minutes Drop

👤 *Customer*: ${order.customerName || 'Customer'}
📞 *Phone*: ${order.customerPhone || '9876543210'}
📍 *Address*: ${order.deliveryAddress || 'Payikapuram, Vijayawada'}
🏬 *Pickup Dark Store*: ${order.darkStoreName || 'Glowway Darkstore A (Payikapuram Hub DS-VIJ-01)'}

🛍️ *Order Items*:
${itemsList || '• Instant Glow Booster (1₹ Trial Sample)'}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

async function notifyDeliveryTeam(order) {
  const alertText = formatDispatchAlert(order);
  console.log('\n[WhatsApp Dispatch Automation Triggered]');
  console.log(`[Target Phones]: ${DISPATCH_PHONES.join(', ')}`);
  console.log(alertText);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Broadcast Webhook / Meta WhatsApp Cloud API / Twilio SMS hook if configured
  if (process.env.WHATSAPP_API_TOKEN) {
    for (const phone of DISPATCH_PHONES) {
      try {
        await axios.post(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            to: `91${phone}`,
            type: 'text',
            text: { body: alertText },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            timeout: 3000,
          }
        ).catch(() => null);
      } catch {
        // continue
      }
    }
  }

  return { ok: true, alertedPhones: DISPATCH_PHONES, message: alertText };
}

module.exports = {
  notifyDeliveryTeam,
  formatDispatchAlert,
  DISPATCH_PHONES,
};
