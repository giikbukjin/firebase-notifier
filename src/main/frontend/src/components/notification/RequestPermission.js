import { getMessaging, getToken } from "firebase/messaging";
//import { sendTokenToServer } from "./api";
import { registerServiceWorker } from "./RegisterServiceWorker";

// 접속한 사용자에게서 토큰 발급 요청 (브라우저 알림 허용 필요)
export function requestPermission() {
    registerServiceWorker();
    const messaging = getMessaging();

    Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: process.env.REACT_APP_VAPID_KEY
            });
            console.log('알림 권한 허용', token);
            //sendTokenToServer(token);
        } else if (permission === "denied") {
            alert("web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요");
        }
    });
}