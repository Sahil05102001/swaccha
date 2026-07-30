import { useState } from "react";

import {
    Alert,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import DateRangeFilter, {
    type DateRangeFilterValue,
} from "../components/DateRangeFilter";
import ExportButtons from "../components/ExportButtons";
import ReportSummaryCards from "../components/ReportSummaryCards";
import SalesReportTable from "../components/SalesReportTable";
import { useSalesReport } from "../hooks/useSalesReport";
import { exportSalesReportToExcel } from "../services/exportExcel";
import { exportSalesReportToPdf } from "../services/exportPdf";

export default function SalesReportPage() {
    const [filters, setFilters] =
        useState<DateRangeFilterValue>({});

    const {
        data,
        isLoading,
        isError,
    } = useSalesReport(filters);

    function handleExportExcel() {
        if (!data) {
            return;
        }

        exportSalesReportToExcel(
            data.rows,
            data.summary
        );
    }

    function handleExportPdf() {
        if (!data) {
            return;
        }

        exportSalesReportToPdf(
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
                    Failed to load sales report.
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
                Sales Report
            </Typography>

            <DateRangeFilter
                value={filters}
                onChange={setFilters}
            />

            <ExportButtons
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
            />

            <ReportSummaryCards
                summary={data.summary}
            />

            <SalesReportTable
                rows={data.rows}
            />
        </Container>
    );
}