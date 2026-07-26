import Grid from "@mui/material/Grid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import type { DashboardStats } from "../services/dashboardService";

import StatCard from "./StatCard";

interface Props {
    stats: DashboardStats;
}

export default function DashboardOrderStats({
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
            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <StatCard
                    title="Pending"
                    value={stats.pendingOrders}
                    subtitle="Awaiting Action"
                    icon={<PendingActionsIcon />}
                    color="warning.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <StatCard
                    title="Confirmed"
                    value={stats.confirmedOrders}
                    subtitle="Confirmed"
                    icon={<CheckCircleIcon />}
                    color="info.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <StatCard
                    title="Packed"
                    value={stats.packedOrders}
                    subtitle="Ready to Ship"
                    icon={<InventoryIcon />}
                    color="primary.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <StatCard
                    title="Shipped"
                    value={stats.shippedOrders}
                    subtitle="In Transit"
                    icon={<LocalShippingIcon />}
                    color="secondary.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <StatCard
                    title="Delivered"
                    value={stats.deliveredOrders}
                    subtitle="Completed"
                    icon={<TaskAltIcon />}
                    color="success.main"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                <StatCard
                    title="Cancelled"
                    value={stats.cancelledOrders}
                    subtitle="Cancelled"
                    icon={<CancelOutlinedIcon />}
                    color="error.main"
                />
            </Grid>
        </Grid>
    );
}