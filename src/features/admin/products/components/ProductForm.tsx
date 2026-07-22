import { useState } from "react";

import {
  Box,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";

import ImageUploadField from "./ImageUploadField";

import { uploadProductImage } from "../services/storageService";

import { useActiveCategories } from "@/features/admin/categories/hooks/useActiveCategories";

import type { ProductFormData } from "../types/product";

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (
    field: keyof ProductFormData,
    value: string | number | boolean
  ) => void;
}

export default function ProductForm({
  formData,
  onChange,
}: ProductFormProps) {
  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useActiveCategories();

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
          label="Product Name"
          value={formData.name}
          onChange={(e) =>
            onChange("name", e.target.value)
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Description"
          value={formData.description}
          onChange={(e) =>
            onChange(
              "description",
              e.target.value
            )
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          select
          label="Category"
          value={formData.category}
          disabled={categoriesLoading}
          onChange={(e) =>
            onChange(
              "category",
              e.target.value
            )
          }
        >
          <MenuItem value="">
            Select Category
          </MenuItem>

          {categories.map((category) => (
            <MenuItem
              key={category.id}
              value={category.name}
            >
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          type="number"
          label="Price"
          value={formData.price}
          onChange={(e) =>
            onChange(
              "price",
              Number(e.target.value)
            )
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          type="number"
          label="Stock"
          value={formData.stock}
          onChange={(e) =>
            onChange(
              "stock",
              Number(e.target.value)
            )
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
            alt="Product"
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
          label="Active Product"
        />
      </Grid>
    </Grid>
  );
}