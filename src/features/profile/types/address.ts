import type { Timestamp } from "firebase/firestore";

export interface Address {
  id: string;

  fullName: string;
  phoneNumber: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  isDefault: boolean;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}