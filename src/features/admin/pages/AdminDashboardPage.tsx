import { lazy } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import LazySection from "@/components/common/LazySection";

import B2BEnquiryStats from "../components/B2BEnquiryStats";
import DashboardOrderStats from "../components/DashboardOrderStats";
import DashboardOverview from "../components/DashboardOverview";

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

export default function AdminDashboardPage() {
  const { data: stats, isError, error } = useDashboardStats();

  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor and manage your store."
      />

      <B2BEnquiryStats />

      {isError ? (
        <pre>{String(error)}</pre>
      ) : !stats ? (
        <Box sx={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={28} aria-label="Loading dashboard figures" />
        </Box>
      ) : (
        <>
          <DashboardOverview stats={stats} />
          <DashboardOrderStats stats={stats} />
        </>
      )}

      <LazySection minHeight={320}>
        <DashboardCharts />
      </LazySection>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <LazySection>
            <RecentOrdersTable />
          </LazySection>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <LazySection>
            <TopSellingProductsCard />
          </LazySection>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <LazySection>
            <SalesByCategoryCard />
          </LazySection>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <LazySection>
            <TopCustomersCard />
          </LazySection>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <LazySection minHeight={200}>
            <LowStockProducts />
          </LazySection>
        </Grid>
      </Grid>
    </PageContainer>
  );
}