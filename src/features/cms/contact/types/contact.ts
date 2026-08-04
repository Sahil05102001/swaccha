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
      id: crypto.randomUUID(),
      day: "Monday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: crypto.randomUUID(),
      day: "Tuesday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: crypto.randomUUID(),
      day: "Wednesday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: crypto.randomUUID(),
      day: "Thursday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: crypto.randomUUID(),
      day: "Friday",
      openingTime: "09:00",
      closingTime: "18:00",
      isClosed: false,
    },
    {
      id: crypto.randomUUID(),
      day: "Saturday",
      openingTime: "09:00",
      closingTime: "14:00",
      isClosed: false,
    },
    {
      id: crypto.randomUUID(),
      day: "Sunday",
      openingTime: "",
      closingTime: "",
      isClosed: true,
    },
  ],

  socialLinks: [
    {
      id: crypto.randomUUID(),
      platform: "Facebook",
      url: "",
    },
    {
      id: crypto.randomUUID(),
      platform: "Instagram",
      url: "",
    },
    {
      id: crypto.randomUUID(),
      platform: "LinkedIn",
      url: "",
    },
    {
      id: crypto.randomUUID(),
      platform: "YouTube",
      url: "",
    },
  ],

  createdAt: null,
  updatedAt: null,
};