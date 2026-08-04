import {
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import { useAboutSettings } from "../hooks/useAboutSettings";

export default function AboutPage() {
  const {
    data: about,
    isLoading,
    isError,
  } = useAboutSettings();

  if (isLoading) {
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !about) {
    return (
      <PageContainer>
        <Alert severity="error">
          Failed to load About page.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={about.heroTitle}
        subtitle={about.heroSubtitle}
      />

      <Stack spacing={4}>
        <Paper
          variant="outlined"
          sx={{ p: 3 }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 2 }}
          >
            Our Story
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              whiteSpace: "pre-line",
            }}
          >
            {about.companyStory}
          </Typography>
        </Paper>

        <Grid
          container
          spacing={3}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 2 }}
              >
                Our Mission
              </Typography>

              <Typography color="text.secondary">
                {about.mission}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 2 }}
              >
                Our Vision
              </Typography>

              <Typography color="text.secondary">
                {about.vision}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {about.galleryImages.length > 0 && (
          <>
            <Typography variant="h4">
              Gallery
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {about.galleryImages.map(
                (image, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        style={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Paper>
                  </Grid>
                ),
              )}
            </Grid>
          </>
        )}
      </Stack>
    </PageContainer>
  );
}