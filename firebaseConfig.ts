import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, inMemoryPersistence } from "firebase/auth";
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_PROJECT_NUMBER",
  appId: "YOUR_FIREBASE_APP_ID"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = Platform.OS === 'web'
  ? getAuth(app)
  : (() => {
      try {
        return initializeAuth(app, {
          persistence: inMemoryPersistence
        });
      }
      catch {
        return getAuth(app);
      }
    })();

export { app, auth };