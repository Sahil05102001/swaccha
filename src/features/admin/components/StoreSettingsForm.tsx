import {
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";

import type {
  StoreSettings,
  CurrencyCode,
} from "../types/storeSettings";

interface StoreSettingsFormProps {
  initialValues: StoreSettings;
  isSaving: boolean;
  onSubmit: (
    values: StoreSettings,
  ) => void;
}

const currencies: CurrencyCode[] = [
  "INR",
  "USD",
  "EUR",
  "GBP",
];

export default function StoreSettingsForm({
  initialValues,
  isSaving,
  onSubmit,
}: StoreSettingsFormProps) {
  const [values, setValues] =
    useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (
    key: keyof StoreSettings,
    value: string,
  ) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Store Name"
            value={values.storeName}
            onChange={(event) =>
              handleChange(
                "storeName",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Logo URL"
            value={values.logoUrl}
            onChange={(event) =>
              handleChange(
                "logoUrl",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="GST Number"
            value={values.gstNumber}
            onChange={(event) =>
              handleChange(
                "gstNumber",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Email"
            value={values.email}
            onChange={(event) =>
              handleChange(
                "email",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address Line 1"
            value={values.addressLine1}
            onChange={(event) =>
              handleChange(
                "addressLine1",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address Line 2"
            value={values.addressLine2 ?? ""}
            onChange={(event) =>
              handleChange(
                "addressLine2",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="City"
            value={values.city}
            onChange={(event) =>
              handleChange(
                "city",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="State"
            value={values.state}
            onChange={(event) =>
              handleChange(
                "state",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Postal Code"
            value={values.postalCode}
            onChange={(event) =>
              handleChange(
                "postalCode",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Country"
            value={values.country}
            onChange={(event) =>
              handleChange(
                "country",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Phone Number"
            value={values.phoneNumber}
            onChange={(event) =>
              handleChange(
                "phoneNumber",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="WhatsApp Number"
            value={values.whatsappNumber}
            onChange={(event) =>
              handleChange(
                "whatsappNumber",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Website"
            value={values.website ?? ""}
            onChange={(event) =>
              handleChange(
                "website",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            select
            label="Currency"
            value={values.currency}
            onChange={(event) =>
              handleChange(
                "currency",
                event.target.value,
              )
            }
          >
            {currencies.map((currency) => (
              <MenuItem
                key={currency}
                value={currency}
              >
                {currency}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Invoice Prefix"
            value={values.invoicePrefix}
            onChange={(event) =>
              handleChange(
                "invoicePrefix",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Support Email"
            value={values.supportEmail}
            onChange={(event) =>
              handleChange(
                "supportEmail",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Support Phone"
            value={values.supportPhone}
            onChange={(event) =>
              handleChange(
                "supportPhone",
                event.target.value,
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Invoice Footer"
            value={values.invoiceFooter}
            onChange={(event) =>
              handleChange(
                "invoiceFooter",
                event.target.value,
              )
            }
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={isSaving}
      >
        Save Settings
      </Button>
    </Stack>
  );
}