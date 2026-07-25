import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate, useParams } from "react-router-dom";

import { useCustomer } from "../hooks/useCustomers";
import { useCustomerAnalytics } from "../hooks/useCustomerAnalytics";

export default function CustomerDetailsPage() {
  const navigate = useNavigate();
  const { uid } = useParams();

  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useCustomer(uid);

  const {
    data: analytics,
    isLoading: analyticsLoading,
  } = useCustomerAnalytics(uid);

  if (isLoading || analyticsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {(error as Error).message}
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert severity="warning">
        Customer not found.
      </Alert>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/customers")}
        sx={{ mb: 3 }}
      >
        Back to Customers
      </Button>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Customer Details
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Profile
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2">
                Name
              </Typography>

              <Typography sx={{ mb: 2 }}>
                {customer.name || "-"}
              </Typography>

              <Typography variant="subtitle2">
                Email
              </Typography>

              <Typography sx={{ mb: 2 }}>
                {customer.email}
              </Typography>

              <Typography variant="subtitle2">
                Phone
              </Typography>

              <Typography sx={{ mb: 2 }}>
                {customer.phone || "-"}
              </Typography>

              <Typography variant="subtitle2">
                Role
              </Typography>

              <Chip
                sx={{ mt: 1, mb: 2 }}
                label={customer.role}
                color={
                  customer.role === "admin"
                    ? "secondary"
                    : "primary"
                }
              />

              <Typography variant="subtitle2">
                Status
              </Typography>

              <Chip
                sx={{ mt: 1, mb: 2 }}
                label={
                  customer.isActive
                    ? "Active"
                    : "Inactive"
                }
                color={
                  customer.isActive
                    ? "success"
                    : "error"
                }
              />

              <Typography variant="subtitle2">
                Joined
              </Typography>

              <Typography>
                {customer.createdAt
                  ? customer.createdAt
                      .toDate()
                      .toLocaleDateString("en-IN")
                  : "-"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customer Analytics
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total Orders
                      </Typography>

                      <Typography variant="h4">
                        {analytics?.totalOrders ?? 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total Spending
                      </Typography>

                      <Typography variant="h4">
                        ₹
                        {(analytics?.totalSpent ?? 0).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Average Order Value
                      </Typography>

                      <Typography variant="h4">
                        ₹
                        {(
                          analytics?.averageOrderValue ?? 0
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Last Order
                      </Typography>

                      <Typography variant="h6">
                        {analytics?.lastOrderDate
                          ? analytics.lastOrderDate.toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Recent Orders
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Paper variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Order No.</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Order Status</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Payment</strong>
                      </TableCell>

                      <TableCell align="right">
                        <strong>Total</strong>
                      </TableCell>

                      <TableCell align="center">
                        <strong>Action</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {analytics?.recentOrders.length ? (
                      analytics.recentOrders.map(
                        (order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              {order.orderNumber}
                            </TableCell>

                            <TableCell>
                              {order.createdAt
                                .toDate()
                                .toLocaleDateString(
                                  "en-IN"
                                )}
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={
                                  order.orderStatus
                                }
                                color="primary"
                                size="small"
                              />
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={
                                  order.paymentStatus
                                }
                                color={
                                  order.paymentStatus ===
                                  "paid"
                                    ? "success"
                                    : order.paymentStatus ===
                                        "pending"
                                      ? "warning"
                                      : "error"
                                }
                                size="small"
                              />
                            </TableCell>

                            <TableCell align="right">
                              ₹
                              {order.totalAmount.toLocaleString(
                                "en-IN"
                              )}
                            </TableCell>

                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(
                                    `/admin/orders/${order.id}`
                                  )
                                }
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                        >
                          No recent orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}