import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, OrderStatus } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export const ORDERS_COLLECTION = 'orders';

/**
 * Save a new order to Firebase Firestore and notify server email endpoint
 */
export async function createFirestoreOrder(order: Order): Promise<{ success: boolean; firestoreId?: string; error?: string }> {
  try {
    const docData = {
      orderId: order.id,
      createdAt: order.createdAt,
      timestamp: serverTimestamp(),
      customerInfo: {
        fullName: order.customerInfo.fullName,
        email: order.customerInfo.email,
        phone: order.customerInfo.phone,
        address: order.customerInfo.address,
        city: order.customerInfo.city,
        postalCode: order.customerInfo.postalCode || '',
        businessName: order.customerInfo.businessName || '',
        googleReviewUrlOrPlace: order.customerInfo.googleReviewUrlOrPlace || '',
        notes: order.customerInfo.notes || '',
      },
      items: order.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        format: item.product.format,
        businessName: item.businessName || '',
        customGoogleLink: item.customGoogleLink || '',
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      adminNotificationSentTo: 'jaesthetic.info@gmail.com',
    };

    // Save into Firestore 'orders' collection
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), docData);

    // Also trigger the backend email notification route
    try {
      fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order,
          firestoreDocId: docRef.id,
          recipientEmail: 'jaesthetic.info@gmail.com',
        }),
      }).catch((err) => console.warn('Email dispatch warning (async):', err));
    } catch (e) {
      console.warn('Could not call /api/orders/notify', e);
    }

    return { success: true, firestoreId: docRef.id };
  } catch (error: any) {
    console.error('Failed to create order in Firestore:', error);
    return { success: false, error: error?.message || 'Database error' };
  }
}

/**
 * Fetch all orders from Firestore (for Admin Dashboard / Order Management)
 */
export async function fetchAllFirestoreOrders(): Promise<any[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      docId: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Failed to fetch Firestore orders:', error);
    return [];
  }
}

/**
 * Update order status in Firestore (e.g., from pending -> processing -> shipped -> delivered)
 */
export async function updateFirestoreOrderStatus(docId: string, newStatus: OrderStatus): Promise<boolean> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, docId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Failed to update Firestore order status:', error);
    return false;
  }
}

/**
 * Real-time listener for Firestore orders
 */
export function subscribeToOrders(callback: (orders: any[]) => void) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      callback(orders);
    });
  } catch (e) {
    console.error('Error subscribing to orders:', e);
    return () => {};
  }
}
