importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

self.addEventListener("install", function (e) {
    self.skipWaiting();
});

self.addEventListener("activate", function (e) {
    console.log("fcm service worker가 실행되었습니다.");
});

const firebaseConfig = initializeApp({
    apiKey: "AIzaSyCX5FIkIXGZOvFojpKhsIoOME4QGrhHuog",
    authDomain: "fir-notifier-ffcfd.firebaseapp.com",
    projectId: "fir-notifier-ffcfd",
    storageBucket: "fir-notifier-ffcfd.appspot.com",
    messagingSenderId: "73444890210",
    appId: "1:73444890210:web:16555aad5b65783fafa33b",
    measurementId: "G-7N8BT8VM83"
});

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);