import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { UpdateWebFCMToken } from "../utils/api";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Get Firebase Messaging Instance
 */
export const getFirebaseMessaging = async () => {
  const supported = await isSupported();

  if (!supported) {
    console.log("Firebase Messaging is not supported.");
    return null;
  }

  return getMessaging(app);
};

/**
 * Request Notification Permission + Generate FCM Token
 */
export const requestNotificationPermission = async () => {
  try {
    const messaging = await getFirebaseMessaging();

    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

    if (permission !== "granted") {
      console.log("Notification Permission Denied");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (UserLoginId && currentToken) {
      await UpdateWebFCMToken(currentToken);
      return currentToken;
    }

    // if (currentToken) {
    //   console.log("FCM Token :", currentToken);
    //   // Yaha apni Backend API Call karna hai
    //   // saveTokenToDatabase(currentToken);
    //   return currentToken;
    // }

    console.log("No Registration Token Available");

    return null;
  } catch (error) {
    console.error("Error getting FCM Token:", error);

    return null;
  }
};

/**
 * Listen Foreground Notification
 */
export const onForegroundMessage = async (callback) => {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return;

  onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export default app;