import Grid from "@mui/material/Grid";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import type { DashboardStats } from "../services/dashboardService";

import StatCard from "./StatCard";

interface Props {
    stats: DashboardStats;
}

export default function DashboardOverview({
    stats,
}: Props) {
    return (
        <Grid
            container
            spacing={3}
            sx={{
                mb: 3,
            }}
        >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                    title="Products"
                    value={stats.totalProducts}
                    subtitle="Total Products"
                    icon={<Inventory2Icon />}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                    title="Orders"
                    value={stats.totalOrders}
                    subtitle="Total Orders"
                    icon={<ShoppingCartIcon />}
                    color="success.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                    title="Customers"
                    value={stats.totalCustomers}
                    subtitle="Registered Users"
                    icon={<PeopleIcon />}
                    color="warning.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                    title="Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    subtitle="Total Revenue"
                    icon={<CurrencyRupeeIcon />}
                    color="secondary.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <StatCard
                    title="Revenue Today"
                    value={`₹${stats.revenueToday.toLocaleString()}`}
                    subtitle="Today's Sales"
                    icon={<TodayIcon />}
                    color="info.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <StatCard
                    title="Revenue This Month"
                    value={`₹${stats.revenueThisMonth.toLocaleString()}`}
                    subtitle="Current Month"
                    icon={<CalendarMonthIcon />}
                    color="primary.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
                <StatCard
                    title="Average Order Value"
                    value={`₹${stats.averageOrderValue.toLocaleString()}`}
                    subtitle="Per Order"
                    icon={<ReceiptLongIcon />}
                    color="success.dark"
                />
            </Grid>
        </Grid>
    );
}