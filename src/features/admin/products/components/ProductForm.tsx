
import { useState } from "react";

import {
  Box,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AddCategoryDialog from "@/features/admin/categories/components/AddCategoryDialog";
import { useActiveCategories } from "@/features/admin/categories/hooks/useActiveCategories";
import AdminSelect from "@/features/admin/components/AdminSelect";
import RateSelect from "@/features/tax/components/RateSelect";
import { useGlobalProductStickerSettings } from "@/features/admin/offerzone/hooks/useOfferZone";
import { MAX_BADGE_LENGTH } from "@/features/admin/offerzone/types/offerZone";

import { uploadProductImageWithDetails } from "../services/storageService";
import type { ProductFormData } from "../types/product";
import ImageUploadField from "./ImageUploadField";

const ADD_CATEGORY_VALUE = "__add_new_category__";

const PRODUCT_UNITS = [
  { label: "Piece (PCS)", value: "pcs" },
  { label: "Bottle (BTL)", value: "bottle" },
  { label: "Litre (LTR)", value: "ltr" },
  { label: "Millilitre (ML)", value: "ml" },
  { label: "Kilogram (KG)", value: "kg" },
  { label: "Gram (GM)", value: "gm" },
  { label: "Pack (PKT)", value: "pack" },
  { label: "Box (BOX)", value: "box" },
  { label: "Carton (CTN)", value: "carton" },
  { label: "Set (SET)", value: "set" },
];

// Advice shown to the admin. Nothing here blocks an upload.
const IMAGE_SIZE_PX = 1000;
const IMAGE_MAX_KB = 50;
const IMAGE_WARN_KB = 100;

/** Looks at the chosen file and returns friendly advice (never blocks). */
function checkImage(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    const notes: string[] = [];
    const kb = Math.round(file.size / 1024);

    if (kb > IMAGE_WARN_KB) {
      notes.push(
        `This image is ${kb} KB. Aim for about ${IMAGE_MAX_KB} KB, because smaller images make the store load faster.`,
      );
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const w = image.naturalWidth;
      const h = image.naturalHeight;

      if (w !== h) {
        notes.push(
          `This image is ${w} × ${h} px, not square. It may be cropped or shown with empty space on product cards.`,
        );
      }
      if (Math.min(w, h) < 800) {
        notes.push("This image is small and may look blurry on large screens.");
      }
      if (Math.max(w, h) > 1600) {
        notes.push(
          `This image is larger than needed. ${IMAGE_SIZE_PX} × ${IMAGE_SIZE_PX} px is enough and loads faster.`,
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

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (
    field: keyof ProductFormData,
    value: string | number | boolean | string[]
  ) => void;
  errors?: Partial<Record<keyof ProductFormData, string>>;
  // When true the stock can't be typed here (editing an existing product).
  stockLocked?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ProductForm({
  formData,
  onChange,
  errors = {},
  stockLocked = false,
  onUploadingChange,
}: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [imageNotes, setImageNotes] = useState<string[]>([]);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useActiveCategories();

  const { data: stickerSettings } = useGlobalProductStickerSettings();
  const globalBadgeText = stickerSettings?.globalBadge?.text?.trim() ?? "";
  const badgeMode = formData.badgeMode ?? "none";

  const handleCategoryChange = (value: string) => {
    if (value === ADD_CATEGORY_VALUE) {
      setAddCategoryOpen(true);
      return;
    }

    onChange("category", value);
  };

  const handleSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      onUploadingChange?.(true);

      // Advice only: the upload goes ahead whatever the notes say.
      setImageNotes(await checkImage(file));

      const result = await uploadProductImageWithDetails(
        file,
        setProgress
      );

      onChange("images", [result.secureUrl]);
      onChange("imagePublicId", result.publicId);
    } catch (error) {
      console.error("Product image upload failed:", error);
    } finally {
      setUploading(false);
      setProgress(0);
      event.target.value = "";
      onUploadingChange?.(false);
    }
  };

  const hsn = (formData.hsnCode ?? "").trim();
  const hsnInvalid =
    hsn !== "" && !/^\d{4}(\d{2}(\d{2})?)?$/.test(hsn);

  const hasDiscount =
    formData.mrp > formData.price &&
    formData.mrp > 0 &&
    formData.price > 0;

  const discountPercentage = hasDiscount
    ? Math.round(
      ((formData.mrp - formData.price) / formData.mrp) * 100
    )
    : 0;

  return (
    <>
      <Grid container spacing={2}>
        {/* Product Name */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Product Name"
            value={formData.name}
            error={!!errors.name}
            helperText={errors.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Grid>

        {/* Description */}
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
            onChange={(e) => onChange("description", e.target.value)}
          />
        </Grid>

        {/* Brand */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Brand (optional)"
            value={formData.brand}
            onChange={(e) => onChange("brand", e.target.value)}
          />
        </Grid>

        {/* SKU */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="SKU"
            value={formData.sku}
            error={!!errors.sku}
            helperText={errors.sku || "Enter a unique product SKU"}
            onChange={(e) => onChange("sku", e.target.value)}
          />
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AdminSelect
            fullWidth
            required
            label="Category"
            value={formData.category}
            disabled={categoriesLoading}
            error={!!errors.category}
            helperText={errors.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="">Select Category</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}

            <MenuItem
              value={ADD_CATEGORY_VALUE}
              sx={{
                color: "primary.main",
                fontWeight: 600,
                borderTop: "1px solid",
                borderColor: "divider",
                mt: 0.5,
              }}
            >
              + Add New Category
            </MenuItem>
          </AdminSelect>
        </Grid>

        {/* Subcategory */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Subcategory (optional)"
            value={formData.subcategory}
            error={!!errors.subcategory}
            helperText={errors.subcategory}
            onChange={(e) => onChange("subcategory", e.target.value)}
          />
        </Grid>

        {/* Product Size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Product Size (optional)"
            value={formData.productSize}
            error={!!errors.productSize}
            helperText={
              errors.productSize || "Example: 0.5, 1, 1.5, 5"
            }
            slotProps={{
              htmlInput: {
                min: 0,
                step: "any",
              },
            }}
            onChange={(e) =>
              onChange(
                "productSize",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </Grid>

        {/* Unit */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AdminSelect
            fullWidth
            required
            label="Unit"
            value={formData.unit}
            error={!!errors.unit}
            helperText={errors.unit || "Select the product measurement unit"}
            onChange={(e) => onChange("unit", e.target.value)}
          >
            <MenuItem value="">Select Unit</MenuItem>

            {PRODUCT_UNITS.map((unit) => (
              <MenuItem key={unit.value} value={unit.value}>
                {unit.label}
              </MenuItem>
            ))}
          </AdminSelect>
        </Grid>

        {/* Selling Price */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Selling Price (₹)"
            value={formData.price || ""}
            error={!!errors.price}
            helperText={errors.price || "Actual customer price"}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
            }}
            onChange={(e) =>
              onChange("price", Number(e.target.value))
            }
          />
        </Grid>

        {/* MRP */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="MRP (₹)"
            value={formData.mrp || ""}
            error={!!errors.mrp}
            helperText={errors.mrp || "Original retail price"}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
            }}
            onChange={(e) =>
              onChange("mrp", Number(e.target.value))
            }
          />
        </Grid>

        {/* Automatic Discount Preview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              minHeight: 56,
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            {hasDiscount ? (
              <Typography variant="body2" color="success.main">
                Discount: <strong>{discountPercentage}% OFF</strong>
                {" — "}You save ₹
                {(formData.mrp - formData.price).toFixed(2)}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {formData.mrp > 0 && formData.mrp < formData.price
                  ? "MRP must be at least the selling price."
                  : "No discount applied."}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Stock */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="number"
            label={stockLocked ? "Current stock" : "Opening stock"}
            value={formData.stock || ""}
            error={!!errors.stock}
            disabled={stockLocked}
            helperText={
              errors.stock ??
              (stockLocked
                ? "To change stock, use Stock History → Update stock."
                : undefined)
            }
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
            onChange={(e) =>
              onChange("stock", Number(e.target.value))
            }
          />
        </Grid>

        {/* HSN */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="HSN code (optional)"
            value={formData.hsnCode ?? ""}
            error={hsnInvalid}
            helperText={
              hsnInvalid
                ? "HSN code must be 4, 6 or 8 digits."
                : "Used on tax invoices while GST is on."
            }
            onChange={(e) =>
              onChange(
                "hsnCode",
                e.target.value.replace(/\D/g, "").slice(0, 8)
              )
            }
          />
        </Grid>

        {/* GST */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RateSelect
            fullWidth
            label="GST rate"
            value={formData.gstRate ?? ""}
            emptyLabel="Use the default rate"
            helperText="The price above already includes GST."
            onChange={(rate) => onChange("gstRate", rate)}
          />
        </Grid>

        {/* Badge */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AdminSelect
            fullWidth
            label="Product badge (optional)"
            value={badgeMode}
            onChange={(e) => onChange("badgeMode", e.target.value)}
            helperText="Shown on the product card. Offer Zone, New and Bestseller tags take priority."
          >
            <MenuItem value="none">No badge</MenuItem>
            <MenuItem value="global">
              {globalBadgeText
                ? `Global badge: ${globalBadgeText}`
                : "Global badge"}
            </MenuItem>
            <MenuItem value="custom">Custom badge</MenuItem>
          </AdminSelect>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {badgeMode === "custom" && (
            <TextField
              fullWidth
              label="Custom badge text"
              value={formData.badgeText ?? ""}
              onChange={(e) => onChange("badgeText", e.target.value)}
              slotProps={{
                htmlInput: { maxLength: MAX_BADGE_LENGTH },
              }}
              helperText={`Up to ${MAX_BADGE_LENGTH} characters. Empty means no badge.`}
            />
          )}

          {badgeMode === "global" && !globalBadgeText && (
            <FormHelperText sx={{ color: "warning.main", mt: 2 }}>
              The global badge text is empty, so nothing will show. Set it on
              the Offer Zone page.
            </FormHelperText>
          )}
        </Grid>

        {/* Product Image */}
        <Grid size={{ xs: 12 }}>
          <ImageUploadField
            uploading={uploading}
            progress={progress}
            onSelectFile={handleSelectFile}
          />

          <FormHelperText sx={{ mt: 1 }}>
            <strong>Recommended:</strong> {IMAGE_SIZE_PX} × {IMAGE_SIZE_PX} px
            square (1:1), WebP or JPEG, around {IMAGE_MAX_KB} KB. Keep the
            product centred on a plain white background with about 8–10%
            empty space around it, so nothing is cropped or hidden behind the
            badge. WebP gives the smallest files, and you can convert for free
            at squoosh.app.
          </FormHelperText>

          {imageNotes.map((note) => (
            <FormHelperText key={note} sx={{ color: "warning.main" }}>
              {note}
            </FormHelperText>
          ))}

          {errors.images && (
            <FormHelperText error>{errors.images}</FormHelperText>
          )}
        </Grid>

        {formData.images.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Preview (full image, nothing cropped)
            </Typography>

            <Box
              component="img"
              src={formData.images[0]}
              alt="Product"
              sx={{
                width: 160,
                height: 160,
                objectFit: "contain",
                bgcolor: "#F9FAFB",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </Grid>
        )}

        {/* Active Product */}
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  onChange("isActive", e.target.checked)
                }
              />
            }
            label="Active Product"
          />
        </Grid>
      </Grid>

      <AddCategoryDialog
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onCategoryCreated={(categoryName) => {
          onChange("category", categoryName);
        }}
      />
    </>
  );
}
