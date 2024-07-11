import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "../../firebase/firebase-init";

const messaging = getMessaging(app);

// 접속 중일 때 알림을 수신하는 Foreground Message
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