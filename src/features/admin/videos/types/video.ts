export interface VideoCard {
  id: string;

  title: string;
  description: string;

  videoUrl: string;
  thumbnailUrl: string;

  type:
    | "product-launch"
    | "tutorial"
    | "customer-review"
    | "other";

  href: string;

  isActive: boolean;
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface VideoCardFormData {
  title: string;
  description: string;

  videoUrl: string;
  thumbnailUrl: string;

  type:
    | "product-launch"
    | "tutorial"
    | "customer-review"
    | "other";

  href: string;

  isActive: boolean;
  displayOrder: number;
}

export const DEFAULT_VIDEO_CARD: VideoCardFormData = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  type: "other",
  href: "",
  isActive: true,
  displayOrder: 1,
};