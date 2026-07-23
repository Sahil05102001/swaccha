import { useEffect, useMemo, useState } from "react";

import {
    Button,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import type {
    Order,
    OrderStatus,
    PaymentStatus,
} from "@/features/orders/types/order";

import { useUpdateAdminOrder } from "../hooks/useUpdateAdminOrder";
import UpdateOrderStatus from "./UpdateOrderStatus";
import UpdatePaymentStatus from "./UpdatePaymentStatus";

interface OrderActionsProps {
    order: Order;
}

export default function OrderActions({
    order,
}: OrderActionsProps) {
    const [orderStatus, setOrderStatus] =
        useState<OrderStatus>(order.orderStatus);

    const [paymentStatus, setPaymentStatus] =
        useState<PaymentStatus>(order.paymentStatus);

    const [trackingNumber, setTrackingNumber] =
        useState(order.trackingNumber ?? "");

    const [deliveryPersonName, setDeliveryPersonName] =
        useState(order.deliveryPersonName ?? "");

    const [deliveryPersonPhone, setDeliveryPersonPhone] =
        useState(order.deliveryPersonPhone ?? "");

    const [estimatedDelivery, setEstimatedDelivery] =
        useState("");

    const [notes, setNotes] =
        useState(order.notes ?? "");

    const { mutate, isPending } =
        useUpdateAdminOrder();

    useEffect(() => {
        setOrderStatus(order.orderStatus);
        setPaymentStatus(order.paymentStatus);
        setTrackingNumber(order.trackingNumber ?? "");
        setDeliveryPersonName(
            order.deliveryPersonName ?? ""
        );
        setDeliveryPersonPhone(
            order.deliveryPersonPhone ?? ""
        );

        setEstimatedDelivery(
            order.estimatedDelivery
                ? order.estimatedDelivery
                    .toDate()
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setNotes(order.notes ?? "");
    }, [order]);

    const hasChanges = useMemo(() => {
        const originalEstimatedDelivery =
            order.estimatedDelivery
                ? order.estimatedDelivery
                    .toDate()
                    .toISOString()
                    .split("T")[0]
                : "";

        return (
            orderStatus !== order.orderStatus ||
            paymentStatus !== order.paymentStatus ||
            trackingNumber !==
            (order.trackingNumber ?? "") ||
            deliveryPersonName !==
            (order.deliveryPersonName ?? "") ||
            deliveryPersonPhone !==
            (order.deliveryPersonPhone ?? "") ||
            estimatedDelivery !==
            originalEstimatedDelivery ||
            notes !== (order.notes ?? "")
        );
    }, [
        order,
        orderStatus,
        paymentStatus,
        trackingNumber,
        deliveryPersonName,
        deliveryPersonPhone,
        estimatedDelivery,
        notes,
    ]);

    const handleSave = () => {
        mutate({
            orderId: order.id,
            orderStatus,
            paymentStatus,
            trackingNumber:
                trackingNumber.trim() || undefined,
            deliveryPersonName:
                deliveryPersonName.trim() || undefined,
            deliveryPersonPhone:
                deliveryPersonPhone.trim() || undefined,
            estimatedDelivery:
                estimatedDelivery
                    ? new Date(estimatedDelivery)
                    : undefined,
            notes: notes.trim() || undefined,
        });
    };

    return (
        <Stack spacing={4}>
            <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
            >
                Order Management
            </Typography>

            <Grid
                container
                spacing={2}
            >
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <UpdateOrderStatus
                        value={orderStatus}
                        onChange={setOrderStatus}
                        disabled={isPending}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <UpdatePaymentStatus
                        value={paymentStatus}
                        onChange={setPaymentStatus}
                        disabled={isPending}
                    />
                </Grid>
            </Grid>

            <Divider />

            <Stack spacing={2}>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                >
                    Dispatch Information
                </Typography>

                <TextField
                    fullWidth
                    label="Dispatch Reference"
                    placeholder="Enter dispatch reference"
                    value={trackingNumber}
                    onChange={(event) =>
                        setTrackingNumber(event.target.value)
                    }
                    disabled={isPending}
                />
            </Stack>

            <Divider />

            <Stack spacing={2}>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                >
                    Delivery Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Delivery Person Name"
                            value={deliveryPersonName}
                            onChange={(event) =>
                                setDeliveryPersonName(
                                    event.target.value
                                )
                            }
                            disabled={isPending}
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Delivery Person Phone"
                            value={deliveryPersonPhone}
                            onChange={(event) =>
                                setDeliveryPersonPhone(
                                    event.target.value
                                )
                            }
                            disabled={isPending}
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    type="date"
                    label="Expected Delivery Date"
                    value={estimatedDelivery}
                    onChange={(event) =>
                        setEstimatedDelivery(event.target.value)
                    }
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    disabled={isPending}
                />
            </Stack>

            <Divider />

            <Stack spacing={2}>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                >
                    Internal Notes
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Notes"
                    value={notes}
                    onChange={(event) =>
                        setNotes(event.target.value)
                    }
                    disabled={isPending}
                />
            </Stack>

            <Divider />

            <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={!hasChanges || isPending}
            >
                {isPending
                    ? "Saving..."
                    : "Save Changes"}
            </Button>
        </Stack>
    );
}