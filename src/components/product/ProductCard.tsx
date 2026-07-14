import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import productImage from "@/assets/images/products/floor-cleaner.png";

export default function ProductCard() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        overflow: "hidden",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        component="img"
        image={productImage}
        alt="Swachha Floor Cleaner"
        sx={{
          height: 280,
          objectFit: "contain",
          p: 3,
          bgcolor: "#fafafa",
        }}
      />

      <CardContent>
        <Chip
          label="Best Seller"
          color="success"
          size="small"
          sx={{
            mb: 2,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Swachha Floor Cleaner
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
          }}
        >
          Rose Fresh Fragrance
        </Typography>

        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          ₹199
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartOutlinedIcon />}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}