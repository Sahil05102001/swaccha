import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import SaveBar from "@/features/admin/components/SaveBar";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import type { AboutSettings } from "../types/about";

const MAX_REASONS = 4;
const MAX_STATISTICS = 4;
const MAX_GALLERY = 6;

type Editable = Omit<AboutSettings, "createdAt" | "updatedAt">;

const t = (value?: string) => (value ?? "").trim();

const newId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** The values as they are saved: trimmed, with empty rows removed. */
function clean(form: Editable): Editable {
  return {
    companyName: t(form.companyName),
    heroTitle: t(form.heroTitle),
    heroSubtitle: t(form.heroSubtitle),
    companyStory: t(form.companyStory),
    mission: t(form.mission),
    vision: t(form.vision),
    whyChooseUs: form.whyChooseUs.map(t).filter(Boolean),
    statistics: form.statistics
      .map((item) => ({ id: item.id, label: t(item.label), value: t(item.value) }))
      .filter((item) => item.label && item.value),
    heroImageUrl: t(form.heroImageUrl),
    desktopBannerUrl: t(form.desktopBannerUrl),
    mobileBannerUrl: t(form.mobileBannerUrl),
    galleryImages: form.galleryImages.map(t).filter(Boolean),
    ownerName: t(form.ownerName),
    ownerTitle: t(form.ownerTitle),
    ownerBio: t(form.ownerBio),
    ownerImageUrl: t(form.ownerImageUrl),
  };
}

function toForm(settings: AboutSettings): Editable {
  const reasons = [...(settings.whyChooseUs ?? [])];
  while (reasons.length < MAX_REASONS) reasons.push("");

  return {
    companyName: settings.companyName ?? "",
    heroTitle: settings.heroTitle ?? "",
    heroSubtitle: settings.heroSubtitle ?? "",
    companyStory: settings.companyStory ?? "",
    mission: settings.mission ?? "",
    vision: settings.vision ?? "",
    whyChooseUs: reasons,
    statistics: settings.statistics ?? [],
    heroImageUrl: settings.heroImageUrl ?? "",
    desktopBannerUrl: settings.desktopBannerUrl ?? "",
    mobileBannerUrl: settings.mobileBannerUrl ?? "",
    galleryImages: settings.galleryImages ?? [],
    ownerName: settings.ownerName ?? "",
    ownerTitle: settings.ownerTitle ?? "",
    ownerBio: settings.ownerBio ?? "",
    ownerImageUrl: settings.ownerImageUrl ?? "",
  };
}

function UrlImageField({
  label,
  value,
  onChange,
  hint,
  ratio,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
  ratio: string;
}) {
  const [broken, setBroken] = useState(false);
  const url = value.trim();

  return (
    <Stack spacing={1}>
      <TextField
        fullWidth
        label={label}
        placeholder="https://..."
        value={value}
        onChange={(event) => {
          setBroken(false);
          onChange(event.target.value);
        }}
        helperText={hint}
      />

      {url && !broken && (
        <Box
          component="img"
          src={url}
          alt=""
          onError={() => setBroken(true)}
          sx={{
            width: "100%",
            maxWidth: 240,
            aspectRatio: ratio,
            objectFit: "cover",
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#FFFFFF",
          }}
        />
      )}

      {url && broken && (
        <FormHelperText error>
          This image could not be loaded. Check the link.
        </FormHelperText>
      )}
    </Stack>
  );
}

interface AboutFormProps {
  initialValues: AboutSettings;
  isSaving: boolean;
  onSubmit: (values: AboutSettings) => Promise<unknown>;
}

