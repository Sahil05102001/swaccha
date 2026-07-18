import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { reload } from "firebase/auth";
import { createUserProfile } from "@/features/profile/services/profileService";

export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: fullName,
  });

  await createUserProfile(
    userCredential.user.uid,
    fullName,
    email
  );

  return userCredential.user;
}

export async function loginUser(
  email: string,
  password: string
) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
}

export async function sendVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error("No authenticated user.");
  }

  await sendEmailVerification(auth.currentUser);
}

export async function refreshCurrentUser() {
  if (!auth.currentUser) {
    throw new Error("No authenticated user.");
  }

  await reload(auth.currentUser);

  return auth.currentUser;
}

export async function updateDisplayName(displayName: string) {
  if (!auth.currentUser) {
    throw new Error("No authenticated user.");
  }

  await updateProfile(auth.currentUser, {
    displayName,
  });

  return auth.currentUser;
}