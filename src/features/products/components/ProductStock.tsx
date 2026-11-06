import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

interface ProductStockProps {
  stock: number;
}

export default function ProductStock({
  stock,
}: ProductStockProps) {
  const isInStock = stock > 0;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignSelf: "flex-start",
        width: "fit-content",
        px: {
          xs: 1.5,
          sm: 1.75,
        },
        py: {
          xs: 0.9,
          sm: 1,
        },
        borderRadius: 2,
        backgroundColor: isInStock
          ? "rgba(0, 217, 255, 0.08)"
          : "rgba(245, 247, 250, 0.04)",
        border: "1px solid",
        borderColor: isInStock
          ? "rgba(0, 217, 255, 0.3)"
          : "#344052",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        {/* Status indicator */}
        <Box
          sx={{
            width: 8,
            height: 8,
            flexShrink: 0,
            borderRadius: "50%",
            backgroundColor: isInStock
              ? "#00D9FF"
              : "#8491A3",
          }}
        />

        {/* Stock information */}
        <Typography
          variant="body2"
          sx={{
            color: isInStock
              ? "#00D9FF"
              : "#AAB6C6",
            fontWeight: 700,
            fontSize: {
              xs: "0.8rem",
              sm: "0.875rem",
            },
            lineHeight: 1.4,
          }}
        >
          {isInStock
            ? `In Stock · ${stock} available`
            : "Out of Stock"}
        </Typography>
      </Stack>
    </Box>
  );
}