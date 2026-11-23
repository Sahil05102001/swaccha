import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { SALES_WINDOW_DAYS } from "../hooks/useSalesOrders";
import { useTopCustomers } from "../hooks/useTopCustomers";
import SalesScopeNote from "./SalesScopeNote";
import CardSkeleton from "./CardSkeleton";
import { Fragment } from "react";

export default function TopCustomersCard() {
  const { data, isLoading, isError, error } = useTopCustomers();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 4 }}>
            <CardSkeleton label="Loading top customers" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error">
        {String(error ?? "Failed to load top customers.")}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          Top Customers · Last {SALES_WINDOW_DAYS} Days
        </Typography>

        <SalesScopeNote />

        {data.length === 0 ? (
          <Typography color="text.secondary">
            No customer data available.
          </Typography>
        ) : (
          <List disablePadding>
            {data.map((customer, index) => (
              <Fragment key={customer.userId}>
                <ListItem disableGutters sx={{ display: "block", py: 1.5 }}>
                  <ListItemText
                    primary={`${index + 1}. ${customer.customerName}`}
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {customer.customerEmail || "No email available"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Orders: {customer.totalOrders}
                        </Typography>

                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{customer.totalSpent.toLocaleString("en-IN")}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Last Order:{" "}
                          {customer.lastOrderDate
                            ? customer.lastOrderDate.toLocaleDateString("en-IN")
                            : "-"}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                {index < data.length - 1 && <Divider component="li" />}
              </Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}