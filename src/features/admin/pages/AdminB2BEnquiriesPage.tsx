
import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { getB2BEnquiries } from "../services/b2bEnquiriesListService";

interface PageNavigation {
    cursor?: string;
    direction: "next" | "previous";
}

export default function AdminB2BEnquiriesPage() {
    const [navigation, setNavigation] = useState<PageNavigation>({
        direction: "next",
    });

    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "admin-b2b-enquiries",
            navigation.cursor ?? null,
            navigation.direction,
        ],
        queryFn: () =>
            getB2BEnquiries(navigation.cursor, navigation.direction),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });

    const enquiries = data?.enquiries ?? [];

    const goToNextPage = () => {
        if (!data?.nextCursor || isFetching) return;

        setNavigation({
            cursor: data.nextCursor,
            direction: "next",
        });
    };

    const goToPreviousPage = () => {
        if (!data?.previousCursor || isFetching) return;

        setNavigation({
            cursor: data.previousCursor,
            direction: "previous",
        });
    };

    const refreshPage = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["admin-b2b-enquiries"],
        });
        await refetch();
    };

    return (
        <PageContainer>
            <PageHeader
                title="B2B Enquiries"
                subtitle="Manage bulk purchase enquiries from business customers."
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 1,
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => void refreshPage()}
                    disabled={isFetching}
                >
                    Refresh
                </Button>
            </Box>

            {isError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => void refetch()}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error instanceof Error
                        ? error.message
                        : "Failed to load B2B enquiries."}
                </Alert>
            )}

            {isLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                    }}
                >
                    <CircularProgress size={28} />
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ overflowX: "auto" }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Business</TableCell>
                                <TableCell>Contact Person</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Products</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Received</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {enquiries.map((enquiry) => {
                                const rawTimestamp = enquiry.createdAt;
                                const seconds =
                                    rawTimestamp?._seconds ??
                                    rawTimestamp?.seconds;

                                const receivedAt =
                                    typeof seconds === "number"
                                        ? new Date(seconds * 1000).toLocaleString(
                                              "en-IN",
                                          )
                                        : "—";

                                return (
                                    <TableRow key={enquiry.id} hover={false}>
                                        <TableCell>
                                            {enquiry.businessName}
                                        </TableCell>
                                        <TableCell>{enquiry.name}</TableCell>
                                        <TableCell>{enquiry.phone}</TableCell>
                                        <TableCell>
                                            {enquiry.email || "—"}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 160 }}>
                                            {enquiry.products}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: 200,
                                                maxWidth: 300,
                                                whiteSpace: "pre-wrap",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {enquiry.message?.trim() || "—"}
                                        </TableCell>
                                        <TableCell>{enquiry.quantity}</TableCell>
                                        <TableCell sx={{ minWidth: 150 }}>
                                            {receivedAt}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {enquiries.length === 0 && !isError && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{ py: 5 }}
                                    >
                                        <Typography color="text.secondary">
                                            No B2B enquiries received yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={goToPreviousPage}
                    disabled={!data?.previousCursor || isFetching}
                >
                    Previous
                </Button>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                >
                    {enquiries.length > 0
                        ? `Showing ${enquiries.length} enquiries on this page`
                        : "No enquiries"}
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={goToNextPage}
                    disabled={!data?.nextCursor || isFetching}
                >
                    Next
                </Button>
            </Box>
        </PageContainer>
    );
}
