/**
 * Order Service for Customer Orders & Real-time Tracking in GlowVAI V2
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  OrderDocument,
  OrderItem,
  OrderPricing,
  OrderPayment,
  OrderDeliveryType,
  UserAddress,
} from '../types';
import { ORDERS_COLLECTION } from './vendorService';

export interface CreateOrderParams {
  orderId?: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryType: OrderDeliveryType;
  vendorId?: string | null;
  vendorName?: string | null;
  zoneId?: string | null;
  items: OrderItem[];
  shippingAddress: UserAddress;
  pricing: OrderPricing;
  payment: OrderPayment;
  referralCodeUsed?: string | null;
}

/**
 * Creates a new customer order in Firestore
 */
export const createOrder = async (params: CreateOrderParams): Promise<OrderDocument> => {
  const orderId = params.orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = Date.now();

  const newOrder: OrderDocument = {
    orderId,
    userId: params.userId,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    deliveryType: params.deliveryType,
    vendorId: params.vendorId || null,
    vendorName: params.vendorName || null,
    vendorStatus: params.vendorId ? 'PENDING' : undefined,
    zoneId: params.zoneId || null,
    items: params.items,
    shippingAddress: params.shippingAddress,
    pricing: params.pricing,
    payment: params.payment,
    status: 'PLACED',
    referralCodeUsed: params.referralCodeUsed || null,
    referralProcessed: false,
    createdAt: now,
    updatedAt: now,
  };

  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await setDoc(orderRef, newOrder);
  return newOrder;
};

/**
 * Fetches order by orderId
 */
export const getOrderById = async (orderId: string): Promise<OrderDocument | null> => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const snapshot = await getDoc(orderRef);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as OrderDocument;
};

/**
 * Fetches user order history
 */
export const getUserOrders = async (userId: string): Promise<OrderDocument[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as OrderDocument);
};

/**
 * Subscribes to real-time updates for a single order
 */
export const subscribeToOrder = (
  orderId: string,
  onUpdate: (order: OrderDocument) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  return onSnapshot(
    orderRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as OrderDocument);
      }
    },
    onError
  );
};
