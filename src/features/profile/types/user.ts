export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}