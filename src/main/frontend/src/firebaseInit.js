import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import { getDatabase } from 'firebase/database';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };