import { MenuItem, type TextFieldProps } from "@mui/material";

import AdminSelect from "@/features/admin/components/AdminSelect";

import { GST_RATES } from "../types/tax";

type Props = Omit<
  TextFieldProps,
  "select" | "value" | "onChange" | "children"
> & {
  value: number | "";
  onChange: (value: number | "") => void;
  // Adds a first option for "no rate chosen" (used on the product form).
  emptyLabel?: string;
};

export default function RateSelect({
  value,
  onChange,
  emptyLabel,
  ...rest
}: Props) {
  return (
    <AdminSelect
      {...rest}
      value={value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
    >
      {emptyLabel !== undefined && <MenuItem value="">{emptyLabel}</MenuItem>}

      {GST_RATES.map((rate) => (
        <MenuItem key={rate} value={rate}>
          {rate}%
        </MenuItem>
      ))}
    </AdminSelect>
  );
}