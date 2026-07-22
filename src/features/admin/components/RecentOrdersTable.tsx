import {
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const orders = [
  {
    id: "ORD-1001",
    customer: "Sahil Sheikh",
    total: "₹550",
    status: "Pending",
  },
  {
    id: "ORD-1002",
    customer: "Rahul Sharma",
    total: "₹890",
    status: "Shipped",
  },
  {
    id: "ORD-1003",
    customer: "Amit Patel",
    total: "₹1,250",
    status: "Delivered",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "warning";
    case "Shipped":
      return "info";
    case "Delivered":
      return "success";
    default:
      return "default";
  }
}

export default function RecentOrdersTable() {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Recent Orders
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>

                <TableCell>{order.customer}</TableCell>

                <TableCell>{order.total}</TableCell>

                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  <Button size="small">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}