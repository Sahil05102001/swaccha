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
import { getProducts } from "@/features/products/services/productService";
import { useAdjustStock } from "@/features/stock/hooks/useStock";

const ACTIONS = [
  { value: "received", label: "Stock received" },
  { value: "manualAdd", label: "Manual addition" },
  { value: "manualDeduct", label: "Manual deduction (reason required)" },
  { value: "correctionIn", label: "Correction: add (reason required)" },
  { value: "correctionOut", label: "Correction: remove (reason required)" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StockAdjustDialog({ open, onClose }: Props) {
  const { showSnackbar } = useSnackbar();
  const adjust = useAdjustStock();

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
            onOpen={() => setPickerOpened(true)}
            onChange={(_, v) => setProduct(v)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => <TextField {...params} label="Product" />}
          />

          <TextField select label="What happened?" value={action} onChange={(e) => setAction(e.target.value)}>
            {ACTIONS.map((a) => (
              <MenuItem key={a.value} value={a.value}>
                {a.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
        <Button onClick={onClose} disabled={adjust.isPending}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!valid || adjust.isPending}>
          {adjust.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}