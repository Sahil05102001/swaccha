import {
    CircularProgress,
    Grid,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import DashboardOverview from "../components/DashboardOverview";
import DashboardOrderStats from "../components/DashboardOrderStats";
import LowStockProducts from "../components/LowStockProducts";
import RecentOrdersTable from "../components/RecentOrdersTable";

import { useDashboardStats } from "../hooks/useDashboardStats";

export default function AdminDashboardPage() {
    const {
        data: stats,
        isLoading,
        isError,
        error,
    } = useDashboardStats();

    if (isError) {
        return (
            <PageContainer>
                <PageHeader
                    title="Admin Dashboard"
                    subtitle="Monitor and manage your store."
                />

                <pre>{String(error)}</pre>
            </PageContainer>
        );
    }

    if (isLoading || !stats) {
        return (
            <PageContainer>
                <PageHeader
                    title="Admin Dashboard"
                    subtitle="Monitor and manage your store."
                />

                <CircularProgress />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Admin Dashboard"
                subtitle="Monitor and manage your store."
            />

            <DashboardOverview stats={stats} />

            <DashboardOrderStats stats={stats} />

            <Grid
                container
                spacing={3}
            >
                <Grid size={{ xs: 12, lg: 8 }}>
                    <RecentOrdersTable />
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <LowStockProducts />
                </Grid>
            </Grid>
        </PageContainer>
    );
}