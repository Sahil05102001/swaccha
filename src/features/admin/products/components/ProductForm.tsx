import { useState } from "react";

import {
  Box,
  FormControlLabel,
  FormHelperText,
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
    value: string | number | boolean | string[]
  ) => void;
  errors?: Partial<
    Record<keyof ProductFormData, string>
  >;
}

export default function ProductForm({
  formData,
  onChange,
  errors = {},
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

      onChange("images", [imageUrl]);
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
          required
          label="Product Name"
          value={formData.name}
          error={!!errors.name}
          helperText={errors.name}
          onChange={(e) =>
            onChange("name", e.target.value)
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          multiline
          minRows={4}
          label="Description"
          value={formData.description}
          error={!!errors.description}
          helperText={errors.description}
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
          required
          select
          label="Category"
          value={formData.category}
          disabled={categoriesLoading}
          error={!!errors.category}
          helperText={errors.category}
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
          required
          type="number"
          label="Price"
          value={formData.price}
          error={!!errors.price}
          helperText={errors.price}
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
          required
          type="number"
          label="Stock"
          value={formData.stock}
          error={!!errors.stock}
          helperText={errors.stock}
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

        {errors.images && (
          <FormHelperText error>
            {errors.images}
          </FormHelperText>
        )}
      </Grid>

      {formData.images.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Box
            component="img"
            src={formData.images[0]}
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