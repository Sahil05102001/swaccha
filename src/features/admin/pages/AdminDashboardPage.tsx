import {
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

export default function AdminDashboardPage() {
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
                        value={120}
                        subtitle="Total Products"
                        icon={<Inventory2Icon />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Orders"
                        value={35}
                        subtitle="Orders Today"
                        icon={<ShoppingCartIcon />}
                        color="success.main"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Customers"
                        value={84}
                        subtitle="Registered Users"
                        icon={<PeopleIcon />}
                        color="warning.main"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Revenue"
                        value="₹58,420"
                        subtitle="This Month"
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