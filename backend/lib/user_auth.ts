import { credential, apps } from 'firebase-admin';
import { initializeApp } from "firebase-admin/app";

export const initFirebaseApp = () => {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    
    if (apps.length === 0) {
        initializeApp({
            credential: credential.cert(serviceAccount)
        });
    }    
}
