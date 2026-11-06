import { useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { getProducts } from "@/features/products/services/productService";
import {
  useStockMovements,
  useStockSummary,
} from "@/features/stock/hooks/useStock";
import type { MovementType } from "@/features/stock/services/stockService";

import StockAdjustDialog from "../components/StockAdjustDialog";

const TYPE_LABELS: Record<MovementType, string> = {
  initial: "Initial stock",
  received: "Stock received",
  sale: "Sale",
  manualAdd: "Manual addition",
  manualDeduct: "Manual deduction",
  return: "Return / restored",
  adjustment: "Adjustment",
};

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, flex: 1, minWidth: 130 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: "1.25rem" }}>{value}</Typography>
    </Paper>
  );
}

export default function AdminStockHistoryPage() {
  const [product, setProduct] = useState<{ id: string; label: string } | null>(null);
  const [pickerOpened, setPickerOpened] = useState(false);
  const [movementType, setMovementType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filters = { productId: product?.id ?? "", movementType, from, to };

  const list = useStockMovements(filters);
  const summary = useStockSummary(filters);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: pickerOpened,
    staleTime: 5 * 60_000,
  });

  const options = products.map((p) => ({ id: p.id, label: `${p.name}${p.sku ? ` (${p.sku})` : ""}` }));
  const movements = list.data?.pages.flatMap((p) => p.movements) ?? [];
  const s = summary.data;
  const manualNet = s ? Number(s.manualIn ?? 0) - Number(s.manualOut ?? 0) : 0;

  return (
    <PageContainer>
      <PageHeader
        title="Stock History"
        subtitle="Every addition and deduction of stock, with the reason."
      />

      <SectionCard>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
            <Autocomplete
              size="small"
              sx={{ minWidth: 240, flex: 1 }}
              options={options}
              value={product}
              loading={productsLoading}
              onOpen={() => setPickerOpened(true)}
              onChange={(_, v) => setProduct(v)}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => <TextField {...params} label="Product" />}
            />
            <TextField
              select size="small" label="Type" value={movementType}
              onChange={(e) => setMovementType(e.target.value)} sx={{ minWidth: 190 }}
            >
              <MenuItem value="">All types</MenuItem>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small" type="date" label="From" value={from}
              onChange={(e) => setFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small" type="date" label="To" value={to}
              onChange={(e) => setTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ whiteSpace: "nowrap" }}>
              Update stock
            </Button>
          </Stack>

          {summary.isError ? (
            <Alert severity="warning">
              The summary couldn't load. Open the browser console and create the index it links to.
            </Alert>
          ) : (
            <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5 }}>
              <Stat label="Stock received" value={summary.isLoading ? "…" : Number(s?.received ?? 0)} />
              <Stat label="Sold" value={summary.isLoading ? "…" : Number(s?.sold ?? 0)} />
              <Stat label="Returned / restored" value={summary.isLoading ? "…" : Number(s?.restored ?? 0)} />
              <Stat label="Manual changes (net)" value={summary.isLoading ? "…" : `${manualNet > 0 ? "+" : ""}${manualNet}`} />
            </Stack>
          )}

          {list.isLoading ? (
            <CircularProgress />
          ) : list.isError ? (
            <Alert severity="error">
              Failed to load stock history. If this is the first time you use this filter, open the browser console and create the index it links to.
            </Alert>
          ) : movements.length === 0 ? (
            <Typography color="text.secondary">No stock movements found.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movements.map((m) => (
                    <TableRow key={m.id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {m.createdAt?.toDate().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, cursor: "pointer" }}
                          onClick={() => setProduct({ id: m.productId, label: m.productName })}
                        >
                          {m.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{m.sku}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={TYPE_LABELS[m.movementType] ?? m.movementType} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: m.direction === "in" ? "success.main" : "error.main" }}>
                        {m.direction === "in" ? "+" : "-"}{m.quantity}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {m.previousStock} → {m.newStock}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                          {[m.referenceId && !m.note?.startsWith("Order") ? m.referenceId : null, m.note]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {list.hasNextPage && (
            <Button
              onClick={() => list.fetchNextPage()}
              disabled={list.isFetchingNextPage}
              sx={{ alignSelf: "center" }}
            >
              {list.isFetchingNextPage ? "Loading..." : "Load more"}
            </Button>
          )}
        </Stack>
      </SectionCard>

      <StockAdjustDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </PageContainer>
  );
}