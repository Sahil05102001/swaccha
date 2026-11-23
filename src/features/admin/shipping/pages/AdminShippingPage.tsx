import { useState } from "react";

import {
  Alert,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import AdminSelect from "@/features/admin/components/AdminSelect";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

import {
  useSaveShippingSettings,
  useShippingSettings,
} from "@/features/shipping/hooks/useShipping";
import {
  calculateShipping,
  type ShippingSettings,
} from "@/features/shipping/utils/shipping";

interface FormState {
  enabled: boolean;
  mode: "flat" | "distance";
  flatFee: string;
  slabs: { upToKm: string; fee: string }[];
  freeAbove: string;
  smallCartBelow: string;
  smallCartFee: string;
  distanceMultiplier: string;
}

const toForm = (s: ShippingSettings): FormState => ({
  enabled: s.enabled,
  mode: s.mode,
  flatFee: String(s.flatFee),
  slabs: s.slabs.map((x) => ({ upToKm: String(x.upToKm), fee: String(x.fee) })),
  freeAbove: String(s.freeAbove),
  smallCartBelow: String(s.smallCartBelow),
  smallCartFee: String(s.smallCartFee),
  distanceMultiplier: String(s.distanceMultiplier),
});

const toSettings = (f: FormState): ShippingSettings => ({
  enabled: f.enabled,
  mode: f.mode,
  flatFee: Number(f.flatFee),
  slabs: f.slabs.map((x) => ({ upToKm: Number(x.upToKm), fee: Number(x.fee) })),
  freeAbove: Number(f.freeAbove || 0),
  smallCartBelow: Number(f.smallCartBelow || 0),
  smallCartFee: Number(f.smallCartFee || 0),
  distanceMultiplier: Number(f.distanceMultiplier),
});

// An empty field counts as invalid, not as 0.
const num = (value: string) => (value.trim() === "" ? NaN : Number(value));

/** Returns why the form can't be saved, or null when it is fine. */
function validate(f: FormState): string | null {
  if (f.mode === "flat") {
    if (!(num(f.flatFee) >= 0)) {
      return "Enter a delivery fee of 0 or more.";
    }
  } else {
    if (!(num(f.distanceMultiplier) > 0)) {
      return "The distance multiplier must be greater than 0.";
    }

    let previous = 0;

    for (let i = 0; i < f.slabs.length; i++) {
      const upTo = num(f.slabs[i].upToKm);
      const fee = num(f.slabs[i].fee);

      if (!(upTo > previous)) {
        return i === 0
          ? "Slab 1 needs a distance above 0 km."
          : `Slab ${i + 1} must go further than slab ${i}. Keep slabs in order, shortest distance first.`;
      }

      if (!(fee >= 0)) {
        return `Enter a fee of 0 or more for slab ${i + 1}.`;
      }

      previous = upTo;
    }
  }

  const optional: [string, string][] = [
    ["Free delivery amount", f.freeAbove],
    ["Small cart amount", f.smallCartBelow],
    ["Small cart extra fee", f.smallCartFee],
  ];

  for (const [label, value] of optional) {
    if (value.trim() !== "" && !(Number(value) >= 0)) {
      return `${label} must be a number of 0 or more.`;
    }
  }

  return null;
}

function ShippingForm({ initial }: { initial: ShippingSettings }) {
  const { showSnackbar } = useSnackbar();
  const save = useSaveShippingSettings();

  const [form, setForm] = useState<FormState>(toForm(initial));
  const [testKm, setTestKm] = useState("4");
  const [testCart, setTestCart] = useState("300");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setSlab = (i: number, key: "upToKm" | "fee", value: string) =>
    setForm((prev) => ({
      ...prev,
      slabs: prev.slabs.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    }));

  const problem = validate(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(toForm(initial));
  const settings = toSettings(form);

  const testValid = num(testKm) >= 0 && num(testCart) >= 0;

  const multiplier =
    settings.distanceMultiplier > 0 ? settings.distanceMultiplier : 1;

  const result =
    !problem && testValid
      ? calculateShipping(settings, Number(testCart), Number(testKm) / multiplier)
      : null;

  const submit = () => {
    const toSave = toSettings(form);

    save.mutate(toSave, {
      onSuccess: () => {
        // Show the cleaned values, so "20.0" becomes "20" and nothing looks unsaved.
        setForm(toForm(toSave));
        showSnackbar("Shipping settings saved.", "success");
        scrollToTop();
      },
      onError: (e) =>
        showSnackbar(e instanceof Error ? e.message : "Could not save.", "error"),
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <SectionCard
          title="Delivery charges"
          subtitle="When switched off, every order has free delivery."
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
                form.enabled ? "Charging for delivery" : "Free delivery on all orders"
              }
            />

            <AdminSelect
              label="Pricing"
              value={form.mode}
              onChange={(e) => set("mode", e.target.value as "flat" | "distance")}
            >
              <MenuItem value="flat">Same fee for every order</MenuItem>
              <MenuItem value="distance">Based on distance</MenuItem>
            </AdminSelect>

            {form.mode === "flat" ? (
              <TextField
                label="Delivery fee (₹)"
                type="number"
                value={form.flatFee}
                onChange={(e) => set("flatFee", e.target.value)}
              />
            ) : (
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Distance slabs</Typography>

                {form.slabs.map((s, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <TextField
                      size="small"
                      label="Up to (km)"
                      type="number"
                      value={s.upToKm}
                      onChange={(e) => setSlab(i, "upToKm", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Fee (₹)"
                      type="number"
                      value={s.fee}
                      onChange={(e) => setSlab(i, "fee", e.target.value)}
                    />
                    <IconButton
                      aria-label="Remove slab"
                      disabled={form.slabs.length <= 1}
                      onClick={() =>
                        set(
                          "slabs",
                          form.slabs.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  size="small"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                  disabled={form.slabs.length >= 6}
                  onClick={() =>
                    set("slabs", [...form.slabs, { upToKm: "", fee: "" }])
                  }
                >
                  Add slab
                </Button>

                <Typography variant="caption" color="text.secondary">
                  Distances beyond the last slab use the last slab's fee.
                </Typography>

                <TextField
                  label="Distance multiplier"
                  type="number"
                  value={form.distanceMultiplier}
                  onChange={(e) => set("distanceMultiplier", e.target.value)}
                  helperText="Straight-line distance is multiplied by this to approximate road distance (1.3 is typical)."
                />
              </Stack>
            )}

            <TextField
              label="Free delivery on orders of (₹)"
              type="number"
              value={form.freeAbove}
              onChange={(e) => set("freeAbove", e.target.value)}
              helperText="0 = never free"
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Small cart: orders below (₹)"
                type="number"
                value={form.smallCartBelow}
                onChange={(e) => set("smallCartBelow", e.target.value)}
                helperText="0 = no small cart fee"
              />
              <TextField
                fullWidth
                label="Small cart extra fee (₹)"
                type="number"
                value={form.smallCartFee}
                onChange={(e) => set("smallCartFee", e.target.value)}
              />
            </Stack>

            {problem && dirty && <Alert severity="warning">{problem}</Alert>}

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={submit}
                disabled={!!problem || !dirty || save.isPending}
              >
                {save.isPending ? "Saving..." : "Save settings"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => setForm(toForm(initial))}
                disabled={!dirty || save.isPending}
              >
                Discard changes
              </Button>
            </Stack>
          </Stack>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <SectionCard
          title="Test calculator"
          subtitle="Try the current (unsaved) values. Nothing is saved or charged."
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Billed distance (km)"
              type="number"
              value={testKm}
              onChange={(e) => setTestKm(e.target.value)}
            />
            <TextField
              fullWidth
              label="Cart value (₹)"
              type="number"
              value={testCart}
              onChange={(e) => setTestCart(e.target.value)}
            />

            <Typography sx={{ fontWeight: 700 }}>
              {result
                ? result.fee === 0
                  ? "Delivery: Free"
                  : `Delivery fee: ₹${result.fee}`
                : "Check the values above."}
            </Typography>
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
}

export default function AdminShippingPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useShippingSettings();

  // Bumping this key rebuilds the form from the saved settings.
  const [formKey, setFormKey] = useState(0);

  const handleRefresh = async () => {
    await refetch();
    setFormKey((key) => key + 1);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Shipping"
        subtitle="Control delivery charges. They apply to new orders only."
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
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rounded" height={520} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rounded" height={260} />
          </Grid>
        </Grid>
      ) : isError || !data ? (
        <Alert severity="error">Failed to load shipping settings.</Alert>
      ) : (
        <ShippingForm key={formKey} initial={data} />
      )}
    </PageContainer>
  );
}