import { getMessaging, getToken } from 'firebase/messaging';
import {saveTokenToServer} from "../../firebase/firebase-init";

// 로그인 한 유저의 첫 화면에서 토큰 발급 요청
export async function handleAllowNotification(currentUser) {
    try {
        const permission = await Notification.requestPermission();
        console.log('알림 권한:', permission);

        if (permission === 'granted') {
            const messaging = getMessaging();
            const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });

            if (token) {
                console.log('FCM 토큰:', token);
                if (currentUser) {
                    await saveTokenToServer(currentUser.uid, token);  // 현재 사용자의 UID와 토큰을 서버에 저장
                    console.log(`토큰이 서버에 저장되었습니다. UID: ${currentUser.uid}`);
                } else {
                    console.log('토큰을 저장할 사용자가 없습니다.');
                }
            } else {
                console.log('등록 토큰을 사용할 수 없습니다. 권한을 요청하세요.');
                alert('토큰 등록이 불가능합니다. 생성하려면 권한을 허용해주세요');
            }
        } else if (permission === 'denied') {
            alert('웹 푸시 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요');
        }
    } catch (error) {
        console.error('푸시 토큰을 가져오는 중 에러가 발생했습니다:', error);
    }
}
