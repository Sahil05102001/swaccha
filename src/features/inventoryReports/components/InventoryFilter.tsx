import { Button, MenuItem, Stack, TextField } from "@mui/material";

import AdminSelect from "@/features/admin/components/AdminSelect";

import {
  STOCK_STATUSES,
  type InventoryReportFilters,
} from "../services/inventoryReportService";

interface Props {
  value: InventoryReportFilters;
  categories: string[];
  onChange: (value: InventoryReportFilters) => void;
}

export default function InventoryFilter({ value, categories, onChange }: Props) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      useFlexGap
      sx={{ gap: 1.5, flexWrap: { md: "wrap" }, alignItems: { md: "center" } }}
    >
      <TextField
        size="small"
        label="Search products"
        placeholder="Name, SKU or category"
        value={value.search ?? ""}
        onChange={(event) => onChange({ ...value, search: event.target.value })}
        sx={{ minWidth: 240, flex: { md: "1 1 240px" } }}
      />

      <AdminSelect
        size="small"
        label="Category"
        value={value.category ?? ""}
        onChange={(event) => onChange({ ...value, category: event.target.value })}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </AdminSelect>

      <AdminSelect
        size="small"
        label="Stock status"
        value={value.stockStatus ?? ""}
        onChange={(event) => onChange({ ...value, stockStatus: event.target.value })}
        sx={{ minWidth: 170 }}
      >
        <MenuItem value="">All</MenuItem>
        {STOCK_STATUSES.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </AdminSelect>

      <Button
        variant="outlined"
        onClick={() => onChange({})}
        sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
      >
        Clear filters
      </Button>
    </Stack>
  );
}