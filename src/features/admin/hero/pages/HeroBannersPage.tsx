import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import {
  useAddHeroBanner,
  useDeleteHeroBanner,
  useHeroBanners,
  useUpdateHeroBanner,
} from "../hooks/useHeroBanners";

import HeroForm from "../components/HeroForm";

import type {
  HeroBanner,
  HeroBannerFormData,
} from "../types/heroBanner";

export default function HeroBannersPage() {
  const {
    data: banners = [],
    isLoading,
  } = useHeroBanners();

  const addMutation =
    useAddHeroBanner();

  const updateMutation =
    useUpdateHeroBanner();

  const deleteMutation =
    useDeleteHeroBanner();

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingBanner, setEditingBanner] =
    useState<HeroBanner | null>(null);

  const handleAdd = () => {
    if (banners.length >= 5) {
      return;
    }

    setEditingBanner(null);
    setFormOpen(true);
  };

  const handleEdit = (
    banner: HeroBanner
  ) => {
    setEditingBanner(banner);
    setFormOpen(true);
  };

  const handleClose = () => {
    if (
      addMutation.isPending ||
      updateMutation.isPending
    ) {
      return;
    }

    setFormOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (
    data: HeroBannerFormData
  ) => {
    try {
      if (editingBanner) {
        await updateMutation.mutateAsync({
          id: editingBanner.id,
          data,
        });
      } else {
        await addMutation.mutateAsync(
          data
        );
      }

      setFormOpen(false);
      setEditingBanner(null);
    } catch (error) {
      console.error(
        "Failed to save hero banner:",
        error
      );
    }
  };

  const handleDelete = (
    id: string
  ) => {
    if (
      window.confirm(
        "Are you sure you want to delete this hero banner?"
      )
    ) {
      setSelectedId(id);

      deleteMutation.mutate(id, {
        onSettled: () => {
          setSelectedId(null);
        },
      });
    }
  };

  const formLoading =
    addMutation.isPending ||
    updateMutation.isPending;

  return (
    <PageContainer>
      <PageHeader
        title="Hero Banners"
        subtitle="Manage the 5 responsive hero banners displayed on the homepage."
      />

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAdd}
          disabled={banners.length >= 5}
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {banners.length >= 5
            ? "Maximum 5 Banners"
            : "Add Hero Banner"}
        </Button>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : banners.length === 0 ? (
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
                align="center"
              >
                No hero banners added yet.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardContent>
                  <Stack
                    direction={{
                      xs: "column",
                      md: "row",
                    }}
                    spacing={2}
                    sx={{
                      alignItems: {
                        xs: "stretch",
                        md: "center",
                      },
                    }}
                  >
                    {/* Desktop Preview */}
                    <Box
                      sx={{
                        width: {
                          xs: "100%",
                          md: 240,
                        },
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Desktop
                      </Typography>

                      <Box
                        component="img"
                        src={
                          banner.desktopImageUrl
                        }
                        alt={
                          banner.heading
                        }
                        sx={{
                          width: "100%",
                          height: 110,
                          objectFit: "cover",
                          borderRadius: 2,
                          bgcolor:
                            "grey.100",
                          display: "block",
                        }}
                      />
                    </Box>

                    {/* Mobile Preview */}
                    <Box
                      sx={{
                        width: {
                          xs: "100%",
                          md: 100,
                        },
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Mobile
                      </Typography>

                      <Box
                        component="img"
                        src={
                          banner.mobileImageUrl ||
                          banner.desktopImageUrl
                        }
                        alt={
                          banner.heading
                        }
                        sx={{
                          width: "100%",
                          height: 110,
                          objectFit: "cover",
                          borderRadius: 2,
                          bgcolor:
                            "grey.100",
                          display: "block",
                        }}
                      />
                    </Box>

                    {/* Banner Details */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                        }}
                      >
                        {banner.heading}
                      </Typography>

                      {banner.badgeText && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          {banner.badgeText}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: {
                            xs: "-webkit-box",
                            sm: "block",
                          },
                          overflow: "hidden",
                          WebkitBoxOrient:
                            "vertical",
                          WebkitLineClamp: 2,
                        }}
                      >
                        {banner.description}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          flexWrap: "wrap",
                          gap: 0.75,
                        }}
                      >
                        <Chip
                          label={`Order: ${banner.displayOrder}`}
                          size="small"
                          variant="outlined"
                        />

                        <Chip
                          label={
                            banner.isActive
                              ? "Active"
                              : "Inactive"
                          }
                          size="small"
                          color={
                            banner.isActive
                              ? "success"
                              : "default"
                          }
                        />

                        {banner.offerText && (
                          <Chip
                            label="Sticker"
                            size="small"
                          />
                        )}
                      </Stack>
                    </Box>

                    {/* Actions */}
                    <Stack
                      direction={{
                        xs: "row",
                        md: "column",
                      }}
                      spacing={1}
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleEdit(
                            banner
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        disabled={
                          deleteMutation.isPending &&
                          selectedId ===
                            banner.id
                        }
                        onClick={() =>
                          handleDelete(
                            banner.id
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                        }}
                      >
                        {deleteMutation.isPending &&
                        selectedId ===
                          banner.id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>

                <Divider />
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Add / Edit Hero Banner Dialog */}
      <Dialog
        open={formOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            pr: 6,
          }}
        >
          {editingBanner
            ? "Edit Hero Banner"
            : "Add Hero Banner"}

          <IconButton
            onClick={handleClose}
            disabled={formLoading}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <HeroForm
            banner={editingBanner}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}