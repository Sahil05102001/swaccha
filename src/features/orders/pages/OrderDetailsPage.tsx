import {
    Alert,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import PageContainer from "@/components/common/PageContainer";

import OrderStatusChip from "../components/OrderStatusChip";
import AdminOrderControls from "../components/AdminOrderControls";

import { useOrder } from "../hooks/useOrders";

export default function OrderDetailsPage() {
    const { id = "" } = useParams();
    const location = useLocation();

    const isAdminView =
        location.pathname.startsWith("/admin");

    const {
        data: order,
        isLoading,
        isError,
    } = useOrder(id);

    if (isLoading) {
        return (
            <Stack
                sx={{
                    minHeight: "60vh",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Stack>
        );
    }

    if (isError || !order) {
        return (
            <Stack sx={{ p: 4 }}>
                <Alert severity="error">
                    Failed to load order.
                </Alert>
            </Stack>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Order Details"
                subtitle="Track the status and view your purchased items."
            />

            <SectionCard title="Order Information">
                <Stack spacing={2}>
                    <OrderStatusChip status={order.orderStatus} />

                    <Typography>
                        <strong>Order ID:</strong> #{order.id}
                    </Typography>

                    <Typography>
                        <strong>Order Number:</strong>{" "}
                        {order.orderNumber}
                    </Typography>

                    <Typography>
                        <strong>Customer:</strong>{" "}
                        {order.customerName}
                    </Typography>

                    <Typography>
                        <strong>Email:</strong>{" "}
                        {order.customerEmail}
                    </Typography>

                    <Typography>
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod.toUpperCase()}
                    </Typography>

                    <Typography>
                        <strong>Payment Status:</strong>{" "}
                        {order.paymentStatus}
                    </Typography>
                </Stack>
            </SectionCard>

            <SectionCard title="Delivery Address">
                <Stack spacing={0.5}>
                    <Typography
                        sx={{
                            fontWeight: 600,
                        }}
                    >
                        {order.shippingAddress.fullName}
                    </Typography>

                    <Typography color="text.secondary">
                        {order.shippingAddress.phoneNumber}
                    </Typography>

                    <Typography>
                        {order.shippingAddress.addressLine1}
                    </Typography>

                    {order.shippingAddress.addressLine2 && (
                        <Typography>
                            {order.shippingAddress.addressLine2}
                        </Typography>
                    )}

                    <Typography>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                    </Typography>

                    <Typography>
                        {order.shippingAddress.postalCode}
                    </Typography>

                    <Typography>
                        {order.shippingAddress.country}
                    </Typography>
                </Stack>
            </SectionCard>

            <SectionCard
                title="Ordered Items"
                subtitle={`${order.items.length} item${
                    order.items.length > 1 ? "s" : ""
                }`}
            >
                <Stack spacing={2}>
                    {order.items.map((item, index) => (
                        <Stack
                            key={item.productId}
                            spacing={1}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                {item.name}
                            </Typography>

                            <Typography color="text.secondary">
                                ₹{item.price} ×{" "}
                                {item.quantity}
                            </Typography>

                            {index !==
                                order.items.length - 1 && (
                                <Divider />
                            )}
                        </Stack>
                    ))}
                </Stack>
            </SectionCard>

            <SectionCard title="Order Summary">
                <Stack spacing={1.5}>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent:
                                "space-between",
                        }}
                    >
                        <Typography>
                            Subtotal
                        </Typography>

                        <Typography>
                            ₹{order.subtotal}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent:
                                "space-between",
                        }}
                    >
                        <Typography>
                            Shipping
                        </Typography>

                        <Typography>
                            ₹
                            {order.shippingCharge}
                        </Typography>
                    </Stack>

                    <Divider />

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent:
                                "space-between",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Grand Total
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            ₹
                            {order.totalAmount}
                        </Typography>
                    </Stack>
                </Stack>
            </SectionCard>

            {isAdminView && (
                <AdminOrderControls order={order} />
            )}
        </PageContainer>
    );
}