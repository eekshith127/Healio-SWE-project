import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, inMemoryPersistence, type Auth } from "firebase/auth";
import * as AuthModule from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBuG2omd9qbxyladvPXbWAk4H1yHOy4sTU",
  authDomain: "healio-bf5ed.firebaseapp.com",
  projectId: "healio-bf5ed",
  storageBucket: "healio-bf5ed.appspot.com",
  messagingSenderId: "691732173849",
  appId: "1:691732173849:web:537d459b2b522271a58688",
  measurementId: "G-NRJ89YP6HN",
};

// ✅ Initialize Firebase (guarded for Fast Refresh)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Auth (Fast Refresh safe)
type GlobalWithAuth = typeof globalThis & { __HEALIO_AUTH__?: Auth };
const g = globalThis as GlobalWithAuth;
let cachedAuth = g.__HEALIO_AUTH__;

if (!cachedAuth) {
  const initializeAuthFn = (AuthModule as any).initializeAuth;
  const getRNPersistence = (AuthModule as any).getReactNativePersistence;
  try {
    if (initializeAuthFn) {
      const persistence = getRNPersistence
        ? getRNPersistence(ReactNativeAsyncStorage)
        : inMemoryPersistence;
      cachedAuth = initializeAuthFn(app, { persistence });
    } else {
      cachedAuth = getAuth(app);
    }
  } catch (e: any) {
    if (e?.code === 'auth/already-initialized') {
      cachedAuth = getAuth(app);
    } else {
      throw e;
    }
  }
  g.__HEALIO_AUTH__ = cachedAuth;
}

const auth: Auth = g.__HEALIO_AUTH__ as Auth;

// Persistence is set during initializeAuth above (RN AsyncStorage if available, otherwise in-memory)

// ✅ Initialize Storage
const storage = getStorage(app);

// --- AUTH FUNCTIONS ---
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await ReactNativeAsyncStorage.setItem("userToken", token);
    
    // Fetch user role from backend
    let role = 'patient'; // default
    try {
      const { API_BASE_URL } = await import('../utils/constants');
      const response = await fetch(`${API_BASE_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email || email,
          role: 'patient', // Will be overridden if user exists
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        role = data.user?.role || 'patient';
      }
    } catch (fetchError) {
      console.warn('Failed to fetch user role from backend:', fetchError);
    }
    
    return { success: true, user: userCredential.user, role };
  } catch (error: any) {
    return { success: false, error: error.message || "An unknown error occurred" };
  }
};

export const registerUser = async (email: string, password: string, role: string, name?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await ReactNativeAsyncStorage.setItem("userToken", token);
    
    // Sync user to backend database
    try {
      const { API_BASE_URL } = await import('../utils/constants');
      const response = await fetch(`${API_BASE_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email || email,
          role,
          name: name || email.split('@')[0],
        }),
      });
      
      if (!response.ok) {
        console.warn('Failed to sync user to backend:', await response.text());
      }
    } catch (syncError) {
      console.warn('Backend sync failed, but Firebase registration succeeded:', syncError);
    }
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message || "An unknown error occurred" };
  }
};

// --- STORAGE FUNCTIONS ---
export const uploadFile = async (fileUri: string, fileName: string) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const fileRef = ref(storage, fileName);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || "File upload failed");
  }
};

export { auth, storage };
