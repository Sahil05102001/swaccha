import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import HeroForm from "../components/HeroForm";
import {
  useAddHeroBanner,
  useDeleteHeroBanner,
  useHeroBanners,
  useUpdateHeroBanner,
} from "../hooks/useHeroBanners";
import type { HeroImageFiles } from "../services/heroBannerService";
import type { HeroBanner, HeroBannerFormData } from "../types/heroBanner";

export default function HeroBannersPage() {
  const { showSnackbar } = useSnackbar();

  const {
    data: banners = [],
    isLoading,
    refetch,
    isRefetching,
  } = useHeroBanners();

  const addMutation = useAddHeroBanner();
  const updateMutation = useUpdateHeroBanner();
  const deleteMutation = useDeleteHeroBanner();

  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeroBanner | null>(null);

  const formLoading = addMutation.isPending || updateMutation.isPending;
  const activeCount = banners.filter((banner) => banner.isActive).length;

  const handleAdd = () => {
    if (banners.length >= 5) return;
    setEditingBanner(null);
    setFormOpen(true);
  };

  const handleEdit = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormOpen(true);
  };

  const handleClose = () => {
    if (formLoading) return;
    setFormOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (
    data: HeroBannerFormData,
    files: HeroImageFiles,
  ) => {
    try {
      const result = editingBanner
        ? await updateMutation.mutateAsync({
            id: editingBanner.id,
            data,
            files,
            previous: editingBanner,
          })
        : await addMutation.mutateAsync({ data, files });

      showSnackbar(
        result.cleanupFailed
          ? "Banner saved, but an old image could not be removed from Cloudinary."
          : editingBanner
            ? "Banner updated."
            : "Banner added.",
        result.cleanupFailed ? "error" : "success",
      );

      setFormOpen(false);
      setEditingBanner(null);
      scrollToTop();
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save the banner.",
        "error",
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        showSnackbar("Banner deleted.", "success");
        setDeleteTarget(null);
        scrollToTop();
      },
      onError: (error) =>
        showSnackbar(
          error instanceof Error ? error.message : "Failed to delete the banner.",
          "error",
        ),
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Hero Banners"
        subtitle={`${activeCount} active · ${banners.length}/5 banners used. Each banner has a desktop and a mobile image.`}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disabled={isLoading || banners.length >= 5}
            >
              {banners.length >= 5 ? "Maximum reached" : "Add banner"}
            </Button>
          </Stack>
        }
      />

      {isLoading ? (
        <Stack spacing={2}>
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={170} />
          ))}
        </Stack>
      ) : banners.length === 0 ? (
        <Card variant="outlined" sx={{ py: 8, px: 2, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            No hero banners yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Add a banner to show it at the top of the homepage.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add first banner
          </Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {banners.map((banner) => {
            const deleting =
              deleteMutation.isPending && deleteTarget?.id === banner.id;

            return (
              <Card key={banner.id} variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}
                >
                  <Box sx={{ width: { xs: "100%", md: 340 }, flexShrink: 0 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      Desktop
                    </Typography>
                    <Box
                      component="img"
                      src={cloudinaryThumb(banner.desktopImageUrl, 680)}
                      alt={`Desktop banner ${banner.displayOrder}`}
                      loading="lazy"
                      sx={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "grey.100",
                      }}
                    />
                  </Box>

                  <Box sx={{ width: { xs: 140, md: 110 }, flexShrink: 0 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      Mobile
                    </Typography>
                    <Box
                      component="img"
                      src={cloudinaryThumb(
                        banner.mobileImageUrl || banner.desktopImageUrl,
                        260,
                      )}
                      alt={`Mobile banner ${banner.displayOrder}`}
                      loading="lazy"
                      sx={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "grey.100",
                      }}
                    />
                  </Box>

                  <Stack sx={{ flex: 1, minWidth: 0 }} spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {banner.heading || `Banner ${banner.displayOrder}`}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                      <Chip size="small" variant="outlined" label={`Position ${banner.displayOrder}`} />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={banner.isActive ? "Active" : "Inactive"}
                        color={banner.isActive ? "success" : "default"}
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: "break-all" }}
                    >
                      Opens: {banner.bannerLink || "/products"}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => handleEdit(banner)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlinedIcon />}
                        disabled={deleting}
                        onClick={() => setDeleteTarget(banner)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      <Dialog open={formOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          {editingBanner ? "Edit hero banner" : "Add hero banner"}
          <IconButton
            onClick={handleClose}
            disabled={formLoading}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <HeroForm
            key={editingBanner?.id ?? "new"}
            banner={editingBanner}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete banner?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes the banner from the homepage and permanently deletes
            its desktop and mobile images from Cloudinary.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}