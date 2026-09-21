export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface FaqSettings {
  heroTitle: string;
  heroSubtitle: string;
  faqs: FaqItem[];

  createdAt: Date | null;
  updatedAt: Date | null;
}

export const DEFAULT_FAQ_SETTINGS: FaqSettings = {
  heroTitle: "Frequently Asked Questions",

  heroSubtitle:
    "Find answers to the most commonly asked questions.",

  faqs: [
    {
      id: crypto.randomUUID(),
      question: "How long does delivery take?",
      answer:
        "Most orders are delivered within 3–7 business days depending on your location.",
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      question: "Do you offer Cash on Delivery?",
      answer:
        "Yes. Cash on Delivery is available for eligible locations.",
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled before they are shipped.",
      isActive: true,
    },
  ],

  createdAt: null,
  updatedAt: null,
};