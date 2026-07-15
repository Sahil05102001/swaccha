import {
  Container,
  Grid,
  Typography,
} from "@mui/material";

import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 6,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 5,
          fontWeight: 700,
        }}
      >
        Our Products
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid
            key={product.id}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}