import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { useProducts } from "../products/hooks/useProducts";

export default function LowStockProducts() {
  const {
    data: products = [],
    isLoading,
  } = useProducts();

  if (isLoading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Inventory Alerts
          </Typography>

          <Typography color="text.secondary">
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const lowStockProducts = products
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock);

  const outOfStockCount =
    lowStockProducts.filter(
      (product) => product.stock === 0
    ).length;

  const lowStockCount =
    lowStockProducts.filter(
      (product) => product.stock > 0
    ).length;

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Inventory Alerts
        </Typography>

        {lowStockProducts.length === 0 ? (
          <Typography color="success.main">
            ✅ All products are sufficiently stocked.
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {lowStockProducts.map((product) => (
                <ListItem
                  key={product.id}
                  divider
                  disableGutters
                  secondaryAction={
                    <Chip
                      size="small"
                      color={
                        product.stock === 0
                          ? "error"
                          : "warning"
                      }
                      label={
                        product.stock === 0
                          ? "Out of Stock"
                          : `${product.stock} Left`
                      }
                    />
                  }
                >
                  <ListItemText
                    primary={product.name}
                    secondary={product.category}
                  />
                </ListItem>
              ))}
            </List>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Low Stock:{" "}
              <strong>{lowStockCount}</strong>
              {" • "}
              Out of Stock:{" "}
              <strong>{outOfStockCount}</strong>
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}