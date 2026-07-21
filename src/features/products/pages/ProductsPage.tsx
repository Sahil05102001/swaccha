import {
  Alert,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import ProductGrid from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";

export default function ProductsPage() {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts();

  if (isLoading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Something went wrong."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
        }}
      >
        Products
      </Typography>

      <ProductGrid products={products} />
    </Container>
  );
}