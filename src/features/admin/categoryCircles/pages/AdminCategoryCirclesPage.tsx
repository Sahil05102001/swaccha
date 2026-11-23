import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import AdminSelect from "@/features/admin/components/AdminSelect";
import { useProducts } from "@/features/products/hooks/useProducts";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import DeferredImageField from "@/features/admin/components/DeferredImageField";
import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";
import { checkImageFile, type ImageSpec } from "@/features/admin/utils/imageAdvice";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";
import {
  useCategoryCircles,
  useCreateCategoryCircle,
  useDeleteCategoryCircle,
  useUpdateCategoryCircle,
} from "../hooks/useCategoryCircles";
import type { CategoryCircleInput } from "../services/categoryCircleService";
import type { CategoryCircle } from "../types/categoryCircle";


const MAX_CATEGORY_CIRCLES = 10;


const IMAGE_SPEC: ImageSpec = {
  width: 240,
  height: 240,
  kb: 20,
  warnKb: 50,
  minWidth: 160,
  maxWidth: 600,
  shape: "square (1:1)",
};


// The icons the homepage knows how to draw.
const ICON_OPTIONS = [
  { value: "Category", label: "Category (default)" },
  { value: "CleaningServices", label: "Cleaning" },
  { value: "LocalLaundryService", label: "Laundry" },
  { value: "ShoppingBag", label: "Shopping bag" },
  { value: "LocalOffer", label: "Offer tag" },
  { value: "Business", label: "Business" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "LocalFlorist", label: "Flower" },
  { value: "Inventory2", label: "Boxes" },
  { value: "Spa", label: "Spa" },
];


interface FormState {
  label: string;
  icon: string;
  href: string;
  isActive: boolean;
}


const EMPTY_FORM: FormState = {
  label: "",
  icon: "Category",
  href: "/products",
  isActive: true,
};


function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}


