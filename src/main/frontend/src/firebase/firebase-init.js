import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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

export {
    auth,
    db,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    onAuthStateChanged,
    signOut,
    doc,
    getDoc,
    messaging
};

export const requestPermission = async () => {
    try {
        await Notification.requestPermission();
        console.log('Notification permission granted.');
        const token = await getToken(messaging);
        console.log('FCM Token:', token);
        // 서버에 토큰을 저장하는 코드 추가
        await fetch('http://localhost:8080/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
    } catch (err) {
        console.error('Unable to get permission to notify.', err);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            resolve(payload);
        });
    });

export const postAnnouncementToBackend = async (message) => {
    try {
        const response = await axios.post('http://localhost:8080/announcements', message);
        console.log(response.data);
    } catch (error) {
        console.error('Error posting announcement to backend:', error);
    }
};