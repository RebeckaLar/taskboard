import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, persistentLocalCache, persistentMultipleTabManager, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

//Avoiding initializing mult apps when updating components
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)


let db 

try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
            cacheSizeBytes: CACHE_SIZE_UNLIMITED
        })
    })
} catch (error) {
    console.warn("IndexedDB cache avaktiverad: ", error.code)
    db = getFirestore(app)
}

const auth = getAuth(app)
const storage = getStorage(app)

export {
    db,
    auth,
    storage
}