import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import SectionCard from "@/components/common/SectionCard";

import ImageUploadField from "@/features/admin/products/components/ImageUploadField";

import {
  uploadImageWithDetails,
} from "@/features/admin/products/services/storageService";

import {
  useCategoryCircles,
  useCreateCategoryCircle,
  useUpdateCategoryCircle,
  useDeleteCategoryCircle,
} from "../hooks/useCategoryCircles";

import type {
  CategoryCircle,
  CategoryCircleFormData,
} from "../types/categoryCircle";

const CATEGORY_CIRCLE_UPLOAD_FOLDER = "category-circles";
const MAX_CATEGORY_CIRCLES = 10;

const DEFAULT_FORM: CategoryCircleFormData = {
  label: "",
  imageUrl: "",
  imagePublicId: "",
  icon: "Category",
  href: "/products",
  sortOrder: 1,
  isActive: true,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function AdminCategoryCirclesPage() {
  const { data: circles = [], isLoading } = useCategoryCircles();

  const createMutation = useCreateCategoryCircle();
  const updateMutation = useUpdateCategoryCircle();
  const deleteMutation = useDeleteCategoryCircle();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] =
    useState<CategoryCircleFormData>(DEFAULT_FORM);

  const [sortOrderInput, setSortOrderInput] = useState("1");

  const [imageUploading, setImageUploading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isAtLimit = circles.length >= MAX_CATEGORY_CIRCLES;
  const isEditing = editingId !== null;

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const parsedSortOrder =
    sortOrderInput.trim() === "" ? NaN : Number(sortOrderInput);

  const invalidSortOrder =
    !Number.isSafeInteger(parsedSortOrder) ||
    parsedSortOrder < 1 ||
    parsedSortOrder > MAX_CATEGORY_CIRCLES;

  useEffect(() => {
    if (editingId) {
      return;
    }

    const nextSortOrder = String(
      Math.min(circles.length + 1, MAX_CATEGORY_CIRCLES),
    );

    setSortOrderInput(nextSortOrder);

    setForm((current) => ({
      ...current,
      sortOrder: Number(nextSortOrder),
    }));
  }, [circles.length, editingId]);

  const resetForm = () => {
    const nextSortOrder = String(
      Math.min(circles.length + 1, MAX_CATEGORY_CIRCLES),
    );

    setEditingId(null);
    setImageUploading(false);
    setImageProgress(0);
    setSortOrderInput(nextSortOrder);

    setForm({
      ...DEFAULT_FORM,
      sortOrder: Number(nextSortOrder),
    });
  };

  const handleChange = <K extends keyof CategoryCircleFormData>(
    key: K,
    value: CategoryCircleFormData[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleEdit = (circle: CategoryCircle) => {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingId(circle.id);
    setImageUploading(false);
    setImageProgress(0);
    setSortOrderInput(String(circle.sortOrder));

    setForm({
      label: circle.label,
      imageUrl: circle.imageUrl ?? "",
      imagePublicId: circle.imagePublicId ?? "",
      icon: circle.icon,
      href: circle.href,
      sortOrder: circle.sortOrder,
      isActive: circle.isActive,
    });
  };

  const handleSelectImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setImageUploading(true);
      setImageProgress(0);

      const result = await uploadImageWithDetails(
        file,
        CATEGORY_CIRCLE_UPLOAD_FOLDER,
        setImageProgress,
      );

      handleChange("imageUrl", result.secureUrl);
      handleChange("imagePublicId", result.publicId);

      setSuccessMessage("Category image uploaded successfully.");
    } catch (error) {
      console.error("Failed to upload category circle image:", error);
      setErrorMessage(
        `Image upload failed: ${getErrorMessage(error)}`,
      );
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = event.target.value;

    setErrorMessage("");
    setSuccessMessage("");

    // Keep the input genuinely empty while the user edits it.
    if (rawValue === "") {
      setSortOrderInput("");
      handleChange("sortOrder", 0);
      return;
    }

    if (!/^\d+$/.test(rawValue)) {
      return;
    }

    const normalizedValue = rawValue.replace(/^0+(?=\d)/, "");
    const numericValue = Number(normalizedValue);

    setSortOrderInput(normalizedValue);
    handleChange("sortOrder", numericValue);

    if (numericValue > MAX_CATEGORY_CIRCLES) {
      setErrorMessage(
        `Sort order cannot exceed ${MAX_CATEGORY_CIRCLES}. Enter a number between 1 and ${MAX_CATEGORY_CIRCLES}.`,
      );
    } else if (numericValue < 1) {
      setErrorMessage("Sort order must be at least 1.");
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.label.trim()) {
      setErrorMessage("Please enter a category name.");
      return;
    }

    if (imageUploading) {
      setErrorMessage("Please wait for the image upload to finish.");
      return;
    }

    if (isSaving) {
      return;
    }

    if (!isEditing && isAtLimit) {
      setErrorMessage(
        `You already have ${MAX_CATEGORY_CIRCLES} category circles. Delete one before adding another.`,
      );
      return;
    }

    if (
      !Number.isSafeInteger(parsedSortOrder) ||
      parsedSortOrder < 1 ||
      parsedSortOrder > MAX_CATEGORY_CIRCLES
    ) {
      setErrorMessage(
        `Sort order must be a whole number between 1 and ${MAX_CATEGORY_CIRCLES}.`,
      );
      return;
    }

    const data: CategoryCircleFormData = {
      ...form,
      label: form.label.trim(),
      sortOrder: parsedSortOrder,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data,
        });

        setSuccessMessage("Category circle updated successfully.");
      } else {
        await createMutation.mutateAsync(data);

        setSuccessMessage("Category circle added successfully.");
      }

      resetForm();
      // resetForm changes the form only; successMessage remains visible.
    } catch (error) {
      console.error("Failed to save category circle:", error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteMutation.mutateAsync(id);

      if (editingId === id) {
        resetForm();
      }

      setSuccessMessage("Category circle and its image deleted successfully.");
    } catch (error) {
      console.error("Failed to delete category circle:", error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading category circles...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <SectionCard
        title="Category Circles"
        subtitle="Manage the category circles displayed below the hero section."
      >
        <Stack
          spacing={3}
          sx={{
            py: 2,
            alignItems: "stretch",
          }}
        >
          {errorMessage && (
            <Alert
              severity="error"
              onClose={() => setErrorMessage("")}
            >
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              onClose={() => setSuccessMessage("")}
            >
              {successMessage}
            </Alert>
          )}

          {/* FORM */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              {isEditing ? "Edit Category" : "Add Category"}
            </Typography>

            {!isEditing && isAtLimit && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You have reached the maximum of {MAX_CATEGORY_CIRCLES}{" "}
                category circles. Delete an existing circle before adding
                another.
              </Alert>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Category Name"
                value={form.label}
                onChange={(event) => {
                  handleChange("label", event.target.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              />

              <TextField
                fullWidth
                label="Icon Name"
                value={form.icon}
                onChange={(event) =>
                  handleChange("icon", event.target.value)
                }
                helperText="Example: Category, CleaningServices, LocalLaundryService"
              />

              {/* CATEGORY IMAGE */}
              <Box
                sx={{
                  gridColumn: {
                    xs: "auto",
                    md: "1 / -1",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700 }}
                  >
                    Category Image
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Upload the circular category image to Cloudinary.
                  </Typography>

                  <ImageUploadField
                    uploading={imageUploading}
                    progress={imageProgress}
                    onSelectFile={handleSelectImage}
                  />

                  {form.imageUrl && (
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "grey.100",
                      }}
                    >
                      <Box
                        component="img"
                        src={form.imageUrl}
                        alt="Category preview"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Box>

              <TextField
                fullWidth
                label="Link"
                value={form.href}
                onChange={(event) =>
                  handleChange("href", event.target.value)
                }
              />

              <TextField
                fullWidth
                type="number"
                label="Sort Order"
                value={sortOrderInput}
                onChange={handleSortOrderChange}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: MAX_CATEGORY_CIRCLES,
                    step: 1,
                  },
                }}
                error={invalidSortOrder}
                helperText={
                  invalidSortOrder
                    ? `Enter a whole number between 1 and ${MAX_CATEGORY_CIRCLES}.`
                    : "Lower numbers appear first."
                }
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Switch
                  checked={form.isActive}
                  onChange={(event) =>
                    handleChange("isActive", event.target.checked)
                  }
                />

                <Typography>Active</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                onClick={handleSubmit}
                disabled={
                  isSaving ||
                  imageUploading ||
                  !form.label.trim() ||
                  invalidSortOrder ||
                  (!isEditing && isAtLimit)
                }
              >
                {isSaving
                  ? "Saving..."
                  : isEditing
                    ? "Update Category"
                    : "Add Category"}
              </Button>

              {isEditing && (
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  disabled={isSaving || imageUploading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>

          <Divider />

          {/* EXISTING CATEGORIES */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Existing Categories ({circles.length}/{MAX_CATEGORY_CIRCLES})
            </Typography>

            {circles.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  No category circles have been added yet.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {circles.map((circle) => (
                  <Card key={circle.id} variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {/* IMAGE PREVIEW */}
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            bgcolor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          {circle.imageUrl ? (
                            <Box
                              component="img"
                              src={circle.imageUrl}
                              alt={circle.label}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: "1.5rem" }}>
                              🧹
                            </Typography>
                          )}
                        </Box>

                        {/* DETAILS */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 180,
                          }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            {circle.label}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {circle.href}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Order: {circle.sortOrder} •{" "}
                            {circle.isActive ? "Active" : "Inactive"}
                          </Typography>
                        </Box>

                        {/* ACTIONS */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => handleEdit(circle)}
                          >
                            Edit
                          </Button>

                          <IconButton
                            color="error"
                            onClick={() => handleDelete(circle.id)}
                            disabled={deleteMutation.isPending}
                            aria-label={`Delete ${circle.label}`}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </SectionCard>
    </Box>
  );
}