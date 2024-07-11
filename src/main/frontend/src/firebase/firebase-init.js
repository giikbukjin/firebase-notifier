import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getMessaging, onMessage } from 'firebase/messaging';
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging();

export { auth, db, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
    doc, getDoc, messaging, provider, app };

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