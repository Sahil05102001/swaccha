import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Link as MuiLink,
  MenuItem,
  Stack,
  TextField,
  Typography,
  type TextFieldProps,
} from "@mui/material";
import { Link } from "react-router-dom";

import SectionCard from "@/components/common/SectionCard";

import AdminSelect from "./AdminSelect";

import type { CurrencyCode, StoreSettings } from "../types/storeSettings";

interface StoreSettingsFormProps {
  initialValues: StoreSettings;
  isSaving: boolean;
  onSubmit: (values: StoreSettings) => void;
}

const currencies: CurrencyCode[] = ["INR", "USD", "EUR", "GBP"];

export default function StoreSettingsForm({
  initialValues,
  isSaving,
  onSubmit,
}: StoreSettingsFormProps) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues],
  );

  const handleChange = (key: keyof StoreSettings, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  // One text field, wired to a settings key.
  const text = (
    key: keyof StoreSettings,
    label: string,
    props: Partial<TextFieldProps> = {},
  ) => (
    <TextField
      fullWidth
      label={label}
      value={(values[key] as string | undefined) ?? ""}
      onChange={(event) => handleChange(key, event.target.value)}
      {...props}
    />
  );

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Business details"
        subtitle="Shown on the website and printed on invoices."
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>{text("storeName", "Store name")}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{text("email", "Email")}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{text("phoneNumber", "Phone number")}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{text("whatsappNumber", "WhatsApp number")}</Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          The GST number is set on the{" "}
          <MuiLink component={Link} to="/admin/tax">
            Tax (GST)
          </MuiLink>{" "}
          page.
        </Typography>
      </SectionCard>

      <SectionCard title="Address">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>{text("addressLine1", "Address line 1")}</Grid>
          <Grid size={{ xs: 12 }}>{text("addressLine2", "Address line 2")}</Grid>
          <Grid size={{ xs: 12, md: 3 }}>{text("city", "City")}</Grid>
          <Grid size={{ xs: 12, md: 3 }}>{text("state", "State")}</Grid>
          <Grid size={{ xs: 12, md: 3 }}>{text("postalCode", "Postal code")}</Grid>
          <Grid size={{ xs: 12, md: 3 }}>{text("country", "Country")}</Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Invoices and support">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdminSelect
              fullWidth
              label="Currency"
              value={values.currency}
              onChange={(event) => handleChange("currency", event.target.value)}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </AdminSelect>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>{text("invoicePrefix", "Invoice prefix")}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{text("supportEmail", "Support email")}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{text("supportPhone", "Support phone")}</Grid>

          <Grid size={{ xs: 12 }}>
            {text("invoiceFooter", "Invoice footer", {
              multiline: true,
              minRows: 3,
              helperText: "Printed at the bottom of invoices.",
            })}
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Homepage announcements"
        subtitle="Short messages shown around the homepage hero banner."
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            {text("announcementTopText", "Top announcement text", {
              helperText: "Displayed above the homepage hero banner.",
            })}
          </Grid>
          <Grid size={{ xs: 12 }}>
            {text("announcementBottomText", "Bottom announcement text", {
              helperText: "Displayed below the homepage hero banner.",
            })}
          </Grid>
        </Grid>
      </SectionCard>

      {/* Stays in view while scrolling, so Save is always reachable. */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          p: 1.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {dirty ? "You have unsaved changes." : "All changes are saved."}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            disabled={!dirty || isSaving}
            onClick={() => setValues(initialValues)}
          >
            Discard
          </Button>

          <Button
            variant="contained"
            disabled={!dirty || isSaving}
            onClick={() => onSubmit(values)}
          >
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}