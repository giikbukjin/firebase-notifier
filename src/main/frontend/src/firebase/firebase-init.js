import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import axios from 'axios';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);
const provider = new GoogleAuthProvider();

export { auth, db, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
    doc, getDoc, messaging, provider };

export const requestPermission = async () => {
    try {
        await Notification.requestPermission();
        console.log('알림 권한이 부여되었습니다.');
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
        console.log('FCM 토큰:', token);
        await fetch('http://localhost:8080/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
    } catch (err) {
        console.error('알림 권한을 부여받을 수 없습니다.', err);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log('메시지를 수신했습니다. ', payload);
            resolve(payload);
        });
    });

export const postAnnouncementToBackend = async (message) => {
    try {
        const response = await axios.post('http://localhost:8080/announcements', message);
        console.log(response.data);
    } catch (error) {
        console.error('백엔드에 공지를 전송하는 중 오류 발생:', error);
    }
};

export const saveTokenToServer = async (uid, token) => {
    try {
        const tokenRef = doc(db, 'tokens', uid);
        await setDoc(tokenRef, { token }, { merge: true });
        console.log('토큰이 Firestore에 성공적으로 저장되었습니다.');
    } catch (error) {
        console.error('토큰을 Firestore에 저장하는 중 오류 발생:', error);
    }
};