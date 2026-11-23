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
  /** undefined while loading: the cards keep their size and show placeholders. */
  stats?: DashboardStats;
}

export default function DashboardOrderStats({ stats }: Props) {
  const cards = [
    { title: "Pending", value: stats?.pendingOrders, subtitle: "Awaiting action", icon: <PendingActionsIcon /> },
    { title: "Confirmed", value: stats?.confirmedOrders, subtitle: "Confirmed", icon: <CheckCircleIcon /> },
    { title: "Packed", value: stats?.packedOrders, subtitle: "Ready to ship", icon: <InventoryIcon /> },
    { title: "Shipped", value: stats?.shippedOrders, subtitle: "In transit", icon: <LocalShippingIcon /> },
    { title: "Delivered", value: stats?.deliveredOrders, subtitle: "Completed", icon: <TaskAltIcon /> },
    { title: "Cancelled", value: stats?.cancelledOrders, subtitle: "Cancelled", icon: <CancelOutlinedIcon /> },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 2 }}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}