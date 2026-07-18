import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export async function createUserProfile(
  uid: string,
  name: string,
  email: string
) {
  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    email,
    phone: "",
    role: "customer",
    addresses: [],
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}