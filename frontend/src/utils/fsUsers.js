// src/utils/fsUsers.js
import { unwrapFields, wrapFields } from "./fsHelpers";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const BASE = "https://firebase-proxy.alireza-akhoondi1.workers.dev";

export async function getUserDoc(uid, idToken) {
  try {
    const r = await fetch(`${BASE}/users/${uid}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });
    if (!r.ok) throw new Error(`Worker fetch failed: ${r.status}`);
    
    const text = await r.text();
    const j = text ? JSON.parse(text) : {};
    if (!j.fields) return null;

    return { id: uid, ...unwrapFields(j.fields) };
  } catch (err) {
    console.warn("Worker offline, fallback to Firebase:", err.message);
    // fallback مستقیم به Firebase
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: uid, ...docSnap.data() } : null;
  }
}

export async function upsertUserDoc(uid, data, idToken) {
  const body = JSON.stringify({ fields: wrapFields(data) });
  const headers = { "Content-Type": "application/json", ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) };

  try {
    // تلاش برای ساخت سند جدید
    let r = await fetch(`${BASE}/users?documentId=${uid}`, { method: "POST", headers, body });
    if (r.ok) return true;

    // اگر قبلاً ساخته شده بود → آپدیت
    const mask = Object.keys(data).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
    r = await fetch(`${BASE}/users/${uid}?${mask}`, { method: "PATCH", headers, body });
    if (r.ok) return true;

    throw new Error(`Worker upsert failed: ${r.status}`);
  } catch (err) {
    console.warn("Worker offline, fallback to Firebase:", err.message);
    // fallback مستقیم به Firebase
    await setDoc(doc(db, "users", uid), data, { merge: true });
    return true;
  }
}