import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  LinearProgress,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AdminSelect from "@/features/admin/components/AdminSelect";
import ImageUploadField from "@/features/admin/products/components/ImageUploadField";
import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";

import { useHeroBanners } from "../hooks/useHeroBanners";
import type { HeroImageFiles } from "../services/heroBannerService";
import type {
  HeroBanner,
  HeroBannerFormData,
} from "../types/heroBanner";

interface HeroFormProps {
  banner?: HeroBanner | null;
  onSubmit: (data: HeroBannerFormData, files: HeroImageFiles) => void;
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

// Advice shown to the admin. Nothing here blocks a save.
const DESKTOP = { width: 1920, height: 640, ratio: 3, kb: 200, warnKb: 300 };
const MOBILE = { width: 800, height: 1000, ratio: 0.8, kb: 100, warnKb: 150 };

type Spec = typeof DESKTOP;

/** Looks at the chosen file and returns friendly advice (never blocks). */
function checkBanner(
  file: File,
  spec: Spec,
  minWidth: number,
  maxWidth: number,
  shape: string,
): Promise<string[]> {
  return new Promise((resolve) => {
    const notes: string[] = [];
    const kb = Math.round(file.size / 1024);

    if (kb > spec.warnKb) {
      notes.push(
        `This image is ${kb} KB. Aim for about ${spec.kb} KB. Banners are the first thing visitors see, so a lighter file makes the store feel faster.`,
      );
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const w = image.naturalWidth;
      const h = image.naturalHeight;
      const ratio = w / h;

      if (Math.abs(ratio - spec.ratio) / spec.ratio > 0.1) {
        notes.push(
          `This image is ${w} × ${h} px. The recommended shape is ${shape} (${spec.width} × ${spec.height} px). Use the same shape for every banner, otherwise the page jumps when the slides change.`,
        );
      }

      if (w < minWidth) {
        notes.push("This image is small and may look blurry on large screens.");
      }

      if (w > maxWidth) {
        notes.push(
          `This image is larger than needed. ${spec.width} px wide is enough and loads faster.`,
        );
      }

      URL.revokeObjectURL(url);
      resolve(notes);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(notes);
    };

    image.src = url;
  });
}

interface BannerImageFieldProps {
  title: string;
  guide: string;
  existingUrl: string;
  existingWidth: number;
  file: File | null;
  notes: string[];
  disabled: boolean;
  maxPreviewWidth?: number;
  onPick: (file: File) => void;
  onUndo: () => void;
}

function BannerImageField({
  title,
  guide,
  existingUrl,
  existingWidth,
  file,
  notes,
  disabled,
  maxPreviewWidth,
  onPick,
  onUndo,
}: BannerImageFieldProps) {
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const previewSrc =
    objectUrl || cloudinaryThumb(existingUrl, existingWidth);

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>

      <Box>
        <ImageUploadField
          uploading={false}
          progress={0}
          onSelectFile={(event) => {
            const picked = event.target.files?.[0];
            event.target.value = "";
            if (picked && !disabled) onPick(picked);
          }}
        />

        <FormHelperText sx={{ mt: 1 }}>{guide}</FormHelperText>

        {notes.map((note) => (
          <FormHelperText key={note} sx={{ color: "warning.main" }}>
            {note}
          </FormHelperText>
        ))}
      </Box>

      {file && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            New image: {file.name} ({Math.round(file.size / 1024)} KB). It is
            uploaded when you save.
          </Typography>

          <Button size="small" onClick={onUndo} disabled={disabled}>
            Undo
          </Button>
        </Stack>
      )}

