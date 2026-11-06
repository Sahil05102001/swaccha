
export interface CompanyStatistic {
  id: string;
  label: string;
  value: string;
}

export interface AboutSettings {
  companyName: string;
  heroTitle: string;
  heroSubtitle: string;
  companyStory: string;
  mission: string;
  vision: string;
  whyChooseUs: string[];
  statistics: CompanyStatistic[];

  heroImageUrl: string;
  desktopBannerUrl: string;
  mobileBannerUrl: string;
  galleryImages: string[];

  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  ownerImageUrl: string;

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

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  companyName: "",
  heroTitle: "",
  heroSubtitle: "",
  companyStory: "",
  mission: "",
  vision: "",
  whyChooseUs: ["", "", "", ""],
  statistics: [
    {
      id: generateId(),
      label: "Happy Customers",
      value: "",
    },
    {
      id: generateId(),
      label: "Products",
      value: "",
    },
    {
      id: generateId(),
      label: "Years of Experience",
      value: "",
    },
    {
      id: generateId(),
      label: "Cities Served",
      value: "",
    },
  ],

  heroImageUrl: "",
  desktopBannerUrl: "",
  mobileBannerUrl: "",
  galleryImages: [],

  ownerName: "",
  ownerTitle: "",
  ownerBio: "",
  ownerImageUrl: "",

  createdAt: null,
  updatedAt: null,
};
