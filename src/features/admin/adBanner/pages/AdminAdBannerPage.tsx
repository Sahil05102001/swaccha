import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import ImageUploadField from "@/features/admin/products/components/ImageUploadField";

import { uploadImageWithDetails } from "@/features/admin/products/services/storageService";

import {
  useAdBanner,
  useSaveAdBanner,
} from "../hooks/useAdBanner";

const DESKTOP_UPLOAD_FOLDER =
  "ad-banners/desktop";

const MOBILE_UPLOAD_FOLDER =
  "ad-banners/mobile";

export default function AdminAdBannerPage() {
  const {
    data: banner,
    isLoading,
  } = useAdBanner();

  const saveMutation = useSaveAdBanner();

  const [desktopImageUrl, setDesktopImageUrl] =
    useState("");

  const [mobileImageUrl, setMobileImageUrl] =
    useState("");

  const [desktopImagePublicId, setDesktopImagePublicId] =
    useState("");

  const [mobileImagePublicId, setMobileImagePublicId] =
    useState("");

  const [altText, setAltText] =
    useState("Advertisement");

  const [href, setHref] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  const [desktopUploading, setDesktopUploading] =
    useState(false);

  const [desktopProgress, setDesktopProgress] =
    useState(0);

  const [mobileUploading, setMobileUploading] =
    useState(false);

  const [mobileProgress, setMobileProgress] =
    useState(0);

  const [saveFeedback, setSaveFeedback] =
    useState<{
      severity: "success" | "warning" | "error";
      message: string;
    } | null>(null);

  useEffect(() => {
    if (!banner) {
      return;
    }

    setDesktopImageUrl(
      banner.desktopImageUrl ||
        banner.imageUrl ||
        "",
    );

    setMobileImageUrl(
      banner.mobileImageUrl ||
        banner.desktopImageUrl ||
        banner.imageUrl ||
        "",
    );

    setDesktopImagePublicId(
      banner.desktopImagePublicId || "",
    );

    setMobileImagePublicId(
      banner.mobileImagePublicId || "",
    );

    setAltText(banner.altText);
    setHref(banner.href);
    setIsActive(banner.isActive);

    setDesktopUploading(false);
    setMobileUploading(false);

    setDesktopProgress(0);
    setMobileProgress(0);
  }, [banner]);

  const handleDesktopSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setDesktopUploading(true);
      setDesktopProgress(0);
      setSaveFeedback(null);

      const uploadedImage =
        await uploadImageWithDetails(
          file,
          DESKTOP_UPLOAD_FOLDER,
          setDesktopProgress,
        );

      setDesktopImageUrl(uploadedImage.secureUrl);
      setDesktopImagePublicId(uploadedImage.publicId);
    } catch (error) {
      console.error(
        "Failed to upload desktop ad banner image:",
        error,
      );

      setSaveFeedback({
        severity: "error",
        message: "Desktop banner image upload failed.",
      });
    } finally {
      setDesktopUploading(false);
      event.target.value = "";
    }
  };

  const handleMobileSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setMobileUploading(true);
      setMobileProgress(0);
      setSaveFeedback(null);

      const uploadedImage =
        await uploadImageWithDetails(
          file,
          MOBILE_UPLOAD_FOLDER,
          setMobileProgress,
        );

      setMobileImageUrl(uploadedImage.secureUrl);
      setMobileImagePublicId(uploadedImage.publicId);
    } catch (error) {
      console.error(
        "Failed to upload mobile ad banner image:",
        error,
      );

      setSaveFeedback({
        severity: "error",
        message: "Mobile banner image upload failed.",
      });
    } finally {
      setMobileUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (desktopUploading || mobileUploading) {
      return;
    }

    setSaveFeedback(null);

    try {
      await saveMutation.mutateAsync({
        imageUrl: desktopImageUrl,
        desktopImageUrl,
        mobileImageUrl,
        desktopImagePublicId,
        mobileImagePublicId,
        altText,
        href,
        isActive,
      });

      setSaveFeedback({
        severity: "success",
        message: "Banner saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save AdBanner:", error);

      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      if (
        message.startsWith(
          "Banner saved successfully, but old image cleanup failed:",
        )
      ) {
        setSaveFeedback({
          severity: "warning",
          message:
            "Your banner was saved successfully, but an old Cloudinary image could not be deleted. Please check the console for details.",
        });
      } else {
        setSaveFeedback({
          severity: "error",
          message:
            "Failed to save the banner. Please try again.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Ad Banner"
          subtitle="Manage the homepage advertisement banner."
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  const isUploading =
    desktopUploading || mobileUploading;

  const isSaving =
    saveMutation.isPending || isUploading;

  return (
    <PageContainer>
      <PageHeader
        title="Ad Banner"
        subtitle="Manage the responsive advertisement banner displayed on the homepage."
      />

      <Box
        sx={{
          maxWidth: 900,
          mt: 3,
        }}
      >
        {/* Desktop Banner */}
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Desktop Banner
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Upload a wide banner designed
            specifically for desktop screens.
          </Typography>

          <ImageUploadField
            uploading={desktopUploading}
            progress={desktopProgress}
            onSelectFile={handleDesktopSelectFile}
          />

          {desktopImageUrl && (
            <Box
              sx={{
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#f5f5f5",
              }}
            >
              <Box
                component="img"
                src={desktopImageUrl}
                alt="Desktop ad banner preview"
                sx={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
          )}
        </Stack>

        {/* Mobile Banner */}
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Mobile Banner
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Upload a separate mobile composition.
            Do not simply crop the desktop banner.
          </Typography>

          <ImageUploadField
            uploading={mobileUploading}
            progress={mobileProgress}
            onSelectFile={handleMobileSelectFile}
          />

          {mobileImageUrl && (
            <Box
              sx={{
                width: "100%",
                maxWidth: 420,
                mx: "auto",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#f5f5f5",
              }}
            >
              <Box
                component="img"
                src={mobileImageUrl}
                alt="Mobile ad banner preview"
                sx={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
          )}
        </Stack>

        {/* Alt Text */}
        <TextField
          fullWidth
          label="Alt Text"
          value={altText}
          onChange={(event) =>
            setAltText(event.target.value)
          }
          sx={{ mb: 3 }}
        />

        {/* Link */}
        <TextField
          fullWidth
          label="Banner Link"
          value={href}
          onChange={(event) =>
            setHref(event.target.value)
          }
          placeholder="/products"
          helperText="Optional. Example: /products"
          sx={{ mb: 3 }}
        />

        {/* Active */}
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(event) =>
                setIsActive(event.target.checked)
              }
            />
          }
          label="Show banner on homepage"
          sx={{ mb: 3 }}
        />

        {/* Save */}
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={
              isSaving ||
              !desktopImageUrl ||
              !mobileImageUrl
            }
            sx={{
              px: 5,
              py: 1.3,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {isUploading
              ? "Uploading..."
              : saveMutation.isPending
                ? "Saving..."
                : "Save Banner"}
          </Button>
        </Box>

        {saveFeedback && (
          <Alert
            severity={saveFeedback.severity}
            sx={{ mt: 2 }}
          >
            {saveFeedback.message}
          </Alert>
        )}
      </Box>
    </PageContainer>
  );
}