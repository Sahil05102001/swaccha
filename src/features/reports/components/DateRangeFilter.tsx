import { Button, MenuItem, Stack, TextField } from "@mui/material";

import AdminSelect from "@/features/admin/components/AdminSelect";

export interface DateRangeFilterValue {
  startDate?: Date;
  endDate?: Date;
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
}

interface Props {
  value: DateRangeFilterValue;
  onChange: (value: DateRangeFilterValue) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

const toInput = (d?: Date) =>
  d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "";

function parts(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { y, m: m - 1, d };
}

const startOfDay = (value: string) => {
  const { y, m, d } = parts(value);
  return new Date(y, m, d, 0, 0, 0, 0);
};

const endOfDay = (value: string) => {
  const { y, m, d } = parts(value);
  return new Date(y, m, d, 23, 59, 59, 999);
};

const ORDER_STATUSES = [
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["packed", "Packed"],
  ["shipped", "Shipped"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
  ["returned", "Returned"],
];

const PAYMENT_STATUSES = [
  ["pending", "Pending"],
  ["paid", "Paid"],
  ["failed", "Failed"],
  ["partially_refunded", "Partly refunded"],
  ["refunded", "Refunded"],
];

export default function DateRangeFilter({ value, onChange }: Props) {
  const range = (daysBack: number) => {
    const start = new Date();
    start.setDate(start.getDate() - daysBack);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    onChange({ ...value, startDate: start, endDate: end });
  };

  const thisMonth = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    onChange({
      ...value,
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: end,
    });
  };

  const invalidRange =
    !!value.startDate && !!value.endDate && value.startDate > value.endDate;

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={() => range(0)}>
          Today
        </Button>
        <Button variant="outlined" size="small" onClick={() => range(6)}>
          Last 7 days
        </Button>
        <Button variant="outlined" size="small" onClick={() => range(29)}>
          Last 30 days
        </Button>
        <Button variant="outlined" size="small" onClick={thisMonth}>
          This month
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            onChange({ ...value, startDate: undefined, endDate: undefined })
          }
        >
          All time
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        useFlexGap
        sx={{ gap: 1.5, flexWrap: { md: "wrap" }, alignItems: { md: "flex-start" } }}
      >
        <TextField
          size="small"
          label="Search orders"
          placeholder="Order no., customer or email"
          value={value.search ?? ""}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          sx={{ minWidth: 240, flex: { md: "1 1 240px" } }}
        />

        <AdminSelect
          size="small"
          label="Order status"
          value={value.orderStatus ?? ""}
          onChange={(event) => onChange({ ...value, orderStatus: event.target.value })}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">All</MenuItem>
          {ORDER_STATUSES.map(([v, label]) => (
            <MenuItem key={v} value={v}>
              {label}
            </MenuItem>
          ))}
        </AdminSelect>

        <AdminSelect
          size="small"
          label="Payment status"
          value={value.paymentStatus ?? ""}
          onChange={(event) => onChange({ ...value, paymentStatus: event.target.value })}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">All</MenuItem>
          {PAYMENT_STATUSES.map(([v, label]) => (
            <MenuItem key={v} value={v}>
              {label}
            </MenuItem>
          ))}
        </AdminSelect>

        <TextField
          size="small"
          type="date"
          label="From"
          value={toInput(value.startDate)}
          onChange={(event) =>
            onChange({
              ...value,
              startDate: event.target.value ? startOfDay(event.target.value) : undefined,
            })
          }
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          size="small"
          type="date"
          label="To"
          value={toInput(value.endDate)}
          onChange={(event) =>
            onChange({
              ...value,
              endDate: event.target.value ? endOfDay(event.target.value) : undefined,
            })
          }
          error={invalidRange}
          helperText={invalidRange ? "Must not be before From." : undefined}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Button
          variant="outlined"
          onClick={() => onChange({})}
          sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
        >
          Clear filters
        </Button>
      </Stack>
    </Stack>
  );
}