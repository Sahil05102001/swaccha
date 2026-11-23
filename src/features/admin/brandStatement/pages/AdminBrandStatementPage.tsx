import { useState } from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import BrandStatementForm from "../components/BrandStatementForm";
import {
  useBrandStatement,
  useSaveBrandStatement,
} from "../hooks/useBrandStatement";
import type { SaveBrandStatementInput } from "../services/brandStatementService";

export default function AdminBrandStatementPage() {
  const { showSnackbar } = useSnackbar();

  const { data: statement, isLoading, refetch, isRefetching } = useBrandStatement();
  const saveMutation = useSaveBrandStatement();

  const [formOpen, setFormOpen] = useState(false);

  const handleClose = () => {
    if (!saveMutation.isPending) setFormOpen(false);
  };

  const handleSubmit = async (input: SaveBrandStatementInput) => {
    try {
      const result = await saveMutation.mutateAsync(input);

      showSnackbar(
        result.cleanupFailed
          ? "Brand statement saved, but an old image could not be removed from Cloudinary."
          : "Brand statement saved.",
        result.cleanupFailed ? "error" : "success",
      );

      setFormOpen(false);
      scrollToTop();
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save the brand statement.",
        "error",
      );
    }
  };

  const desktopUrl = statement?.desktopImageUrl || statement?.imageUrl || "";
  const mobileUrl = statement?.mobileImageUrl || "";

  return (
    <PageContainer>
      <PageHeader
        title="Brand Statement"
        subtitle="The brand statement section shown above the footer."
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
              startIcon={<EditOutlinedIcon />}
              onClick={() => setFormOpen(true)}
              disabled={isLoading}
            >
              {statement ? "Edit" : "Add"}
            </Button>
          </Stack>
        }
      />

      {isLoading ? (
        <Skeleton variant="rounded" height={240} />
      ) : (
        <SectionCard title="Current statement">
          {statement ? (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={statement.isActive ? "Active" : "Inactive"}
                  color={statement.isActive ? "success" : "default"}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  label={desktopUrl ? "Banner image set" : "Text only"}
                />
              </Stack>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {statement.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {statement.description}
                </Typography>
                {statement.tagline && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {statement.tagline}
                  </Typography>
                )}
              </Box>

              {(desktopUrl || mobileUrl) && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {desktopUrl && (
                    <Box sx={{ flex: 1, maxWidth: 420 }}>
                      <Typography variant="caption" color="text.secondary">
                        Desktop
                      </Typography>
                      <Box
                        component="img"
                        src={cloudinaryThumb(desktopUrl, 840)}
                        alt="Desktop banner"
                        loading="lazy"
                        sx={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    </Box>
                  )}

                  {mobileUrl && (
                    <Box sx={{ width: 140 }}>
                      <Typography variant="caption" color="text.secondary">
                        Mobile
                      </Typography>
                      <Box
                        component="img"
                        src={cloudinaryThumb(mobileUrl, 280)}
                        alt="Mobile banner"
                        loading="lazy"
                        sx={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
          ) : (
            <Typography color="text.secondary">
              No brand statement configured yet.
            </Typography>
          )}
        </SectionCard>
      )}

      <Dialog open={formOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          {statement ? "Edit brand statement" : "Add brand statement"}
          <IconButton
            onClick={handleClose}
            disabled={saveMutation.isPending}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ pt: 1 }}>
            <BrandStatementForm
              statement={statement}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              loading={saveMutation.isPending}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}