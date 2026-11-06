import { useState } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    FormControlLabel,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

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

    const settings = toSettings(form);
    const numbers = [
        settings.flatFee,
        settings.freeAbove,
        settings.smallCartBelow,
        settings.smallCartFee,
        settings.distanceMultiplier,
        Number(testKm),
        Number(testCart),
        ...settings.slabs.flatMap((s) => [s.upToKm, s.fee]),
    ];
    const valid = numbers.every((n) => Number.isFinite(n));

    const result = valid
        ? calculateShipping(settings, Number(testCart), Number(testKm) / settings.distanceMultiplier)
        : null;

    const submit = () =>
        save.mutate(settings, {
            onSuccess: () => showSnackbar("Shipping settings saved.", "success"),
            onError: (e) =>
                showSnackbar(e instanceof Error ? e.message : "Could not save.", "error"),
        });

    return (
        <Stack spacing={3}>
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
                        label={form.enabled ? "Charging for delivery" : "Free delivery on all orders"}
                    />

                    <TextField
                        select
                        label="Pricing"
                        value={form.mode}
                        onChange={(e) => set("mode", e.target.value as "flat" | "distance")}
                    >
                        <MenuItem value="flat">Same fee for every order</MenuItem>
                        <MenuItem value="distance">Based on distance</MenuItem>
                    </TextField>

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
                                <Stack key={i} direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
                                            set("slabs", form.slabs.filter((_, idx) => idx !== i))
                                        }
                                    >
                                        <DeleteOutlinedIcon />
                                    </IconButton>
                                </Stack>
                            ))}
                            <Button
                                size="small"
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

                    <Button
                        variant="contained"
                        onClick={submit}
                        disabled={!valid || save.isPending}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        {save.isPending ? "Saving..." : "Save settings"}
                    </Button>
                </Stack>
            </SectionCard>

            <SectionCard
                title="Test calculator"
                subtitle="Try the current (unsaved) values. Nothing is saved or charged."
            >
                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                    </Stack>

                    <Typography sx={{ fontWeight: 700 }}>
                        {result
                            ? result.fee === 0
                                ? "Delivery: Free"
                                : `Delivery fee: ₹${result.fee}`
                            : "Check the values above."}
                    </Typography>
                </Stack>
            </SectionCard>
        </Stack>
    );
}

export default function AdminShippingPage() {
    const { data, isLoading, isError } = useShippingSettings();

    return (
        <PageContainer>
            <PageHeader
                title="Shipping"
                subtitle="Control delivery charges. They apply to new orders only."
            />

            {isLoading ? (
                <CircularProgress />
            ) : isError || !data ? (
                <Alert severity="error">Failed to load shipping settings.</Alert>
            ) : (
                <ShippingForm initial={data} />
            )}
        </PageContainer>
    );
}