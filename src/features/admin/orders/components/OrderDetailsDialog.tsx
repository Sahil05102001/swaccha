import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
} from "@mui/material";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import type { Order } from "@/features/orders/types/order";

import CustomerInformation from "./CustomerInformation";
import OrderActions from "./OrderActions";
import OrderedItemsTable from "./OrderedItemsTable";
import OrderInformation from "./OrderInformation";
import OrderSummaryCard from "./OrderSummaryCard";
import ShippingInformation from "./ShippingInformation";

import { generateInvoice } from "@/features/orders/utils/generateInvoice";
import OrderRefundPanel from "./OrderRefundPanel";

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

  const handleDownloadInvoice = () => {
    generateInvoice({
      orderId: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone:
        order.shippingAddress.phoneNumber,
      paymentMethod:
        order.paymentMethod.toUpperCase(),
      paymentStatus: order.paymentStatus,
      orderDate: order.createdAt
        .toDate()
        .toLocaleString(),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      discount: order.discount ?? 0,
      total: order.totalAmount,
    });
  };

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

          <OrderRefundPanel order={order} />

          <Divider />

          <OrderActions order={order} />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        {order.orderStatus === "delivered" && (
          <Button
            variant="outlined"
            startIcon={
              <DownloadOutlinedIcon />
            }
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button>
        )}

        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}