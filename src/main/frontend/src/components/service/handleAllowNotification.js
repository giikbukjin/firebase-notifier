import { getMessaging, getToken } from 'firebase/messaging';
import {saveTokenToServer} from "../../firebase/firebase-init";

// 로그인 한 유저의 첫 화면에서 토큰 발급 요청
export async function handleAllowNotification(currentUser) {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const messaging = getMessaging();
            const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });

            if (token) {
                if (currentUser) {
                    await saveTokenToServer(currentUser.uid, token);
                } else {
                    console.log('토큰을 저장할 사용자가 없습니다.');
                }
            } else {
                alert('토큰 등록이 불가능합니다. 생성하려면 권한을 허용해주세요');
            }
        } else if (permission === 'denied') {
            alert('웹 푸시 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요');
        }
    } catch (error) {
        console.error('푸시 토큰을 가져오는 중 에러가 발생했습니다:', error);
    }
}
