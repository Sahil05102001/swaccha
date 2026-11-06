
import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import ImageUploadField from "@/features/admin/products/components/ImageUploadField";
import { uploadImageWithDetails } from "@/features/admin/products/services/storageService";
import { useHeroBanners } from "../hooks/useHeroBanners";

import type {
  HeroBanner,
  HeroBannerFormData,
} from "../types/heroBanner";

interface HeroFormProps {
  banner?: HeroBanner | null;
  onSubmit: (data: HeroBannerFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const defaultForm: HeroBannerFormData = {
  desktopImageUrl: "",
  desktopImagePublicId: "",
  mobileImageUrl: "",
  mobileImagePublicId: "",

  bannerLink: "/products",

  badgeText: "",
  heading: "",
  description: "",

  primaryButtonText: "",
  primaryButtonLink: "",

  secondaryButtonText: "",
  secondaryButtonLink: "",

  offerText: "",

  isActive: true,
  displayOrder: 1,
};

const HERO_ORDER_OPTIONS = [1, 2, 3, 4, 5];

export default function HeroForm({
  banner,
  onSubmit,
  onCancel,
  loading = false,
}: HeroFormProps) {
  const [form, setForm] =
    useState<HeroBannerFormData>(defaultForm);

  const [desktopUploading, setDesktopUploading] =
    useState(false);

  const [desktopProgress, setDesktopProgress] =
    useState(0);

  const [mobileUploading, setMobileUploading] =
    useState(false);

  const [mobileProgress, setMobileProgress] =
    useState(0);

  const { data: banners = [] } = useHeroBanners();

  const availableOrderOptions = useMemo(() => {
    const usedOrders = new Set(
      banners
        .filter(
          (currentBanner) =>
            currentBanner.id !== banner?.id,
        )
        .map((currentBanner) => currentBanner.displayOrder),
    );

    return HERO_ORDER_OPTIONS.filter(
      (order) => !usedOrders.has(order),
    );
  }, [banners, banner?.id]);

  useEffect(() => {
    if (banner) {
      setForm({
        desktopImageUrl: banner.desktopImageUrl,
        desktopImagePublicId:
          banner.desktopImagePublicId ?? "",

        mobileImageUrl: banner.mobileImageUrl,
        mobileImagePublicId:
          banner.mobileImagePublicId ?? "",

        bannerLink: banner.bannerLink,

        badgeText: banner.badgeText,
        heading: banner.heading,
        description: banner.description,

        primaryButtonText: banner.primaryButtonText,
        primaryButtonLink: banner.primaryButtonLink,

        secondaryButtonText: banner.secondaryButtonText,
        secondaryButtonLink: banner.secondaryButtonLink,

        offerText: banner.offerText,

        isActive: banner.isActive,
        displayOrder: banner.displayOrder,
      });
    } else {
      const firstAvailableOrder =
        availableOrderOptions[0] ?? 1;

      setForm({
        ...defaultForm,
        displayOrder: firstAvailableOrder,
      });
    }

    setDesktopProgress(0);
    setMobileProgress(0);
    setDesktopUploading(false);
    setMobileUploading(false);
  }, [banner, availableOrderOptions]);

  const updateField = <K extends keyof HeroBannerFormData>(
    field: K,
    value: HeroBannerFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleDesktopSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setDesktopUploading(true);
      setDesktopProgress(0);

      const result = await uploadImageWithDetails(
        file,
        "hero-banners/desktop",
        setDesktopProgress,
      );

      updateField("desktopImageUrl", result.secureUrl);
      updateField("desktopImagePublicId", result.publicId);
    } catch (error) {
      console.error(
        "Failed to upload desktop hero image:",
        error,
      );
    } finally {
      setDesktopUploading(false);
      event.target.value = "";
    }
  };

  const handleMobileSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setMobileUploading(true);
      setMobileProgress(0);

      const result = await uploadImageWithDetails(
        file,
        "hero-banners/mobile",
        setMobileProgress,
      );

      updateField("mobileImageUrl", result.secureUrl);
      updateField("mobileImagePublicId", result.publicId);
    } catch (error) {
      console.error(
        "Failed to upload mobile hero image:",
        error,
      );
    } finally {
      setMobileUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const isUploading = desktopUploading || mobileUploading;
  const noOrderAvailable = availableOrderOptions.length === 0;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, mb: 0.5 }}
        >
          Hero Banner
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Upload separate desktop and mobile artwork. The uploaded
          artwork will be displayed full-width on the homepage.
        </Typography>
      </Box>

      {/* Desktop Banner */}
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Desktop Banner
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Use a wide promotional banner designed specifically for
          desktop screens.
        </Typography>

        <ImageUploadField
          uploading={desktopUploading}
          progress={desktopProgress}
          onSelectFile={handleDesktopSelectFile}
        />
      </Stack>

      {form.desktopImageUrl && (
        <Box
          sx={{
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={form.desktopImageUrl}
            alt="Desktop hero banner preview"
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Box>
      )}

      {/* Mobile Banner */}
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Mobile Banner
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Use a separate portrait/mobile composition. Do not simply
          crop the desktop banner.
        </Typography>

        <ImageUploadField
          uploading={mobileUploading}
          progress={mobileProgress}
          onSelectFile={handleMobileSelectFile}
        />
      </Stack>

      {form.mobileImageUrl && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            mx: "auto",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={form.mobileImageUrl}
            alt="Mobile hero banner preview"
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Box>
      )}

      {/* Banner Destination */}
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Banner Destination
        </Typography>

        <TextField
          fullWidth
          label="Banner Link"
          value={form.bannerLink}
          onChange={(event) =>
            updateField("bannerLink", event.target.value)
          }
          placeholder="/products"
          helperText="Clicking anywhere on the banner will open this destination."
        />
      </Stack>

      {/* Display Settings */}
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Display Settings
        </Typography>

        <FormControl fullWidth disabled={noOrderAvailable}>
          <InputLabel id="hero-display-order-label">
            Display Order
          </InputLabel>

          <Select
            labelId="hero-display-order-label"
            value={form.displayOrder}
            label="Display Order"
            onChange={(event) =>
              updateField("displayOrder", Number(event.target.value))
            }
            MenuProps={{
              slotProps: {
                paper: {
                  sx: { maxHeight: 320 },
                },
              },
            }}
          >
            {availableOrderOptions.map((order) => (
              <MenuItem key={order} value={order}>
                Position {order}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="caption" color="text.secondary">
          Each position from 1 to 5 can only be assigned to one banner.
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
            />
          }
          label="Show this banner on homepage"
        />

        {noOrderAvailable && !banner && (
          <Typography
            variant="body2"
            color="error"
            sx={{ fontWeight: 600 }}
          >
            All 5 hero banner positions are already occupied.
          </Typography>
        )}
      </Stack>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          pt: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading || isUploading}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            isUploading ||
            noOrderAvailable ||
            !form.desktopImageUrl ||
            !form.mobileImageUrl
          }
          sx={{
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {loading
            ? "Saving..."
            : banner
              ? "Update Banner"
              : "Add Banner"}
        </Button>
      </Box>
    </Stack>
  );
}
