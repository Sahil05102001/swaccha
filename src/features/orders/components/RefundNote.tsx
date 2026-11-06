import { Box, Typography } from "@mui/material";

import type { Order } from "../types/order";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const SUPPORT_EMAIL = "swachha.business@gmail.com";

export default function RefundNote({ order }: { order: Order }) {
  const refunds = (order.refunds ?? []).filter((r) => r.status !== "failed");

  const total = (list: typeof refunds) =>
    list.reduce((sum, r) => sum + Math.round(r.amount * 100), 0) / 100;

  const online = refunds.filter((r) => r.source !== "manual");
  const manual = refunds.filter((r) => r.source === "manual");

  const lines: string[] = [];

  if (online.length > 0) {
    const allSent = online.every((r) => r.status === "processed");
    lines.push(
      allSent
        ? `Your refund of ${rupees(total(online))} has been sent to your original payment method. It can take 5 to 7 working days to show in your account. If you haven't received it by then, write to ${SUPPORT_EMAIL}.`
        : `Your refund of ${rupees(total(online))} is being processed. You should receive it in 5 to 7 working days. If you haven't, write to ${SUPPORT_EMAIL}.`,
    );
  }

  if (manual.length > 0) {
    lines.push(`${rupees(total(manual))} was refunded to you by Swachha.`);
  }

  if (order.refundRequired) {
    lines.push(
      `We are arranging your refund and will update you soon. Questions? Write to ${SUPPORT_EMAIL}.`,
    );
  }

  if (lines.length === 0) return null;

  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      {lines.map((line) => (
        <Typography key={line} sx={{ fontSize: "0.85rem", color: "#212121" }}>
          {line}
        </Typography>
      ))}
    </Box>
  );
}