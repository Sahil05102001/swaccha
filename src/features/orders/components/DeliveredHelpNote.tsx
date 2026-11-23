import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

const SUPPORT_EMAIL = "swachha.business@gmail.com";

interface Props {
  orderNumber: string;
}

/** Shown on delivered orders: where to reach us if something is wrong. */
export default function DeliveredHelpNote({ orderNumber }: Props) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        p: 1.5,
        alignItems: "flex-start",
        border: "1px solid #BFEFF4",
        borderRadius: 2,
        bgcolor: "#EAFBFE",
      }}
    >
      <SupportAgentOutlinedIcon
        aria-hidden="true"
        sx={{ fontSize: 22, mt: 0.25, color: "#007F89", flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#212121" }}>
          Need help with this order?
        </Typography>

        <Typography
          sx={{ mt: 0.25, fontSize: "0.85rem", lineHeight: 1.6, color: "#52656B" }}
        >
          If you have any concerns, please write to us at{" "}
          <MuiLink
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
              `Help with order #${orderNumber}`,
            )}`}
            underline="none"
            sx={{
              fontWeight: 600,
              color: "#007F89",
              overflowWrap: "anywhere",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {SUPPORT_EMAIL}
          </MuiLink>{" "}
          and our team will assist you.
        </Typography>
      </Box>
    </Stack>
  );
}
