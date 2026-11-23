import { useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import { useAvailableCoupons } from "@/features/coupons/hooks/useCoupons";
import type { CheckoutOffer } from "@/features/coupons/services/couponService";

const COLORS = {
  blue: "#00DDEB",
  ink: "#111111",
  muted: "#68777A",
  panelBg: "#EAFBFE",
  teal: "#0891B2",
};

const VISIBLE_COUNT = 3;

const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function offerText(offer: CheckoutOffer) {
  if (offer.type === "freeShipping") return "Free delivery";
  if (offer.type === "flat") return `${rupees(offer.value)} off`;

  return `${offer.value}% off${
    offer.maxDiscount > 0 ? ` up to ${rupees(offer.maxDiscount)}` : ""
  }`;
}

function conditions(offer: CheckoutOffer) {
  const parts: string[] = [];

  if (offer.minOrderValue > 0) {
    parts.push(`Above ${rupees(offer.minOrderValue)}`);
  }
  if (offer.paymentMethods === "online") parts.push("Online payment");
  if (offer.paymentMethods === "cod") parts.push("Cash on delivery");
  if (offer.firstOrderOnly) parts.push("First order");

  return parts.join(" · ");
}

export default function ProductCoupons() {
  const { data: offers = [] } = useAvailableCoupons(true);

  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  if (offers.length === 0) {
    return null;
  }

  const hasMore = offers.length > VISIBLE_COUNT;
  const shown = expanded ? offers : offers.slice(0, VISIBLE_COUNT);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(""), 1500);
    } catch {
      // Clipboard can be blocked; the code is still visible to type.
    }
  };

  const renderTile = (offer: CheckoutOffer) => {
    const detail = conditions(offer) || offer.description;

    return (
      <Box
        key={offer.code}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          height: "100%",
          px: 1.25,
          py: 0.9,
          borderRadius: "8px",
          border: `1px dashed ${COLORS.blue}`,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              columnGap: 0.75,
            }}
          >
            <Typography
              component="span"
              sx={{
                color: COLORS.ink,
                fontSize: "0.82rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {offer.code}
            </Typography>

            <Typography
              component="span"
              sx={{
                color: COLORS.teal,
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              {offerText(offer)}
            </Typography>
          </Box>

          {detail && (
            <Typography
              noWrap
              title={detail}
              sx={{ color: COLORS.muted, fontSize: "0.7rem", lineHeight: 1.3 }}
            >
              {detail}
            </Typography>
          )}
        </Box>

        <Button
          onClick={() => copyCode(offer.code)}
          disableRipple
          sx={{
            flexShrink: 0,
            minWidth: 0,
            p: 0,
            color: COLORS.teal,
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          {copiedCode === offer.code ? "Copied" : "Copy"}
        </Button>
      </Box>
    );
  };

  return (
    <Box
      component="section"
      aria-label="Available coupons"
      sx={{
        mt: { xs: 1.5, sm: 2 },
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: "12px",
        border: `1px solid ${COLORS.blue}`,
        backgroundColor: COLORS.panelBg,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          columnGap: 1,
          mb: 1,
        }}
      >
        <Typography
          component="h2"
          sx={{ color: COLORS.ink, fontSize: "0.95rem", fontWeight: 800 }}
        >
          Available coupons
        </Typography>

        <Typography sx={{ color: COLORS.muted, fontSize: "0.72rem" }}>
          Apply these at checkout. Copy the code and enter it there.
        </Typography>
      </Box>

      {expanded ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 1,
          }}
        >
          {shown.map(renderTile)}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& > *": {
              flex: {
                xs: "0 0 78%",
                sm: "0 0 calc((100% - 8px) / 2)",
                md: "0 0 calc((100% - 16px) / 3)",
              },
              minWidth: 0,
              scrollSnapAlign: "start",
            },
          }}
        >
          {shown.map(renderTile)}
        </Box>
      )}

      {hasMore && (
        <Button
          onClick={() => setExpanded((current) => !current)}
          disableRipple
          sx={{
            mt: 1,
            p: 0,
            minWidth: 0,
            color: COLORS.teal,
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "none",
            textDecoration: "underline",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {expanded ? "View less" : `View all ${offers.length} coupons`}
        </Button>
      )}
    </Box>
  );
}