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

  // Delivery pin chosen on the map. Required for new and edited addresses.
  // Optional in the type only so TypeScript tolerates any old documents.
  latitude?: number;
  longitude?: number;
  // GPS accuracy in metres at the time of pinning (omitted if the pin was
  // placed by hand on the map).
  locationAccuracy?: number;

  isDefault: boolean;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}