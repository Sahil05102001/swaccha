import { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  useCancelOrder,
  useRefundOrder,
} from "@/features/orders/hooks/useOrderActions";
import type { Order } from "@/features/orders/types/order";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type Confirm = "refund" | "cancel" | "retry" | null;

export default function OrderRefundPanel({ order }: { order: Order }) {
  const { showSnackbar } = useSnackbar();
  const refund = useRefundOrder();
  const cancel = useCancelOrder(true);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [restock, setRestock] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [confirm, setConfirm] = useState<Confirm>(null);

  const status = order.orderStatus;
  const refunds = order.refunds ?? [];
  const online = order.paymentMethod === "razorpay";

  const paidPaise = Math.round(order.totalAmount * 100);
  const activePaise = refunds
    .filter((r) => r.status !== "failed")
    .reduce((t, r) => t + Math.round(r.amount * 100), 0);
  const remaining = (paidPaise - activePaise) / 100;

  // What the admin can do depends on where the order is.
  const canCancel =
    ["pending", "confirmed", "packed", "shipped"].includes(status) &&
    (!online || order.paymentStatus === "paid");

  const canRefund =
    status === "delivered" &&
    ["paid", "partially_refunded"].includes(order.paymentStatus) &&
    remaining > 0;

  const canRetry =
    (status === "cancelled" || status === "returned") &&
    online &&
    order.refundRequired === true &&
    remaining > 0;

  const amountNumber = amount.trim() === "" ? remaining : Number(amount);
  const amountValid =
    Number.isFinite(amountNumber) && amountNumber >= 1 && amountNumber <= remaining;
  const isFull =
    amountValid && Math.round(amountNumber * 100) === Math.round(remaining * 100);

  const done = (message: string) => {
    showSnackbar(message, "success");
    setConfirm(null);
    setAmount("");
    setReason("");
    setCancelReason("");
    setRestock(false);
  };

  const fail = (e: unknown) => {
    setConfirm(null);
    showSnackbar(e instanceof Error ? e.message : "Something went wrong.", "error");
  };

  if (!canCancel && !canRefund && !canRetry && refunds.length === 0 && !order.cancelledAt) {
    return null;
  }

  const busy = refund.isPending || cancel.isPending;

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Cancellation and Refunds
      </Typography>

      {order.refundRequired && (
        <Alert severity="warning">
          The customer paid online but has not been fully refunded
          {canRetry ? ". Use Retry refund below." : "."}
        </Alert>
      )}

      {order.cancelledAt && (
        <Typography variant="body2" color="text.secondary">
          Cancelled by {order.cancelledBy ?? "unknown"} on{" "}
          {order.cancelledAt.toDate().toLocaleString("en-IN")}
          {order.cancelReason ? `. Reason: ${order.cancelReason}` : ""}
        </Typography>
      )}

      {status === "returned" && order.returnedAt && (
        <Typography variant="body2" color="text.secondary">
          Returned on {order.returnedAt.toDate().toLocaleString("en-IN")}
          {order.returnStockRestored ? ". Stock was added back." : "."}
        </Typography>
      )}

      {refunds.length > 0 && (
        <Stack spacing={0.75}>
          {refunds.map((r) => (
            <Typography key={r.id} variant="body2">
              {rupees(r.amount)} ·{" "}
              <strong>
                {r.status === "processed"
                  ? r.source === "manual"
                    ? "Refunded (paid back by hand)"
                    : "Refunded"
                  : r.status === "failed"
                    ? "Failed"
                    : "In progress"}
              </strong>{" "}
              · {r.reason} · {r.createdAt.toDate().toLocaleDateString("en-IN")}
              {r.status === "failed" && r.failureReason
                ? ` (${r.failureReason})`
                : ""}
            </Typography>
          ))}
        </Stack>
      )}

      {/* Before delivery: cancelling is the only way, and it refunds by itself */}
      {canCancel && (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Cancelling puts the stock back
            {online
              ? ` and automatically refunds the full ${rupees(order.totalAmount)} to the customer.`
              : ". This is a cash on delivery order, so nothing needs refunding."}
            {status === "shipped" &&
              " The parcel is out for delivery, so make sure it comes back to the shop."}
          </Typography>

          <TextField
            size="small"
            fullWidth
            label="Cancellation reason (required)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 300 } }}
          />

          <Button
            color="error"
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
            disabled={cancelReason.trim().length < 3 || busy}
            onClick={() => setConfirm("cancel")}
          >
            {online ? "Cancel and refund" : "Cancel order"}
          </Button>
        </Stack>
      )}

      {/* After delivery: full or partial refund */}
      {canRefund && (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Up to {rupees(remaining)} can still be refunded. Leave the amount
            empty for a full refund, which marks the order as Returned. A
            partial refund keeps it Delivered.{" "}
            {online
              ? "The money goes to the customer's original payment method."
              : "This is a cash on delivery order. This only records the refund, so pay the customer back yourself."}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              size="small"
              type="number"
              label={`Amount (max ${rupees(remaining)})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={amount !== "" && !amountValid}
              sx={{ minWidth: 200 }}
            />
            <TextField
              size="small"
              fullWidth
              label="Reason (required)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 300 } }}
            />
          </Stack>

          {isFull && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={restock}
                  onChange={(e) => setRestock(e.target.checked)}
                />
              }
              label="Items came back in good condition, add the stock back"
            />
          )}

          <Button
            variant="contained"
            sx={{ alignSelf: "flex-start" }}
            disabled={!amountValid || reason.trim().length < 3 || busy}
            onClick={() => setConfirm("refund")}
          >
            {isFull ? "Refund in full and mark returned" : `Refund ${rupees(amountValid ? amountNumber : 0)}`}
          </Button>
        </Stack>
      )}

      {/* After a failed refund on a cancelled or returned order */}
      {canRetry && (
        <Button
          variant="contained"
          sx={{ alignSelf: "flex-start" }}
          disabled={busy}
          onClick={() => setConfirm("retry")}
        >
          Retry refund of {rupees(remaining)}
        </Button>
      )}

      {/* Confirmations */}
      <Dialog open={confirm === "refund"} onClose={() => setConfirm(null)}>
        <DialogTitle>Confirm refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Refund {rupees(amountNumber)} for this order
            {isFull ? " and mark it as Returned" : ""}? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirm(null)} disabled={busy}>
            Back
          </Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() =>
              refund.mutate(
                {
                  orderId: order.id,
                  amount: amount.trim() === "" ? undefined : amountNumber,
                  reason,
                  restock: isFull && restock,
                },
                { onSuccess: done, onError: fail },
              )
            }
          >
            {refund.isPending ? "Refunding..." : "Yes, refund"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirm === "retry"} onClose={() => setConfirm(null)}>
        <DialogTitle>Retry refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Try refunding {rupees(remaining)} to the customer again?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirm(null)} disabled={busy}>
            Back
          </Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() =>
              refund.mutate(
                { orderId: order.id, reason: "Retry after failed refund" },
                { onSuccess: done, onError: fail },
              )
            }
          >
            {refund.isPending ? "Refunding..." : "Retry"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirm === "cancel"} onClose={() => setConfirm(null)}>
        <DialogTitle>Cancel this order?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            The order will be cancelled
            {online ? ` and ${rupees(order.totalAmount)} refunded to the customer` : ""}.
            This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirm(null)} disabled={busy}>
            Back
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={busy}
            onClick={() =>
              cancel.mutate(
                { orderId: order.id, reason: cancelReason },
                { onSuccess: done, onError: fail },
              )
            }
          >
            {cancel.isPending ? "Cancelling..." : "Yes, cancel order"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}