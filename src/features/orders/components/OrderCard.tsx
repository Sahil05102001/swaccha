import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useNavigate } from "react-router-dom";

import OrderStatusChip from "./OrderStatusChip";

import type { Order } from "../types/order";
import { generateInvoice } from "../utils/generateInvoice";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({
  order,
}: OrderCardProps) {
  const navigate = useNavigate();

  const handleDownloadInvoice = () => {
    generateInvoice({
      orderId: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.shippingAddress.phoneNumber,
      paymentMethod: order.paymentMethod.toUpperCase(),
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
      discount: 0,
      total: order.totalAmount,
    });
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <OrderStatusChip status={order.orderStatus} />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              #{order.orderNumber}
            </Typography>
          </Stack>

          <Divider />

          <Typography>
            <strong>Items:</strong> {order.items.length}
          </Typography>

          <Typography>
            <strong>Payment:</strong>{" "}
            {order.paymentMethod.toUpperCase()}
          </Typography>

          <Typography>
            <strong>Total:</strong> ₹
            {order.totalAmount.toFixed(2)}
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate(`/orders/${order.id}`)
              }
            >
              View Details
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadOutlinedIcon />}
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}