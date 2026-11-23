import {
  Alert,
  Box,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { SALES_WINDOW_DAYS } from "../hooks/useSalesOrders";
import { useTopSellingProducts } from "../hooks/useTopSellingProducts";
import SalesScopeNote from "./SalesScopeNote";
import CardSkeleton from "./CardSkeleton";

export default function TopSellingProductsCard() {
  const { data, isLoading, isError, error } = useTopSellingProducts();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 4 }}>
            <CardSkeleton label="Loading top selling products" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error">
        {String(error ?? "Failed to load top selling products.")}
      </Alert>
    );
  }

  const maxSold =
    data.length > 0 ? Math.max(...data.map((item) => item.totalSold)) : 1;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          Top Selling Products · Last {SALES_WINDOW_DAYS} Days
        </Typography>

        <SalesScopeNote />

        {data.length === 0 ? (
          <Typography color="text.secondary">
            No sales data available.
          </Typography>
        ) : (
          <List disablePadding>
            {data.map((product, index) => (
              <ListItem
                key={product.productId}
                disableGutters
                sx={{ display: "block", py: 1.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <ListItemText
                    primary={`${index + 1}. ${product.productName}`}
                    secondary={`${product.totalSold} sold`}
                  />

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  aria-label={`${product.productName} sales`}
                  value={maxSold === 0 ? 0 : (product.totalSold / maxSold) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}