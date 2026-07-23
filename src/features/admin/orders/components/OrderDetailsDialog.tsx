import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
} from "@mui/material";

import type { Order } from "@/features/orders/types/order";

import CustomerInformation from "./CustomerInformation";
import OrderActions from "./OrderActions";
import OrderedItemsTable from "./OrderedItemsTable";
import OrderInformation from "./OrderInformation";
import OrderSummaryCard from "./OrderSummaryCard";
import ShippingInformation from "./ShippingInformation";

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsDialog({
  open,
  order,
  onClose,
}: OrderDetailsDialogProps) {
  if (!order) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Order Details
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={4}>
          <OrderInformation order={order} />

          <Divider />

          <CustomerInformation order={order} />

          <Divider />

          <ShippingInformation order={order} />

          <Divider />

          <OrderedItemsTable order={order} />

          <Divider />

          <OrderSummaryCard order={order} />

          <Divider />

          <OrderActions order={order} />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}