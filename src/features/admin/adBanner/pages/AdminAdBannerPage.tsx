import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import DeferredImageField from "@/features/admin/components/DeferredImageField";
import { checkImageFile, type ImageSpec } from "@/features/admin/utils/imageAdvice";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import { useAdBanner, useSaveAdBanner } from "../hooks/useAdBanner";
import type { SaveAdBannerInput } from "../services/adBannerService";
import type { AdBanner } from "../types/adBanner";

const DESKTOP_SPEC: ImageSpec = {
  width: 1920,
  height: 480,
  kb: 150,
  warnKb: 250,
  minWidth: 1400,
  maxWidth: 2600,
  shape: "4:1 wide banner",
  keepSameShape: true,
};

const MOBILE_SPEC: ImageSpec = {
  width: 800,
  height: 600,
  kb: 80,
  warnKb: 130,
  minWidth: 640,
  maxWidth: 1300,
  shape: "4:3 landscape",
  keepSameShape: true,
};

interface AdBannerFormProps {
  banner: AdBanner | null;
  saving: boolean;
  onSave: (input: SaveAdBannerInput) => void;
  onDiscard: () => void;
}

function AdBannerForm({ banner, saving, onSave, onDiscard }: AdBannerFormProps) {
  const initialAlt = banner?.altText ?? "Advertisement";
  const initialHref = banner?.href ?? "";
  const initialActive = banner?.isActive ?? true;

  const desktopUrl = banner?.desktopImageUrl || banner?.imageUrl || "";
  const mobileUrl = banner?.mobileImageUrl || desktopUrl;

  const [altText, setAltText] = useState(initialAlt);
  const [href, setHref] = useState(initialHref);
  const [isActive, setIsActive] = useState(initialActive);

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [desktopNotes, setDesktopNotes] = useState<string[]>([]);
  const [mobileNotes, setMobileNotes] = useState<string[]>([]);

  const dirty =
    Boolean(desktopFile || mobileFile) ||
    altText !== initialAlt ||
    href !== initialHref ||
    isActive !== initialActive;

  const hasBoth =
    Boolean(desktopFile || desktopUrl) && Boolean(mobileFile || mobileUrl);

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Banner images"
        subtitle="Images are uploaded only when you press Save, so nothing unused is left in Cloudinary."
      >
        <Stack spacing={4}>
          <DeferredImageField
            title="Desktop banner"
            guide={`Recommended: ${DESKTOP_SPEC.width} × ${DESKTOP_SPEC.height} px (4:1 wide banner), WebP or JPEG, around ${DESKTOP_SPEC.kb} KB. Shown on screens wider than 767 px. Keep text and logos away from the edges. You can convert images for free at squoosh.app.`}
            existingUrl={desktopUrl}
            thumbWidth={960}
            file={desktopFile}
            notes={desktopNotes}
            disabled={saving}
            onPick={async (file) => {
              setDesktopFile(file);
              setDesktopNotes(await checkImageFile(file, DESKTOP_SPEC));
            }}
            onUndoPick={() => {
              setDesktopFile(null);
              setDesktopNotes([]);
            }}
          />

          <DeferredImageField
            title="Mobile banner"
            guide={`Recommended: ${MOBILE_SPEC.width} × ${MOBILE_SPEC.height} px (4:3 landscape), WebP or JPEG, around ${MOBILE_SPEC.kb} KB. Shown on phones (767 px and narrower). Design it separately instead of cropping the desktop banner.`}
            existingUrl={mobileUrl}
            thumbWidth={480}
            file={mobileFile}
            notes={mobileNotes}
            disabled={saving}
            maxPreviewWidth={420}
            onPick={async (file) => {
              setMobileFile(file);
              setMobileNotes(await checkImageFile(file, MOBILE_SPEC));
            }}
            onUndoPick={() => {
              setMobileFile(null);
              setMobileNotes([]);
            }}
          />
        </Stack>
      </SectionCard>

      <SectionCard title="Link and visibility">
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Alt text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            helperText="Describes the banner for screen readers and search engines."
            disabled={saving}
          />

          <TextField
            fullWidth
            label="Banner link"
            value={href}
            onChange={(event) => setHref(event.target.value)}
            placeholder="/products"
            helperText="Optional. Example: /products"
            disabled={saving}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                disabled={saving}
              />
            }
            label="Show banner on homepage"
          />
        </Stack>
      </SectionCard>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          p: 1.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {!hasBoth
            ? "Choose both a desktop and a mobile image to save."
            : dirty
              ? "You have unsaved changes."
              : "All changes are saved."}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button disabled={!dirty || saving} onClick={onDiscard}>
            Discard
          </Button>

          <Button
            variant="contained"
            disabled={!dirty || saving || !hasBoth}
            onClick={() =>
              onSave({
                altText,
                href,
                isActive,
                files: { desktop: desktopFile, mobile: mobileFile },
              })
            }
          >
            {saving ? "Saving..." : "Save banner"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default function AdminAdBannerPage() {
  const { showSnackbar } = useSnackbar();

  const { data: banner, isLoading, isError, refetch, isRefetching } = useAdBanner();
  const saveMutation = useSaveAdBanner();

  // Changing the key gives the form a fresh start (after save or discard).
  const [formKey, setFormKey] = useState(0);

  const handleSave = async (input: SaveAdBannerInput) => {
    try {
      const result = await saveMutation.mutateAsync(input);

      showSnackbar(
        result.cleanupFailed
          ? "Banner saved, but an old image could not be removed from Cloudinary."
          : "Banner saved.",
        result.cleanupFailed ? "error" : "success",
      );

      scrollToTop();
      setFormKey((key) => key + 1);
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save the banner.",
        "error",
      );
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Ad Banner"
        subtitle="The advertisement banner shown on the homepage, with a desktop and a mobile image."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={300} />
          <Skeleton variant="rounded" height={220} />
        </Stack>
      ) : isError ? (
        <Alert severity="error">Failed to load the ad banner.</Alert>
      ) : (
        <AdBannerForm
          key={formKey}
          banner={banner ?? null}
          saving={saveMutation.isPending}
          onSave={(input) => void handleSave(input)}
          onDiscard={() => setFormKey((key) => key + 1)}
        />
      )}
    </PageContainer>
  );
}