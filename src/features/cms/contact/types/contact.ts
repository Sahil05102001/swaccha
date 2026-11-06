export interface BusinessHour {
  id: string;
  day: string;
  openingTime: string;
  closingTime: string;
  isClosed: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ContactSettings {
  heroTitle: string;
  heroSubtitle: string;
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  googleMapsEmbedUrl: string;
  businessHours: BusinessHour[];
  socialLinks: SocialLink[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

function generateId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)}`;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  heroTitle: "Contact Us",
  heroSubtitle:
    "We're here to help. Get in touch with us anytime.",
  businessName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  googleMapsEmbedUrl: "",

  businessHours: [
    {
      id: generateId(),
      day: "Monday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: generateId(),
      day: "Tuesday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: generateId(),
      day: "Wednesday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: generateId(),
      day: "Thursday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: generateId(),
      day: "Friday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: generateId(),
      day: "Saturday",
      openingTime: "09:00",
      closingTime: "14:00",
      isClosed: false,
    },
    {
      id: generateId(),
      day: "Sunday",
      openingTime: "",
      closingTime: "",
      isClosed: true,
    },
  ],

  socialLinks: [
    {
      id: generateId(),
      platform: "Facebook",
      url: "",
    },
    {
      id: generateId(),
      platform: "Instagram",
      url: "",
    },
    {
      id: generateId(),
      platform: "LinkedIn",
      url: "",
    },
    {
      id: generateId(),
      platform: "YouTube",
      url: "",
    },
  ],

  createdAt: null,
  updatedAt: null,
};