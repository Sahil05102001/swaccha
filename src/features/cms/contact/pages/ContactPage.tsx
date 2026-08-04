import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import { useContactSettings } from "../hooks/useContactSettings";

export default function ContactPage() {
  const {
    contactSettings,
    isLoading,
    error,
  } = useContactSettings();

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

  if (error || !contactSettings) {
    return (
      <PageContainer>
        <Alert severity="error">
          Failed to load contact information.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={contactSettings.heroTitle}
        subtitle={contactSettings.heroSubtitle}
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
            {contactSettings.businessName}
          </Typography>

          <Stack spacing={1}>
            <Typography>
              {contactSettings.addressLine1}
            </Typography>

            {contactSettings.addressLine2 && (
              <Typography>
                {contactSettings.addressLine2}
              </Typography>
            )}

            <Typography>
              {contactSettings.city},{" "}
              {contactSettings.state}
            </Typography>

            <Typography>
              {contactSettings.postalCode}
            </Typography>

            <Typography>
              {contactSettings.country}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography>
              📞 {contactSettings.phone}
            </Typography>

            <Typography>
              📧 {contactSettings.email}
            </Typography>

            <Typography>
              🌐 {contactSettings.website}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            {contactSettings.phone && (
              <Button
                variant="contained"
                href={`tel:${contactSettings.phone}`}
              >
                Call
              </Button>
            )}

            {contactSettings.whatsapp && (
              <Button
                variant="contained"
                color="success"
                href={`https://wa.me/${contactSettings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
              >
                WhatsApp
              </Button>
            )}

            {contactSettings.email && (
              <Button
                variant="outlined"
                href={`mailto:${contactSettings.email}`}
              >
                Email
              </Button>
            )}
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ p: 3 }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 2 }}
          >
            Business Hours
          </Typography>

          <Stack spacing={1}>
            {contactSettings.businessHours.map(
              (hour) => (
                <Stack
                  key={hour.id}
                  direction="row"
                  sx={{
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography>
                    {hour.day}
                  </Typography>

                  <Typography>
                    {hour.isClosed
                      ? "Closed"
                      : `${hour.openingTime} - ${hour.closingTime}`}
                  </Typography>
                </Stack>
              ),
            )}
          </Stack>
        </Paper>

        {contactSettings.socialLinks.some(
          (link) => link.url,
        ) && (
          <Paper
            variant="outlined"
            sx={{ p: 3 }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2 }}
            >
              Follow Us
            </Typography>

            <Stack spacing={1}>
              {contactSettings.socialLinks
                .filter((link) => link.url)
                .map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    {link.platform}
                  </Link>
                ))}
            </Stack>
          </Paper>
        )}

        {contactSettings.googleMapsEmbedUrl && (
          <Paper
            variant="outlined"
            sx={{ p: 2 }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2 }}
            >
              Find Us
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 450,
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <iframe
                title="Google Map"
                src={
                  contactSettings.googleMapsEmbedUrl
                }
                width="100%"
                height="100%"
                style={{
                  border: 0,
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Paper>
        )}
      </Stack>
    </PageContainer>
  );
}