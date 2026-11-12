"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";
import { notificationService } from "./notification-service";

const DEVICE_ID_KEY = "medilink-notification-device-id";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured(): boolean {
  return (
    Object.values(firebaseConfig).every(Boolean) &&
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY)
  );
}

export function isWebPushConfigured(): boolean {
  return isConfigured();
}

function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const deviceId = crypto.randomUUID().replaceAll("-", "");
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

async function getMessagingClient() {
  if (!isConfigured()) {
    throw new Error(
      "Les notifications push ne sont pas configurées. Ajoutez la configuration publique Firebase et la clé VAPID au frontend.",
    );
  }
  if (
    typeof window === "undefined" ||
    !window.isSecureContext ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !(await isSupported())
  ) {
    throw new Error(
      "Les notifications push web ne sont pas prises en charge par ce navigateur ou ce contexte.",
    );
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getMessaging(app);
}

export async function registerWebPush(): Promise<void> {
  const messaging = await getMessagingClient();
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Les notifications sont bloquées dans les paramètres du navigateur."
        : "Autorisez les notifications pour activer les alertes MediLink.",
    );
  }
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) {
    throw new Error("Firebase n’a pas pu créer un abonnement push pour cet appareil.");
  }
  await notificationService.registerDevice({
    deviceId: getDeviceId(),
    token,
    platform: "web",
    userAgent: navigator.userAgent,
  });
}

export async function unregisterWebPush(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.getRegistration(
    "/firebase-messaging-sw.js",
  );
  if (!registration || !isConfigured() || !(await isSupported())) return;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (token) {
    await notificationService.unregisterDevice(getDeviceId());
    await deleteToken(messaging);
  }
}

export async function listenForWebPush(
  onPayload: (payload: MessagePayload) => void,
): Promise<() => void> {
  const messaging = await getMessagingClient();
  return onMessage(messaging, (payload) => {
    onPayload(payload);
    window.dispatchEvent(new CustomEvent("medilink:notification"));
    const title = payload.data?.title;
    const body = payload.data?.body;
    if (
      Notification.permission === "granted" &&
      typeof title === "string" &&
      typeof body === "string"
    ) {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        data: { url: payload.data?.url ?? "/" },
      });
    }
  });
}
