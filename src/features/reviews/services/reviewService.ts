import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  orderId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Timestamp;
  editedAt?: Timestamp;
  adminReply?: { text: string; createdAt: Timestamp };
}

export const REVIEW_LIMITS = {
  titleMax: 100,
  bodyMin: 10,
  bodyMax: 1000,
};

export const REVIEWS_PAGE_SIZE = 3;
export const ADMIN_REVIEWS_PAGE_SIZE = 10;

export const reviewId = (productId: string, uid: string) =>
  `${productId}_${uid}`;

export async function getMyReview(
  productId: string,
  uid: string
): Promise<Review | null> {
  const snap = await getDoc(doc(db, "reviews", reviewId(productId, uid)));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Review) : null;
}

interface SaveReviewInput {
  productId: string;
  productName: string;
  orderId: string;
  uid: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
}

/**
 * Creates the review, or edits it if this user already reviewed the product.
 * The product's ratingSum / ratingCount are updated in the same transaction,
 * so the average shown on product cards always matches the reviews.
 */
export async function saveReview(input: SaveReviewInput) {
  const { productId, orderId, uid, userName, rating } = input;
  const title = input.title.trim();
  const body = input.body.trim();
  const productName = input.productName.trim().slice(0, 200);

  if (rating < 1 || rating > 5) throw new Error("Please select a rating.");
  if (!title) throw new Error("Please add a review title.");
  if (body.length < REVIEW_LIMITS.bodyMin) {
    throw new Error(
      `Review must be at least ${REVIEW_LIMITS.bodyMin} characters.`
    );
  }

  // Make sure the login token has the latest "email verified" status.
  await auth.currentUser?.getIdToken(true);

  const reviewRef = doc(db, "reviews", reviewId(productId, uid));
  const productRef = doc(db, "products", productId);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(reviewRef);

    if (existing.exists()) {
      const oldRating = Number(existing.data().rating) || 0;

      tx.update(reviewRef, {
        rating,
        title,
        body,
        editedAt: serverTimestamp(),
      });

      if (rating !== oldRating) {
        tx.update(productRef, { ratingSum: increment(rating - oldRating) });
      }
    } else {
      tx.set(reviewRef, {
        productId,
        productName,
        orderId,
        userId: uid,
        userName,
        rating,
        title,
        body,
        createdAt: serverTimestamp(),
      });

      tx.update(productRef, {
        ratingSum: increment(rating),
        ratingCount: increment(1),
      });
    }
  });
}

export interface ReviewsPage {
  reviews: Review[];
  last: QueryDocumentSnapshot | null;
}

/** Newest first. Pass the last doc of the previous page to continue. */
export async function fetchReviewsPage(
  productId: string,
  after: QueryDocumentSnapshot | null,
  count: number = REVIEWS_PAGE_SIZE
): Promise<ReviewsPage> {
  const constraints: QueryConstraint[] = [
    where("productId", "==", productId),
    orderBy("createdAt", "desc"),
    ...(after ? [startAfter(after)] : []),
    limit(count),
  ];

  const snap = await getDocs(query(collection(db, "reviews"), ...constraints));

  return {
    reviews: snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review),
    last: snap.docs[snap.docs.length - 1] ?? null,
  };
}

/**
 * Deletes a review and takes it out of the product totals in one batch.
 * If the product no longer exists, only the review is deleted.
 */
async function removeReview(review: Review) {
  const productRef = doc(db, "products", review.productId);
  const productSnap = await getDoc(productRef);

  const batch = writeBatch(db);

  batch.delete(doc(db, "reviews", review.id));

  if (productSnap.exists()) {
    batch.update(productRef, {
      ratingSum: increment(-review.rating),
      ratingCount: increment(-1),
    });
  }

  await batch.commit();
}

/** The author deletes their own review. */
export async function deleteMyReview(review: Review) {
  await removeReview(review);
}

// ==========================
// Admin
// ==========================

export interface AdminReviewsPage {
  reviews: Review[];
  last: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

/** All reviews, newest first. Reads one extra doc to know if another page exists. */
export async function fetchAdminReviewsPage(
  after: QueryDocumentSnapshot | null
): Promise<AdminReviewsPage> {
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    ...(after ? [startAfter(after)] : []),
    limit(ADMIN_REVIEWS_PAGE_SIZE + 1),
  ];

  const snap = await getDocs(query(collection(db, "reviews"), ...constraints));
  const docs = snap.docs.slice(0, ADMIN_REVIEWS_PAGE_SIZE);

  return {
    reviews: docs.map((d) => ({ id: d.id, ...d.data() }) as Review),
    last: docs[docs.length - 1] ?? null,
    hasMore: snap.docs.length > ADMIN_REVIEWS_PAGE_SIZE,
  };
}

/** Adds or replaces the admin's reply. */
export async function saveAdminReply(reviewDocId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Reply cannot be empty.");
  if (trimmed.length > 1000) throw new Error("Reply is too long (max 1,000).");

  await updateDoc(doc(db, "reviews", reviewDocId), {
    adminReply: { text: trimmed, createdAt: serverTimestamp() },
  });
}

export async function deleteAdminReply(reviewDocId: string) {
  await updateDoc(doc(db, "reviews", reviewDocId), {
    adminReply: deleteField(),
  });
}

/** Admin removes any review. */
export async function deleteReviewAsAdmin(review: Review) {
  await removeReview(review);
}