export default function AdminCategoryCirclesPage() {
  const { showSnackbar } = useSnackbar();


  const {
    data: circles = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCategoryCircles();


  const createMutation = useCreateCategoryCircle();
  const updateMutation = useUpdateCategoryCircle();
  const deleteMutation = useDeleteCategoryCircle();


  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sortOrderInput, setSortOrderInput] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imageNotes, setImageNotes] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CategoryCircle | null>(null);
  const isAtLimit = circles.length >= MAX_CATEGORY_CIRCLES;
  const isEditing = editingId !== null;
  const editingCircle = circles.find((circle) => circle.id === editingId) ?? null;
  const existingImageUrl = editingCircle?.imageUrl ?? "";
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const parsedSortOrder =
    sortOrderInput.trim() === "" ? NaN : Number(sortOrderInput);


  const invalidSortOrder =
    !Number.isSafeInteger(parsedSortOrder) ||
    parsedSortOrder < 1 ||
    parsedSortOrder > MAX_CATEGORY_CIRCLES;


  // New circles default to the next free position.
  useEffect(() => {
    if (editingId) return;


    setSortOrderInput(String(Math.min(circles.length + 1, MAX_CATEGORY_CIRCLES)));
  }, [circles.length, editingId]);


  const { data: allProducts = [] } = useProducts();


  const productCategories = [
    ...new Set(
      allProducts
        .filter((product) => product.isActive)
        .map((product) => product.category?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b));


  const categoryLink = (name: string) =>
    `/products?category=${encodeURIComponent(name)}`;


  const linkChoice =
    form.href === "/products"
      ? "/products"
      : productCategories.find((name) => categoryLink(name) === form.href)
        ? form.href
        : "custom";


  const iconOptions = ICON_OPTIONS.some((option) => option.value === form.icon)
    ? ICON_OPTIONS
    : [...ICON_OPTIONS, { value: form.icon, label: form.icon }];


  const clearImageState = () => {
    setFile(null);
    setRemoveImage(false);
    setImageNotes([]);
  };


  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSortOrderInput(String(Math.min(circles.length + 1, MAX_CATEGORY_CIRCLES)));
    clearImageState();
  };


  const handleEdit = (circle: CategoryCircle) => {
    setEditingId(circle.id);
    setForm({
      label: circle.label,
      icon: circle.icon,
      href: circle.href,
      isActive: circle.isActive,
    });
    setSortOrderInput(String(circle.sortOrder));
    clearImageState();


    // The form is at the top of the page; take the admin there.
    scrollToTop();
  };


  const handleSortOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;


    if (rawValue === "") {
      setSortOrderInput("");
      return;
    }


    if (!/^\d+$/.test(rawValue)) return;


    setSortOrderInput(rawValue.replace(/^0+(?=\d)/, ""));
  };


  const handleSubmit = async () => {
    if (!form.label.trim()) {
      showSnackbar("Please enter a category name.", "error");
      return;
    }


    if (invalidSortOrder) {
      showSnackbar(
        `Sort order must be a whole number between 1 and ${MAX_CATEGORY_CIRCLES}.`,
        "error",
      );
      return;
    }


    if (!isEditing && isAtLimit) {
      showSnackbar(
        `You already have ${MAX_CATEGORY_CIRCLES} category circles. Delete one before adding another.`,
        "error",
      );
      return;
    }


    const input: CategoryCircleInput = {
      label: form.label.trim(),
      icon: form.icon,
      href: form.href,
      sortOrder: parsedSortOrder,
      isActive: form.isActive,
      file,
      remove: removeImage && !file,
    };


    try {
      const result = editingId
        ? await updateMutation.mutateAsync({ id: editingId, input })
        : await createMutation.mutateAsync(input);


      showSnackbar(
        result.cleanupFailed
          ? "Saved, but an old image could not be removed from Cloudinary."
          : editingId
            ? "Category circle updated."
            : "Category circle added.",
        result.cleanupFailed ? "error" : "success",
      );


      resetForm();
      scrollToTop();
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };


  const confirmDelete = async () => {
    if (!deleteTarget) return;


    try {
      await deleteMutation.mutateAsync(deleteTarget.id);


      if (editingId === deleteTarget.id) resetForm();


      showSnackbar("Category circle deleted.", "success");
      setDeleteTarget(null);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };


  return (
    <PageContainer>
      <PageHeader
        title="Category Circles"
        subtitle={`${circles.length}/${MAX_CATEGORY_CIRCLES} used. Shown below the hero section.`}
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


      <Stack spacing={3}>
        <SectionCard
          title={isEditing ? `Edit category: ${editingCircle?.label ?? ""}` : "Add category"}
        >
          <Stack spacing={3}>
            {!isEditing && isAtLimit && (
              <Alert severity="warning">
                You have reached the maximum of {MAX_CATEGORY_CIRCLES} category
                circles. Delete an existing circle before adding another.
              </Alert>
            )}


            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Category name"
                value={form.label}
                onChange={(event) =>
                  setForm((current) => ({ ...current, label: event.target.value }))
                }
                disabled={isSaving}
              />


              <AdminSelect
                fullWidth
                label="Icon"
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({ ...current, icon: event.target.value }))
                }
                helperText="Shown only when the category has no image."
                disabled={isSaving}
              >
                {iconOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </AdminSelect>


              <AdminSelect
                fullWidth
                label="When clicked, show"
                value={linkChoice}
                onChange={(event) => {
                  const value = String(event.target.value);
                  setForm((current) => ({
                    ...current,
                    href: value === "custom" ? "" : value,
                  }));
                }}
              >
                <MenuItem value="/products">All products (Shop All)</MenuItem>
                {productCategories.map((name) => (
                  <MenuItem key={name} value={categoryLink(name)}>
                    Category: {name}
                  </MenuItem>
                ))}
                <MenuItem value="custom">Custom link…</MenuItem>
              </AdminSelect>


              {linkChoice === "custom" && (
                <TextField
                  fullWidth
                  label="Custom link"
                  placeholder="/offer-zone or https://…"
                  value={form.href}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm((current) => ({ ...current, href: value }));
                  }}
                />
              )}


              <TextField
                fullWidth
                type="number"
                label="Sort order"
                value={sortOrderInput}
                onChange={handleSortOrderChange}
                slotProps={{
                  htmlInput: { min: 1, max: MAX_CATEGORY_CIRCLES, step: 1 },
                }}
                error={invalidSortOrder}
                helperText={
                  invalidSortOrder
                    ? `Enter a whole number between 1 and ${MAX_CATEGORY_CIRCLES}.`
                    : "Lower numbers appear first."
                }
                disabled={isSaving}
              />


              <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
                <DeferredImageField
                  title="Category image (optional)"
                  guide={`Recommended: ${IMAGE_SPEC.width} × ${IMAGE_SPEC.height} px square (1:1), WebP or JPEG, around ${IMAGE_SPEC.kb} KB. It is shown as a small circle (up to about 104 px), so a bigger file adds nothing. Centre the subject, because the corners are cropped by the circle. Without an image, the icon above is shown. You can convert images for free at squoosh.app.`}
                  existingUrl={existingImageUrl}
                  thumbWidth={240}
                  file={file}
                  notes={imageNotes}
                  disabled={isSaving}
                  shape="circle"
                  maxPreviewWidth={120}
                  removed={removeImage}
                  onPick={async (picked) => {
                    setFile(picked);
                    setRemoveImage(false);
                    setImageNotes(await checkImageFile(picked, IMAGE_SPEC));
                  }}
                  onUndoPick={() => {
                    setFile(null);
                    setImageNotes([]);
                  }}
                  onRemove={() => setRemoveImage(true)}
                  onUndoRemove={() => setRemoveImage(false)}
                />
              </Box>


              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, isActive: event.target.checked }))
                    }
                    disabled={isSaving}
                  />
                }
                label="Active"
              />
            </Box>


            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                onClick={() => void handleSubmit()}
                disabled={
                  isSaving ||
                  !form.label.trim() ||
                  invalidSortOrder ||
                  (!isEditing && isAtLimit)
                }
              >
                {isSaving
                  ? "Saving..."
                  : isEditing
                    ? "Update category"
                    : "Add category"}
              </Button>


              {isEditing && (
                <Button variant="outlined" onClick={resetForm} disabled={isSaving}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </SectionCard>


        <SectionCard title={`Existing categories (${circles.length}/${MAX_CATEGORY_CIRCLES})`}>
          {isLoading ? (
            <Stack spacing={1.5}>
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} variant="rounded" height={84} />
              ))}
            </Stack>
          ) : isError ? (
            <Alert severity="error">Failed to load category circles.</Alert>
          ) : circles.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
              No category circles have been added yet.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {circles.map((circle) => (
                <Card
                  key={circle.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    borderColor: circle.id === editingId ? "text.primary" : undefined,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "grey.100",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {circle.imageUrl ? (
                      <Box
                        component="img"
                        src={cloudinaryThumb(circle.imageUrl, 112)}
                        alt={circle.label}
                        loading="lazy"
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Icon
                      </Typography>
                    )}
                  </Box>


                  <Box sx={{ flex: 1, minWidth: 160 }}>
                    <Typography sx={{ fontWeight: 700 }}>{circle.label}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {circle.href}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip size="small" variant="outlined" label={`Order ${circle.sortOrder}`} />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={circle.isActive ? "Active" : "Inactive"}
                        color={circle.isActive ? "success" : "default"}
                      />
                    </Stack>
                  </Box>


                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(circle)}
                      disabled={isSaving}
                    >
                      Edit
                    </Button>


                    <IconButton
                      color="error"
                      onClick={() => setDeleteTarget(circle)}
                      disabled={deleteMutation.isPending}
                      aria-label={`Delete ${circle.label}`}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </SectionCard>
      </Stack>


      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete category circle?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes "{deleteTarget?.label}" from the homepage and deletes
            its image from Cloudinary, if it has one.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void confirmDelete()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}