export interface VideoCard {
  id: string;

  videoUrl: string;
  publicId?: string;

  thumbnailUrl: string;

  isActive: boolean;
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface VideoCardFormData {
  videoUrl: string;
  publicId: string;

  thumbnailUrl: string;

  isActive: boolean;
  displayOrder: number;
}

export const DEFAULT_VIDEO_CARD: VideoCardFormData = {
  videoUrl: "",
  publicId: "",
  thumbnailUrl: "",
  isActive: true,
  displayOrder: 1,
};