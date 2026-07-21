export interface Category {
    name: string;
    subcategories: string[];
}

export const categories: Category[] = [
    {
        name: "Cleaning Chemicals",
        subcategories: [
            "Floor Cleaners",
            "Toilet Cleaners",
            "Glass Cleaners",
            "Kitchen Cleaners",
            "Disinfectants",
        ],
    },
    {
        name: "Housekeeping Essentials",
        subcategories: [
            "Tissues",
            "Garbage Bags",
            "Air Fresheners",
            "Hand Wash",
            "Sanitizers",
        ],
    },
    {
        name: "Cleaning Tools",
        subcategories: [
            "Mops",
            "Brooms",
            "Brushes",
            "Wipers",
            "Buckets",
        ],
    },
    {
        name: "Paper Products",
        subcategories: [
            "Toilet Rolls",
            "Napkins",
            "Kitchen Towels",
            "Facial Tissues",
        ],
    },
    {
        name: "Hotel & Restaurant Supplies",
        subcategories: [
            "Disposable Cups",
            "Disposable Plates",
            "Cleaning Cloths",
            "Gloves",
        ],
    },
];