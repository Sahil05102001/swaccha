import {
    Alert,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";

import { useTopCustomers } from "../hooks/useTopCustomers";

export default function TopCustomersCard() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useTopCustomers();

    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <Stack
                        sx={{
                            alignItems: "center",
                            justifyContent: "center",
                            py: 4,
                        }}
                    >
                        <CircularProgress />
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (isError || !data) {
        return (
            <Alert severity="error">
                {String(error ?? "Failed to load top customers.")}
            </Alert>
        );
    }

    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Top Customers
                </Typography>

                {data.length === 0 ? (
                    <Typography color="text.secondary">
                        No customer data available.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {data.map((customer, index) => (
                            <div key={customer.userId}>
                                <ListItem
                                    disableGutters
                                    sx={{
                                        display: "block",
                                        py: 1.5,
                                    }}
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${customer.customerName}`}
                                        secondary={
                                            <>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {customer.customerEmail || "No email available"}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Orders: {customer.totalOrders}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ₹{customer.totalSpent.toLocaleString("en-IN")}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Last Order:{" "}
                                                    {customer.lastOrderDate
                                                        ? customer.lastOrderDate.toLocaleDateString(
                                                              "en-IN"
                                                          )
                                                        : "-"}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>

                                {index < data.length - 1 && <Divider />}
                            </div>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}