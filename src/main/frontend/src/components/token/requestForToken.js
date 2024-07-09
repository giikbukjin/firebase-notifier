import {getMessaging, getToken} from "firebase/messaging";
import {useState} from "react";

const [ token, setToken ] = useState(null);
const [notificationPermission, setNotificationPermission] = useState(null);

const messaging = getMessaging();

const requestForToken = () => {
    return getToken(messaging, {vapidKey: process.env.REACT_APP_VAPID_KEY})
        .then((token) => {
            if (token) {
                console.log('FCM 토큰:', token);
                setToken(token);
            } else {
                console.error('알림 권한을 부여받을 수 없습니다.');
            }
        })
        .catch((err) => {
            if (err.code === 'messaging/permission-blocked') {
                console.error("알림 권한이 차단되었습니다.");
            } else {
                console.error("FCM 토큰 요청 중 오류가 발생했습니다.", err);
            }
        });

        // Notification.requestPermission().then((permission) => {
        //     setNotificationPermission(permission);
        //     if (permission === 'granted') {
        //         requestForToken();
        //     } else {
        //         console.log('알림 비허용');
        //     }
        // })
};