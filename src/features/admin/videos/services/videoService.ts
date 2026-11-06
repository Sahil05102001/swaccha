import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  VideoCard,
  VideoCardFormData,
} from "../types/video";

const COLLECTION_NAME = "homepageVideos";
const MAX_VIDEOS = 5;

const videosRef = collection(
  db,
  COLLECTION_NAME,
);

export async function getVideos(): Promise<
  VideoCard[]
> {
  const q = query(
    videosRef,
    orderBy("displayOrder", "asc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((snapshotDoc) => {
    const data = snapshotDoc.data();

    return {
      id: snapshotDoc.id,
      videoUrl: data.videoUrl ?? "",
      publicId: data.publicId ?? "",
      thumbnailUrl: data.thumbnailUrl ?? "",
      isActive: Boolean(data.isActive),
      displayOrder: Number(
        data.displayOrder ?? 1,
      ),
      createdAt:
        data.createdAt?.toDate?.() ?? new Date(),
      updatedAt:
        data.updatedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function addVideo(
  data: VideoCardFormData,
): Promise<void> {
  const countSnapshot =
    await getCountFromServer(videosRef);

  if (countSnapshot.data().count >= MAX_VIDEOS) {
    throw new Error(
      "Maximum of 5 homepage videos allowed.",
    );
  }

  // Validate that the selected position is available.
  const existingVideos = await getDocs(videosRef);

  const orderTaken = existingVideos.docs.some(
    (existingDoc) =>
      Number(existingDoc.data().displayOrder) ===
      data.displayOrder,
  );

  if (orderTaken) {
    throw new Error(
      `Position ${data.displayOrder} is already occupied. Please select an available position.`,
    );
  }

  await addDoc(videosRef, {
    videoUrl: data.videoUrl.trim(),
    publicId: data.publicId.trim(),
    thumbnailUrl: data.thumbnailUrl.trim(),
    isActive: data.isActive,
    displayOrder: data.displayOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateVideo(
  id: string,
  data: VideoCardFormData,
): Promise<void> {
  const videoRef = doc(db, COLLECTION_NAME, id);

  // Read the collection before starting the transaction.
  const videosSnapshot = await getDocs(videosRef);

  await runTransaction(db, async (transaction) => {
    const currentSnapshot = await transaction.get(videoRef);

    if (!currentSnapshot.exists()) {
      throw new Error(
        "The video you're trying to update no longer exists.",
      );
    }

    const currentData = currentSnapshot.data();
    const currentOrder = Number(currentData.displayOrder ?? 1);
    const targetOrder = data.displayOrder;

    if (
      !Number.isInteger(targetOrder) ||
      targetOrder < 1 ||
      targetOrder > MAX_VIDEOS
    ) {
      throw new Error(
        "Display order must be between 1 and 5.",
      );
    }

    const conflictingVideo = videosSnapshot.docs.find(
      (existingDoc) =>
        existingDoc.id !== id &&
        Number(existingDoc.data().displayOrder) === targetOrder,
    );

    if (conflictingVideo) {
      transaction.update(conflictingVideo.ref, {
        displayOrder: currentOrder,
        updatedAt: serverTimestamp(),
      });
    }

    transaction.update(videoRef, {
      videoUrl: data.videoUrl.trim(),
      publicId: data.publicId.trim(),
      thumbnailUrl: data.thumbnailUrl.trim(),
      isActive: data.isActive,
      displayOrder: targetOrder,
      updatedAt: serverTimestamp(),
    });
  });
}
/**
 * Deletes only the Firestore video record.
 * The Cloudinary asset is intentionally preserved.
 */
export async function deleteVideo(
  id: string,
): Promise<void> {
  await deleteDoc(
    doc(db, COLLECTION_NAME, id),
  );
}