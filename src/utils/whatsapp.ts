/**
 * WhatsApp Deep-Linking & Messaging Utility
 * 
 * Generates WhatsApp API and universal links for vendor coordination,
 * delivery dispatch, and order status updates.
 */

/**
 * Normalizes phone numbers to WhatsApp international format (e.g. +91XXXXXXXXXX -> 91XXXXXXXXXX)
 */
export const normalizeWhatsAppPhone = (phone: string): string => {
  const cleaned = phone.replace(/[^\d]/g, '');
  // Default to Indian country code (91) if 10 digits provided
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
};

/**
 * Creates a WhatsApp direct chat deep link with pre-filled message text
 */
export const createWhatsAppOrderLink = (params: {
  phone: string;
  orderId: string;
  customerName?: string;
  messageType: 'VENDOR_NOTIFY' | 'RIDER_DISPATCH' | 'CUSTOMER_SUPPORT';
  extraDetails?: string;
}): string => {
  const { phone, orderId, customerName, messageType, extraDetails } = params;
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  let message = '';
  switch (messageType) {
    case 'VENDOR_NOTIFY':
      message = `Hello! New GlowVAI Order #${orderId} has been assigned to your store. Please review and accept/pack the order.${extraDetails ? `\nDetails: ${extraDetails}` : ''}`;
      break;
    case 'RIDER_DISPATCH':
      message = `GlowVAI Delivery Dispatch for Order #${orderId}.\nCustomer: ${customerName || 'N/A'}.${extraDetails ? `\nPickup/Drop: ${extraDetails}` : ''}`;
      break;
    case 'CUSTOMER_SUPPORT':
      message = `Hi GlowVAI Support, I have a query regarding Order #${orderId}.`;
      break;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
};
