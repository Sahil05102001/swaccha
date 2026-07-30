import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import type {
    InventoryReportSummary,
} from "../services/inventoryReportService";

interface Props {
    summary: InventoryReportSummary;
}

interface SummaryCardProps {
    title: string;
    value: string | number;
}

function SummaryCard({
    title,
    value,
}: SummaryCardProps) {
    return (
        <Grid
            size={{
                xs: 12,
                sm: 6,
                md: 2.4,
            }}
        >
            <Card
                sx={{
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        {value}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default function InventorySummaryCards({
    summary,
}: Props) {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                mb: 3,
            }}
        >
            <SummaryCard
                title="Total Products"
                value={summary.totalProducts}
            />

            <SummaryCard
                title="Total Stock"
                value={summary.totalStockQuantity}
            />

            <SummaryCard
                title="Inventory Value"
                value={`₹${summary.totalInventoryValue.toLocaleString(
                    "en-IN"
                )}`}
            />

            <SummaryCard
                title="Low Stock"
                value={summary.lowStockProducts}
            />

            <SummaryCard
                title="Out of Stock"
                value={
                    summary.outOfStockProducts
                }
            />
        </Grid>
    );
}