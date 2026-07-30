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

import type {
    InventoryReportRow,
} from "../services/inventoryReportService";

interface Props {
    rows: InventoryReportRow[];
}

function getStatusColor(
    status: InventoryReportRow["stockStatus"]
): "success" | "warning" | "error" {
    switch (status) {
        case "In Stock":
            return "success";

        case "Low Stock":
            return "warning";

        case "Out of Stock":
            return "error";
    }
}

export default function InventoryReportTable({
    rows,
}: Props) {
    return (
        <TableContainer
            component={Paper}
            elevation={2}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Product
                        </TableCell>

                        <TableCell>
                            SKU
                        </TableCell>

                        <TableCell>
                            Category
                        </TableCell>

                        <TableCell align="right">
                            Purchase Price
                        </TableCell>

                        <TableCell align="right">
                            Selling Price
                        </TableCell>

                        <TableCell align="right">
                            Stock
                        </TableCell>

                        <TableCell align="right">
                            Stock Value
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell>
                            Last Updated
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
                                {row.productName}
                            </TableCell>

                            <TableCell>
                                {row.sku}
                            </TableCell>

                            <TableCell>
                                {row.category}
                            </TableCell>

                            <TableCell align="right">
                                ₹
                                {row.purchasePrice.toLocaleString(
                                    "en-IN"
                                )}
                            </TableCell>

                            <TableCell align="right">
                                ₹
                                {row.sellingPrice.toLocaleString(
                                    "en-IN"
                                )}
                            </TableCell>

                            <TableCell align="right">
                                {row.stock}
                            </TableCell>

                            <TableCell align="right">
                                ₹
                                {row.stockValue.toLocaleString(
                                    "en-IN"
                                )}
                            </TableCell>

                            <TableCell>
                                <Chip
                                    label={
                                        row.stockStatus
                                    }
                                    color={getStatusColor(
                                        row.stockStatus
                                    )}
                                    size="small"
                                />
                            </TableCell>

                            <TableCell>
                                {row.lastUpdated
                                    ? row.lastUpdated.toLocaleDateString(
                                          "en-IN"
                                      )
                                    : "-"}
                            </TableCell>
                        </TableRow>
                    ))}

                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                align="center"
                            >
                                No inventory data
                                found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}