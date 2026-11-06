
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import type {
    BrandStatement,
    BrandStatementFormData,
} from "../types/brandStatement";

const COLLECTION_NAME = "brandStatement";
const DOCUMENT_ID = "main";

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:5000"
).replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = "xxjcpz3y";

const brandStatementRef = doc(
    db,
    COLLECTION_NAME,
    DOCUMENT_ID,
);

function getCloudinaryPublicIdFromUrl(
    imageUrl: string,
): string {
    if (!imageUrl) {
        return "";
    }

    try {
        const url = new URL(imageUrl);

        const segments = url.pathname
            .split("/")
            .filter(Boolean);

        if (
            url.hostname !== "res.cloudinary.com" ||
            segments[0] !== CLOUDINARY_CLOUD_NAME ||
            segments[1] !== "image" ||
            segments[2] !== "upload"
        ) {
            return "";
        }

        let publicIdSegments = segments.slice(3);

        if (/^v\d+$/.test(publicIdSegments[0] ?? "")) {
            publicIdSegments = publicIdSegments.slice(1);
        }

        if (publicIdSegments.length === 0) {
            return "";
        }

        const lastIndex = publicIdSegments.length - 1;

        publicIdSegments[lastIndex] =
            publicIdSegments[lastIndex].replace(/\.[^.]+$/, "");

        return publicIdSegments.join("/");
    } catch {
        return "";
    }
}

async function deleteCloudinaryBrandStatementImage(
    publicId: string,
): Promise<void> {
    if (!publicId) {
        return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error(
            "Authentication required to delete the Brand Statement image.",
        );
    }

    const idToken = await currentUser.getIdToken();

    const response = await fetch(
        `${API_BASE_URL}/hero-images`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ publicId }),
        },
    );

    if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
            `Failed to delete Brand Statement image (${response.status}): ${
                responseText || response.statusText
            }`,
        );
    }
}

export async function getBrandStatement(): Promise<BrandStatement | null> {
    const snapshot = await getDoc(brandStatementRef);

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data();

    // Legacy image fields remain supported for existing records.
    const imageUrl = data.imageUrl ?? "";
    const imagePublicId =
        data.imagePublicId ||
        getCloudinaryPublicIdFromUrl(imageUrl);

    const desktopImageUrl =
        data.desktopImageUrl || imageUrl;

    const desktopImagePublicId =
        data.desktopImagePublicId ||
        (desktopImageUrl === imageUrl
            ? imagePublicId
            : getCloudinaryPublicIdFromUrl(desktopImageUrl));

    const mobileImageUrl = data.mobileImageUrl ?? "";

    const mobileImagePublicId =
        data.mobileImagePublicId ||
        getCloudinaryPublicIdFromUrl(mobileImageUrl);

    return {
        id: snapshot.id,

        brandName: data.brandName ?? "",
        title: data.title ?? "",
        description: data.description ?? "",
        tagline: data.tagline ?? "",

        // Backward-compatible legacy fields.
        imageUrl,
        imagePublicId,

        desktopImageUrl,
        desktopImagePublicId,
        mobileImageUrl,
        mobileImagePublicId,

        isActive: Boolean(data.isActive),

        createdAt:
            data.createdAt?.toDate?.() ?? new Date(),
        updatedAt:
            data.updatedAt?.toDate?.() ?? new Date(),
    };
}

export async function saveBrandStatement(
    data: BrandStatementFormData,
): Promise<void> {
    const previousSnapshot = await getDoc(brandStatementRef);

    const previousData = previousSnapshot.exists()
        ? previousSnapshot.data()
        : null;

    // Read existing image references, including legacy records.
    const previousLegacyUrl =
        previousData?.imageUrl ?? "";

    const previousLegacyPublicId =
        previousData?.imagePublicId ||
        getCloudinaryPublicIdFromUrl(previousLegacyUrl);

    const previousDesktopUrl =
        previousData?.desktopImageUrl ||
        previousLegacyUrl;

    const previousDesktopPublicId =
        previousData?.desktopImagePublicId ||
        (previousDesktopUrl === previousLegacyUrl
            ? previousLegacyPublicId
            : getCloudinaryPublicIdFromUrl(previousDesktopUrl));

    const previousMobileUrl =
        previousData?.mobileImageUrl ?? "";

    const previousMobilePublicId =
        previousData?.mobileImagePublicId ||
        getCloudinaryPublicIdFromUrl(previousMobileUrl);

    const previousPublicIds = new Set(
        [
            previousLegacyPublicId,
            previousDesktopPublicId,
            previousMobilePublicId,
        ].filter(Boolean),
    );

    // Resolve IDs for the images being saved.
    const desktopImageUrl = data.desktopImageUrl ?? "";
    const desktopImagePublicId = desktopImageUrl
        ? (
            data.desktopImagePublicId ||
            getCloudinaryPublicIdFromUrl(desktopImageUrl)
        )
        : "";

    const mobileImageUrl = data.mobileImageUrl ?? "";
    const mobileImagePublicId = mobileImageUrl
        ? (
            data.mobileImagePublicId ||
            getCloudinaryPublicIdFromUrl(mobileImageUrl)
        )
        : "";

    // Keep legacy fields aligned with the desktop banner.
    // This protects any existing component still using imageUrl.
    const imageUrl = desktopImageUrl;
    const imagePublicId = desktopImagePublicId;

    const retainedPublicIds = new Set(
        [
            imagePublicId,
            desktopImagePublicId,
            mobileImagePublicId,
        ].filter(Boolean),
    );

    // Save the new state first. If Firestore fails, old images
    // are not deleted.
    await setDoc(
        brandStatementRef,
        {
            ...data,

            imageUrl,
            imagePublicId,

            desktopImageUrl,
            desktopImagePublicId,

            mobileImageUrl,
            mobileImagePublicId,

            updatedAt: serverTimestamp(),

            ...(previousSnapshot.exists()
                ? {}
                : { createdAt: serverTimestamp() }),
        },
        { merge: true },
    );

    // Delete only images no longer referenced by either banner.
    const publicIdsToDelete = [...previousPublicIds].filter(
        (publicId) => !retainedPublicIds.has(publicId),
    );

    const cleanupErrors: string[] = [];

    for (const publicId of publicIdsToDelete) {
        try {
            await deleteCloudinaryBrandStatementImage(publicId);
        } catch (error: unknown) {
            console.error(
                "Brand Statement saved, but old Cloudinary image cleanup failed:",
                publicId,
                error,
            );

            cleanupErrors.push(
                error instanceof Error
                    ? error.message
                    : "Unknown Cloudinary deletion error",
            );
        }
    }

    if (cleanupErrors.length > 0) {
        throw new Error(
            `Brand Statement saved successfully, but cleanup of ${cleanupErrors.length} old Cloudinary image(s) failed: ${cleanupErrors.join("; ")}`,
        );
    }
}
