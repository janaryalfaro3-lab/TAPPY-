import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
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
 * Save a new order to Firebase Firestore and notify server email & mock SMS endpoints
 */
export async function createFirestoreOrder(order: Order): Promise<{ success: boolean; firestoreId?: string; trackingUrl?: string; error?: string }> {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tapreview.ph';
    const trackingUrl = `${origin}/?track=${order.id}`;

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
      trackingUrl,
      trackingNumber: `JT-PH-${order.id.replace('TR-', '')}`,
      courier: 'J&T Express Philippines',
      smsNotification: {
        sent: true,
        recipient: order.customerInfo.phone,
        gateway: 'PhilSMS / Semaphore Mock',
        status: 'DELIVERED_MOCK',
      },
      adminNotificationSentTo: 'jaesthetic.info@gmail.com',
    };

    // Save into Firestore 'orders' collection
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), docData);

    // Also trigger the backend email and automated mock SMS notification route
    try {
      fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            ...order,
            trackingUrl,
          },
          firestoreDocId: docRef.id,
          recipientEmail: 'jaesthetic.info@gmail.com',
        }),
      }).catch((err) => console.warn('Email/SMS dispatch warning (async):', err));
    } catch (e) {
      console.warn('Could not call /api/orders/notify', e);
    }

    return { success: true, firestoreId: docRef.id, trackingUrl };
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

/**
 * Fetch a single order by its human-readable orderId from Firestore
 */
export interface FirestoreOrderLookupResult {
  found: boolean;
  searchedId: string;
  order?: {
    docId: string;
    orderId: string;
    status: OrderStatus;
    stageTitle: string;
    stageDescription: string;
    customerName: string;
    email: string;
    phone: string;
    destination: string;
    fullAddress: string;
    businessName: string;
    googleReviewUrlOrPlace: string;
    courier: string;
    trackingNumber: string;
    trackingUrl: string;
    estimatedDelivery: string;
    total: number;
    subtotal: number;
    shipping: number;
    paymentMethod: string;
    createdAt: string;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
      format?: string;
      businessName?: string;
      customGoogleLink?: string;
    }>;
    adminNotificationSentTo?: string;
  };
  error?: string;
}

/**
 * Robust lookup tool that queries the Firestore 'orders' collection by order ID,
 * tracking number, or document ID to answer customer queries with real data.
 */
export async function lookupOrderInFirestore(queryInput: string): Promise<FirestoreOrderLookupResult> {
  const raw = (queryInput || '').trim();
  if (!raw) {
    return { found: false, searchedId: raw, error: 'Please enter a valid Order ID' };
  }

  // Remove leading '#' or 'order ' prefix if present
  let cleanId = raw.replace(/^[#\s]+/, '').replace(/^order[:\s-]*/i, '').trim();
  const upperId = cleanId.toUpperCase();

  try {
    let matchedDocData: any = null;
    let matchedDocId: string = '';

    // 1. Query by exact orderId (e.g. "TR-104928" or normalized)
    const candidates = [cleanId, upperId];
    if (!upperId.startsWith('TR-') && /^\d{5,8}$/.test(upperId)) {
      candidates.push(`TR-${upperId}`);
    }

    for (const testId of candidates) {
      const q = query(collection(db, ORDERS_COLLECTION), where('orderId', '==', testId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        matchedDocData = snap.docs[0].data();
        matchedDocId = snap.docs[0].id;
        break;
      }
    }

    // 2. If not found, try querying by trackingNumber
    if (!matchedDocData) {
      for (const testId of candidates) {
        const qTrack = query(collection(db, ORDERS_COLLECTION), where('trackingNumber', '==', testId));
        const snapTrack = await getDocs(qTrack);
        if (!snapTrack.empty) {
          matchedDocData = snapTrack.docs[0].data();
          matchedDocId = snapTrack.docs[0].id;
          break;
        }
      }
    }

    // 3. If not found, check if input is a direct Firestore document ID
    if (!matchedDocData && cleanId.length > 10) {
      try {
        const docRef = doc(db, ORDERS_COLLECTION, cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          matchedDocData = docSnap.data();
          matchedDocId = docSnap.id;
        }
      } catch {
        // Document ID not found or invalid format
      }
    }

    if (!matchedDocData) {
      return {
        found: false,
        searchedId: raw,
      };
    }

    // Map order status to clear customer-facing stages
    const status: OrderStatus = matchedDocData.status || 'pending';
    let stageTitle = 'Chip Encoding & Quality Inspection';
    let stageDescription = 'Your NFC NTAG213 microchip is being encoded with your Google Review URL and tested for instant phone tap response.';

    if (status === 'shipped') {
      stageTitle = 'Shipped & In Transit';
      stageDescription = `Handed over to ${matchedDocData.courier || 'J&T Express Philippines'}. Package is en route to your shipping address.`;
    } else if (status === 'in_production') {
      stageTitle = 'In Production / Hardware Assembly';
      stageDescription = 'Hardware acrylic stand / matte tag assembly is being assembled with anti-scratch UV finish.';
    } else if (status === 'delivered') {
      stageTitle = 'Delivered to Destination';
      stageDescription = 'Your TAPPY NFC package has been successfully delivered and is ready on your counter!';
    } else if (status === 'pending') {
      stageTitle = 'Order Placed & Queued';
      stageDescription = 'Order received and payment verified. Hardware is queued for custom programming.';
    } else if (status === 'cancelled') {
      stageTitle = 'Order Cancelled';
      stageDescription = 'This order has been cancelled. Please contact support for questions.';
    }

    const cust = matchedDocData.customerInfo || {};
    const items = Array.isArray(matchedDocData.items)
      ? matchedDocData.items.map((item: any) => ({
          productName: item.productName || item.product?.name || 'TAPPY NFC Product',
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          format: item.format || '',
          businessName: item.businessName || '',
          customGoogleLink: item.customGoogleLink || '',
        }))
      : [];

    return {
      found: true,
      searchedId: raw,
      order: {
        docId: matchedDocId,
        orderId: matchedDocData.orderId || cleanId,
        status,
        stageTitle,
        stageDescription,
        customerName: cust.fullName || 'Valued Customer',
        email: cust.email || '',
        phone: cust.phone || '',
        destination: `${cust.city || 'Philippines'}${cust.postalCode ? `, ${cust.postalCode}` : ''}`,
        fullAddress: `${cust.address || ''}, ${cust.city || ''} ${cust.postalCode || ''}`.trim(),
        businessName: cust.businessName || 'Your Business',
        googleReviewUrlOrPlace: cust.googleReviewUrlOrPlace || '',
        courier: matchedDocData.courier || 'J&T Express Philippines',
        trackingNumber: matchedDocData.trackingNumber || `JT-PH-${(matchedDocData.orderId || '').replace('TR-', '')}`,
        trackingUrl: matchedDocData.trackingUrl || `/?track=${matchedDocData.orderId}`,
        estimatedDelivery: matchedDocData.estimatedDelivery || '2–4 Business Days',
        total: Number(matchedDocData.total) || 0,
        subtotal: Number(matchedDocData.subtotal) || 0,
        shipping: Number(matchedDocData.shipping) || 0,
        paymentMethod: (matchedDocData.paymentMethod || 'gcash').toUpperCase(),
        createdAt: matchedDocData.createdAt || 'Recent',
        items,
        adminNotificationSentTo: matchedDocData.adminNotificationSentTo,
      },
    };
  } catch (error: any) {
    console.error('Error querying Firestore order:', error);
    return {
      found: false,
      searchedId: raw,
      error: error?.message || 'Database lookup failed',
    };
  }
}

