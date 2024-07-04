import { getMessaging, getToken } from 'firebase/messaging';
import { registerServiceWorker } from "../../firebase/registerServiceWorker";
import { saveTokenToServer } from './saveTokenToServer';

// 로그인 한 유저의 첫 화면에서 토큰 발급 요청
export async function handleAllowNotification(currentUser) {
    registerServiceWorker();
    try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);

        if (permission === 'granted') {
            const messaging = getMessaging();
            const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });

            if (token) {
                console.log('FCM token:', token);
                if (currentUser) {
                    await saveTokenToServer(currentUser.uid, token);  // 현재 사용자의 UID와 토큰을 서버에 저장
                } else {
                    console.log('토큰을 저장할 사용자가 없습니다.');
                }
            } else {
                console.log('No registration token available. Request permission to generate one.');
                alert('토큰 등록이 불가능합니다. 생성하려면 권한을 허용해주세요');
            }
        } else if (permission === 'denied') {
            alert('web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요');
        }
    } catch (error) {
        console.error('푸시 토큰 가져오는 중 에러 발생', error);
    }
}