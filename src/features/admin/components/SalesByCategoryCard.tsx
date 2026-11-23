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
import { useSalesByCategory } from "../hooks/useSalesByCategory";
import SalesScopeNote from "./SalesScopeNote";
import { TOP_CATEGORIES_LIMIT } from "../services/dashboardCategorySalesService";
import CardSkeleton from "./CardSkeleton";

export default function SalesByCategoryCard() {
  const { data, isLoading, isError, error } = useSalesByCategory();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 4 }}>
            <CardSkeleton label="Loading category sales" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error">
        {String(error ?? "Failed to load category sales.")}
      </Alert>
    );
  }

  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((item) => item.totalRevenue)) : 1;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          Sales by Category · Last {SALES_WINDOW_DAYS} Days
        </Typography>

        <SalesScopeNote />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          Showing the top {TOP_CATEGORIES_LIMIT} categories by revenue.
        </Typography>

        {data.length === 0 ? (
          <Typography color="text.secondary">
            No category sales available.
          </Typography>
        ) : (
          <List disablePadding>
            {data.map((category) => (
              <ListItem
                key={category.category}
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
                    primary={category.category}
                    secondary={`${category.totalSold} units sold`}
                  />

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{category.totalRevenue.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  aria-label={`${category.category} sales`}
                  value={
                    maxRevenue === 0
                      ? 0
                      : (category.totalRevenue / maxRevenue) * 100
                  }
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