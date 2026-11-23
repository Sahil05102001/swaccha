import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { cloudinaryThumb } from "@/features/admin/products/utils/imageUrl";
import type { Order } from "@/features/orders/types/order";

import OrderSection from "./OrderSection";

export default function OrderedItemsTable({ order }: { order: Order }) {
  return (
    <OrderSection title="Items">
      <TableContainer
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {order.items.map((item, index) => (
              <TableRow key={`${item.productId}-${index}`}>
                <TableCell>
                  <Box
                    component="img"
                    src={item.image ? cloudinaryThumb(item.image, 96) : undefined}
                    alt={item.name}
                    loading="lazy"
                    sx={{
                      display: "block",
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "#fff",
                    }}
                  />
                </TableCell>

                <TableCell sx={{ minWidth: 160 }}>{item.name}</TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  ₹{item.price.toLocaleString("en-IN")}
                </TableCell>

                <TableCell align="center">{item.quantity}</TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </OrderSection>
  );
}