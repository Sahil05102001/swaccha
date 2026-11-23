import { useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import AdminSelect from "@/features/admin/components/AdminSelect";
import { getProducts } from "@/features/products/services/productService";
import {
  useStockMovements,
  useStockSummary,
} from "@/features/stock/hooks/useStock";
import type { MovementType } from "@/features/stock/services/stockService";
import StockAdjustDialog from "../components/StockAdjustDialog";
import { useEffect} from "react";

const PAGE_SIZE = 10;
/** Safety limit for one export, so a huge history can't freeze the browser. */
const MAX_EXPORT_ROWS = 5000;

const TYPE_LABELS: Record<MovementType, string> = {
  initial: "Initial stock",
  received: "Stock received",
  sale: "Sale",
  manualAdd: "Manual addition",
  manualDeduct: "Manual deduction",
  return: "Return / restored",
  adjustment: "Adjustment",
};

const typeLabel = (type: string) =>
  TYPE_LABELS[type as MovementType] ?? type;

const ddmmyyyy = (iso: string) => iso.split("-").reverse().join("/");

const scrollTop = () => {
  window.scrollTo({ top: 0 });
  document.querySelector("main")?.scrollTo({ top: 0 });
};

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, flex: 1, minWidth: 130 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function AdminStockHistoryPage() {
  const { showSnackbar } = useSnackbar();
  const [productOpen, setProductOpen] = useState(false);

  // Close the product list when anything on the page scrolls. The listener runs
  // in the capture phase, so scrolling inside the admin layout is caught too.
  useEffect(() => {
    if (!productOpen) return;

    const openedAt = Date.now();

    const close = (event: Event) => {
      // Ignore the tiny scroll some browsers do right when the list opens.
      if (Date.now() - openedAt < 250) return;

      // Scrolling inside the list itself must not close it.
      const target = event.target;
      if (target instanceof Element && target.closest(".MuiAutocomplete-popper")) {
        return;
      }

      setProductOpen(false);
    };

    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [productOpen]);
  const [product, setProduct] = useState<{ id: string; label: string } | null>(null);
  const [pickerOpened, setPickerOpened] = useState(false);
  const [movementType, setMovementType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const filters = { productId: product?.id ?? "", movementType, from, to };

  const list = useStockMovements(filters);
  const summary = useStockSummary(filters);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: pickerOpened,
    staleTime: 5 * 60_000,
  });

  const options = products.map((p) => ({
    id: p.id,
    label: `${p.name}${p.sku ? ` (${p.sku})` : ""}`,
  }));

  const movements = list.data?.pages.flatMap((p) => p.movements) ?? [];
  const s = summary.data;
  const manualNet = s ? Number(s.manualIn ?? 0) - Number(s.manualOut ?? 0) : 0;

  // Rows are shown 10 at a time. More are fetched only when Next needs them.
  const start = pageIndex * PAGE_SIZE;
  const pageRows = movements.slice(start, start + PAGE_SIZE);
  const canPrev = pageIndex > 0;
  const canNext = start + PAGE_SIZE < movements.length || !!list.hasNextPage;

  const goNext = async () => {
    if (start + PAGE_SIZE >= movements.length && list.hasNextPage) {
      await list.fetchNextPage();
    }
    setPageIndex((i) => i + 1);
    scrollTop();
  };

  const goPrev = () => {
    setPageIndex((i) => Math.max(i - 1, 0));
    scrollTop();
  };

  const refreshing = list.isFetching && !list.isFetchingNextPage;

  const handleRefresh = async () => {
    setPageIndex(0);
    await Promise.all([list.refetch(), summary.refetch()]);
  };

  const filterLines = [
    product ? `Product: ${product.label}` : "",
    movementType ? `Type: ${typeLabel(movementType)}` : "",
    from ? `From: ${ddmmyyyy(from)}` : "",
    to ? `To: ${ddmmyyyy(to)}` : "",
  ].filter(Boolean);

  const handleExport = async (kind: "excel" | "pdf") => {
    setMenuAnchor(null);
    if (exporting) return;

    setExporting(kind);

    try {
      // Everything that matches the filters, not just what is on screen.
      let rows = movements;
      let more = !!list.hasNextPage;

      while (more && rows.length < MAX_EXPORT_ROWS) {
        const result = await list.fetchNextPage();
        if (result.isError) throw new Error("Could not load all stock history.");
        rows = result.data?.pages.flatMap((p) => p.movements) ?? rows;
        more = !!result.hasNextPage;
      }

      if (rows.length === 0) {
        showSnackbar("There is nothing to download for these filters.", "warning");
        return;
      }

      const truncated = rows.length > MAX_EXPORT_ROWS || more;
      const exportRows = rows.slice(0, MAX_EXPORT_ROWS);

      const meta = {
        filters: filterLines,
        typeLabel,
        summary: s
          ? {
            received: Number(s.received ?? 0),
            sold: Number(s.sold ?? 0),
            restored: Number(s.restored ?? 0),
            manualNet,
          }
          : undefined,
      };

      const exporter = await import("../utils/exportStockHistory");

      if (kind === "excel") {
        exporter.exportStockHistoryExcel(exportRows, meta);
      } else {
        await exporter.exportStockHistoryPdf(exportRows, meta);
      }

      showSnackbar(
        truncated
          ? `Downloaded the latest ${MAX_EXPORT_ROWS.toLocaleString("en-IN")} movements. Narrow the dates to get the rest.`
          : `Downloaded ${exportRows.length.toLocaleString("en-IN")} movements.`,
        truncated ? "warning" : "success",
      );
    } catch (e) {
      showSnackbar(
        e instanceof Error ? e.message : "The download failed. Please try again.",
        "error",
      );
    } finally {
      setExporting(null);
    }
  };

  const dash = (value: number | string) => (summary.isLoading ? "…" : value);

  return (
    <PageContainer>
      <PageHeader
        title="Stock History"
        subtitle="Every addition and deduction of stock, with the reason."
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void handleRefresh()}
              disabled={list.isFetching || summary.isFetching}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              disabled={exporting !== null || list.isLoading}
            >
              {exporting ? "Preparing..." : "Download"}
            </Button>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              transitionDuration={0}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: { border: "1px solid", borderColor: "divider" },
                },
              }}
            >
              <MenuItem onClick={() => void handleExport("excel")}>
                Excel (.xlsx)
              </MenuItem>
              <MenuItem onClick={() => void handleExport("pdf")}>
                PDF (.pdf)
              </MenuItem>
            </Menu>
          </Stack>
        }
      />

      <SectionCard>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            useFlexGap
            sx={{
              gap: 1.5,
              flexWrap: { md: "wrap" },
              alignItems: { md: "center" },
            }}
          >
            <Autocomplete
              size="small"
              sx={{ minWidth: 240, flex: { md: "1 1 240px" } }}
              options={options}
              value={product}
              loading={productsLoading}
              open={productOpen}
              onOpen={() => {
                setProductOpen(true);
                setPickerOpened(true);
              }}
              onClose={() => setProductOpen(false)}
              onChange={(_, v) => {
                setProduct(v);
                setPageIndex(0);
              }}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => <TextField {...params} label="Product" />}
            />

            <AdminSelect
              size="small"
              label="Type"
              value={movementType}
              onChange={(e) => {
                setMovementType(e.target.value);
                setPageIndex(0);
              }}
              sx={{ minWidth: 190 }}
            >
              <MenuItem value="">All types</MenuItem>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </AdminSelect>

            <TextField
              size="small"
              type="date"
              label="From"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPageIndex(0);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPageIndex(0);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Update stock
            </Button>
          </Stack>

          {summary.isError ? (
            <Alert severity="warning">
              The summary couldn't load. Open the browser console and create the
              index it links to.
            </Alert>
          ) : (
            <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5 }}>
              <Stat label="Stock received" value={dash(Number(s?.received ?? 0))} />
              <Stat label="Sold" value={dash(Number(s?.sold ?? 0))} />
              <Stat label="Returned / restored" value={dash(Number(s?.restored ?? 0))} />
              <Stat
                label="Manual changes (net)"
                value={dash(`${manualNet > 0 ? "+" : ""}${manualNet}`)}
              />
            </Stack>
          )}

          {list.isLoading ? (
            <Stack spacing={1} aria-label="Loading stock history">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={44} />
              ))}
            </Stack>
          ) : list.isError ? (
            <Alert severity="error">
              Failed to load stock history. If this is the first time you use this
              filter, open the browser console and create the index it links to.
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
                  {pageRows.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {m.createdAt
                          ?.toDate()
                          .toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, cursor: "pointer" }}
                          onClick={() => {
                            setProduct({ id: m.productId, label: m.productName });
                            setPageIndex(0);
                          }}
                        >
                          {m.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {m.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={typeLabel(m.movementType)}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: m.direction === "in" ? "success.main" : "error.main",
                        }}
                      >
                        {m.direction === "in" ? "+" : "-"}
                        {m.quantity}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {m.previousStock} → {m.newStock}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                          {[
                            m.referenceId && !m.note?.startsWith("Order")
                              ? m.referenceId
                              : null,
                            m.note,
                          ]
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

          {(canPrev || canNext) && movements.length > 0 && (
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", justifyContent: "flex-end" }}
            >
              <Typography variant="body2" color="text.secondary">
                Page {pageIndex + 1}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={goPrev}
                disabled={!canPrev}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => void goNext()}
                disabled={!canNext || list.isFetchingNextPage}
              >
                {list.isFetchingNextPage ? "Loading..." : "Next"}
              </Button>
            </Stack>
          )}
        </Stack>
      </SectionCard>

      <StockAdjustDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </PageContainer>
  );
}