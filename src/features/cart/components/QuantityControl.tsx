import { IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const COLORS = {
  white: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  blue: "#0891B2",
};

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
}: QuantityControlProps) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignItems: "center",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 1.5,
        bgcolor: COLORS.white,
        p: 0.25,
      }}
    >
      <IconButton
        aria-label="Decrease quantity"
        size="small"
        onClick={onDecrease}
        sx={{
          color: COLORS.muted,
          width: 32,
          height: 32,
          borderRadius: 1,
          "&:hover": {
            color: COLORS.blue,
            bgcolor: "rgba(0, 217, 255, 0.08)",
          },
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Typography
        aria-live="polite"
        sx={{
          minWidth: 28,
          textAlign: "center",
          fontWeight: 600,
          fontSize: "0.95rem",
          color: COLORS.text,
        }}
      >
        {quantity}
      </Typography>

      <IconButton
        aria-label="Increase quantity"
        size="small"
        onClick={onIncrease}
        sx={{
          color: COLORS.muted,
          width: 32,
          height: 32,
          borderRadius: 1,
          "&:hover": {
            color: COLORS.blue,
            bgcolor: "rgba(0, 217, 255, 0.08)",
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}