import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import type { SalesReportRow } from "../services/salesReportService";

interface Props {
    rows: SalesReportRow[];
}

function getOrderStatusColor(
    status: string
):
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info" {
    switch (status.toLowerCase()) {
        case "pending":
            return "warning";

        case "confirmed":
            return "info";

        case "packed":
            return "secondary";

        case "shipped":
            return "primary";

        case "delivered":
            return "success";

        case "cancelled":
            return "error";

        default:
            return "default";
    }
}

function getPaymentStatusColor(
    status: string
):
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info" {
    switch (status.toLowerCase()) {
        case "paid":
            return "success";

        case "pending":
            return "warning";

        case "failed":
            return "error";

        case "refunded":
            return "info";

        default:
            return "default";
    }
}

export default function SalesReportTable({
    rows,
}: Props) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>

                        <TableCell>Customer</TableCell>

                        <TableCell>Email</TableCell>

                        <TableCell>Date</TableCell>

                        <TableCell>Order Status</TableCell>

                        <TableCell>Payment</TableCell>

                        <TableCell align="right">
                            Products
                        </TableCell>

                        <TableCell align="right">
                            Amount
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            hover
                        >
                            <TableCell>
                                {row.orderId}
                            </TableCell>

                            <TableCell>
                                {row.customerName}
                            </TableCell>

                            <TableCell>
                                {row.customerEmail || "-"}
                            </TableCell>

                            <TableCell>
                                {row.orderDate
                                    ? row.orderDate.toLocaleDateString(
                                          "en-IN"
                                      )
                                    : "-"}
                            </TableCell>

                            <TableCell>
                                <Chip
                                    label={row.orderStatus}
                                    color={getOrderStatusColor(
                                        row.orderStatus
                                    )}
                                    size="small"
                                />
                            </TableCell>

                            <TableCell>
                                <Chip
                                    label={row.paymentStatus}
                                    color={getPaymentStatusColor(
                                        row.paymentStatus
                                    )}
                                    size="small"
                                />
                            </TableCell>

                            <TableCell align="right">
                                {row.productsSold}
                            </TableCell>

                            <TableCell align="right">
                                ₹
                                {row.totalAmount.toLocaleString(
                                    "en-IN"
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}