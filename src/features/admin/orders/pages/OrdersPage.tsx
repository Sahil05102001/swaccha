import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useOrder } from "@/features/orders/hooks/useOrders";
import { isUnpaidRazorpayOrder } from "@/features/orders/services/orderService";

import OrderDetailsDialog from "../components/OrderDetailsDialog";
import OrdersTable from "../components/OrdersTable";
import {
  ADMIN_ORDERS_QUERY_KEY,
  useAdminOrdersPage,
  type OrderStatusFilter,
} from "../hooks/useAdminOrders";

const INK = "#0F172A";

const STATUS_FILTERS: { value: OrderStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

const scrollTop = () => {
  window.scrollTo({ top: 0 });
  document.querySelector("main")?.scrollTo({ top: 0 });
};

/** Opens an order that is not on the loaded pages (e.g. from a dashboard link). */
function OrderFromLink({ id, onClose }: { id: string; onClose: () => void }) {
  const { showSnackbar } = useSnackbar();
  const { data: order, isLoading, isError } = useOrder(id);

  const missing =
    !isLoading && (isError || !order || isUnpaidRazorpayOrder(order));

  useEffect(() => {
    if (missing) {
      showSnackbar("That order could not be found.", "error");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing]);

  if (!order || missing) return null;

  return <OrderDetailsDialog open order={order} onClose={onClose} />;
}

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState<OrderStatusFilter>("all");
  const [pageIndex, setPageIndex] = useState(0);

  const query = useAdminOrdersPage(status);

  const pages = query.data?.pages ?? [];
  const safeIndex = Math.min(pageIndex, Math.max(pages.length - 1, 0));
  const pageOrders = pages[safeIndex]?.orders ?? [];
  const allOrders = pages.flatMap((page) => page.orders);

  const isLastLoaded = safeIndex >= pages.length - 1;
  const canNext = !isLastLoaded || !!query.hasNextPage;
  const canPrev = safeIndex > 0;

  const selectedId = searchParams.get("order");
  const selectedFromList = selectedId
    ? (allOrders.find((order) => order.id === selectedId) ?? null)
    : null;

  const openOrder = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("order", id);
      return next;
    });
  };

  const closeOrder = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("order");
      return next;
    });
  };

  const handleRefresh = () => {
    setPageIndex(0);
    void queryClient.resetQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
  };

  const changeStatus = (value: OrderStatusFilter) => {
    setStatus(value);
    setPageIndex(0);
  };

  const goNext = async () => {
    if (!isLastLoaded) {
      setPageIndex(safeIndex + 1);
    } else if (query.hasNextPage) {
      await query.fetchNextPage();
      setPageIndex(safeIndex + 1);
    }
    scrollTop();
  };

  const goPrev = () => {
    setPageIndex(Math.max(safeIndex - 1, 0));
    scrollTop();
  };

  const updatedAt = query.dataUpdatedAt
    ? new Date(query.dataUpdatedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const statusLabel =
    STATUS_FILTERS.find((filter) => filter.value === status)?.label ?? "";

  const refreshing = query.isFetching && !query.isFetchingNextPage;
  const nothingAtAll =
    pages.length > 0 && allOrders.length === 0 && !query.hasNextPage;

  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders, update statuses, and track order history."
        action={
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            {updatedAt && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Updated {updatedAt}
              </Typography>
            )}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={query.isFetching}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </Stack>
        }
      />

      <SectionCard>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {STATUS_FILTERS.map((filter) => {
              const selected = status === filter.value;
              return (
                <Chip
                  key={filter.value}
                  label={filter.label}
                  variant="outlined"
                  onClick={() => changeStatus(filter.value)}
                  sx={{
                    borderRadius: 1,
                    fontWeight: 600,
                    transition: "none",
                    bgcolor: selected ? INK : "transparent",
                    color: selected ? "#fff" : "text.primary",
                    borderColor: selected ? INK : "divider",
                    "&:hover, &:focus": {
                      bgcolor: selected ? INK : "transparent",
                    },
                  }}
                />
              );
            })}
          </Box>

          {query.isLoading ? (
            <Stack spacing={1} aria-label="Loading orders">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={44} />
              ))}
            </Stack>
          ) : query.isError ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={handleRefresh}>
                  Try again
                </Button>
              }
            >
              Failed to load orders.
            </Alert>
          ) : nothingAtAll ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              {status === "all"
                ? "No orders available."
                : `No ${statusLabel.toLowerCase()} orders.`}
            </Typography>
          ) : (
            <OrdersTable orders={pageOrders} onView={openOrder} />
          )}

          {(canPrev || canNext) && (
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", justifyContent: "flex-end" }}
            >
              <Typography variant="body2" color="text.secondary">
                Page {safeIndex + 1}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={goPrev}
                disabled={!canPrev || query.isFetchingNextPage}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => void goNext()}
                disabled={!canNext || query.isFetchingNextPage}
              >
                {query.isFetchingNextPage ? "Loading..." : "Next"}
              </Button>
            </Stack>
          )}
        </Stack>
      </SectionCard>

      {selectedId &&
        (selectedFromList ? (
          <OrderDetailsDialog
            open
            order={selectedFromList}
            onClose={closeOrder}
          />
        ) : (
          <OrderFromLink id={selectedId} onClose={closeOrder} />
        ))}
    </PageContainer>
  );
}