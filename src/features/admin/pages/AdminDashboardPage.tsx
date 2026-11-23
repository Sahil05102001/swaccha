import { lazy } from "react";
import {
  Alert,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import B2BEnquiryStats from "../components/B2BEnquiryStats";
import DashboardOrderStats from "../components/DashboardOrderStats";
import DashboardOverview from "../components/DashboardOverview";
import DashboardSection from "../components/DashboardSection";
import StatCard from "../components/StatCard";

import { useDashboardStats } from "../hooks/useDashboardStats";

// Downloaded only when scrolled near (the chart library is the big one).
const DashboardCharts = lazy(() => import("../components/DashboardCharts"));
const RecentOrdersTable = lazy(() => import("../components/RecentOrdersTable"));
const TopSellingProductsCard = lazy(
  () => import("../components/TopSellingProductsCard"),
);
const SalesByCategoryCard = lazy(
  () => import("../components/SalesByCategoryCard"),
);
const TopCustomersCard = lazy(() => import("../components/TopCustomersCard"));
const LowStockProducts = lazy(() => import("../components/LowStockProducts"));

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export default function AdminDashboardPage() {
  const theme = useTheme();
  // noSsr: read the screen size on the first render, so phones never flash the desktop layout.
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

  const queryClient = useQueryClient();
  const fetching = useIsFetching();

  const { data: stats, isError, error, refetch, dataUpdatedAt } =
    useDashboardStats();

  // Refetches every dashboard card that is on screen. Cards further down the
  // page are marked stale and load fresh when they are scrolled to.
  const refreshAll = () => {
    void queryClient.invalidateQueries();
  };

  const updated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const refreshControls = (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      {updated && (
        <Typography variant="caption" color="text.secondary">
          Updated {updated}
        </Typography>
      )}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RefreshIcon />}
        onClick={refreshAll}
        disabled={fetching > 0}
      >
        {fetching > 0 ? "Refreshing..." : "Refresh"}
      </Button>
    </Stack>
  );

  const statsError = isError && (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={() => void refetch()}>
          Retry
        </Button>
      }
    >
      {error instanceof Error ? error.message : "Failed to load dashboard figures."}
    </Alert>
  );

  // ---------- Phones: only what an admin needs on the go ----------
  if (isMobile) {
    const tiles = [
      { title: "Revenue today", value: stats && inr(stats.revenueToday) },
      { title: "This month", value: stats && inr(stats.revenueThisMonth) },
      { title: "Pending", value: stats?.pendingOrders },
      { title: "Confirmed", value: stats?.confirmedOrders },
      { title: "Packed", value: stats?.packedOrders },
      { title: "Shipped", value: stats?.shippedOrders },
    ];

    return (
      <PageContainer spacing={2.5}>
        <PageHeader
          title="Dashboard"
          subtitle="Today at a glance."
          action={refreshControls}
        />

        {statsError}

        {!isError && (
          <Grid container spacing={1.5}>
            {tiles.map((tile) => (
              <Grid key={tile.title} size={{ xs: 6 }}>
                <StatCard title={tile.title} value={tile.value} icon={null} compact />
              </Grid>
            ))}
          </Grid>
        )}

        <B2BEnquiryStats compact />

        <DashboardSection placeholderHeight={300}>
          <RecentOrdersTable />
        </DashboardSection>

        <DashboardSection placeholderHeight={200}>
          <LowStockProducts />
        </DashboardSection>
      </PageContainer>
    );
  }

  // ---------- Tablets and desktops ----------
  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor and manage your store."
        action={refreshControls}
      />

      {statsError}

      {!isError && (
        <>
          <DashboardOverview stats={stats} />
          <DashboardOrderStats stats={stats} />
        </>
      )}

      <B2BEnquiryStats />

      <DashboardSection placeholderHeight={{ md: 808, lg: 392 }}>
        <DashboardCharts />
      </DashboardSection>

      {/* Two independent columns: each card takes only the height it needs,
          so a short card never leaves a gap beside a tall one. */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3}>
            <DashboardSection placeholderHeight={320}>
              <RecentOrdersTable />
            </DashboardSection>

            <DashboardSection placeholderHeight={480}>
              <TopSellingProductsCard />
            </DashboardSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <DashboardSection placeholderHeight={400}>
              <TopCustomersCard />
            </DashboardSection>

            <DashboardSection placeholderHeight={480}>
              <SalesByCategoryCard />
            </DashboardSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <DashboardSection placeholderHeight={200}>
            <LowStockProducts />
          </DashboardSection>
        </Grid>
      </Grid>
    </PageContainer>
  );
}