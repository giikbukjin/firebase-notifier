import { getMessaging, getToken } from 'firebase/messaging';
import { registerServiceWorker } from "../../firebase/registerServiceWorker";

// 로그인 한 유저의 첫 화면에서 토큰 발급 요청
export async function handleAllowNotification() {
    registerServiceWorker();
    try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);

        if (permission === 'granted') {
            const messaging = getMessaging();
            try {
                const currentToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });

                if (currentToken) {
                    console.log('FCM token:', currentToken);
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                    alert('토큰 등록이 불가능합니다. 생성하려면 권한을 허용해주세요');
                }
            } catch (error) {
                if (error.code === 'messaging/token-unsubscribe-failed') {
                    console.log('Token unsubscribe failed:', error);
                } else {
                    throw error;
                }
            }
        } else if (permission === 'denied') {
            alert('web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요');
        }
    } catch (error) {
        console.error('푸시 토큰 가져오는 중 에러 발생', error);
    }
}