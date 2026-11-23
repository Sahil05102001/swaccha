import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";
import AdminSelect from "@/features/admin/components/AdminSelect";
import { useDropdown } from "@/features/admin/hooks/useDropdown";
import { scrollToTop } from "@/features/admin/utils/scrollToTop";
import { getProducts } from "@/features/products/services/productService";
import { useAdjustStock } from "@/features/stock/hooks/useStock";


const ACTIONS = [
  { value: "received", label: "Stock received" },
  { value: "manualAdd", label: "Manual addition" },
  { value: "manualDeduct", label: "Manual deduction (reason required)" },
  { value: "correctionIn", label: "Correction: add (reason required)" },
  { value: "correctionOut", label: "Correction: remove (reason required)" },
];

const ACTION_HELP: Record<string, string> = {
  received:
    "New goods arrived from a supplier. Website orders and refunds update stock by themselves, so don't enter them here.",
  manualAdd:
    "Goods came in, but not from a supplier purchase. For example, a shop customer returned an item.",
  manualDeduct:
    "Goods left, but not through a website order. For example, sold in the shop, damaged, or given as a sample.",
  correctionIn:
    "No goods moved. The system showed too little. For example, a stock count found more than expected.",
  correctionOut:
    "No goods moved. The system showed too much. For example, a stock count found fewer than expected.",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StockAdjustDialog({ open, onClose }: Props) {
  const { showSnackbar } = useSnackbar();
  const adjust = useAdjustStock();
  const dropdown = useDropdown();

  const [pickerOpened, setPickerOpened] = useState(false);
  const [product, setProduct] = useState<{ id: string; label: string } | null>(null);
  const [action, setAction] = useState("received");
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  // Shares the ["products"] cache; it only loads when the picker is opened.
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: pickerOpened,
    staleTime: 5 * 60_000,
  });

  const options = products.map((p) => ({
    id: p.id,
    label: `${p.name}${p.sku ? ` (${p.sku})` : ""} · ${p.stock} in stock`,
  }));

  const needsNote = action !== "received" && action !== "manualAdd";
  const qty = Number(quantity);
  const valid =
    !!product &&
    Number.isInteger(qty) &&
    qty >= 1 &&
    (!needsNote || note.trim().length >= 3);

  const reset = () => {
    setProduct(null);
    setAction("received");
    setQuantity("");
    setReference("");
    setNote("");
  };

  const submit = () => {
    if (!product || !valid) return;

    adjust.mutate(
      {
        productId: product.id,
        action,
        quantity: qty,
        reference: reference.trim() || undefined,
        note: note.trim() || undefined,
      },
      {
        onSuccess: (r) => {
          showSnackbar(r.message, "success");
          reset();
          onClose();
          scrollToTop();
        },
        onError: (e) =>
          showSnackbar(e instanceof Error ? e.message : "Could not update stock.", "error"),
      },
    );
  };

  return (
    <Dialog open={open} onClose={adjust.isPending ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update stock</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Autocomplete
            options={options}
            value={product}
            loading={isLoading}
            open={dropdown.open}
            onOpen={() => {
              dropdown.onOpen();
              setPickerOpened(true);
            }}
            onClose={dropdown.onClose}
            onChange={(_, v) => setProduct(v)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => <TextField {...params} label="Product" />}
          />

          <AdminSelect
            label="What happened?"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            helperText={ACTION_HELP[action]}
          >
            {ACTIONS.map((a) => (
              <MenuItem key={a.value} value={a.value}>
                {a.label}
              </MenuItem>
            ))}
          </AdminSelect>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            helperText="How many to add or remove, not the new total."
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />

          {action === "received" && (
            <TextField
              label="Purchase reference or supplier (optional)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          )}

          <TextField
            label={needsNote ? "Reason (required)" : "Note (optional)"}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            minRows={2}
            slotProps={{ htmlInput: { maxLength: 300 } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={adjust.isPending}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={!valid || adjust.isPending}>
          {adjust.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}