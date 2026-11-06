import { Box, Typography } from "@mui/material";

import type { Order } from "../types/order";

const COLORS = {
  done: "#2E7D32", // completed steps
  doneText: "#1B5E20",
  active: "#F59E0B", // step being worked on right now
  activeLight: "#FDE6B3",
  activeText: "#B45309",
  text: "#212121",
  muted: "#757575",
  track: "#E0E0E0",
  border: "#E0E0E0",
};

const STEPS = ["Confirmed", "Packed", "On the way", "Delivered"];

// How far along each active status is (0 = placed, waiting to be confirmed).
const RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  packed: 2,
  shipped: 3,
};

const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

function headline(order: Order): string {
  switch (order.orderStatus) {
    case "pending":
      return "Order placed. Waiting for the store to confirm.";
    case "confirmed":
      return "Confirmed. We're getting your order ready.";
    case "packed":
      return "Packed and ready for dispatch.";
    case "shipped": {
      const eta = order.estimatedDelivery?.toDate();
      return eta && isToday(eta)
        ? "On its way. Expected today."
        : "On its way to you.";
    }
    default:
      return "";
  }
}

const reducedMotion = "@media (prefers-reduced-motion: reduce)";

export default function OrderLiveTracker({ order }: { order: Order }) {
  const rank = RANK[order.orderStatus];

  // Hidden once the order is delivered, cancelled, returned, or unpaid.
  if (rank === undefined) return null;
  if (order.paymentMethod === "razorpay" && order.paymentStatus === "pending") {
    return null;
  }

  const updated = order.updatedAt
    ?.toDate()
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.25,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 8,
              height: 8,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: COLORS.done,
              "@keyframes swPulse": {
                "0%, 100%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.35, transform: "scale(1.5)" },
              },
              animation: "swPulse 1.6s ease-in-out infinite",
              [reducedMotion]: { animation: "none" },
            }}
          />
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: COLORS.doneText,
            }}
          >
            Live
          </Typography>
        </Box>

        {updated && (
          <Typography sx={{ fontSize: "0.72rem", color: COLORS.muted }}>
            Updated {updated}
          </Typography>
        )}
      </Box>

      <Typography
        sx={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.text, mb: 1.5 }}
      >
        {headline(order)}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.75 }}>
        {STEPS.map((label, i) => {
          const done = rank >= i + 1;
          const current = rank === i; // the step being worked on right now

          return (
            <Box key={label} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  height: current ? 8 : 6,
                  borderRadius: 4,
                  bgcolor: done
                    ? COLORS.done
                    : current
                      ? COLORS.activeLight
                      : COLORS.track,
                  ...(current && {
                    // A bright stripe sweeps across the bar so it is obvious
                    // that this step is still in progress.
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: "55%",
                      borderRadius: 4,
                      bgcolor: COLORS.active,
                      "@keyframes swSweep": {
                        "0%": { transform: "translateX(-100%)" },
                        "100%": { transform: "translateX(190%)" },
                      },
                      animation: "swSweep 1.3s ease-in-out infinite",
                    },
                    [reducedMotion]: {
                      bgcolor: COLORS.active,
                      "&::after": { display: "none" },
                    },
                  }),
                }}
              />

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  fontWeight: done || current ? 700 : 400,
                  color: done
                    ? COLORS.doneText
                    : current
                      ? COLORS.activeText
                      : COLORS.muted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </Typography>

              {/* Only the step being worked on gets this line. */}
              <Typography
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.68rem" },
                  fontWeight: 600,
                  color: COLORS.activeText,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  visibility: current ? "visible" : "hidden",
                }}
              >
                In progress
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}