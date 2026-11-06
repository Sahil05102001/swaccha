import { useState } from "react";
import {
  Button,
  Dialog,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { useCancelOrder } from "../hooks/useOrderActions";
import type { Order } from "../types/order";

const REASONS = [
  "Ordered by mistake",
  "Want to change the items or address",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Other",
];

const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  red: "#D32F2F",
};

const pill = {
  borderRadius: 999,
  py: 1.1,
  px: 3,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "none",
  whiteSpace: "nowrap",
} as const;

export default function CancelOrderButton({ order }: { order: Order }) {
  const { showSnackbar } = useSnackbar();
  const cancel = useCancelOrder(false);

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const eligible =
    ["pending", "confirmed", "packed"].includes(order.orderStatus) &&
    (order.paymentMethod === "cod" || order.paymentStatus === "paid");

  if (!eligible) return null;

  const online = order.paymentMethod !== "cod";

  const confirm = () =>
    cancel.mutate(
      { orderId: order.id, reason },
      {
        onSuccess: (message) => {
          showSnackbar(message, "success");
          setOpen(false);
        },
        onError: (e) =>
          showSnackbar(
            e instanceof Error ? e.message : "Could not cancel the order.",
            "error",
          ),
      },
    );

  return (
    <>
      <Button
        fullWidth
        disableRipple
        onClick={() => setOpen(true)}
        sx={{
          ...pill,
          color: COLORS.red,
          border: `1px solid ${COLORS.border}`,
          "&:hover": { borderColor: COLORS.red, bgcolor: COLORS.white },
        }}
      >
        Cancel order
      </Button>

      <Dialog
        open={open}
        onClose={cancel.isPending ? undefined : () => setOpen(false)}
        transitionDuration={0}
        slotProps={{
          paper: {
            sx: {
              m: 2,
              width: "100%",
              maxWidth: 400,
              p: 2.5,
              borderRadius: 3,
              boxShadow: "none",
              border: `1px solid ${COLORS.border}`,
              backgroundImage: "none",
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 700, color: COLORS.text }}>
          Cancel this order?
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: "0.875rem", color: COLORS.muted }}>
          {online
            ? `₹${order.totalAmount.toLocaleString("en-IN")} will be refunded to your original payment method in 5 to 7 working days.`
            : "Nothing has been paid, so there is nothing to refund."}{" "}
          Orders can't be cancelled once they ship.
        </Typography>

        <TextField
          select
          size="small"
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mt: 2 }}
        >
          {REASONS.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
          <Button
            fullWidth
            disableRipple
            disabled={cancel.isPending}
            onClick={() => setOpen(false)}
            sx={{ ...pill, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
          >
            Keep order
          </Button>
          <Button
            fullWidth
            disableRipple
            disableElevation
            variant="contained"
            disabled={cancel.isPending}
            onClick={confirm}
            sx={{
              ...pill,
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text },
              "&.Mui-disabled": { bgcolor: COLORS.border, color: COLORS.muted },
            }}
          >
            {cancel.isPending ? "Cancelling..." : "Yes, cancel"}
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}