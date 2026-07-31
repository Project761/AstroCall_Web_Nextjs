"use client";

import { useEffect } from "react";
import { requestNotificationPermission, onForegroundMessage } from "../lib/firebase";

export default function NotificationProvider() {
  useEffect(() => {
    const userId = localStorage.getItem("UserLoginId");
    if (!userId) return;

    const initializeNotifications = async () => {
      // Request Permission & Register Token
      // await requestNotificationPermission();

      // Listen Foreground Notification
      await onForegroundMessage((payload) => {
        try {
          let title = "New Notification";
          let body = "";
          let image = "";
          let redirectUrl = "/notifications";

          if (payload?.data?.key_1) {
            const data = JSON.parse(payload.data.key_1);
            title = data.Title || "New Notification";
            body = data.Message || "";

            // Image URL
            if (data.UploadImage) {
              image = data.UploadImage.startsWith("http")
                ? data.UploadImage
                : `https://${data.UploadImage}`;
            }

            // Redirect Page
            switch (data.TableType) {
              case "Notification":
                redirectUrl = "/PalmReading";
                break;

              case "PalmReading":
                redirectUrl = "/PalmReading";
                break;

              case "Chat":
                redirectUrl = "/Chat";
                break;

              default:
                redirectUrl = "/";
            }
          }

          // Play Notification Sound
          const audio = new Audio("/notify.mp3");

          audio.play().catch((err) => {
            console.log("Audio Play Error :", err);
          });

          // Browser Notification
          if (Notification.permission === "granted") {
            const notification = new Notification(title, {
              body: body,
              // public/logo.png
              icon: "/images/logo1.webp",
              image: image || undefined,
              badge: "/images/logo1.webp",
              tag: "astrocall-notification",
              requireInteraction: false,
              silent: false,
            });

            notification.onclick = () => {
              notification.close();
              window.focus();
              window.location.href = redirectUrl;
            };
          }
        } catch (error) {
          console.log("Notification Error :", error);
        }
      });
    };

    initializeNotifications();
  }, []);

  return null;
}