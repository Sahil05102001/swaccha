import { useState } from "react";

import { Grid, Stack, TextField } from "@mui/material";

import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import SaveBar from "@/features/admin/components/SaveBar";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import type { ContactSettings } from "../types/contact";

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

const matchesPlatform = (platformName: string | undefined, key: string) =>
  (platformName ?? "").toLowerCase().includes(key);

const isKnownPlatform = (platformName: string | undefined) =>
  SOCIAL_PLATFORMS.some((p) => matchesPlatform(platformName, p.key));

function toForm(settings: ContactSettings): FormState {
  const social: Record<string, string> = {};

  SOCIAL_PLATFORMS.forEach((platform) => {
    const existing = (settings.socialLinks ?? []).find((link) =>
      matchesPlatform(link.platform, platform.key),
    );

    social[platform.key] = existing?.url ?? "";
  });

  return {
    businessName: settings.businessName ?? "",
    addressLine1: settings.addressLine1 ?? "",
    addressLine2: settings.addressLine2 ?? "",
    city: settings.city ?? "",
    state: settings.state ?? "",
    postalCode: settings.postalCode ?? "",
    country: settings.country ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    social,
  };
}

function clean(form: FormState): FormState {
  const social: Record<string, string> = {};

  SOCIAL_PLATFORMS.forEach((platform) => {
    social[platform.key] = (form.social[platform.key] ?? "").trim();
  });

  return {
    businessName: form.businessName.trim(),
    addressLine1: form.addressLine1.trim(),
    addressLine2: form.addressLine2.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    postalCode: form.postalCode.trim(),
    country: form.country.trim(),
    whatsapp: form.whatsapp.trim(),
    email: form.email.trim(),
    social,
  };
}

interface ContactFormProps {
  initial: ContactSettings;
  isSaving: boolean;
  onSave: (settings: ContactSettings) => Promise<unknown>;
}

export default function ContactForm({ initial, isSaving, onSave }: ContactFormProps) {
  const { showSnackbar } = useSnackbar();

  const [base, setBase] = useState(initial);
  const [saved, setSaved] = useState<FormState>(() => toForm(initial));
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [submitted, setSubmitted] = useState(false);

  const dirty = JSON.stringify(clean(form)) !== JSON.stringify(clean(saved));

  const setField =
    (field: keyof TextFields) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const setSocial = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((previous) => ({
      ...previous,
      social: { ...previous.social, [key]: event.target.value },
    }));

  const values = clean(form);

  const errors = {
    businessName: values.businessName === "" ? "Brand name is required." : "",
    email:
      values.email !== "" && !/^\S+@\S+\.\S+$/.test(values.email)
        ? "Enter a valid email address."
        : "",
    whatsapp:
      values.whatsapp !== "" &&
      !/^\d{10,15}$/.test(values.whatsapp.replace(/\D/g, ""))
        ? "Enter 10 digits, or include the country code."
        : "",
  };

  const socialError = (key: string) => {
    const url = values.social[key];
    return url !== "" && !/^https?:\/\//i.test(url) ? "Start with https://" : "";
  };

  const hasErrors =
    Boolean(errors.businessName || errors.email || errors.whatsapp) ||
    SOCIAL_PLATFORMS.some((platform) => socialError(platform.key));

  const shown = (message: string) => (submitted ? message : "");

  const submit = async () => {
    setSubmitted(true);
    if (hasErrors) return;

    const existingLinks = base.socialLinks ?? [];

    const knownLinks = SOCIAL_PLATFORMS.map((platform) => {
      const existing = existingLinks.find((link) =>
        matchesPlatform(link.platform, platform.key),
      );

      return {
        id: existing?.id ?? platform.key,
        platform: existing?.platform ?? platform.label,
        url: values.social[platform.key],
      };
    }).filter((link) => link.url);

    // Keep any other links already stored in the CMS.
    const otherLinks = existingLinks.filter((link) => !isKnownPlatform(link.platform));

    // Keeps the fields this form does not edit (hours, map, phone...).
    const payload = {
      ...base,
      businessName: values.businessName,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      whatsapp: values.whatsapp,
      email: values.email,
      socialLinks: [...knownLinks, ...otherLinks],
    } as ContactSettings;

    try {
      await onSave(payload);

      setBase(payload);
      setSaved(values);
      setForm(values);
      setSubmitted(false);

      showSnackbar("Contact page saved.", "success");
      scrollToTop();
    } catch {
      showSnackbar("Could not save the contact page. Please try again.", "error");
    }
  };

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Brand"
        subtitle="Shown as the main heading on the Contact Us page."
      >
        <TextField
          label="Brand name"
          value={form.businessName}
          onChange={setField("businessName")}
          error={Boolean(shown(errors.businessName))}
          helperText={shown(errors.businessName)}
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
            <TextField label="City" value={form.city} onChange={setField("city")} fullWidth />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="State" value={form.state} onChange={setField("state")} fullWidth />
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
              error={Boolean(shown(errors.whatsapp))}
              helperText={
                shown(errors.whatsapp) || "10-digit number, or include the country code"
              }
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={setField("email")}
              error={Boolean(shown(errors.email))}
              helperText={shown(errors.email)}
              fullWidth
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Social links"
        subtitle="Leave a field empty to hide that platform on the page."
      >
        <Grid container spacing={2}>
          {SOCIAL_PLATFORMS.map((platform) => (
            <Grid key={platform.key} size={{ xs: 12, sm: 6 }}>
              <TextField
                label={platform.label}
                placeholder={platform.placeholder}
                value={form.social[platform.key] ?? ""}
                onChange={setSocial(platform.key)}
                error={Boolean(shown(socialError(platform.key)))}
                helperText={shown(socialError(platform.key))}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SaveBar
        dirty={dirty}
        saving={isSaving}
        onSave={() => void submit()}
        onDiscard={() => {
          setForm(saved);
          setSubmitted(false);
        }}
      />
    </Stack>
  );
}