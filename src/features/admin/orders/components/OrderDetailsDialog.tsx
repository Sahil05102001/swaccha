import { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import OrderStatusChip from "@/features/orders/components/OrderStatusChip";
import { generateInvoice } from "@/features/orders/utils/generateInvoice";
import { buildInvoiceData } from "@/features/orders/utils/buildInvoiceData";
import type { Order } from "@/features/orders/types/order";

import CustomerInformation from "./CustomerInformation";
import OrderActions from "./OrderActions";
import OrderCreditNotes from "./OrderCreditNotes";
import OrderedItemsTable from "./OrderedItemsTable";
import OrderInformation from "./OrderInformation";
import OrderRefundPanel from "./OrderRefundPanel";
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => contentRef.current?.scrollTo({ top: 0 });

  if (!order) {
    return null;
  }

  const handleDownloadInvoice = () => {
    generateInvoice(buildInvoiceData(order));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            boxShadow: "none",
            backgroundImage: "none",
            border: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: "1.1rem", overflowWrap: "anywhere" }}
          >
            Order {order.orderNumber}
          </Typography>
          <OrderStatusChip status={order.orderStatus} />
        </Stack>

        <IconButton aria-label="Close order details" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent ref={contentRef}>
        <Stack spacing={3} divider={<Divider flexItem />}>
          <OrderInformation order={order} />
          <CustomerInformation order={order} />
          <ShippingInformation order={order} />
          <OrderedItemsTable order={order} />
          <OrderSummaryCard order={order} />
          <OrderRefundPanel order={order} onSaved={scrollToTop} />
          <OrderCreditNotes order={order} />
          <OrderActions order={order} onSaved={scrollToTop} />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        {order.orderStatus === "delivered" && (
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            onClick={handleDownloadInvoice}
          >
            Download invoice
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}