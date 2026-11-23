import { Autocomplete, TextField } from "@mui/material";

import { useDropdown } from "@/features/admin/hooks/useDropdown";

interface PickerProduct {
  id: string;
  name: string;
}

interface ProductPickerProps {
  products: PickerProduct[];
  value: string;
  onChange: (productId: string) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

/** Searchable product list that closes when the page is scrolled. */
export default function ProductPicker({
  products,
  value,
  onChange,
  label = "Product",
  helperText,
  disabled = false,
}: ProductPickerProps) {
  const dropdown = useDropdown();

  const selected = products.find((product) => product.id === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      options={products}
      value={selected}
      onChange={(_, option) => onChange(option?.id ?? "")}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      open={dropdown.open}
      onOpen={dropdown.onOpen}
      onClose={dropdown.onClose}
      disabled={disabled}
      noOptionsText="No matching products"
      slotProps={{ listbox: { sx: { maxHeight: 240 } } }}
      renderInput={(params) => (
        <TextField {...params} label={label} helperText={helperText} />
      )}
    />
  );
}