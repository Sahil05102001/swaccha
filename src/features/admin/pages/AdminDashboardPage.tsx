import {
    CircularProgress,
    Grid,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import StatCard from "../components/StatCard";
import RecentOrdersTable from "../components/RecentOrdersTable";
import LowStockProducts from "../components/LowStockProducts";

import { useDashboardStats } from "../hooks/useDashboardStats";

export default function AdminDashboardPage() {
    const {
        data: stats,
        isLoading,
        isError,
        error,
    } = useDashboardStats();

    console.log("Dashboard Stats:", stats);
    console.log("Dashboard Error:", error);

    if (isError) {
    return (
        <PageContainer>
            <PageHeader
                title="Admin Dashboard"
                subtitle="Monitor and manage your store."
            />

            <pre>
                {String(error)}
            </pre>
        </PageContainer>
    );
}

    if (isLoading) {
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

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Products"
                        value={stats?.totalProducts ?? 0}
                        subtitle="Total Products"
                        icon={<Inventory2Icon />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Orders"
                        value={stats?.totalOrders ?? 0}
                        subtitle="Total Orders"
                        icon={<ShoppingCartIcon />}
                        color="success.main"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Customers"
                        value={stats?.totalCustomers ?? 0}
                        subtitle="Registered Users"
                        icon={<PeopleIcon />}
                        color="warning.main"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Revenue"
                        value={`₹${stats?.totalRevenue.toLocaleString() ?? 0}`}
                        subtitle="Total Revenue"
                        icon={<CurrencyRupeeIcon />}
                        color="secondary.main"
                    />
                </Grid>
            </Grid>

            <Grid
                container
                spacing={3}
                sx={{
                    mt: 1,
                }}
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