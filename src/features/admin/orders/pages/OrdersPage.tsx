import { Alert, CircularProgress, Typography } from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import OrdersTable from "../components/OrdersTable";
import { useAdminOrders } from "../hooks/useAdminOrders";

export default function OrdersPage() {
  const {
  data: orders = [],
  isLoading,
  isError,
} = useAdminOrders();


  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders, update statuses, and track order history."
      />

      <SectionCard>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Alert severity="error">
            Failed to load orders.
          </Alert>
        ) : orders.length === 0 ? (
          <Typography color="text.secondary">
            No orders available.
          </Typography>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </SectionCard>
    </PageContainer>
  );
}