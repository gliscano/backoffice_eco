// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// import APP_CONFIG from 'src/config/app.config';
// import { getAnalytics } from "firebase/analytics";

const { default: firebaseConfig } = require('./firebaseConfig');
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
// const storageRef = ref(storage, `gs://${APP_CONFIG.FIREBASE_STORAGEBUCKET}`);

export default storage;
