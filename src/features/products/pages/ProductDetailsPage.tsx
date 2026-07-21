import { Alert, CircularProgress, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import Grid from "@mui/material/Grid";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id);

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

  if (!product) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Product not found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Grid
        container
        spacing={5}
        sx={{
          alignItems: "flex-start",
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductImage
            image={product.images[0]}
            name={product.name}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProductInfo product={product} />
        </Grid>
      </Grid>
    </Container>
  );
}