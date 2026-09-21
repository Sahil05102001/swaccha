export interface BrandStatement {
    id: string;

    brandName: string;
    title: string;
    description: string;
    tagline: string;

    imageUrl: string;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface BrandStatementFormData {
    brandName: string;
    title: string;
    description: string;
    tagline: string;

    imageUrl: string;

    isActive: boolean;
}

export const DEFAULT_BRAND_STATEMENT: BrandStatementFormData = {
    brandName: "SWACHHA",
    title: "CLEAN TODAY, GREENER TOMORROW.",
    description:
        "At Swachha, we believe a clean space leads to a healthy life and a better planet.",
    tagline: "Better for you. Better for the earth.",
    imageUrl: "",
    isActive: true,
};