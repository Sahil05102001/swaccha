import { useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import { useExclusiveOffers } from "@/features/admin/exclusiveOffers/hooks/useExclusiveOffers";

const COLORS = {
  blue: "#00DDEB",
  ink: "#111111",
  muted: "#68777A",
  panelBg: "#EAFBFE",
  teal: "#0891B2",
};

const VISIBLE_COUNT = 2;

export default function ExclusiveOffers() {
  const { data } = useExclusiveOffers();
  const [expanded, setExpanded] = useState(false);

  const offers = (data?.offers ?? []).filter((offer) => offer.title.trim());

  if (!data?.isEnabled || offers.length === 0) {
    return null;
  }

  const hasMore = offers.length > VISIBLE_COUNT;
  const shown = expanded ? offers : offers.slice(0, VISIBLE_COUNT);

  return (
    <Box
      component="section"
      aria-label="Exclusive offers"
      sx={{
        mt: { xs: 1.5, sm: 2 },
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: "12px",
        border: `1px solid ${COLORS.blue}`,
        backgroundColor: COLORS.panelBg,
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: COLORS.ink,
          fontSize: "0.95rem",
          fontWeight: 800,
          mb: 0.75,
        }}
      >
        {data.heading || "Exclusive Offers"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 1,
        }}
      >
        {shown.map((offer) => (
          <Box
            key={offer.id}
            sx={{
              px: 1.25,
              py: 0.9,
              borderRadius: "8px",
              borderLeft: `3px solid ${COLORS.blue}`,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                color: COLORS.ink,
                fontSize: "0.84rem",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {offer.title}
            </Typography>

            {offer.description && (
              <Typography
                sx={{
                  color: COLORS.muted,
                  fontSize: "0.74rem",
                  lineHeight: 1.35,
                  mt: 0.25,
                }}
              >
                {offer.description}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

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
          {expanded ? "View less" : `View all ${offers.length} offers`}
        </Button>
      )}
    </Box>
  );
}