      {previewSrc && (
        <Box
          sx={{
            width: "100%",
            maxWidth: maxPreviewWidth,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={previewSrc}
            alt={`${title} preview`}
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>
      )}
    </Stack>
  );
}

export default function HeroForm({
  banner,
  onSubmit,
  onCancel,
  loading = false,
}: HeroFormProps) {
  const { data: banners = [] } = useHeroBanners();

  const availableOrderOptions = useMemo(() => {
    const usedOrders = new Set(
      banners
        .filter((currentBanner) => currentBanner.id !== banner?.id)
        .map((currentBanner) => currentBanner.displayOrder),
    );

    return HERO_ORDER_OPTIONS.filter((order) => !usedOrders.has(order));
  }, [banners, banner?.id]);

  // Set once when the form opens, so a background refresh can't wipe
  // the files the admin has chosen.
  const [form, setForm] = useState<HeroBannerFormData>(() =>
    banner
      ? {
          desktopImageUrl: banner.desktopImageUrl,
          desktopImagePublicId: banner.desktopImagePublicId ?? "",

          mobileImageUrl: banner.mobileImageUrl,
          mobileImagePublicId: banner.mobileImagePublicId ?? "",

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
        }
      : { ...defaultForm, displayOrder: availableOrderOptions[0] ?? 1 },
  );

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [desktopNotes, setDesktopNotes] = useState<string[]>([]);
  const [mobileNotes, setMobileNotes] = useState<string[]>([]);

  const updateField = <K extends keyof HeroBannerFormData>(
    field: K,
    value: HeroBannerFormData[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const pickDesktop = async (file: File) => {
    setDesktopFile(file);
    setDesktopNotes(await checkBanner(file, DESKTOP, 1400, 2600, "3:1 wide banner"));
  };

  const pickMobile = async (file: File) => {
    setMobileFile(file);
    setMobileNotes(await checkBanner(file, MOBILE, 640, 1300, "4:5 portrait"));
  };

  const noOrderAvailable = availableOrderOptions.length === 0;

  const hasDesktop = Boolean(desktopFile || form.desktopImageUrl);
  const hasMobile = Boolean(mobileFile || form.mobileImageUrl);

  const handleSubmit = () => {
    onSubmit(form, { desktop: desktopFile, mobile: mobileFile });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Upload separate desktop and mobile artwork. It is shown full width on
        the homepage. Images are uploaded only when you press Save, so closing
        this window never leaves unused files behind.
      </Typography>

      <BannerImageField
        title="Desktop banner"
        guide={`Recommended: ${DESKTOP.width} × ${DESKTOP.height} px (3:1 wide banner), WebP or JPEG, around ${DESKTOP.kb} KB. Shown on screens wider than 767 px. Keep text and logos away from the edges. Use the same size for all five banners so the page doesn't jump between slides. You can convert images for free at squoosh.app.`}
        existingUrl={form.desktopImageUrl}
        existingWidth={960}
        file={desktopFile}
        notes={desktopNotes}
        disabled={loading}
        onPick={(file) => void pickDesktop(file)}
        onUndo={() => {
          setDesktopFile(null);
          setDesktopNotes([]);
        }}
      />

      <BannerImageField
        title="Mobile banner"
        guide={`Recommended: ${MOBILE.width} × ${MOBILE.height} px (4:5 portrait), WebP or JPEG, around ${MOBILE.kb} KB. Shown on phones (767 px and narrower). Design it separately instead of cropping the desktop banner.`}
        existingUrl={form.mobileImageUrl}
        existingWidth={480}
        file={mobileFile}
        notes={mobileNotes}
        disabled={loading}
        maxPreviewWidth={260}
        onPick={(file) => void pickMobile(file)}
        onUndo={() => {
          setMobileFile(null);
          setMobileNotes([]);
        }}
      />

      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Banner destination
        </Typography>

        <TextField
          fullWidth
          label="Banner link"
          value={form.bannerLink}
          onChange={(event) => updateField("bannerLink", event.target.value)}
          placeholder="/products"
          helperText="Clicking anywhere on the banner opens this page."
          disabled={loading}
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Display settings
        </Typography>

        <AdminSelect
          fullWidth
          label="Display order"
          value={form.displayOrder}
          disabled={noOrderAvailable || loading}
          onChange={(event) =>
            updateField("displayOrder", Number(event.target.value))
          }
          helperText="Each position from 1 to 5 can only be used by one banner."
        >
          {availableOrderOptions.map((order) => (
            <MenuItem key={order} value={order}>
              Position {order}
            </MenuItem>
          ))}
        </AdminSelect>

        <FormControlLabel
          control={
            <Switch
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
              disabled={loading}
            />
          }
          label="Show this banner on homepage"
        />

        {noOrderAvailable && !banner && (
          <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
            All 5 hero banner positions are already occupied.
          </Typography>
        )}
      </Stack>

      {loading && (
        <Box>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary">
            Saving. New images are being uploaded, please wait.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 1 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || noOrderAvailable || !hasDesktop || !hasMobile}
        >
          {loading ? "Saving..." : banner ? "Update banner" : "Add banner"}
        </Button>
      </Box>
    </Stack>
  );
}