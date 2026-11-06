// D:\Projects\swaccha\src\features\cms\contact\pages\ContactPage.tsx

import type { ReactNode } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";

import PageContainer from "@/components/common/PageContainer";

import { useContactSettings } from "../hooks/useContactSettings";

const accent = "#00BFD6";
const accentDark = "#087F8C";
const ink = "#17252B";
const border = "#E5ECEE";
const softBackground = "#F7FAFA";

// Fallbacks, used only if the CMS fields are empty
const FALLBACK_WHATSAPP = "8766911307";
const FALLBACK_EMAIL = "swachha.business@gmail.com";

function getSocialIcon(platform: string): ReactNode {
  const key = platform.toLowerCase();

  if (key.includes("insta")) return <InstagramIcon />;
  if (key.includes("face")) return <FacebookIcon />;
  if (key.includes("youtube")) return <YouTubeIcon />;
  if (key.includes("linked")) return <LinkedInIcon />;
  if (key.includes("twitter") || key === "x") return <TwitterIcon />;
  if (key.includes("whatsapp")) return <WhatsAppIcon />;

  return <LanguageIcon />;
}

function toWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  // Bare 10-digit Indian numbers need the country code for wa.me
  return digits.length === 10 ? `91${digits}` : digits;
}

type InfoCardProps = {
  icon: ReactNode;
  label: string;
  href?: string;
  external?: boolean;
  children: ReactNode;
};

function InfoCard({
  icon,
  label,
  href,
  external,
  children,
}: InfoCardProps) {
  const clickable = Boolean(href);

  return (
    <Box
      component={clickable ? "a" : "div"}
      {...(clickable
        ? {
          href,
          ...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {}),
        }
        : {})}
      sx={{
        display: "block",
        height: "100%",
        p: { xs: 2.5, md: 3.5 },
        textDecoration: "none",
        border: `1px solid ${border}`,
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        transition: "border-color 0.25s ease",
        ...(clickable && {
          "&:hover": {
            borderColor: accent,
          },
        }),
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          color: accentDark,
          backgroundColor: "rgba(0, 191, 214, 0.1)",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="overline"
        sx={{
          display: "block",
          color: accentDark,
          fontWeight: 700,
          letterSpacing: 1.5,
          lineHeight: 1.6,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          color: ink,
          fontWeight: 600,
          fontSize: { xs: "1rem", md: "1.08rem" },
          lineHeight: 1.7,
          overflowWrap: "anywhere",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function ContactPage() {
  const { contactSettings, isLoading, error } = useContactSettings();

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

  if (error || !contactSettings) {
    return (
      <PageContainer>
        <Alert severity="error">Failed to load contact information.</Alert>
      </PageContainer>
    );
  }

  const businessName = contactSettings.businessName?.trim() || "Swachha";

  const addressLines = [
    contactSettings.addressLine1,
    contactSettings.addressLine2,
    [contactSettings.city, contactSettings.state].filter(Boolean).join(", "),
    [contactSettings.postalCode, contactSettings.country]
      .filter(Boolean)
      .join(", "),
  ]
    .map((line) => line?.trim())
    .filter(Boolean) as string[];

  const whatsapp = contactSettings.whatsapp?.trim() || FALLBACK_WHATSAPP;
  const email = contactSettings.email?.trim() || FALLBACK_EMAIL;

  const socialLinks = (contactSettings.socialLinks ?? []).filter((link) =>
    link.url?.trim(),
  );

  return (
    <PageContainer>
      <Stack spacing={{ xs: 4, md: 6 }} sx={{ pb: { xs: 3, md: 5 } }}>
        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 2, md: 3 },
            border: `1px solid ${border}`,
            px: { xs: 3, sm: 5, md: 8 },
            py: { xs: 5, md: 8 },
            textAlign: "center",
            background: `linear-gradient(135deg, #FFFFFF 0%, ${softBackground} 55%, rgba(0, 191, 214, 0.12) 100%)`,
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: "absolute",
              top: -90,
              right: -90,
              width: 260,
              height: 260,
              borderRadius: "50%",
              backgroundColor: "rgba(0, 191, 214, 0.1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -70,
              left: -70,
              width: 190,
              height: 190,
              borderRadius: "50%",
              border: `2px solid rgba(0, 191, 214, 0.25)`,
            }}
          />

          <Stack
            spacing={2}
            sx={{ position: "relative", alignItems: "center" }}
          >
            <Typography
              variant="overline"
              sx={{
                color: accentDark,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              CONTACT US
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: ink,
                fontWeight: 750,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.8rem" },
                overflowWrap: "anywhere",
              }}
            >
              {businessName}
            </Typography>

            <Box
              sx={{
                width: 56,
                height: 4,
                borderRadius: 2,
                backgroundColor: accent,
              }}
            />
          </Stack>
        </Box>

        {/* Address / WhatsApp / Email */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {addressLines.length > 0 && (
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoCard icon={<PlaceOutlinedIcon />} label="ADDRESS">
                {addressLines.map((line, index) => (
                  <Box key={`${index}-${line}`} component="span" sx={{ display: "block" }}>
                    {line}
                  </Box>
                ))}
              </InfoCard>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoCard
              icon={<WhatsAppIcon />}
              label="WHATSAPP"
              href={`https://wa.me/${toWhatsAppNumber(whatsapp)}`}
              external
            >
              {whatsapp}
            </InfoCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoCard
              icon={<EmailOutlinedIcon />}
              label="EMAIL"
              href={`mailto:${email}`}
            >
              {email}
            </InfoCard>
          </Grid>
        </Grid>

        {/* Follow us */}
        {socialLinks.length > 0 && (
          <Box
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: 3,
              backgroundColor: ink,
              textAlign: "center",
            }}
          >
            <Stack spacing={3} sx={{ alignItems: "center" }}>
              <Stack spacing={1} sx={{ alignItems: "center" }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: accent,
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  FOLLOW US
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

              <Stack
                direction="row"
                useFlexGap
                sx={{
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                {socialLinks.map((link) => (
                  <Box
                    key={link.id}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 999,
                      textDecoration: "none",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      transition: "all 0.25s ease",
                      "& svg": { fontSize: 22 },
                      "&:hover": {
                        backgroundColor: accent,
                        borderColor: accent,
                        color: ink,
                      },
                    }}
                  >
                    {getSocialIcon(link.platform)}
                    {link.platform}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </PageContainer>
  );
}