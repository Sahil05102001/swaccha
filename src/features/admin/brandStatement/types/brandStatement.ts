
export interface BrandStatement {
    id: string;

    brandName: string;
    title: string;
    description: string;
    tagline: string;

    // Legacy image fields retained for backward compatibility.
    imageUrl: string;
    imagePublicId: string;

    // Responsive banner images.
    desktopImageUrl: string;
    desktopImagePublicId: string;
    mobileImageUrl: string;
    mobileImagePublicId: string;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface BrandStatementFormData {
    brandName: string;
    title: string;
    description: string;
    tagline: string;

    // Legacy image fields retained for existing records.
    imageUrl: string;
    imagePublicId: string;

    // Responsive banner images.
    desktopImageUrl: string;
    desktopImagePublicId: string;
    mobileImageUrl: string;
    mobileImagePublicId: string;

    isActive: boolean;
}

export const DEFAULT_BRAND_STATEMENT: BrandStatementFormData = {
    brandName: "SWACHHA",
    title: "CLEAN TODAY, GREENER TOMORROW.",
    description:
        "At Swachha, we believe a clean space leads to a healthy life and a better planet.",
    tagline: "Better for you. Better for the earth.",

    imageUrl: "",
    imagePublicId: "",

    desktopImageUrl: "",
    desktopImagePublicId: "",
    mobileImageUrl: "",
    mobileImagePublicId: "",

    isActive: true,
};
