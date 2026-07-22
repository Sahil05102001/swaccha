import { Timestamp } from "firebase/firestore";

export interface Category {
  id: string;

  name: string;

  imageUrl: string;

  isActive: boolean;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}

export interface CategoryFormData {
  name: string;

  imageUrl: string;

  isActive: boolean;
}