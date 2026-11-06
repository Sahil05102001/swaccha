// D:\Projects\swaccha\src\features\cms\contact\components\ContactForm.tsx

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useContactSettings } from "../hooks/useContactSettings";
import type { ContactSettings } from "../types/contact";

const accent = "#00BFD6";
const ink = "#17252B";
const muted = "#64747A";
const border = "#E5ECEE";

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourpage" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourpage" },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
] as const;

type TextFields = {
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  whatsapp: string;
  email: string;
};

type FormState = TextFields & { social: Record<string, string> };

const emptyForm: FormState = {
  businessName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  whatsapp: "",
  email: "",
  social: {},
};

const matchesPlatform = (platformName: string | undefined, key: string) =>
  (platformName ?? "").toLowerCase().includes(key);

const isKnownPlatform = (platformName: string | undefined) =>
  SOCIAL_PLATFORMS.some((p) => matchesPlatform(platformName, p.key));

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderColor: border, borderRadius: 2, backgroundColor: "#FFFFFF" }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography sx={{ color: ink, fontWeight: 700, fontSize: "1.05rem" }}>
          {title}
        </Typography>

        {description && (
          <Typography variant="body2" sx={{ color: muted, mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: border }} />

      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );
}

export default function ContactForm() {
  const {
    contactSettings,
    isLoading,
    isSaving,
    error,
    saveContactSettings,
  } = useContactSettings();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "saved" | "failed">("idle");

  useEffect(() => {
    if (!contactSettings) return;

    const social: Record<string, string> = {};

    SOCIAL_PLATFORMS.forEach((platform) => {
      const existing = (contactSettings.socialLinks ?? []).find((link) =>
        matchesPlatform(link.platform, platform.key),
      );

      social[platform.key] = existing?.url ?? "";
    });

    setForm({
      businessName: contactSettings.businessName ?? "",
      addressLine1: contactSettings.addressLine1 ?? "",
      addressLine2: contactSettings.addressLine2 ?? "",
      city: contactSettings.city ?? "",
      state: contactSettings.state ?? "",
      postalCode: contactSettings.postalCode ?? "",
      country: contactSettings.country ?? "",
      whatsapp: contactSettings.whatsapp ?? "",
      email: contactSettings.email ?? "",
      social,
    });
  }, [contactSettings]);

  const setField =
    (field: keyof TextFields) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStatus("idle");
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const setSocial =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setStatus("idle");
      setForm((prev) => ({
        ...prev,
        social: { ...prev.social, [key]: event.target.value },
      }));
    };

  const brandMissing = form.businessName.trim() === "";
  const emailInvalid =
    form.email.trim() !== "" && !/^\S+@\S+\.\S+$/.test(form.email.trim());

  const canSave = !brandMissing && !emailInvalid && !isSaving;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!contactSettings || !canSave) return;

    const existingLinks = contactSettings.socialLinks ?? [];

    const knownLinks = SOCIAL_PLATFORMS.map((platform) => {
      const existing = existingLinks.find((link) =>
        matchesPlatform(link.platform, platform.key),
      );

      return {
        id: existing?.id ?? platform.key,
        platform: existing?.platform ?? platform.label,
        url: form.social[platform.key]?.trim() ?? "",
      };
    }).filter((link) => link.url);

    // Keep any other links already stored in the CMS
    const otherLinks = existingLinks.filter(
      (link) => !isKnownPlatform(link.platform),
    );

    const payload = {
      ...contactSettings, // keeps fields this form no longer edits (hours, map, phone...)
      businessName: form.businessName.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      socialLinks: [...knownLinks, ...otherLinks],
    } as ContactSettings;

    try {
      await saveContactSettings(payload);
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }

  if (isLoading) {
    return (
      <Stack sx={{ minHeight: "40vh", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: accent }} />
      </Stack>
    );
  }

  if (error || !contactSettings) {
    return <Alert severity="error">Failed to load contact settings.</Alert>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <SectionCard
          title="Brand"
          description="Shown as the main heading on the Contact Us page."
        >
          <TextField
            label="Brand name"
            value={form.businessName}
            onChange={setField("businessName")}
            error={brandMissing}
            helperText={brandMissing ? "Brand name is required" : " "}
            fullWidth
            required
          />
        </SectionCard>

        <SectionCard title="Address">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address line 1"
                value={form.addressLine1}
                onChange={setField("addressLine1")}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address line 2"
                value={form.addressLine2}
                onChange={setField("addressLine2")}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="City"
                value={form.city}
                onChange={setField("city")}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="State"
                value={form.state}
                onChange={setField("state")}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Postal code"
                value={form.postalCode}
                onChange={setField("postalCode")}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Country"
                value={form.country}
                onChange={setField("country")}
                fullWidth
              />
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard title="Contact">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="WhatsApp number"
                value={form.whatsapp}
                onChange={setField("whatsapp")}
                helperText="10-digit number, or include the country code"
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={setField("email")}
                error={emailInvalid}
                helperText={emailInvalid ? "Enter a valid email address" : " "}
                fullWidth
              />
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard
          title="Social links"
          description="Leave a field empty to hide that platform on the page."
        >
          <Grid container spacing={2}>
            {SOCIAL_PLATFORMS.map((platform) => (
              <Grid key={platform.key} size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={platform.label}
                  placeholder={platform.placeholder}
                  value={form.social[platform.key] ?? ""}
                  onChange={setSocial(platform.key)}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>

        {status === "saved" && (
          <Alert severity="success">Contact page updated.</Alert>
        )}

        {status === "failed" && (
          <Alert severity="error">Could not save changes. Please try again.</Alert>
        )}

        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!canSave}
            disableElevation
            sx={{
              px: 4,
              py: 1.1,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: accent,
              color: ink,
              "&:hover": { backgroundColor: "#00A9BE" },
              "&.Mui-disabled": { backgroundColor: border, color: muted },
            }}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}