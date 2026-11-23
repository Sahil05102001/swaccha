import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { Order, OrderStatus } from "@/features/orders/types/order";
import { useSnackbar } from "@/contexts/SnackbarContext";

import { useUpdateAdminOrder } from "../hooks/useUpdateAdminOrder";
import UpdateOrderStatus from "./UpdateOrderStatus";
import { SectionTitle } from "./OrderSection";

interface OrderActionsProps {
  order: Order;
  onSaved?: () => void;
}

// The only step an order can take from each status.
const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed"],
  confirmed: ["packed"],
  packed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  returned: [],
  cancelled: [],
};

type ShippingErrors = Partial<
  Record<
    "trackingNumber" | "deliveryPersonName" | "deliveryPersonPhone" | "estimatedDelivery",
    string
  >
>;

// Local calendar date as YYYY-MM-DD (toISOString would shift it for IST).
function todayLocal() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function dateInput(order: Order) {
  return order.estimatedDelivery
    ? order.estimatedDelivery.toDate().toISOString().split("T")[0]
    : "";
}

// Random reference for in-house deliveries. Replace it for courier / Porter.
function generateDispatchReference() {
  return `DSP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function cleanPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits;
}

function lockReason(order: Order) {
  if (order.paymentStatus === "refunded") return "refunded";
  if (order.orderStatus === "delivered") return "delivered";
  if (order.orderStatus === "cancelled") return "cancelled";
  if (order.orderStatus === "returned") return "returned";
  return "";
}

export default function OrderActions({ order, onSaved }: OrderActionsProps) {
  const { showSnackbar } = useSnackbar();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [deliveryPersonName, setDeliveryPersonName] = useState(
    order.deliveryPersonName ?? "",
  );
  const [deliveryPersonPhone, setDeliveryPersonPhone] = useState(
    order.deliveryPersonPhone ?? "",
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState(dateInput(order));
  const [notes, setNotes] = useState(order.notes ?? "");

  const [errors, setErrors] = useState<ShippingErrors>({});
  const [codDialogOpen, setCodDialogOpen] = useState(false);

  const { mutate, isPending } = useUpdateAdminOrder();

  const resetToOrder = () => {
    setOrderStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber ?? "");
    setDeliveryPersonName(order.deliveryPersonName ?? "");
    setDeliveryPersonPhone(order.deliveryPersonPhone ?? "");
    setEstimatedDelivery(dateInput(order));
    setNotes(order.notes ?? "");
    setErrors({});
  };

  // Reset only when a different order is shown or this order was really
  // updated, so a background refetch never wipes what the admin is typing.
  useEffect(() => {
    resetToOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id, order.updatedAt?.toMillis?.()]);

  const statusOptions = useMemo(
    () => [order.orderStatus, ...NEXT_STATUS[order.orderStatus]],
    [order.orderStatus],
  );

  const reason = lockReason(order);
  const locked = reason !== "";

  const shippingRequired = !locked && orderStatus === "shipped";

  const hasDispatchInfo =
    !!order.trackingNumber ||
    !!order.deliveryPersonName ||
    !!order.deliveryPersonPhone ||
    !!order.estimatedDelivery;

  // While open: only once shipping starts. When locked: only if something was saved.
  const showShippingSections = locked
    ? hasDispatchInfo
    : orderStatus === "shipped" || orderStatus === "delivered";

  const fieldsDisabled = isPending || locked;

  const isCod = order.paymentMethod === "cod";
  const needsCodConfirmation =
    isCod && orderStatus === "delivered" && order.orderStatus !== "delivered";

  const hasChanges = locked
    ? notes !== (order.notes ?? "")
    : orderStatus !== order.orderStatus ||
      trackingNumber !== (order.trackingNumber ?? "") ||
      deliveryPersonName !== (order.deliveryPersonName ?? "") ||
      deliveryPersonPhone !== (order.deliveryPersonPhone ?? "") ||
      estimatedDelivery !== dateInput(order) ||
      notes !== (order.notes ?? "");

  const clearError = (key: keyof ShippingErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleStatusChange = (status: OrderStatus) => {
    setOrderStatus(status);

    // Pre-fill what the admin would otherwise have to type.
    if (status === "shipped") {
      setTrackingNumber((current) => current || generateDispatchReference());
      setEstimatedDelivery((current) => current || todayLocal());
    }
  };

  const validateShipping = () => {
    const next: ShippingErrors = {};

    if (!trackingNumber.trim()) {
      next.trackingNumber = "Dispatch reference is required";
    }
    if (!deliveryPersonName.trim()) {
      next.deliveryPersonName = "Delivery person name is required";
    }
    if (!deliveryPersonPhone.trim()) {
      next.deliveryPersonPhone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone(deliveryPersonPhone))) {
      next.deliveryPersonPhone = "Enter a valid 10-digit mobile number";
    }
    if (!estimatedDelivery) {
      next.estimatedDelivery = "Expected delivery date is required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (codCollected: boolean) => {
    // A finished order only ever saves its notes.
    const payload = locked
      ? { orderId: order.id, notes: notes.trim() }
      : {
          orderId: order.id,
          orderStatus,
          trackingNumber: trackingNumber.trim(),
          deliveryPersonName: deliveryPersonName.trim(),
          deliveryPersonPhone: deliveryPersonPhone.trim()
            ? cleanPhone(deliveryPersonPhone)
            : "",
          estimatedDelivery: estimatedDelivery
            ? new Date(estimatedDelivery)
            : undefined,
          notes: notes.trim(),
          ...(codCollected ? { codPaymentCollected: true } : {}),
        };

    mutate(payload, {
      onSuccess: () => onSaved?.(),
      onSettled: () => setCodDialogOpen(false),
    });
  };

  const handleSave = () => {
    if (isPending) return;
    if (shippingRequired && !validateShipping()) return;

    if (needsCodConfirmation) {
      setCodDialogOpen(true);
      return;
    }

    submit(false);
  };

  const handleCodNotCollected = () => {
    setCodDialogOpen(false);
    // Nothing is saved: the status goes back to what it was.
    setOrderStatus(order.orderStatus);
    showSnackbar(
      "Order status was not changed because the payment was not collected.",
      "warning",
    );
  };

  return (
    <Stack spacing={3}>
      <SectionTitle>Order management</SectionTitle>

      {locked && (
        <Alert severity="info">
          This order is {reason}, so its status and dispatch and delivery
          details are locked. You can still edit the internal notes.
        </Alert>
      )}

      <UpdateOrderStatus
        value={orderStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        options={statusOptions}
      />

      {showShippingSections && (
        <>
          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Dispatch and delivery
            </Typography>

            <TextField
              fullWidth
              required={shippingRequired}
              label="Dispatch Reference"
              placeholder="Enter dispatch reference"
              value={trackingNumber}
              onChange={(event) => {
                setTrackingNumber(event.target.value);
                clearError("trackingNumber");
              }}
              error={!!errors.trackingNumber}
              helperText={
                errors.trackingNumber ||
                (shippingRequired
                  ? "Auto-generated for in-house delivery. Replace it with the courier or Porter reference if you use one."
                  : undefined)
              }
              disabled={fieldsDisabled}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required={shippingRequired}
                  label="Delivery Person Name"
                  value={deliveryPersonName}
                  onChange={(event) => {
                    setDeliveryPersonName(event.target.value);
                    clearError("deliveryPersonName");
                  }}
                  error={!!errors.deliveryPersonName}
                  helperText={errors.deliveryPersonName}
                  disabled={fieldsDisabled}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required={shippingRequired}
                  label="Delivery Person Phone"
                  value={deliveryPersonPhone}
                  onChange={(event) => {
                    setDeliveryPersonPhone(event.target.value);
                    clearError("deliveryPersonPhone");
                  }}
                  error={!!errors.deliveryPersonPhone}
                  helperText={errors.deliveryPersonPhone}
                  disabled={fieldsDisabled}
                  slotProps={{ htmlInput: { inputMode: "tel" } }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              required={shippingRequired}
              type="date"
              label="Expected Delivery Date"
              value={estimatedDelivery}
              onChange={(event) => {
                setEstimatedDelivery(event.target.value);
                clearError("estimatedDelivery");
              }}
              error={!!errors.estimatedDelivery}
              helperText={
                errors.estimatedDelivery ||
                (shippingRequired
                  ? "Defaults to today. Change it if the order was placed outside working hours."
                  : undefined)
              }
              slotProps={{ inputLabel: { shrink: true } }}
              disabled={fieldsDisabled}
            />
          </Stack>
        </>
      )}

      <Divider />

      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Internal Notes
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Notes"
          helperText="Only you can see these. Customers never do."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={isPending}
        />
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
        >
          {isPending ? "Saving..." : locked ? "Save Notes" : "Save Changes"}
        </Button>
        <Button
          variant="outlined"
          onClick={resetToOrder}
          disabled={!hasChanges || isPending}
        >
          Discard
        </Button>
      </Stack>

      {/* COD cash confirmation */}
      <Dialog
        open={codDialogOpen}
        onClose={isPending ? undefined : handleCodNotCollected}
        maxWidth="xs"
        fullWidth
        transitionDuration={0}
      >
        <DialogTitle>Cash payment collected?</DialogTitle>

        <DialogContent>
          <Stack spacing={1.5}>
            <Typography variant="body2">
              This is a cash on delivery order. Call the delivery person and
              confirm they collected{" "}
              <strong>
                ₹
                {order.totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>{" "}
              from the customer before marking it delivered.
            </Typography>

            {(order.deliveryPersonName || order.deliveryPersonPhone) && (
              <Typography variant="body2" color="text.secondary">
                Delivery person: {order.deliveryPersonName ?? "—"}
                {order.deliveryPersonPhone ? ` · ${order.deliveryPersonPhone}` : ""}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCodNotCollected} disabled={isPending}>
            No, not collected
          </Button>
          <Button
            variant="contained"
            onClick={() => submit(true)}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Yes, collected"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}