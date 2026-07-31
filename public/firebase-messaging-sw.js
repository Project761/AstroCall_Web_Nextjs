/* eslint-disable no-undef */

// Firebase SDK
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

// Firebase Config
firebase.initializeApp({
    apiKey: "AIzaSyAZuwSeGtHQfLQEQTBNNN3b5HMkkuS-LOU",
    authDomain: "app-astrocall-live.firebaseapp.com",
    projectId: "app-astrocall-live",
    storageBucket: "app-astrocall-live.firebasestorage.app",
    messagingSenderId: "707341062386",
    appId: "1:707341062386:web:e90471235d8e3ab21b006b",
    measurementId: "G-JJP1G6GTMN"
});

// Messaging Instance
const messaging = firebase.messaging();

// Background Notification
// messaging.onBackgroundMessage(function (payload) {
//     console.log("[firebase-messaging-sw.js] Background Message ", payload);

//     const notificationTitle =
//         payload.notification?.title || "New Notification";

//     const notificationOptions = {
//         body: payload.notification?.body || "",
//         icon: "/images/logo1.webp", 
//         badge: "/images/logo1.webp",
//         image: payload.notification?.image,
//         data: payload.data || {},
//         requireInteraction: false,
//     };

//     self.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//     );
// });

messaging.onBackgroundMessage((payload) => {
    let title = "New Notification";
    let body = "";
    let image = "";
    let redirectUrl = "/chat-to-astrologers";

    if (payload.data && payload.data.key_1) {
        const data = JSON.parse(payload.data.key_1);

        title = data.Title || "New Notification";
        body = data.Message || "";

        if (data.UploadImage) {
            image = data.UploadImage.startsWith("http")
                ? data.UploadImage
                : `https://${data.UploadImage}`;
        }
    }

    self.registration.showNotification(title, {
        body,
        icon: "/images/logo1.webp",
        badge: "/images/logo1.webp",
        image,
        data: {
            url: redirectUrl,
        },
    });
});

// Notification Click
self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const url =
        event.notification.data?.click_action ||
        event.notification.data?.url ||
        "/";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});