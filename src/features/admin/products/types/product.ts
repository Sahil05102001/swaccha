import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;

  category: string;

  price: number;

  stock: number;

  images: string[];

  isActive: boolean;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}

export interface ProductFormData {
  name: string;

  description: string;

  category: string;

  price: number;

  stock: number;

  imageUrl: string;

  isActive: boolean;
}