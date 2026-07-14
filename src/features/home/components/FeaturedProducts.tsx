import { Box, Container, Grid, Typography } from "@mui/material";

import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts() {
  return (
    <Box
      sx={{
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
          }}
        >
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}