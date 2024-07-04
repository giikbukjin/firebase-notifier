import { db } from '../../firebase/firebase-init';
import { doc, setDoc } from 'firebase/firestore';

export const saveTokenToServer = async (uid, token) => {
    try {
        const tokenRef = doc(db, 'tokens', uid);
        await setDoc(tokenRef, { token }, { merge: true });
        console.log('Token successfully saved to Firestore');
    } catch (error) {
        console.error('Error saving token to Firestore:', error);
    }
};
