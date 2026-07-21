import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import OrderStatusChip from "./OrderStatusChip";

import type { Order } from "../types/order";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({
  order,
}: OrderCardProps) {
  const navigate = useNavigate();

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

            <Typography variant="body2" color="text.secondary">
              #{order.id.slice(0, 8).toUpperCase()}
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

          <Button
            variant="outlined"
            onClick={() =>
              navigate(`/orders/${order.id}`)
            }
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}