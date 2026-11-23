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

import { REPORT_PAGE_SIZE, dmy, money } from "@/features/reports/utils/reportUtils";

import type { InventoryReportRow } from "../services/inventoryReportService";

interface Props {
  rows: InventoryReportRow[];
  page: number;
  onPageChange: (page: number) => void;
}

function statusColor(status: InventoryReportRow["stockStatus"]) {
  if (status === "Out of Stock") return "error";
  if (status === "Low Stock") return "warning";
  return "success";
}

export default function InventoryReportTable({ rows, page, onPageChange }: Props) {
  const pageRows = rows.slice(page * REPORT_PAGE_SIZE, (page + 1) * REPORT_PAGE_SIZE);

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Cost price</TableCell>
              <TableCell align="right">Selling price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Value at cost</TableCell>
              <TableCell align="right">Value at selling</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ minWidth: 180 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.sku || "-"}
                  </Typography>
                </TableCell>

                <TableCell>{row.category}</TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {row.purchasePrice > 0 ? money(row.purchasePrice) : "-"}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {money(row.sellingPrice)}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {row.stock}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {money(row.costValue)}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {money(row.retailValue)}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={row.stockStatus}
                    color={statusColor(row.stockStatus)}
                  />
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>{dmy(row.lastUpdated)}</TableCell>
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