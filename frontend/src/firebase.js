import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcuX5gam3Gnl-d-Ap8l94XTI-T2q6vsVY",
  authDomain: "prueba-5087b.firebaseapp.com",
  projectId: "prueba-5087b",
  storageBucket: "prueba-5087b.firebasestorage.app",
  messagingSenderId: "187347159741",
  appId: "1:187347159741:web:debf7ee6d6a990b5dc05d4",
  measurementId: "G-02ZECJC483"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Firestore con persistencia offline y soporte multi-tab
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export { analytics, logEvent, db }
