import { useEffect, useState } from "react";

import { Box, Button, FormHelperText, Stack, Typography } from "@mui/material";

import ImageUploadField from "@/features/admin/products/components/ImageUploadField";
import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";

export interface DeferredImageFieldProps {
  title: string;
  guide: string;
  /** The saved image ("" if none). */
  existingUrl: string;
  /** Width of the small copy shown for the saved image. */
  thumbWidth: number;
  /** A newly chosen file. It is uploaded only when the form is saved. */
  file: File | null;
  notes: string[];
  disabled?: boolean;
  shape?: "rect" | "circle";
  maxPreviewWidth?: number;
  removed?: boolean;
  onPick: (file: File) => void;
  onUndoPick: () => void;
  /** Provide these two to allow removing the saved image. */
  onRemove?: () => void;
  onUndoRemove?: () => void;
}

export default function DeferredImageField({
  title,
  guide,
  existingUrl,
  thumbWidth,
  file,
  notes,
  disabled = false,
  shape = "rect",
  maxPreviewWidth,
  removed = false,
  onPick,
  onUndoPick,
  onRemove,
  onUndoRemove,
}: DeferredImageFieldProps) {
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
    objectUrl || (removed ? "" : cloudinaryThumb(existingUrl, thumbWidth));

  const isCircle = shape === "circle";

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

          <Button size="small" onClick={onUndoPick} disabled={disabled}>
            Undo
          </Button>
        </Stack>
      )}

      {removed && !file && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            The current image will be removed when you save.
          </Typography>

          <Button size="small" onClick={onUndoRemove} disabled={disabled}>
            Undo
          </Button>
        </Stack>
      )}

      {onRemove && existingUrl && !removed && !file && (
        <Box>
          <Button size="small" color="error" onClick={onRemove} disabled={disabled}>
            Remove current image
          </Button>
        </Box>
      )}

      {previewSrc && (
        <Box
          sx={{
            width: isCircle ? (maxPreviewWidth ?? 120) : "100%",
            maxWidth: isCircle ? undefined : maxPreviewWidth,
            aspectRatio: isCircle ? "1 / 1" : undefined,
            borderRadius: isCircle ? "50%" : 2,
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
            sx={{
              display: "block",
              width: "100%",
              height: isCircle ? "100%" : "auto",
              objectFit: isCircle ? "cover" : undefined,
            }}
          />
        </Box>
      )}
    </Stack>
  );
}