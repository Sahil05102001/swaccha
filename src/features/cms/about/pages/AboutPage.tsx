
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import { useAboutSettings } from "../hooks/useAboutSettings";

const accent = "#00BFD6";
const ink = "#17252B";
const muted = "#64747A";
const border = "#E5ECEE";
const softBackground = "#F7FAFA";

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
        <CircularProgress sx={{ color: accent }} />
      </Stack>
    );
  }

  if (isError || !about) {
    return (
      <PageContainer>
        <Alert severity="error">Failed to load About page.</Alert>
      </PageContainer>
    );
  }

  const reasons = (about.whyChooseUs ?? []).filter(
    (item) => item?.trim(),
  );

  const statistics = (about.statistics ?? []).filter(
    (item) => item?.label?.trim() && item?.value?.trim(),
  );

  const galleryImages = (about.galleryImages ?? []).filter(
    (image) => image?.trim(),
  );

  const hasOwner =
    Boolean(about.ownerName?.trim()) ||
    Boolean(about.ownerTitle?.trim()) ||
    Boolean(about.ownerBio?.trim()) ||
    Boolean(about.ownerImageUrl?.trim());

  const hasStory = Boolean(about.companyStory?.trim());
  const hasMission = Boolean(about.mission?.trim());
  const hasVision = Boolean(about.vision?.trim());

  const desktopBannerUrl = about.desktopBannerUrl?.trim() || "";
  const mobileBannerUrl = about.mobileBannerUrl?.trim() || "";
  const heroImageUrl = about.heroImageUrl?.trim() || "";

  const fallbackBannerUrl =
    desktopBannerUrl || mobileBannerUrl || heroImageUrl;

  const hasBanner = Boolean(fallbackBannerUrl);

  return (
    <PageContainer>
      <Stack spacing={{ xs: 5, md: 8 }} sx={{ pb: { xs: 3, md: 5 } }}>
        {/* Hero */}
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: { xs: 2, md: 3 },
            border: `1px solid ${border}`,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Grid
            container
            spacing={{ xs: 3, md: 5 }}
            sx={{
              p: { xs: 2.5, sm: 4, md: 5 },
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, md: hasBanner ? 6 : 12 }}>
              <Stack spacing={2}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#087F8C",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  {about.companyName?.trim() || "ABOUT US"}
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    color: ink,
                    fontWeight: 750,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.15,
                    fontSize: {
                      xs: "2rem",
                      sm: "2.6rem",
                      md: "3.1rem",
                    },
                    whiteSpace: "pre-line",
                    overflowWrap: "anywhere",
                  }}
                >
                  {about.heroTitle?.trim() || "A little about us"}
                </Typography>

                {about.heroSubtitle?.trim() && (
                  <Typography
                    sx={{
                      color: muted,
                      fontSize: { xs: "0.98rem", md: "1.05rem" },
                      lineHeight: 1.85,
                      maxWidth: 600,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {about.heroSubtitle}
                  </Typography>
                )}

                <Box
                  sx={{
                    width: 44,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: accent,
                  }}
                />
              </Stack>
            </Grid>

            {hasBanner && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 2,
                    backgroundColor: softBackground,
                    lineHeight: 0,
                  }}
                >
                  <picture>
                    {mobileBannerUrl && (
                      <source
                        media="(max-width: 767px)"
                        srcSet={mobileBannerUrl}
                      />
                    )}

                    {desktopBannerUrl && (
                      <source
                        media="(min-width: 768px)"
                        srcSet={desktopBannerUrl}
                      />
                    )}

                    <img
                      src={fallbackBannerUrl}
                      alt={`${about.companyName?.trim() || "Company"} banner`}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </picture>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Company statistics */}
        {statistics.length > 0 && (
          <Grid container spacing={2}>
            {statistics.map((statistic) => (
              <Grid
                key={statistic.id}
                size={{
                  xs: 6,
                  sm: 6,
                  md: 12 / Math.min(statistics.length, 4),
                }}
              >
                <Box
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    height: "100%",
                    border: `1px solid ${border}`,
                    borderRadius: 2,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 750,
                      color: ink,
                      fontSize: { xs: "1.5rem", md: "1.9rem" },
                      letterSpacing: "-0.03em",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {statistic.value}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: muted, mt: 0.5, lineHeight: 1.6 }}
                  >
                    {statistic.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Why Swachha */}
        {reasons.length > 0 && (
          <Box>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#087F8C",
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                WHY {about.companyName?.trim() || "CHOOSE US"}
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  color: ink,
                  fontWeight: 750,
                  letterSpacing: "-0.035em",
                  fontSize: { xs: "1.8rem", md: "2.3rem" },
                }}
              >
                A better way to do business
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {reasons.map((reason, index) => (
                <Grid
                  key={`${index}-${reason}`}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: reasons.length === 2 ? 6 : 3,
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      p: { xs: 2.5, md: 3 },
                      border: `1px solid ${border}`,
                      borderRadius: 2,
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#087F8C",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>

                    <Typography
                      sx={{
                        color: ink,
                        lineHeight: 1.8,
                        fontWeight: 500,
                        whiteSpace: "pre-line",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {reason}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Our story */}
        {hasStory && (
          <Grid
            container
            spacing={{ xs: 2, md: 5 }}
            sx={{ alignItems: "start" }}
          >
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#087F8C",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  OUR STORY
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    color: ink,
                    fontWeight: 750,
                    letterSpacing: "-0.035em",
                    fontSize: { xs: "1.8rem", md: "2.3rem" },
                    lineHeight: 1.25,
                  }}
                >
                  The story behind our business
                </Typography>

                <Box
                  sx={{
                    width: 44,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: accent,
                  }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                sx={{
                  color: muted,
                  fontSize: { xs: "1rem", md: "1.05rem" },
                  lineHeight: 2,
                  whiteSpace: "pre-line",
                  overflowWrap: "anywhere",
                }}
              >
                {about.companyStory}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Mission and vision */}
        {(hasMission || hasVision) && (
          <Box>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#087F8C",
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                OUR PURPOSE
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  color: ink,
                  fontWeight: 750,
                  letterSpacing: "-0.035em",
                  fontSize: { xs: "1.8rem", md: "2.3rem" },
                }}
              >
                Mission & vision
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {hasMission && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: { xs: 2.5, md: 3.5 },
                      height: "100%",
                      border: `1px solid ${border}`,
                      borderTop: `3px solid ${accent}`,
                      borderRadius: 2,
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: ink,
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    >
                      Our Mission
                    </Typography>

                    <Typography
                      sx={{
                        color: muted,
                        lineHeight: 1.9,
                        whiteSpace: "pre-line",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {about.mission}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {hasVision && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: { xs: 2.5, md: 3.5 },
                      height: "100%",
                      border: `1px solid ${border}`,
                      borderTop: `3px solid ${accent}`,
                      borderRadius: 2,
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: ink,
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    >
                      Our Vision
                    </Typography>

                    <Typography
                      sx={{
                        color: muted,
                        lineHeight: 1.9,
                        whiteSpace: "pre-line",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {about.vision}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Meet the owner */}
        {hasOwner && (
          <Box>
            <Divider sx={{ mb: { xs: 3, md: 5 }, borderColor: border }} />

            <Grid
              container
              spacing={{ xs: 3, md: 5 }}
              sx={{ alignItems: "center" }}
            >
              {about.ownerImageUrl?.trim() && (
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Box
                    component="img"
                    src={about.ownerImageUrl}
                    alt={about.ownerName?.trim() || "Company owner"}
                    loading="lazy"
                    sx={{
                      display: "block",
                      width: "100%",
                      maxWidth: { xs: 360, sm: "100%" },
                      mx: { xs: "auto", sm: 0 },
                      aspectRatio: "4 / 5",
                      objectFit: "cover",
                      borderRadius: 2,
                      backgroundColor: softBackground,
                    }}
                  />
                </Grid>
              )}

              <Grid
                size={{
                  xs: 12,
                  sm: about.ownerImageUrl?.trim() ? 7 : 12,
                }}
              >
                <Stack spacing={1.5}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#087F8C",
                      fontWeight: 700,
                      letterSpacing: 1.5,
                    }}
                  >
                    MEET THE OWNER
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{
                      color: ink,
                      fontWeight: 750,
                      letterSpacing: "-0.035em",
                      fontSize: { xs: "2rem", md: "2.6rem" },
                      overflowWrap: "anywhere",
                    }}
                  >
                    {about.ownerName?.trim() || "Our Owner"}
                  </Typography>

                  {about.ownerTitle?.trim() && (
                    <Typography sx={{ color: "#087F8C", fontWeight: 600 }}>
                      {about.ownerTitle}
                    </Typography>
                  )}

                  {about.ownerBio?.trim() && (
                    <Typography
                      sx={{
                        color: muted,
                        lineHeight: 1.9,
                        whiteSpace: "pre-line",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {about.ownerBio}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <Box>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#087F8C",
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                OUR GALLERY
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  color: ink,
                  fontWeight: 750,
                  letterSpacing: "-0.035em",
                  fontSize: { xs: "1.8rem", md: "2.3rem" },
                }}
              >
                {about.companyName?.trim() || "A closer look"}
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {galleryImages.map((image, index) => (
                <Grid
                  key={`${image}-${index}`}
                  size={{
                    xs: 12,
                    sm: galleryImages.length === 1 ? 12 : 6,
                    md: galleryImages.length === 1 ? 12 : 4,
                  }}
                >
                  <Box
                    sx={{
                      overflow: "hidden",
                      borderRadius: 2,
                      backgroundColor: softBackground,
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${about.companyName?.trim() || "Company"} gallery ${index + 1}`}
                      loading="lazy"
                      sx={{
                        display: "block",
                        width: "100%",
                        height: { xs: 240, sm: 260, md: 280 },
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Bottom call to action */}
        <Box
          sx={{
            py: { xs: 3, md: 4 },
            px: { xs: 2, md: 4 },
            borderTop: `1px solid ${border}`,
            borderBottom: `1px solid ${border}`,
            textAlign: "center",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              maxWidth: 620,
              mx: "auto",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: ink,
                fontWeight: 750,
                letterSpacing: "-0.03em",
                fontSize: { xs: "1.6rem", md: "2rem" },
              }}
            >
              Ready to get started?
            </Typography>

            <Typography
              sx={{
                color: muted,
                lineHeight: 1.8,
              }}
            >
              Browse our products or contact us about your bulk requirements.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                width: { xs: "100%", sm: "auto" },
                pt: 1,
              }}
            >
              <Button
                component="a"
                href="/"
                variant="contained"
                size="large"
                sx={{
                  minWidth: { sm: 160 },
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  backgroundColor: accent,
                  color: ink,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#00A9BE",
                    boxShadow: "none",
                  },
                }}
              >
                Shop Now
              </Button>

              <Button
                component="a"
                href="https://wa.me/8766911307"
                variant="outlined"
                size="large"
                sx={{
                  minWidth: { sm: 160 },
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  borderColor: accent,
                  color: "#087F8C",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#00A9BE",
                    backgroundColor: "rgba(0, 191, 214, 0.05)",
                  },
                }}
              >
                Bulk Order
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </PageContainer>
  );
}
