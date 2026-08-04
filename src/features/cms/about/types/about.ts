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
  galleryImages: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  companyName: "",
  heroTitle: "",
  heroSubtitle: "",
  companyStory: "",
  mission: "",
  vision: "",
  whyChooseUs: [
    "",
    "",
    "",
    "",
  ],
  statistics: [
    {
      id: crypto.randomUUID(),
      label: "Happy Customers",
      value: "",
    },
    {
      id: crypto.randomUUID(),
      label: "Products",
      value: "",
    },
    {
      id: crypto.randomUUID(),
      label: "Years of Experience",
      value: "",
    },
    {
      id: crypto.randomUUID(),
      label: "Cities Served",
      value: "",
    },
  ],
  heroImageUrl: "",
  galleryImages: [],
  createdAt: null,
  updatedAt: null,
};