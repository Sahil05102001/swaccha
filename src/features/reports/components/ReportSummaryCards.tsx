import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import type { SalesReportSummary } from "../services/salesReportService";

interface Props {
    summary: SalesReportSummary;
}

export default function ReportSummaryCards({
    summary,
}: Props) {
    return (
        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Total Revenue
                        </Typography>

                        <Typography variant="h5">
                            ₹
                            {summary.totalRevenue.toLocaleString(
                                "en-IN"
                            )}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Total Orders
                        </Typography>

                        <Typography variant="h5">
                            {summary.totalOrders}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Products Sold
                        </Typography>

                        <Typography variant="h5">
                            {summary.totalProductsSold}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card>
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Average Order Value
                        </Typography>

                        <Typography variant="h5">
                            ₹
                            {summary.averageOrderValue.toLocaleString(
                                "en-IN"
                            )}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}