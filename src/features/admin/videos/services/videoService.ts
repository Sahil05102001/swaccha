import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  VideoCard,
  VideoCardFormData,
} from "../types/video";

const COLLECTION_NAME = "homepageVideos";

const videosRef = collection(
  db,
  COLLECTION_NAME
);

export async function getVideos(): Promise<VideoCard[]> {
  const q = query(
    videosRef,
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((snapshotDoc) => {
    const data = snapshotDoc.data();

    return {
      id: snapshotDoc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      videoUrl: data.videoUrl ?? "",
      thumbnailUrl: data.thumbnailUrl ?? "",
      type: data.type ?? "other",
      href: data.href ?? "",
      isActive: Boolean(data.isActive),
      displayOrder: data.displayOrder ?? 1,
      createdAt:
        data.createdAt?.toDate?.() ?? new Date(),
      updatedAt:
        data.updatedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function addVideo(
  data: VideoCardFormData
): Promise<void> {
  const countSnapshot =
    await getCountFromServer(videosRef);

  if (countSnapshot.data().count >= 5) {
    throw new Error(
      "Maximum of 5 homepage videos allowed."
    );
  }

  await addDoc(videosRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateVideo(
  id: string,
  data: VideoCardFormData
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteVideo(
  id: string
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTION_NAME, id)
  );
}