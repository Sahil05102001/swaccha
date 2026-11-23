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

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

interface Props {
  /** undefined while loading: the cards keep their size and show placeholders. */
  stats?: DashboardStats;
}

export default function DashboardOverview({ stats }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Products"
          value={stats?.totalProducts}
          subtitle="Total products"
          icon={<Inventory2Icon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Orders"
          value={stats?.totalOrders}
          subtitle="Total orders"
          icon={<ShoppingCartIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Customers"
          value={stats?.totalCustomers}
          subtitle="Registered users"
          icon={<PeopleIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Revenue"
          value={stats ? inr(stats.totalRevenue) : undefined}
          subtitle="Total revenue"
          icon={<CurrencyRupeeIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <StatCard
          title="Revenue today"
          value={stats ? inr(stats.revenueToday) : undefined}
          subtitle="Today's sales"
          icon={<TodayIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <StatCard
          title="Revenue this month"
          value={stats ? inr(stats.revenueThisMonth) : undefined}
          subtitle="Current month"
          icon={<CalendarMonthIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
        <StatCard
          title="Average order value"
          value={stats ? inr(stats.averageOrderValue) : undefined}
          subtitle="Per order"
          icon={<ReceiptLongIcon />}
        />
      </Grid>
    </Grid>
  );
}