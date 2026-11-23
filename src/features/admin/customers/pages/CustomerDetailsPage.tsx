import type { ReactNode } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import OrderStatusChip from "@/features/orders/components/OrderStatusChip";

import { useCustomer } from "../hooks/useCustomers";
import { useCustomerAnalytics } from "../hooks/useCustomerAnalytics";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Box sx={{ wordBreak: "break-word" }}>{children}</Box>
    </Box>
  );
}

function Tile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography component="div" sx={{ fontWeight: 700, fontSize: "1.35rem" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function CustomerDetailsPage() {
  const navigate = useNavigate();
  const { uid } = useParams();

  const { data: customer, isLoading, isError, error } = useCustomer(uid);

  // Admin accounts have no shopping data, so skip the orders lookup for them.
  const isAdmin = customer?.role === "admin";
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useCustomerAnalytics(customer && !isAdmin ? uid : undefined);

  // Sign-up doesn't collect a phone, so use the one from the latest order.
  const latestOrderPhone =
    analytics?.recentOrders[0]?.shippingAddress?.phoneNumber;
  const phone = customer?.phone || latestOrderPhone || "";

  const backButton = (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate("/admin/customers")}
    >
      Back to customers
    </Button>
  );

  if (isLoading || analyticsLoading) {
    return (
      <PageContainer>
        <PageHeader title="Customer Details" action={backButton} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={360} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={360} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Skeleton variant="rounded" height={260} />
          </Grid>
        </Grid>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Customer Details" action={backButton} />
        <Alert severity="error">{(error as Error).message}</Alert>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <PageHeader title="Customer Details" action={backButton} />
        <Alert severity="warning">Customer not found.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Customer Details"
        subtitle={customer.email}
        action={backButton}
      />
      {analyticsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not load this customer's orders.
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: isAdmin ? 12 : 4 }}>
          <SectionCard title="Profile">
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: isAdmin ? "repeat(2, 1fr)" : "1fr",
                },
              }}
            >
              <Field label="Name">
                <Typography>{customer.name || "-"}</Typography>
              </Field>

              <Field label="Email">
                <Typography>{customer.email}</Typography>
              </Field>

              {!isAdmin && (
                <Field label={customer.phone ? "Phone" : "Phone (from latest order)"}>
                  <Typography>{phone || "-"}</Typography>
                </Field>
              )}

              <Field label="Role">
                <Chip
                  size="small"
                  variant="outlined"
                  label={customer.role}
                  color={isAdmin ? "secondary" : "default"}
                />
              </Field>

              <Field label="Status">
                <Chip
                  size="small"
                  variant="outlined"
                  label={customer.isActive ? "Active" : "Inactive"}
                  color={customer.isActive ? "success" : "error"}
                />
              </Field>

              <Field label="Joined">
                <Typography>
                  {customer.createdAt
                    ? customer.createdAt.toDate().toLocaleDateString("en-IN")
                    : "-"}
                </Typography>
              </Field>
            </Box>
          </SectionCard>
        </Grid>

        {!isAdmin && (
          <>
            <Grid size={{ xs: 12, md: 8 }}>
              <SectionCard title="Customer Analytics">
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 6 }}>
                    <Tile label="Total orders" value={analytics?.totalOrders ?? 0} />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Tile
                      label="Total spending"
                      value={`₹${(analytics?.totalSpent ?? 0).toLocaleString("en-IN")}`}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Tile
                      label="Average order value"
                      value={`₹${(analytics?.averageOrderValue ?? 0).toLocaleString(
                        "en-IN",
                        { maximumFractionDigits: 2 },
                      )}`}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Tile
                      label="Last order"
                      value={
                        analytics?.lastOrderDate
                          ? analytics.lastOrderDate.toLocaleDateString("en-IN")
                          : "-"
                      }
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <SectionCard title="Recent Orders">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order No.</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Order status</TableCell>
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          Payment
                        </TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {analytics?.recentOrders.length ? (
                        analytics.recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              {order.orderNumber}
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              {order.createdAt.toDate().toLocaleDateString("en-IN")}
                            </TableCell>

                            <TableCell>
                              <OrderStatusChip status={order.orderStatus} />
                            </TableCell>

                            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                              <Chip
                                size="small"
                                variant="outlined"
                                label={order.paymentStatus}
                                color={
                                  order.paymentStatus === "paid"
                                    ? "success"
                                    : order.paymentStatus === "pending"
                                      ? "warning"
                                      : "error"
                                }
                              />
                            </TableCell>

                            <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                              ₹{order.totalAmount.toLocaleString("en-IN")}
                            </TableCell>

                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              No recent orders found.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SectionCard>
            </Grid>
          </>
        )}
      </Grid>
    </PageContainer>
  );
}