import {
  Button,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type {
  AboutSettings,
  CompanyStatistic,
} from "../types/about";

interface AboutFormProps {
  initialValues: AboutSettings;
  isSaving: boolean;
  onSubmit: (
    values: AboutSettings,
  ) => void;
}

export default function AboutForm({
  initialValues,
  isSaving,
  onSubmit,
}: AboutFormProps) {
  const [values, setValues] =
    useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (
    key: keyof AboutSettings,
    value: string,
  ) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleWhyChooseUsChange = (
    index: number,
    value: string,
  ) => {
    const updated = [
      ...values.whyChooseUs,
    ];

    updated[index] = value;

    setValues((previous) => ({
      ...previous,
      whyChooseUs: updated,
    }));
  };

  const handleStatisticChange = (
    index: number,
    key: keyof CompanyStatistic,
    value: string,
  ) => {
    const updated = [
      ...values.statistics,
    ];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    setValues((previous) => ({
      ...previous,
      statistics: updated,
    }));
  };

  const handleGalleryImageChange = (
    index: number,
    value: string,
  ) => {
    const updated = [
      ...values.galleryImages,
    ];

    updated[index] = value;

    setValues((previous) => ({
      ...previous,
      galleryImages: updated,
    }));
  };

  const addGalleryImage = () => {
    setValues((previous) => ({
      ...previous,
      galleryImages: [
        ...previous.galleryImages,
        "",
      ],
    }));
  };

  return (
    <Stack spacing={4}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Company Name"
            value={values.companyName}
            onChange={(event) =>
              handleChange(
                "companyName",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Hero Title"
            value={values.heroTitle}
            onChange={(event) =>
              handleChange(
                "heroTitle",
                event.target.value,
              )
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
              handleChange(
                "heroSubtitle",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            minRows={6}
            label="Company Story"
            value={values.companyStory}
            onChange={(event) =>
              handleChange(
                "companyStory",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Mission"
            value={values.mission}
            onChange={(event) =>
              handleChange(
                "mission",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Vision"
            value={values.vision}
            onChange={(event) =>
              handleChange(
                "vision",
                event.target.value,
              )
            }
          />
        </Grid>

        {values.whyChooseUs.map(
          (item, index) => (
            <Grid
              key={index}
              size={{ xs: 12 }}
            >
              <TextField
                fullWidth
                label={`Why Choose Us #${
                  index + 1
                }`}
                value={item}
                onChange={(event) =>
                  handleWhyChooseUsChange(
                    index,
                    event.target.value,
                  )
                }
              />
            </Grid>
          ),
        )}

        {values.statistics.map(
          (statistic, index) => (
            <Grid
              key={statistic.id}
              size={{ xs: 12 }}
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Statistic Label"
                    value={
                      statistic.label
                    }
                    onChange={(
                      event,
                    ) =>
                      handleStatisticChange(
                        index,
                        "label",
                        event.target
                          .value,
                      )
                    }
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Statistic Value"
                    value={
                      statistic.value
                    }
                    onChange={(
                      event,
                    ) =>
                      handleStatisticChange(
                        index,
                        "value",
                        event.target
                          .value,
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          ),
        )}

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Hero Image URL"
            value={
              values.heroImageUrl
            }
            onChange={(event) =>
              handleChange(
                "heroImageUrl",
                event.target.value,
              )
            }
          />
        </Grid>

        {values.galleryImages.map(
          (image, index) => (
            <Grid
              key={index}
              size={{ xs: 12 }}
            >
              <TextField
                fullWidth
                label={`Gallery Image ${
                  index + 1
                }`}
                value={image}
                onChange={(event) =>
                  handleGalleryImageChange(
                    index,
                    event.target.value,
                  )
                }
              />
            </Grid>
          ),
        )}

        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            onClick={
              addGalleryImage
            }
          >
            Add Gallery Image
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="large"
        disabled={isSaving}
        onClick={() =>
          onSubmit(values)
        }
      >
        Save About Page
      </Button>
    </Stack>
  );
}