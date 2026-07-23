import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";

import type { Order } from "@/features/orders/types/order";

interface OrderedItemsTableProps {
  order: Order;
}

export default function OrderedItemsTable({
  order,
}: OrderedItemsTableProps) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Ordered Items
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">
                Price
              </TableCell>
              <TableCell align="center">
                Qty
              </TableCell>
              <TableCell align="right">
                Total
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <img
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    style={{
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </TableCell>

                <TableCell>
                  {item.name}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {item.price.toLocaleString(
                    "en-IN"
                  )}
                </TableCell>

                <TableCell align="center">
                  {item.quantity}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}