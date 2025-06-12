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
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

// ✅ Signup function (creates auth + user doc)
export async function signUpUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid: uid,
      name: name,
      email: email,
      role: "user",
      createdAt: Timestamp.now()
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

// ✅ Logout
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Get current user data
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

// ✅ Book a service
export async function createBooking({ userId, doctorId, serviceName, date, status = "pending" }) {
  try {
    await addDoc(collection(db, "bookings"), {
      userId,
      doctorId,
      serviceName,
      date: Timestamp.fromDate(new Date(date)),
      status,
      createdAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ View user bookings
export async function getUserBookings(userId) {
  try {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, bookings };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Update or cancel booking by user
export async function updateBookingStatus(bookingId, newStatus) {
  try {
    const ref = doc(db, "bookings", bookingId);
    await updateDoc(ref, { status: newStatus });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Admin fetch all bookings
export async function getAllBookings() {
  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, bookings };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Doctor verify booking
export async function verifyBooking(bookingId) {
  try {
    const ref = doc(db, "bookings", bookingId);
    await updateDoc(ref, { status: "confirmed" });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ✅ Add product (merchant)
export async function addProduct({ merchantId, name, description, price, status = "draft" }) {
  try {
    await addDoc(collection(db, "products"), {
      merchantId,
      name,
      description,
      price,
      status,
      createdAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
