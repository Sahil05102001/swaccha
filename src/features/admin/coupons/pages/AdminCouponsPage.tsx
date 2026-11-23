import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import AdminSelect from "@/features/admin/components/AdminSelect";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";

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

const isExpired = (c: AdminCoupon) =>
  !!c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();

const PAGE_SIZE = 10;

export default function AdminCouponsPage() {
  const { showSnackbar } = useSnackbar();
  const { data: coupons = [], isLoading, isError, refetch, isFetching } =
    useAdminCoupons();
  const save = useSaveCoupon();
  const remove = useDeleteCoupon();

  const contentRef = useRef<HTMLDivElement>(null);

  const [editing, setEditing] = useState<"new" | AdminCoupon | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<AdminCoupon | null>(null);
  const [page, setPage] = useState(0);

  const lastPage = Math.max(0, Math.ceil(coupons.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, lastPage);

  const visibleCoupons = coupons.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  const isNew = editing === "new";
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setForm(EMPTY);
    setFormError("");
    setEditing("new");
  };

  const openEdit = (c: AdminCoupon) => {
    setForm(fromCoupon(c));
    setFormError("");
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

  // `inDialog` is false for Pause/Resume, where there is no dialog to show an error in.
  const submit = (override?: FormState, creating = isNew, inDialog = true) => {
    save.mutate(
      { coupon: buildPayload(override ?? form), isNew: creating },
      {
        onSuccess: () => {
          showSnackbar("Coupon saved.", "success");
          setEditing(null);
          setFormError("");
          scrollToTop();
        },
        onError: (e) => {
          const message = e instanceof Error ? e.message : "Could not save.";

          if (inDialog) {
            setFormError(message);
            scrollToTop(contentRef.current);
          } else {
            showSnackbar(message, "error");
          }
        },
      },
    );
  };

  const togglePause = (c: AdminCoupon) =>
    submit({ ...fromCoupon(c), isActive: !c.isActive }, false, false);

  const confirmDelete = () => {
    if (!deleting) return;

    remove.mutate(deleting.code, {
      onSuccess: () => {
        showSnackbar("Coupon deleted.", "success");
        setDeleting(null);
      },
      onError: (e) =>
        showSnackbar(e instanceof Error ? e.message : "Could not delete.", "error"),
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Coupons"
        subtitle="Create discount codes and control who can use them."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>

            <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
              New coupon
            </Button>
          </Stack>
        }
      />

      <SectionCard>
        {isError ? (
          <Alert severity="error">Failed to load coupons.</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Offer</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    Min order
                  </TableCell>
                  <TableCell>Used</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Valid until
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  [0, 1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      {[0, 1, 2, 3, 4, 5, 6].map((cell) => (
                        <TableCell
                          key={cell}
                          sx={
                            cell === 2
                              ? { display: { xs: "none", md: "table-cell" } }
                              : cell === 4
                                ? { display: { xs: "none", sm: "table-cell" } }
                                : undefined
                          }
                        >
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        No coupons yet. Use “New coupon” to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleCoupons.map((c) => (
                    <TableRow key={c.code}>
                      <TableCell sx={{ fontWeight: 700 }}>{c.code}</TableCell>

                      <TableCell>
                        {offerLabel(c)}
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {[
                            c.firstOrderOnly && "First order",
                            c.paymentMethods !== "all" &&
                            (c.paymentMethods === "cod" ? "COD only" : "Online only"),
                            !c.showAtCheckout && "Hidden",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        ₹{c.minOrderValue}
                      </TableCell>

                      <TableCell>
                        {c.usedCount}
                        {c.usageLimit > 0 ? ` / ${c.usageLimit}` : ""}
                      </TableCell>

                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {c.expiresAt
                          ? new Date(c.expiresAt).toLocaleDateString("en-IN")
                          : "No expiry"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={isExpired(c) ? "Expired" : c.isActive ? "Active" : "Paused"}
                          color={!isExpired(c) && c.isActive ? "success" : "default"}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <Button size="small" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button size="small" onClick={() => togglePause(c)} disabled={save.isPending}>
                          {c.isActive ? "Pause" : "Resume"}
                        </Button>
                        <Button size="small" color="error" onClick={() => setDeleting(c)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!isError && coupons.length > PAGE_SIZE && (
          <TablePagination
            component="div"
            count={coupons.length}
            page={currentPage}
            onPageChange={(_, next) => setPage(next)}
            rowsPerPage={PAGE_SIZE}
            rowsPerPageOptions={[]}
          />
        )}
      </SectionCard>

      {/* New / edit */}
      <Dialog
        open={editing !== null}
        onClose={save.isPending ? undefined : () => setEditing(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isNew ? "New coupon" : `Edit ${form.code}`}</DialogTitle>

        <DialogContent ref={contentRef}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}

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

            <AdminSelect
              label="Type"
              value={form.type}
              onChange={(e) => set("type", e.target.value as CouponType)}
            >
              <MenuItem value="percent">Percent off</MenuItem>
              <MenuItem value="flat">Flat amount off</MenuItem>
              <MenuItem value="freeShipping">Free shipping</MenuItem>
            </AdminSelect>

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

            <AdminSelect
              label="Payment method"
              value={form.paymentMethods}
              onChange={(e) => set("paymentMethods", e.target.value as CouponPayments)}
            >
              <MenuItem value="all">Online and COD</MenuItem>
              <MenuItem value="online">Online payment only</MenuItem>
              <MenuItem value="cod">Cash on delivery only</MenuItem>
            </AdminSelect>

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
          <Button onClick={() => setEditing(null)} disabled={save.isPending}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => submit()} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save coupon"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={deleting !== null}
        onClose={remove.isPending ? undefined : () => setDeleting(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete coupon</DialogTitle>
        <DialogContent>
          <Typography>
            Delete coupon <strong>{deleting?.code}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleting(null)} disabled={remove.isPending}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>
            {remove.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}