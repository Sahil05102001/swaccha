import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import OrderStatusChip from "@/features/orders/components/OrderStatusChip";
import type { OrderStatus } from "@/features/orders/types/order";

import type { SalesReportRow } from "../services/salesReportService";
import { REPORT_PAGE_SIZE, dmy, money } from "../utils/reportUtils";

interface Props {
  rows: SalesReportRow[];
  page: number;
  onPageChange: (page: number) => void;
}

function paymentColor(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "failed":
      return "error";
    case "refunded":
    case "partially_refunded":
      return "info";
    default:
      return "warning";
  }
}

export default function SalesReportTable({ rows, page, onPageChange }: Props) {
  const pageRows = rows.slice(page * REPORT_PAGE_SIZE, (page + 1) * REPORT_PAGE_SIZE);

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="right">Units</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Refunded</TableCell>
              <TableCell align="right">Net sales</TableCell>
              <TableCell align="right">GST incl.</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{row.orderId}</TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.customerName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {row.customerEmail || "-"}
                  </Typography>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>{dmy(row.orderDate)}</TableCell>

                <TableCell>
                  <OrderStatusChip status={row.orderStatus as OrderStatus} />
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={row.paymentStatus.replace(/_/g, " ")}
                    color={paymentColor(row.paymentStatus)}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {row.paymentMethod.toUpperCase()}
                  </Typography>
                </TableCell>

                <TableCell align="right">{row.productsSold}</TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {money(row.totalAmount)}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {row.refundedAmount > 0 ? money(row.refundedAmount) : "-"}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                  {row.countsAsSale ? (
                    money(row.netAmount)
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Not counted
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {row.gstAmount > 0 ? money(row.gstAmount) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {rows.length > REPORT_PAGE_SIZE && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          rowsPerPage={REPORT_PAGE_SIZE}
          rowsPerPageOptions={[]}
          onPageChange={(_, next) => onPageChange(next)}
        />
      )}
    </>
  );
}