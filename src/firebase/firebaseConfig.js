import APP_CONFIG from 'src/config/app.config';

const firebaseConfig = {
  apiKey: APP_CONFIG.FIREBASE_APIKEY,
  authDomain: APP_CONFIG.FIREBASE_AUTHDOMAIN,
  projectId: APP_CONFIG.FIREBASE_PROJECTID,
  storageBucket: APP_CONFIG.FIREBASE_STORAGEBUCKET,
  messagingSenderId: APP_CONFIG.FIREBASE_MESSAGINGSENDERID,
  appId: APP_CONFIG.FIREBASE_APPID,
  measurementId: APP_CONFIG.FIREBASE_MEASUREMENTID,
};

export default firebaseConfig;
