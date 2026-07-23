import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses: unknown[];
  isActive: boolean;
}

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

export async function getUserProfile(): Promise<UserProfile> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const snapshot = await getDoc(
    doc(db, "users", user.uid)
  );

  if (!snapshot.exists()) {
    throw new Error("Profile not found.");
  }

  return snapshot.data() as UserProfile;
}