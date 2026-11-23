import { Alert, Box, CircularProgress, Container, Stack, Typography } from "@mui/material";

import { useFaqSettings } from "../hooks/useFaqSettings";

import FaqAccordion from "../components/FaqAccordion";

const accent = "#00BFD6";
const accentDark = "#087F8C";
const ink = "#17252B";
const muted = "#64747A";

export default function FaqPage() {
  const { faqSettings, isLoading, error } = useFaqSettings();

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

  if (error || !faqSettings) {
    return (
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 4 }}>
        <Alert severity="error">Failed to load FAQ.</Alert>
      </Container>
    );
  }

  const faqs = (faqSettings.faqs ?? []).filter((faq) => faq.isActive);

  return (
    <Container
      maxWidth="md"
      sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4, md: 6 } }}
    >
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Stack spacing={1.25}>
          <Typography
            variant="overline"
            sx={{ color: accentDark, fontWeight: 700, letterSpacing: 1.5 }}
          >
            FAQ
          </Typography>

          <Typography
            component="h1"
            sx={{
              color: ink,
              fontWeight: 750,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "2.8rem" },
              overflowWrap: "anywhere",
            }}
          >
            {faqSettings.heroTitle?.trim() || "Frequently asked questions"}
          </Typography>

          {faqSettings.heroSubtitle?.trim() && (
            <Typography
              sx={{
                color: muted,
                lineHeight: 1.8,
                maxWidth: 620,
                fontSize: { xs: "0.98rem", md: "1.05rem" },
              }}
            >
              {faqSettings.heroSubtitle}
            </Typography>
          )}

          <Box
            sx={{
              width: 48,
              height: 3,
              borderRadius: 2,
              backgroundColor: accent,
              mt: 0.5,
            }}
          />
        </Stack>

        {faqs.length === 0 ? (
          <Typography sx={{ color: muted }}>
            No questions have been added yet.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {faqs.map((faq) => (
              <FaqAccordion key={faq.id} faq={faq} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
