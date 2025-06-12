// auth.js
import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

// ✅ Signup function
export async function signUpUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // ✅ Create user document in Firestore
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      name: name,
      email: email,
      role: "user",        // default role
      createdAt: new Date()
    });

    return { success: true, uid };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Login function
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, uid: userCredential.user.uid };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Logout function
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Get current user data from Firestore
export async function getCurrentUserData() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          resolve(userDoc.data());
        } else {
          reject("No user document found.");
        }
      } else {
        reject("No user is signed in.");
      }
    });
  });
}