export default function AboutForm({
  initialValues,
  isSaving,
  onSubmit,
}: AboutFormProps) {
  const { showSnackbar } = useSnackbar();

  const [base, setBase] = useState(initialValues);
  const [saved, setSaved] = useState<Editable>(() => toForm(initialValues));
  const [form, setForm] = useState<Editable>(() => toForm(initialValues));
  const [problem, setProblem] = useState<string | null>(null);

  const set = <K extends keyof Editable>(key: K, value: Editable[K]) => {
    setProblem(null);
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const dirty = JSON.stringify(clean(form)) !== JSON.stringify(clean(saved));

  const setReason = (index: number, value: string) =>
    set(
      "whyChooseUs",
      form.whyChooseUs.map((reason, i) => (i === index ? value : reason)),
    );

  const setStatistic = (index: number, key: "label" | "value", value: string) =>
    set(
      "statistics",
      form.statistics.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );

  const setGallery = (index: number, value: string) =>
    set(
      "galleryImages",
      form.galleryImages.map((image, i) => (i === index ? value : image)),
    );

  const submit = async () => {

    const values = clean(form);
    const payload = { ...base, ...values } as AboutSettings;

    try {
      await onSubmit(payload);

      setBase(payload);
      setSaved(toForm(payload));
      setForm(toForm(payload));
      setProblem(null);

      showSnackbar("About page saved.", "success");
      scrollToTop();
    } catch {
      showSnackbar("Failed to save the About page.", "error");
    }
  };

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Brand introduction"
        subtitle="The first thing visitors see on the About page."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Company name"
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Hero title"
              value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Hero subtitle"
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <UrlImageField
              label="Desktop banner URL"
              value={form.desktopBannerUrl}
              onChange={(v) => set("desktopBannerUrl", v)}
              ratio="3 / 2"
              hint="Shown beside the heading on desktop. Recommended 1200 × 800 px (3:2), WebP or JPEG, about 150 KB."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <UrlImageField
              label="Mobile banner URL"
              value={form.mobileBannerUrl}
              onChange={(v) => set("mobileBannerUrl", v)}
              ratio="4 / 3"
              hint="Shown on phones. Recommended 800 × 600 px (4:3), WebP or JPEG, about 100 KB."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <UrlImageField
              label="Fallback image URL (optional)"
              value={form.heroImageUrl}
              onChange={(v) => set("heroImageUrl", v)}
              ratio="3 / 2"
              hint="Used only when no banner above is set."
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Our story"
        subtitle="Tell visitors about the company and what it stands for."
      >
        <TextField
          fullWidth
          multiline
          minRows={6}
          label="Company story"
          value={form.companyStory}
          onChange={(e) => set("companyStory", e.target.value)}
        />
      </SectionCard>

      <SectionCard
        title="Mission & vision"
        subtitle="Your purpose and long-term direction. Empty boxes are hidden."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Our mission"
              value={form.mission}
              onChange={(e) => set("mission", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Our vision"
              value={form.vision}
              onChange={(e) => set("vision", e.target.value)}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Why choose us"
        subtitle={`Up to ${MAX_REASONS} short points. Empty points are hidden, and the section is hidden if all are empty.`}
      >
        <Grid container spacing={2}>
          {form.whyChooseUs.map((reason, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label={`Point ${index + 1}`}
                value={reason}
                onChange={(e) => setReason(index, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Company statistics"
        subtitle={`Up to ${MAX_STATISTICS} figures, for example "500+" with "Happy customers". A row is only saved and shown when both its value and label are filled in.`}
        action={
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            disabled={form.statistics.length >= MAX_STATISTICS}
            onClick={() =>
              set("statistics", [
                ...form.statistics,
                { id: newId(), label: "", value: "" },
              ])
            }
          >
            Add
          </Button>
        }
      >
        <Stack spacing={1.5}>
          {form.statistics.length === 0 && (
            <FormHelperText>No statistics. The section is hidden.</FormHelperText>
          )}

          {form.statistics.map((item, index) => (
            <Stack
              key={item.id}
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ alignItems: { sm: "center" } }}
            >
              <TextField
                label="Value"
                placeholder="500+"
                value={item.value}
                onChange={(e) => setStatistic(index, "value", e.target.value)}
                sx={{ width: { sm: 180 } }}
              />

              <TextField
                fullWidth
                label="Label"
                placeholder="Happy customers"
                value={item.label}
                onChange={(e) => setStatistic(index, "label", e.target.value)}
              />

              <IconButton
                color="error"
                aria-label="Remove statistic"
                onClick={() =>
                  set(
                    "statistics",
                    form.statistics.filter((_, i) => i !== index),
                  )
                }
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard
        title="Meet the owner"
        subtitle="Leave everything blank to hide this section."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Owner name"
              value={form.ownerName}
              onChange={(e) => set("ownerName", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Owner title"
              placeholder="e.g. Founder"
              value={form.ownerTitle}
              onChange={(e) => set("ownerTitle", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Owner biography"
              value={form.ownerBio}
              onChange={(e) => set("ownerBio", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <UrlImageField
              label="Owner image URL"
              value={form.ownerImageUrl}
              onChange={(v) => set("ownerImageUrl", v)}
              ratio="4 / 5"
              hint="Portrait, shown at 4:5. Recommended 800 × 1000 px, WebP or JPEG, about 120 KB."
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Gallery"
        subtitle={`Up to ${MAX_GALLERY} photos. Recommended 1200 × 800 px (3:2), about 150 KB each. They are cropped to fit.`}
        action={
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            disabled={form.galleryImages.length >= MAX_GALLERY}
            onClick={() => set("galleryImages", [...form.galleryImages, ""])}
          >
            Add photo
          </Button>
        }
      >
        <Stack spacing={2}>
          {form.galleryImages.length === 0 && (
            <FormHelperText>No photos. The gallery is hidden.</FormHelperText>
          )}

          {form.galleryImages.map((image, index) => (
            <Stack key={index} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <UrlImageField
                  label={`Photo ${index + 1} URL`}
                  value={image}
                  onChange={(v) => setGallery(index, v)}
                  ratio="3 / 2"
                  hint=" "
                />
              </Box>

              <IconButton
                color="error"
                aria-label="Remove photo"
                sx={{ mt: 1 }}
                onClick={() =>
                  set(
                    "galleryImages",
                    form.galleryImages.filter((_, i) => i !== index),
                  )
                }
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      {problem && <Alert severity="warning">{problem}</Alert>}

      <SaveBar
        dirty={dirty}
        saving={isSaving}
        saveLabel="Save About page"
        onSave={() => void submit()}
        onDiscard={() => {
          setForm(saved);
          setProblem(null);
        }}
      />
    </Stack>
  );
}