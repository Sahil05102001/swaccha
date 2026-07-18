export interface Address {
  id: string;

  label: "Home" | "Office" | "Other";

  fullName: string;

  phone: string;

  addressLine1: string;

  addressLine2: string;

  landmark: string;

  city: string;

  state: string;

  pincode: string;

  country: string;

  isDefault: boolean;

  createdAt: Date;

  updatedAt: Date;
}