import {
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

import { useState } from "react";

import SectionCard from "@/components/common/SectionCard";

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

export default function AdminCategoryCirclesPage() {
  const { data: circles = [], isLoading } =
    useCategoryCircles();

  const createMutation =
    useCreateCategoryCircle();

  const updateMutation =
    useUpdateCategoryCircle();

  const deleteMutation =
    useDeleteCategoryCircle();

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<CategoryCircleFormData>({
      label: "",
      imageUrl: "",
      icon: "Category",
      href: "/products",
      sortOrder: circles.length + 1,
      isActive: true,
    });

  const resetForm = () => {
    setEditingId(null);

    setForm({
      label: "",
      imageUrl: "",
      icon: "Category",
      href: "/products",
      sortOrder: circles.length + 1,
      isActive: true,
    });
  };

  const handleChange = <
    K extends keyof CategoryCircleFormData
  >(
    key: K,
    value: CategoryCircleFormData[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleEdit = (
    circle: CategoryCircle,
  ) => {
    setEditingId(circle.id);

    setForm({
      label: circle.label,
      imageUrl: circle.imageUrl ?? "",
      icon: circle.icon,
      href: circle.href,
      sortOrder: circle.sortOrder,
      isActive: circle.isActive,
    });
  };

  const handleSubmit = async () => {
    if (!form.label.trim()) {
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: form,
      });
    } else {
      await createMutation.mutateAsync(form);
    }

    resetForm();
  };

  const handleDelete = async (
    id: string,
  ) => {
    await deleteMutation.mutateAsync(id);

    if (editingId === id) {
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>
          Loading category circles...
        </Typography>
      </Box>
    );
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

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
          {/* FORM */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              {editingId
                ? "Edit Category"
                : "Add Category"}
            </Typography>

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
                onChange={(event) =>
                  handleChange(
                    "label",
                    event.target.value,
                  )
                }
              />

              <TextField
                fullWidth
                label="Icon Name"
                value={form.icon}
                onChange={(event) =>
                  handleChange(
                    "icon",
                    event.target.value,
                  )
                }
                helperText="Example: Category, CleaningServices, LocalLaundryService"
              />

              <TextField
                fullWidth
                label="Image URL"
                value={form.imageUrl ?? ""}
                onChange={(event) =>
                  handleChange(
                    "imageUrl",
                    event.target.value,
                  )
                }
                helperText="Leave empty to use the default icon."
              />

              <TextField
                fullWidth
                label="Link"
                value={form.href}
                onChange={(event) =>
                  handleChange(
                    "href",
                    event.target.value,
                  )
                }
              />

              <TextField
                fullWidth
                type="number"
                label="Sort Order"
                value={form.sortOrder}
                onChange={(event) =>
                  handleChange(
                    "sortOrder",
                    Number(event.target.value),
                  )
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
                    handleChange(
                      "isActive",
                      event.target.checked,
                    )
                  }
                />

                <Typography>
                  Active
                </Typography>
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
                startIcon={
                  editingId ? (
                    <SaveIcon />
                  ) : (
                    <AddIcon />
                  )
                }
                onClick={handleSubmit}
                disabled={
                  isSaving ||
                  !form.label.trim()
                }
              >
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Add Category"}
              </Button>

              {editingId && (
                <Button
                  variant="outlined"
                  onClick={resetForm}
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
              Existing Categories
            </Typography>

            {circles.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  No category circles have been
                  added yet.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {circles.map(
                  (circle) => (
                    <Card
                      key={circle.id}
                      variant="outlined"
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          {/* ICON / IMAGE PREVIEW */}
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              bgcolor:
                                "grey.100",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              overflow:
                                "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {circle.imageUrl ? (
                              <Box
                                component="img"
                                src={
                                  circle.imageUrl
                                }
                                alt={
                                  circle.label
                                }
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit:
                                    "cover",
                                }}
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontSize:
                                    "1.5rem",
                                }}
                              >
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
                            <Typography
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {circle.label}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  "text.secondary",
                              }}
                            >
                              {circle.href}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "text.secondary",
                              }}
                            >
                              Order:{" "}
                              {
                                circle.sortOrder
                              }{" "}
                              •{" "}
                              {circle.isActive
                                ? "Active"
                                : "Inactive"}
                            </Typography>
                          </Box>

                          {/* ACTIONS */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 1,
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleEdit(
                                  circle,
                                )
                              }
                            >
                              Edit
                            </Button>

                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDelete(
                                  circle.id,
                                )
                              }
                              disabled={
                                deleteMutation.isPending
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ),
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </SectionCard>
    </Box>
  );
}