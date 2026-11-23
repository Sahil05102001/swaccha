import {
  Alert,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "../theme/chartColors";
import { useDashboardCharts } from "../hooks/useDashboardCharts";

const CHART_HEIGHT = 300;
// Fixed, so the loading placeholder and the real card are the same size.
const CARD_HEIGHT = 392;

export default function DashboardCharts() {
  const theme = useTheme();
  const { data, isLoading, isError, error } = useDashboardCharts();

  const grid = theme.palette.divider;
  const tick = { fill: theme.palette.text.secondary, fontSize: 12 };
  const axisLine = { stroke: grid };
  const currentMonth = new Date().getMonth();

  const tooltip = {
    contentStyle: {
      border: `1px solid ${grid}`,
      borderRadius: 8,
      boxShadow: "none",
      fontSize: 13,
    },
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[0, 1].map((key) => (
          <Grid key={key} size={{ xs: 12, lg: 6 }}>
            <Skeleton variant="rounded" height={CARD_HEIGHT} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error">
        {error instanceof Error
          ? error.message
          : "Failed to load dashboard charts."}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography
              component="h3"
              sx={{ fontSize: "1.05rem", fontWeight: 700, mb: 2 }}
            >
              Monthly revenue
            </Typography>

            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.revenue} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="month" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis
                  tick={tick}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
                <Tooltip
                  {...tooltip}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_COLORS.revenue}
                  strokeWidth={2.5}
                  fill="url(#revenueFill)"
                  dot={false}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography
              component="h3"
              sx={{ fontSize: "1.05rem", fontWeight: 700, mb: 2 }}
            >
              Monthly orders
            </Typography>

            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={data}>
                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="month" tick={tick} axisLine={axisLine} tickLine={false} />
                <YAxis
                  tick={tick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={40}
                />
                <Tooltip {...tooltip} cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.month}
                      fill={
                        index === currentMonth
                          ? CHART_COLORS.ordersCurrent
                          : CHART_COLORS.orders
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}