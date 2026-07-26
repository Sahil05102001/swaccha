import {
    Alert,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useDashboardCharts } from "../hooks/useDashboardCharts";

export default function DashboardCharts() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useDashboardCharts();

    if (isLoading) {
        return (
            <Stack
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    py: 6,
                }}
            >
                <CircularProgress />
            </Stack>
        );
    }

    if (isError || !data) {
        return (
            <Alert severity="error">
                {String(error ?? "Failed to load dashboard charts.")}
            </Alert>
        );
    }

    return (
        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >
            <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ height: 420 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Monthly Revenue
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip
                                    formatter={(value) => [
                                        `₹${Number(value).toLocaleString("en-IN")}`,
                                        "Revenue",
                                    ]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1976d2"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ height: 420 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            Monthly Orders
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="orders"
                                    fill="#2e7d32"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}