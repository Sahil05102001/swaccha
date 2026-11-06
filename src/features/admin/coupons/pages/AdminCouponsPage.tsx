import { useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import {
  useAdminCoupons,
  useDeleteCoupon,
  useSaveCoupon,
} from "@/features/coupons/hooks/useCoupons";
import type {
  AdminCoupon,
  CouponPayments,
  CouponType,
} from "@/features/coupons/services/couponService";

interface FormState {
  code: string;
  description: string;
  type: CouponType;
  value: string;
  maxDiscount: string;
  minOrderValue: string;
  startsAt: string;
  expiresAt: string;
  usageLimit: string;
  perUserLimit: string;
  paymentMethods: CouponPayments;
  firstOrderOnly: boolean;
  showAtCheckout: boolean;
  isActive: boolean;
}

const EMPTY: FormState = {
  code: "",
  description: "",
  type: "percent",
  value: "",
  maxDiscount: "",
  minOrderValue: "0",
  startsAt: "",
  expiresAt: "",
  usageLimit: "0",
  perUserLimit: "1",
  paymentMethods: "all",
  firstOrderOnly: false,
  showAtCheckout: true,
  isActive: true,
};

const toLocalDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const fromCoupon = (c: AdminCoupon): FormState => ({
  code: c.code,
  description: c.description,
  type: c.type,
  value: String(c.value),
  maxDiscount: c.maxDiscount ? String(c.maxDiscount) : "",
  minOrderValue: String(c.minOrderValue),
  startsAt: toLocalDate(c.startsAt),
  expiresAt: toLocalDate(c.expiresAt),
  usageLimit: String(c.usageLimit),
  perUserLimit: String(c.perUserLimit),
  paymentMethods: c.paymentMethods,
  firstOrderOnly: c.firstOrderOnly,
  showAtCheckout: c.showAtCheckout,
  isActive: c.isActive,
});

const offerLabel = (c: AdminCoupon) =>
  c.type === "freeShipping"
    ? "Free shipping"
    : c.type === "flat"
      ? `₹${c.value} off`
      : `${c.value}% off${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ""}`;

export default function AdminCouponsPage() {
  const { showSnackbar } = useSnackbar();
  const { data: coupons = [], isLoading, isError } = useAdminCoupons();
  const save = useSaveCoupon();
  const remove = useDeleteCoupon();

  const [editing, setEditing] = useState<"new" | AdminCoupon | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const isNew = editing === "new";
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
  };

  const openEdit = (c: AdminCoupon) => {
    setForm(fromCoupon(c));
    setEditing(c);
  };

  const buildPayload = (f: FormState) => ({
    code: f.code.trim().toUpperCase(),
    description: f.description.trim(),
    type: f.type,
    value: f.type === "freeShipping" ? 0 : Number(f.value),
    maxDiscount: f.type === "percent" ? Number(f.maxDiscount || 0) : 0,
    minOrderValue: Number(f.minOrderValue || 0),
    startsAt: f.startsAt ? new Date(`${f.startsAt}T00:00:00`).toISOString() : null,
    expiresAt: f.expiresAt ? new Date(`${f.expiresAt}T23:59:59`).toISOString() : null,
    usageLimit: Number(f.usageLimit || 0),
    perUserLimit: Number(f.perUserLimit || 1),
    paymentMethods: f.paymentMethods,
    firstOrderOnly: f.firstOrderOnly,
    showAtCheckout: f.showAtCheckout,
    isActive: f.isActive,
  });

  const submit = (override?: FormState, creating = isNew) => {
    save.mutate(
      { coupon: buildPayload(override ?? form), isNew: creating },
      {
        onSuccess: () => {
          showSnackbar("Coupon saved.", "success");
          setEditing(null);
        },
        onError: (e) =>
          showSnackbar(e instanceof Error ? e.message : "Could not save.", "error"),
      },
    );
  };

  const togglePause = (c: AdminCoupon) =>
    submit({ ...fromCoupon(c), isActive: !c.isActive }, false);

  const handleDelete = (c: AdminCoupon) => {
    if (!window.confirm(`Delete coupon ${c.code}? This cannot be undone.`)) return;
    remove.mutate(c.code, {
      onSuccess: () => showSnackbar("Coupon deleted.", "success"),
      onError: (e) =>
        showSnackbar(e instanceof Error ? e.message : "Could not delete.", "error"),
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Coupons"
        subtitle="Create discount codes and control who can use them."
      />

      <SectionCard>
        <Stack spacing={2}>
          <Button variant="contained" onClick={openNew} sx={{ alignSelf: "flex-start" }}>
            New coupon
          </Button>

          {isLoading ? (
            <CircularProgress />
          ) : isError ? (
            <Alert severity="error">Failed to load coupons.</Alert>
          ) : coupons.length === 0 ? (
            <Typography color="text.secondary">No coupons yet.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Offer</TableCell>
                    <TableCell>Min order</TableCell>
                    <TableCell>Used</TableCell>
                    <TableCell>Valid until</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupons.map((c) => (
                    <TableRow key={c.code} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{c.code}</TableCell>
                      <TableCell>
                        {offerLabel(c)}
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {[
                            c.firstOrderOnly && "First order",
                            c.paymentMethods !== "all" && (c.paymentMethods === "cod" ? "COD only" : "Online only"),
                            !c.showAtCheckout && "Hidden",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </Typography>
                      </TableCell>
                      <TableCell>₹{c.minOrderValue}</TableCell>
                      <TableCell>
                        {c.usedCount}
                        {c.usageLimit > 0 ? ` / ${c.usageLimit}` : ""}
                      </TableCell>
                      <TableCell>
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "No expiry"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={c.isActive ? "Active" : "Paused"}
                          color={c.isActive ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <Button size="small" onClick={() => openEdit(c)}>Edit</Button>
                        <Button size="small" onClick={() => togglePause(c)} disabled={save.isPending}>
                          {c.isActive ? "Pause" : "Resume"}
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDelete(c)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </SectionCard>

      <Dialog open={editing !== null} onClose={save.isPending ? undefined : () => setEditing(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{isNew ? "New coupon" : `Edit ${form.code}`}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Code"
              value={form.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              disabled={!isNew}
              helperText="3 to 20 letters, numbers, - or _. Cannot be changed later."
              slotProps={{ htmlInput: { maxLength: 20 } }}
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              helperText="Shown to customers, e.g. 10% off on orders above ₹499"
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />

            <TextField select label="Type" value={form.type} onChange={(e) => set("type", e.target.value as CouponType)}>
              <MenuItem value="percent">Percent off</MenuItem>
              <MenuItem value="flat">Flat amount off</MenuItem>
              <MenuItem value="freeShipping">Free shipping</MenuItem>
            </TextField>

            {form.type !== "freeShipping" && (
              <TextField
                label={form.type === "percent" ? "Percentage (1 to 100)" : "Amount (₹)"}
                type="number"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
              />
            )}
            {form.type === "percent" && (
              <TextField
                label="Maximum discount (₹, optional)"
                type="number"
                value={form.maxDiscount}
                onChange={(e) => set("maxDiscount", e.target.value)}
                helperText="Leave empty for no cap"
              />
            )}

            <TextField
              label="Minimum order value (₹)"
              type="number"
              value={form.minOrderValue}
              onChange={(e) => set("minOrderValue", e.target.value)}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                type="date"
                label="Starts on (optional)"
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                type="date"
                label="Ends on (optional)"
                value={form.expiresAt}
                onChange={(e) => set("expiresAt", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Total uses (0 = unlimited)"
                type="number"
                value={form.usageLimit}
                onChange={(e) => set("usageLimit", e.target.value)}
              />
              <TextField
                fullWidth
                label="Uses per customer"
                type="number"
                value={form.perUserLimit}
                onChange={(e) => set("perUserLimit", e.target.value)}
              />
            </Stack>

            <TextField
              select
              label="Payment method"
              value={form.paymentMethods}
              onChange={(e) => set("paymentMethods", e.target.value as CouponPayments)}
            >
              <MenuItem value="all">Online and COD</MenuItem>
              <MenuItem value="online">Online payment only</MenuItem>
              <MenuItem value="cod">Cash on delivery only</MenuItem>
            </TextField>

            <FormControlLabel
              control={<Switch checked={form.firstOrderOnly} onChange={(e) => set("firstOrderOnly", e.target.checked)} />}
              label="First order only"
            />
            <FormControlLabel
              control={<Switch checked={form.showAtCheckout} onChange={(e) => set("showAtCheckout", e.target.checked)} />}
              label="Show in the offers list at checkout"
            />
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />}
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditing(null)} disabled={save.isPending}>Cancel</Button>
          <Button variant="contained" onClick={() => submit()} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save coupon"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}