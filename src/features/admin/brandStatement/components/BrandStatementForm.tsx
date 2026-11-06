
import { useEffect, useRef, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Switch,
    TextField,
    FormControlLabel,
    Typography,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

import {
    DEFAULT_BRAND_STATEMENT,
    type BrandStatement,
    type BrandStatementFormData,
} from "../types/brandStatement";

import { uploadImageWithDetails } from "@/features/admin/products/services/storageService";

interface BrandStatementFormProps {
    statement?: BrandStatement | null;
    onSubmit: (data: BrandStatementFormData) => void | Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

type BannerType = "desktop" | "mobile";

export default function BrandStatementForm({
    statement,
    onSubmit,
    onCancel,
    loading = false,
}: BrandStatementFormProps) {
    const [form, setForm] = useState<BrandStatementFormData>({
        ...DEFAULT_BRAND_STATEMENT,
    });

    const [uploadingBanner, setUploadingBanner] =
        useState<BannerType | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageError, setImageError] = useState("");
    const [formError, setFormError] = useState("");

    const desktopFileInputRef = useRef<HTMLInputElement>(null);
    const mobileFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (statement) {
            const legacyImageUrl = statement.imageUrl ?? "";
            const legacyImagePublicId =
                statement.imagePublicId ?? "";

            setForm({
                brandName: statement.brandName ?? "",
                title: statement.title ?? "",
                description: statement.description ?? "",
                tagline: statement.tagline ?? "",

                imageUrl: legacyImageUrl,
                imagePublicId: legacyImagePublicId,

                desktopImageUrl:
                    statement.desktopImageUrl ||
                    legacyImageUrl,
                desktopImagePublicId:
                    statement.desktopImagePublicId ||
                    legacyImagePublicId,

                mobileImageUrl:
                    statement.mobileImageUrl || "",
                mobileImagePublicId:
                    statement.mobileImagePublicId || "",

                isActive: statement.isActive,
            });
        } else {
            setForm({
                ...DEFAULT_BRAND_STATEMENT,
            });
        }

        setImageError("");
        setFormError("");
        setUploadProgress(0);
        setUploadingBanner(null);
    }, [statement]);

    const updateField = <
        K extends keyof BrandStatementFormData
    >(
        field: K,
        value: BrandStatementFormData[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleImageSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
        bannerType: BannerType,
    ) => {
        const file = event.target.files?.[0];

        // Allow selecting the same file again.
        event.target.value = "";

        if (!file) {
            return;
        }

        setImageError("");
        setFormError("");

        if (!file.type.startsWith("image/")) {
            setImageError("Please select a valid image file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setImageError("Image size must not exceed 10 MB.");
            return;
        }

        setUploadingBanner(bannerType);
        setUploadProgress(0);

        try {
            const result = await uploadImageWithDetails(
                file,
                "brand-statement",
                setUploadProgress,
            );

            if (bannerType === "desktop") {
                setForm((current) => ({
                    ...current,
                    desktopImageUrl: result.secureUrl,
                    desktopImagePublicId: result.publicId,
                }));
            } else {
                setForm((current) => ({
                    ...current,
                    mobileImageUrl: result.secureUrl,
                    mobileImagePublicId: result.publicId,
                }));
            }
        } catch (error) {
            console.error(
                `Failed to upload ${bannerType} Brand Statement image:`,
                error,
            );

            setImageError(
                error instanceof Error
                    ? error.message
                    : `Failed to upload the ${bannerType} image. Please try again.`,
            );
        } finally {
            setUploadingBanner(null);
            setUploadProgress(0);
        }
    };

    const handleRemoveImage = (bannerType: BannerType) => {
        if (bannerType === "desktop") {
            setForm((current) => ({
                ...current,
                desktopImageUrl: "",
                desktopImagePublicId: "",
            }));
        } else {
            setForm((current) => ({
                ...current,
                mobileImageUrl: "",
                mobileImagePublicId: "",
            }));
        }

        setImageError("");
        setFormError("");
    };

    const handleSubmit = async () => {
        setFormError("");

        try {
            await onSubmit(form);
        } catch (error) {
            console.error(
                "Failed to save brand statement:",
                error,
            );

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Failed to save the brand statement. Please try again.",
            );
        }
    };

    const busy = loading || uploadingBanner !== null;

    const renderBannerField = (
        bannerType: BannerType,
        imageUrl: string,
    ) => {
        const isDesktop = bannerType === "desktop";
        const fileInputRef = isDesktop
            ? desktopFileInputRef
            : mobileFileInputRef;

        const label = isDesktop
            ? "Desktop Banner"
            : "Mobile Banner";

        const helperText = isDesktop
            ? "Upload a wide banner optimized for desktop and laptop screens."
            : "Upload a separate banner optimized for mobile screens.";

        const isUploading = uploadingBanner === bannerType;

        return (
            <Box
                key={bannerType}
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 0.5 }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                >
                    {helperText}
                </Typography>

                {imageUrl ? (
                    <Box
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={`${label} preview`}
                            sx={{
                                display: "block",
                                width: "100%",
                                maxHeight: 260,
                                objectFit: "contain",
                                bgcolor: "grey.100",
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                p: 1.5,
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                disabled={busy}
                                sx={{ textTransform: "none" }}
                            >
                                Replace Image
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() =>
                                    handleRemoveImage(bannerType)
                                }
                                disabled={busy}
                                sx={{ textTransform: "none" }}
                            >
                                Remove Image
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                            p: 3,
                            textAlign: "center",
                        }}
                    >
                        <ImageOutlinedIcon
                            sx={{
                                fontSize: 42,
                                color: "text.secondary",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            No {bannerType} banner selected.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            disabled={busy}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Upload {label}
                        </Button>
                    </Box>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) =>
                        void handleImageSelect(event, bannerType)
                    }
                />

                {isUploading && (
                    <Box sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <CircularProgress
                                size={18}
                                variant={
                                    uploadProgress > 0
                                        ? "determinate"
                                        : "indeterminate"
                                }
                                value={uploadProgress}
                            />

                            <Typography variant="body2">
                                Uploading {bannerType} banner
                                {uploadProgress > 0
                                    ? `: ${uploadProgress}%`
                                    : "..."}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Stack spacing={2.5}>
            <TextField
                fullWidth
                label="Brand Name"
                value={form.brandName}
                onChange={(event) =>
                    updateField("brandName", event.target.value)
                }
                disabled={busy}
            />

            <TextField
                fullWidth
                label="Main Quote / Title"
                value={form.title}
                onChange={(event) =>
                    updateField("title", event.target.value)
                }
                helperText="Main statement displayed when no banner images are configured."
                disabled={busy}
            />

            <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={(event) =>
                    updateField("description", event.target.value)
                }
                disabled={busy}
            />

            <TextField
                fullWidth
                label="Tagline"
                value={form.tagline}
                onChange={(event) =>
                    updateField("tagline", event.target.value)
                }
                disabled={busy}
            />

            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1 }}
                >
                    Responsive Brand Statement Banners
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Configure separate images for desktop and mobile.
                    If a mobile image is not configured, the desktop
                    image will be used on mobile too.
                </Typography>

                <Stack spacing={2}>
                    {renderBannerField(
                        "desktop",
                        form.desktopImageUrl,
                    )}

                    {renderBannerField(
                        "mobile",
                        form.mobileImageUrl,
                    )}
                </Stack>

                {imageError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {imageError}
                    </Alert>
                )}
            </Box>

            {formError && (
                <Alert severity="error">
                    {formError}
                </Alert>
            )}

            <FormControlLabel
                control={
                    <Switch
                        checked={form.isActive}
                        onChange={(event) =>
                            updateField(
                                "isActive",
                                event.target.checked,
                            )
                        }
                        disabled={busy}
                    />
                }
                label="Show this section on homepage"
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={busy}
                    sx={{ textTransform: "none" }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={() => void handleSubmit()}
                    disabled={busy}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    {loading
                        ? "Saving..."
                        : uploadingBanner
                          ? "Uploading..."
                          : "Save Changes"}
                </Button>
            </Box>
        </Stack>
    );
}
