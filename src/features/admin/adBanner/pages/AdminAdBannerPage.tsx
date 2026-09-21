import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import {
  useAdBanner,
  useSaveAdBanner,
} from "../hooks/useAdBanner";

export default function AdminAdBannerPage() {
  const {
    data: banner,
    isLoading,
  } = useAdBanner();

  const saveMutation =
    useSaveAdBanner();

  const [imageUrl, setImageUrl] =
    useState("");

  const [altText, setAltText] =
    useState("Advertisement");

  const [href, setHref] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  useEffect(() => {
    if (!banner) {
      return;
    }

    setImageUrl(
      banner.imageUrl
    );

    setAltText(
      banner.altText
    );

    setHref(
      banner.href
    );

    setIsActive(
      banner.isActive
    );
  }, [banner]);

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      imageUrl,
      altText,
      href,
      isActive,
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Ad Banner"
          subtitle="Manage the homepage advertisement banner."
        />

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Ad Banner"
        subtitle="Manage the single advertisement banner displayed on the homepage."
      />

      <Box
        sx={{
          maxWidth: 900,
          mt: 3,
        }}
      >
        {/* Banner Preview */}
        <Box
          sx={{
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Banner Preview
          </Typography>

          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor:
                "divider",
              bgcolor:
                "#f5f5f5",
              minHeight: 220,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt={altText}
                sx={{
                  width: "100%",
                  display: "block",
                  objectFit:
                    "cover",
                }}
              />
            ) : (
              <Typography
                color="text.secondary"
              >
                No banner image added yet.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Image URL */}
        <TextField
          fullWidth
          label="Banner Image URL"
          value={imageUrl}
          onChange={(event) =>
            setImageUrl(
              event.target.value
            )
          }
          placeholder="https://..."
          helperText="We will add Firebase Storage image upload next."
          sx={{
            mb: 3,
          }}
        />

        {/* Alt Text */}
        <TextField
          fullWidth
          label="Alt Text"
          value={altText}
          onChange={(event) =>
            setAltText(
              event.target.value
            )
          }
          sx={{
            mb: 3,
          }}
        />

        {/* Link */}
        <TextField
          fullWidth
          label="Banner Link"
          value={href}
          onChange={(event) =>
            setHref(
              event.target.value
            )
          }
          placeholder="/products"
          helperText="Optional. Example: /products"
          sx={{
            mb: 3,
          }}
        />

        {/* Active */}
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(event) =>
                setIsActive(
                  event.target.checked
                )
              }
            />
          }
          label="Show banner on homepage"
          sx={{
            mb: 3,
          }}
        />

        {/* Save */}
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={
              handleSave
            }
            disabled={
              saveMutation.isPending
            }
            sx={{
              px: 5,
              py: 1.3,
              fontWeight: 700,
              textTransform:
                "none",
            }}
          >
            {saveMutation.isPending
              ? "Saving..."
              : "Save Banner"}
          </Button>
        </Box>

        {saveMutation.isSuccess && (
          <Typography
            sx={{
              mt: 2,
            }}
            color="success.main"
          >
            Banner saved successfully.
          </Typography>
        )}

        {saveMutation.isError && (
          <Typography
            sx={{
              mt: 2,
            }}
            color="error.main"
          >
            Failed to save banner.
          </Typography>
        )}
      </Box>
    </PageContainer>
  );
}