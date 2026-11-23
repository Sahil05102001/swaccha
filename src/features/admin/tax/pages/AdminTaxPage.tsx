import { useState } from "react";

import {
  Alert,
  Button,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import {
  useSaveTaxSettings,
  useTaxSettings,
} from "@/features/tax/hooks/useTax";
import { type TaxSettings } from "@/features/tax/types/tax";
import RateSelect from "@/features/tax/components/RateSelect";

const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

type Errors = Partial<Record<keyof TaxSettings, string>>;

function validate(form: TaxSettings): Errors {
  if (!form.enabled) return {};

  const errors: Errors = {};

  if (!GSTIN.test(form.gstin.trim().toUpperCase())) {
    errors.gstin = "Enter a valid 15-character GSTIN.";
  }
  if (!form.legalName.trim()) errors.legalName = "Enter the legal name.";
  if (!form.address.trim()) errors.address = "Enter the registered address.";
  if (!form.state.trim()) errors.state = "Enter the state.";

  return errors;
}

/** The values as they are saved: trimmed, GSTIN in capitals. */
const clean = (form: TaxSettings): TaxSettings => ({
  enabled: form.enabled,
  gstin: form.gstin.trim().toUpperCase(),
  legalName: form.legalName.trim(),
  address: form.address.trim(),
  state: form.state.trim(),
  defaultRatePercent: form.defaultRatePercent,
  shippingRatePercent: form.shippingRatePercent,
});

const inr = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// How a ₹2,800 product splits at a rate (inclusive pricing).
function sample(rate: number) {
  const basisPoints = Math.round(rate * 100);
  const gross = 280000;
  const taxable = Math.round((gross * 10000) / (10000 + basisPoints));

  return { taxable, tax: gross - taxable };
}

function TaxForm({ initial }: { initial: TaxSettings }) {
  const { showSnackbar } = useSnackbar();
  const save = useSaveTaxSettings();

  const [form, setForm] = useState<TaxSettings>(initial);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof TaxSettings>(key: K, value: TaxSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const errors = validate(form);
  const shown = submitted ? errors : {};
  const example = sample(form.defaultRatePercent);

  const dirty = JSON.stringify(clean(form)) !== JSON.stringify(clean(initial));

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    const toSave = clean(form);

    save.mutate(toSave, {
      onSuccess: () => {
        setForm(toSave);
        setSubmitted(false);
        showSnackbar("Tax settings saved.", "success");
        scrollToTop();
      },
      onError: (e) =>
        showSnackbar(e instanceof Error ? e.message : "Could not save.", "error"),
    });
  };

  return (
    <Stack spacing={3}>
      <SectionCard
        title="GST"
        subtitle="Turn this on only after the business has its GST registration."
      >
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={form.enabled}
                onChange={(e) => set("enabled", e.target.checked)}
              />
            }
            label={
              form.enabled
                ? "GST is ON: new orders get a tax invoice"
                : "GST is OFF: new orders get a plain invoice"
            }
          />

          <Alert severity="info">
            Prices shown to customers never change. They are treated as
            GST-inclusive, and the tax is split out on the invoice. Changes apply
            to new orders only. Orders already placed keep the way they were
            placed.
          </Alert>

          {form.enabled && (
            <Alert severity="warning">
              Tax invoices carry the details below. Check them with your
              accountant or CA before switching GST on.
            </Alert>
          )}

          <Alert severity="info">
            Before switching GST on, fill in the HSN code on every product. Tax
            invoices print it for each item.
          </Alert>
        </Stack>
      </SectionCard>

      <SectionCard
        title="Registration details"
        subtitle="Printed on every tax invoice and credit note."
      >
        <Stack spacing={2}>
          <TextField
            label="GSTIN"
            value={form.gstin}
            onChange={(e) => set("gstin", e.target.value.toUpperCase().slice(0, 15))}
            error={!!shown.gstin}
            helperText={shown.gstin ?? "For example 27ABCDE1234F1Z5"}
          />

          <TextField
            label="Legal name of the business"
            value={form.legalName}
            onChange={(e) => set("legalName", e.target.value)}
            error={!!shown.legalName}
            helperText={shown.legalName}
          />

          <TextField
            label="Registered address"
            multiline
            minRows={3}
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            error={!!shown.address}
            helperText={shown.address}
          />

          <TextField
            label="State of registration"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            error={!!shown.state}
            helperText={
              shown.state ??
              "Deliveries in this state get CGST + SGST. Other states get IGST."
            }
          />
        </Stack>
      </SectionCard>

      <SectionCard
        title="Rates"
        subtitle="Each product can have its own rate. These apply when it has none."
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <RateSelect
              fullWidth
              label="Default GST rate (%)"
              value={form.defaultRatePercent}
              onChange={(rate) => set("defaultRatePercent", Number(rate))}
            />

            <RateSelect
              fullWidth
              label="GST rate on delivery charge (%)"
              value={form.shippingRatePercent}
              onChange={(rate) => set("shippingRatePercent", Number(rate))}
              helperText="Ask your CA which rate applies to delivery."
            />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Example: a ₹2,800 product at {form.defaultRatePercent}% still costs
            the customer ₹2,800. On the invoice it shows as taxable value{" "}
            {inr(example.taxable)} plus GST {inr(example.tax)}.
          </Typography>
        </Stack>
      </SectionCard>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          onClick={submit}
          disabled={!dirty || save.isPending}
        >
          {save.isPending ? "Saving..." : "Save tax settings"}
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setForm(initial);
            setSubmitted(false);
          }}
          disabled={!dirty || save.isPending}
        >
          Discard changes
        </Button>
      </Stack>
    </Stack>
  );
}

export default function AdminTaxPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useTaxSettings();

  // Bumping this key rebuilds the form from the saved settings.
  const [formKey, setFormKey] = useState(0);

  const handleRefresh = async () => {
    await refetch();
    setFormKey((key) => key + 1);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Tax (GST)"
        subtitle="Switch GST on or off and set the registration details."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void handleRefresh()}
            disabled={isRefetching}
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={300} />
          <Skeleton variant="rounded" height={380} />
          <Skeleton variant="rounded" height={200} />
        </Stack>
      ) : isError || !data ? (
        <Alert severity="error">Failed to load tax settings.</Alert>
      ) : (
        <TaxForm key={formKey} initial={data} />
      )}
    </PageContainer>
  );
}