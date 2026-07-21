import { IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
}: QuantityControlProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
      <IconButton
        size="small"
        onClick={onDecrease}
      >
        <RemoveIcon />
      </IconButton>

      <Typography
        sx={{
          minWidth: 24,
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {quantity}
      </Typography>

      <IconButton
        size="small"
        onClick={onIncrease}
      >
        <AddIcon />
      </IconButton>
    </Stack>
  );
}