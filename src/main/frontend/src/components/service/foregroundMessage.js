import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "../../firebase/firebase-init";

// 앱이 켜져 있을 때 메시지 수신
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
    console.log("알림 도착 ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body
    };

    if (Notification.permission === "granted") {
        new Notification(notificationTitle, notificationOptions);
    }
});