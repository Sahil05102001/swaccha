import {
    Alert,
    Button,
    Card,
    CardContent,
    Divider,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

import type { Order } from "../types/order";

import { useUpdateOrderShippingDetails } from "../hooks/useOrders";

interface Props {
    order: Order;
}

export default function ShippingManagementCard({
    order,
}: Props) {
    const mutation =
        useUpdateOrderShippingDetails();

    const [trackingNumber, setTrackingNumber] =
        useState(order.trackingNumber ?? "");

    const [
        deliveryPersonName,
        setDeliveryPersonName,
    ] = useState(order.deliveryPersonName ?? "");

    const [
        deliveryPersonPhone,
        setDeliveryPersonPhone,
    ] = useState(order.deliveryPersonPhone ?? "");

    const [estimatedDelivery, setEstimatedDelivery] =
        useState(
            order.estimatedDelivery
                ? order.estimatedDelivery
                    .toDate()
                    .toISOString()
                    .split("T")[0]
                : ""
        );

    const [notes, setNotes] = useState(
        order.notes ?? ""
    );

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        severity: "success" | "error";
        message: string;
    }>({
        open: false,
        severity: "success",
        message: "",
    });

    useEffect(() => {
        setTrackingNumber(
            order.trackingNumber ?? ""
        );

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

    async function handleSave() {
        try {
            await mutation.mutateAsync({
                orderId: order.id,
                data: {
                    trackingNumber:
                        trackingNumber.trim() || undefined,

                    deliveryPersonName:
                        deliveryPersonName.trim() ||
                        undefined,

                    deliveryPersonPhone:
                        deliveryPersonPhone.trim() ||
                        undefined,

                    estimatedDelivery:
                        estimatedDelivery
                            ? Timestamp.fromDate(
                                new Date(
                                    estimatedDelivery
                                )
                            )
                            : undefined,

                    notes:
                        notes.trim() || undefined,
                },
            });

            setSnackbar({
                open: true,
                severity: "success",
                message:
                    "Shipping details updated successfully.",
            });
        } catch {
            setSnackbar({
                open: true,
                severity: "error",
                message:
                    "Failed to update shipping details.",
            });
        }
    }

    return (
        <>
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                    >
                        Shipping Management
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={3}>
                        <TextField
                            label="Tracking Number"
                            value={trackingNumber}
                            onChange={(e) =>
                                setTrackingNumber(
                                    e.target.value
                                )
                            }
                            fullWidth
                        />

                        <TextField
                            label="Delivery Person Name"
                            value={deliveryPersonName}
                            onChange={(e) =>
                                setDeliveryPersonName(
                                    e.target.value
                                )
                            }
                            fullWidth
                        />

                        <TextField
                            label="Delivery Person Phone"
                            value={deliveryPersonPhone}
                            onChange={(e) =>
                                setDeliveryPersonPhone(
                                    e.target.value
                                )
                            }
                            fullWidth
                        />

                        <TextField
                            type="date"
                            label="Estimated Delivery"
                            value={estimatedDelivery}
                            onChange={(e) =>
                                setEstimatedDelivery(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Internal Notes"
                            value={notes}
                            onChange={(e) =>
                                setNotes(e.target.value)
                            }
                            multiline
                            rows={4}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending
                                ? "Saving..."
                                : "Save Shipping Details"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}