import { useMemo, useState } from "react";

import {
    Alert,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import ExportButtons from "@/features/reports/components/ExportButtons";

import InventoryFilter from "../components/InventoryFilter";
import InventoryReportTable from "../components/InventoryReportTable";
import InventorySummaryCards from "../components/InventorySummaryCards";
import { useInventoryReport } from "../hooks/useInventoryReport";
import { exportInventoryReportToExcel } from "../services/exportInventoryExcel";
import { exportInventoryReportToPdf } from "../services/exportInventoryPdf";
import type {
    InventoryReportFilters,
} from "../services/inventoryReportService";

export default function InventoryReportPage() {
    const [filters, setFilters] =
        useState<InventoryReportFilters>({});

    const {
        data,
        isLoading,
        isError,
    } = useInventoryReport(filters);

    const categories = useMemo(() => {
        if (!data) {
            return [];
        }

        return Array.from(
            new Set(
                data.rows
                    .map((row) => row.category)
                    .filter(Boolean)
            )
        ).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [data]);

    function handleExportExcel() {
        if (!data) {
            return;
        }

        exportInventoryReportToExcel(
            data.rows,
            data.summary
        );
    }

    function handleExportPdf() {
        if (!data) {
            return;
        }

        exportInventoryReportToPdf(
            data.rows,
            data.summary
        );
    }

    if (isLoading) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: 4,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (isError || !data) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: 4,
                }}
            >
                <Alert severity="error">
                    Failed to load inventory report.
                </Alert>
            </Container>
        );
    }

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                }}
            >
                Inventory Report
            </Typography>

            <InventoryFilter
                value={filters}
                categories={categories}
                onChange={setFilters}
            />

            <ExportButtons
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
            />

            <InventorySummaryCards
                summary={data.summary}
            />

            <InventoryReportTable
                rows={data.rows}
            />
        </Container>
    );
}