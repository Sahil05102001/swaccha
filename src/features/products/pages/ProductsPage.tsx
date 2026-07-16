import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search")?.toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    if (!search) return true;

    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  });

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

      {filteredProducts.length === 0 ? (
        <Box
          sx={{
            py: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SearchOffOutlinedIcon
            sx={{
              fontSize: 80,
              color: "text.secondary",
            }}
          />

          <Typography variant="h4">
            No products found
          </Typography>

          <Typography color="text.secondary">
            Try another search term.
          </Typography>

          <Button
            component={Link}
            to="/products"
            variant="contained"
            sx={{
              mt: 2,
            }}
          >
            Clear Search
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid
              key={product.id}
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}