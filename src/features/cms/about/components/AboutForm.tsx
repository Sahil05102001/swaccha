
import {
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { AboutSettings } from "../types/about";

interface AboutFormProps {
  initialValues: AboutSettings;
  isSaving: boolean;
  onSubmit: (values: AboutSettings) => void;
}

export default function AboutForm({
  initialValues,
  isSaving,
  onSubmit,
}: AboutFormProps) {
  const [values, setValues] = useState<AboutSettings>(initialValues);

  useEffect(() => {
    setValues({
      ...initialValues,
      desktopBannerUrl: initialValues.desktopBannerUrl ?? "",
      mobileBannerUrl: initialValues.mobileBannerUrl ?? "",
      ownerName: initialValues.ownerName ?? "",
      ownerTitle: initialValues.ownerTitle ?? "",
      ownerBio: initialValues.ownerBio ?? "",
      ownerImageUrl: initialValues.ownerImageUrl ?? "",
    });
  }, [initialValues]);

  const handleChange = (key: keyof AboutSettings, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const renderImagePreview = (imageUrl: string, alt: string) => {
    if (!imageUrl.trim()) return null;

    return (
      <Paper
        variant="outlined"
        sx={{
          mt: 1.5,
          p: 1,
          width: "fit-content",
          maxWidth: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt={alt}
          style={{
            display: "block",
            width: "100%",
            maxWidth: 360,
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </Paper>
    );
  };

  const sectionSx = {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
  };

  return (
    <Stack spacing={3}>
      {/* Brand introduction */}
      <Paper variant="outlined" sx={sectionSx}>
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Brand introduction
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set the first impression visitors see on your About page.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Company Name"
              value={values.companyName}
              onChange={(event) =>
                handleChange("companyName", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Hero Title"
              value={values.heroTitle}
              onChange={(event) =>
                handleChange("heroTitle", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Hero Subtitle"
              value={values.heroSubtitle}
              onChange={(event) =>
                handleChange("heroSubtitle", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Hero Image URL"
              placeholder="https://..."
              value={values.heroImageUrl}
              onChange={(event) =>
                handleChange("heroImageUrl", event.target.value)
              }
              helperText="Use a publicly accessible image URL."
            />
            {renderImagePreview(values.heroImageUrl, "Hero preview")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Desktop Banner URL"
              placeholder="https://..."
              value={values.desktopBannerUrl}
              onChange={(event) =>
                handleChange("desktopBannerUrl", event.target.value)
              }
              helperText="Banner image displayed on desktop screens."
            />
            {renderImagePreview(
              values.desktopBannerUrl,
              "Desktop banner preview",
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Mobile Banner URL"
              placeholder="https://..."
              value={values.mobileBannerUrl}
              onChange={(event) =>
                handleChange("mobileBannerUrl", event.target.value)
              }
              helperText="Banner image displayed on mobile screens."
            />
            {renderImagePreview(
              values.mobileBannerUrl,
              "Mobile banner preview",
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Our story */}
      <Paper variant="outlined" sx={sectionSx}>
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Our story
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tell visitors about the company and what it stands for.
          </Typography>
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={6}
          label="Company Story"
          value={values.companyStory}
          onChange={(event) =>
            handleChange("companyStory", event.target.value)
          }
        />
      </Paper>

      {/* Mission and vision */}
      <Paper variant="outlined" sx={sectionSx}>
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Mission & vision
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Describe your purpose and long-term direction.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Our Mission"
              value={values.mission}
              onChange={(event) =>
                handleChange("mission", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Our Vision"
              value={values.vision}
              onChange={(event) =>
                handleChange("vision", event.target.value)
              }
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Meet the owner */}
      <Paper variant="outlined" sx={sectionSx}>
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Meet the owner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Introduce the person behind the business. Leave fields blank
            if you do not want to display this section yet.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Owner Name"
              value={values.ownerName}
              onChange={(event) =>
                handleChange("ownerName", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Owner Title"
              placeholder="e.g. Founder"
              value={values.ownerTitle}
              onChange={(event) =>
                handleChange("ownerTitle", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Owner Biography"
              value={values.ownerBio}
              onChange={(event) =>
                handleChange("ownerBio", event.target.value)
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Owner Image URL"
              placeholder="https://..."
              value={values.ownerImageUrl}
              onChange={(event) =>
                handleChange("ownerImageUrl", event.target.value)
              }
              helperText="Use a publicly accessible portrait image URL."
            />
            {renderImagePreview(
              values.ownerImageUrl,
              "Owner portrait preview",
            )}
          </Grid>
        </Grid>
      </Paper>

      <Divider />

      <Button
        variant="contained"
        size="large"
        disabled={isSaving}
        onClick={() => onSubmit(values)}
        sx={{
          alignSelf: { xs: "stretch", sm: "flex-end" },
          minWidth: { sm: 200 },
          py: 1.4,
          borderRadius: 2,
          fontWeight: 700,
        }}
      >
        {isSaving ? "Saving..." : "Save About Page"}
      </Button>
    </Stack>
  );
}
