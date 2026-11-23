import { useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import DeferredImageField from "@/features/admin/components/DeferredImageField";
import { checkImageFile, type ImageSpec } from "@/features/admin/utils/imageAdvice";

import type { SaveBrandStatementInput } from "../services/brandStatementService";
import {
  DEFAULT_BRAND_STATEMENT,
  type BrandStatement,
} from "../types/brandStatement";

const DESKTOP_SPEC: ImageSpec = {
  width: 1920,
  height: 800,
  kb: 200,
  warnKb: 300,
  minWidth: 1400,
  maxWidth: 2600,
  shape: "12:5 wide banner",
  keepSameShape: true,
};

const MOBILE_SPEC: ImageSpec = {
  width: 800,
  height: 1000,
  kb: 100,
  warnKb: 150,
  minWidth: 640,
  maxWidth: 1300,
  shape: "4:5 portrait",
  keepSameShape: true,
};

interface BrandStatementFormProps {
  statement?: BrandStatement | null;
  onSubmit: (input: SaveBrandStatementInput) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function BrandStatementForm({
  statement,
  onSubmit,
  onCancel,
  loading = false,
}: BrandStatementFormProps) {
  const start = statement ?? DEFAULT_BRAND_STATEMENT;

  const desktopUrl = statement?.desktopImageUrl || statement?.imageUrl || "";
  const mobileUrl = statement?.mobileImageUrl || "";

  const [brandName, setBrandName] = useState(start.brandName ?? "");
  const [title, setTitle] = useState(start.title ?? "");
  const [description, setDescription] = useState(start.description ?? "");
  const [tagline, setTagline] = useState(start.tagline ?? "");
  const [isActive, setIsActive] = useState(start.isActive);

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [removeDesktop, setRemoveDesktop] = useState(false);
  const [removeMobile, setRemoveMobile] = useState(false);
  const [desktopNotes, setDesktopNotes] = useState<string[]>([]);
  const [mobileNotes, setMobileNotes] = useState<string[]>([]);

  return (
    <Stack spacing={2.5}>
      <TextField
        fullWidth
        label="Brand name"
        value={brandName}
        onChange={(event) => setBrandName(event.target.value)}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Main quote / title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        helperText="Shown as text when no banner image is set."
        disabled={loading}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Tagline"
        value={tagline}
        onChange={(event) => setTagline(event.target.value)}
        disabled={loading}
      />

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Banner images (optional)
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          With a desktop image the banner replaces the text above. Without a
          mobile image, phones show the desktop image. Images are uploaded only
          when you press Save.
        </Typography>

        <Stack spacing={3}>
          <DeferredImageField
            title="Desktop banner"
            guide={`Recommended: ${DESKTOP_SPEC.width} × ${DESKTOP_SPEC.height} px (12:5 wide banner), WebP or JPEG, around ${DESKTOP_SPEC.kb} KB. Shown on screens wider than 767 px. Keep text and logos away from the edges. You can convert images for free at squoosh.app.`}
            existingUrl={desktopUrl}
            thumbWidth={960}
            file={desktopFile}
            notes={desktopNotes}
            disabled={loading}
            removed={removeDesktop}
            onPick={async (file) => {
              setDesktopFile(file);
              setRemoveDesktop(false);
              setDesktopNotes(await checkImageFile(file, DESKTOP_SPEC));
            }}
            onUndoPick={() => {
              setDesktopFile(null);
              setDesktopNotes([]);
            }}
            onRemove={() => setRemoveDesktop(true)}
            onUndoRemove={() => setRemoveDesktop(false)}
          />

          <DeferredImageField
            title="Mobile banner"
            guide={`Recommended: ${MOBILE_SPEC.width} × ${MOBILE_SPEC.height} px (4:5 portrait), WebP or JPEG, around ${MOBILE_SPEC.kb} KB. Shown on phones (767 px and narrower). Design it separately instead of cropping the desktop banner.`}
            existingUrl={mobileUrl}
            thumbWidth={480}
            file={mobileFile}
            notes={mobileNotes}
            disabled={loading}
            removed={removeMobile}
            maxPreviewWidth={260}
            onPick={async (file) => {
              setMobileFile(file);
              setRemoveMobile(false);
              setMobileNotes(await checkImageFile(file, MOBILE_SPEC));
            }}
            onUndoPick={() => {
              setMobileFile(null);
              setMobileNotes([]);
            }}
            onRemove={() => setRemoveMobile(true)}
            onUndoRemove={() => setRemoveMobile(false)}
          />
        </Stack>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            disabled={loading}
          />
        }
        label="Show this section on homepage"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={() =>
            void onSubmit({
              brandName,
              title,
              description,
              tagline,
              isActive,
              files: { desktop: desktopFile, mobile: mobileFile },
              removeDesktop: removeDesktop && !desktopFile,
              removeMobile: removeMobile && !mobileFile,
            })
          }
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </Box>
    </Stack>
  );
}