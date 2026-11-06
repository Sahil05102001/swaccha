import {
    Alert,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import OrderStatusChip from "../components/OrderStatusChip";
import { useOrder } from "../hooks/useOrders";

export default function OrderDetailsPage() {
    const { id = "" } = useParams();
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

                    {order.paymentMethodType && (
                        <Typography>
                            <strong>Payment Method Type:</strong>{" "}
                            {order.paymentMethodType.toUpperCase()}
                        </Typography>
                    )}

                    {order.paymentProvider && (
                        <Typography>
                            <strong>Payment Provider:</strong>{" "}
                            {order.paymentProvider.toUpperCase()}
                        </Typography>
                    )}

                    <Typography>
                        <strong>Payment Status:</strong>{" "}
                        {order.paymentStatus.toUpperCase()}
                    </Typography>

                </Stack>
            </SectionCard>

            {(order.trackingNumber ||
                order.deliveryPersonName ||
                order.estimatedDelivery ||
                order.deliveredAt) && (
                    <SectionCard title="Delivery Information">
                        <Stack spacing={2}>
                            {order.estimatedDelivery &&
                                order.orderStatus !== "delivered" && (
                                    <Typography>
                                        <strong>Expected Delivery:</strong>{" "}
                                        {order.estimatedDelivery
                                            .toDate()
                                            .toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                    </Typography>
                                )}

                            {order.deliveredAt && (
                                <Typography>
                                    <strong>Delivered On:</strong>{" "}
                                    {order.deliveredAt
                                        .toDate()
                                        .toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                </Typography>
                            )}

                            {order.deliveryPersonName && (
                                <Typography>
                                    <strong>Delivery Partner:</strong>{" "}
                                    {order.deliveryPersonName}
                                </Typography>
                            )}

                            {order.deliveryPersonPhone && (
                                <Typography>
                                    <strong>Delivery Partner Phone:</strong>{" "}
                                    {order.deliveryPersonPhone}
                                </Typography>
                            )}

                            {order.trackingNumber && (
                                <Typography>
                                    <strong>Dispatch Reference:</strong>{" "}
                                    {order.trackingNumber}
                                </Typography>
                            )}
                        </Stack>
                    </SectionCard>
                )}

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
                subtitle={`${order.items.length} item${order.items.length > 1 ? "s" : ""
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

                    {!!order.discount && (
                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                            <Typography>
                                Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                            </Typography>
                            <Typography>-₹{order.discount}</Typography>
                        </Stack>
                    )}

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
        </PageContainer>
    );
}