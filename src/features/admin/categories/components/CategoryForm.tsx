import { useState } from "react";

import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";

import ImageUploadField from "../../products/components/ImageUploadField";

import { uploadProductImage } from "../../products/services/storageService";

import type { CategoryFormData } from "../types/category";

interface CategoryFormProps {
  formData: CategoryFormData;
  onChange: (
    field: keyof CategoryFormData,
    value: string | boolean
  ) => void;
}

export default function CategoryForm({
  formData,
  onChange,
}: CategoryFormProps) {
  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const handleSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      const imageUrl =
        await uploadProductImage(
          file,
          setProgress
        );

      onChange("imageUrl", imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Category Name"
          value={formData.name}
          onChange={(e) =>
            onChange("name", e.target.value)
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ImageUploadField
          uploading={uploading}
          progress={progress}
          onSelectFile={handleSelectFile}
        />
      </Grid>

      {formData.imageUrl && (
        <Grid size={{ xs: 12 }}>
          <Box
            component="img"
            src={formData.imageUrl}
            alt="Category"
            sx={{
              width: 160,
              height: 160,
              objectFit: "cover",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        </Grid>
      )}

      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) =>
                onChange(
                  "isActive",
                  e.target.checked
                )
              }
            />
          }
          label="Active Category"
        />
      </Grid>
    </Grid>
  );
}