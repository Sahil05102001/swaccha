import { useEffect, useMemo, useState } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import type {
    Order,
    OrderStatus,
} from "@/features/orders/types/order";

import { useSnackbar } from "@/contexts/SnackbarContext";

import { useUpdateAdminOrder } from "../hooks/useUpdateAdminOrder";
import UpdateOrderStatus from "./UpdateOrderStatus";

interface OrderActionsProps {
    order: Order;
}

// The only step an order can take from each status.
const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed"],
    confirmed: ["packed"],
    packed: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    returned: [],
    cancelled: [],
};

type ShippingErrors = Partial<
    Record<"trackingNumber" | "deliveryPersonName" | "deliveryPersonPhone" | "estimatedDelivery", string>
>;

// Local calendar date as YYYY-MM-DD (toISOString would shift it for IST).
function todayLocal() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

// Random reference for in-house deliveries. Replace it for courier / Porter.
function generateDispatchReference() {
    return `DSP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function cleanPhone(value: string) {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) {
        digits = digits.slice(2);
    }
    return digits;
}

export default function OrderActions({
    order,
}: OrderActionsProps) {
    const { showSnackbar } = useSnackbar();

    const [orderStatus, setOrderStatus] =
        useState<OrderStatus>(order.orderStatus);

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

    const [errors, setErrors] = useState<ShippingErrors>({});
    const [codDialogOpen, setCodDialogOpen] = useState(false);

    const { mutate, isPending } =
        useUpdateAdminOrder();

    useEffect(() => {
        setOrderStatus(order.orderStatus);
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
        setErrors({});
    }, [order]);

    const statusOptions = useMemo(
        () => [order.orderStatus, ...NEXT_STATUS[order.orderStatus]],
        [order.orderStatus]
    );

    const shippingRequired = orderStatus === "shipped";

    // Dispatch and delivery details only matter once the order is being
    // shipped (or has already been shipped / delivered).
    const showShippingSections =
        orderStatus === "shipped" || orderStatus === "delivered";

    const isCod = order.paymentMethod === "cod";
    const needsCodConfirmation =
        isCod &&
        orderStatus === "delivered" &&
        order.orderStatus !== "delivered";

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
        trackingNumber,
        deliveryPersonName,
        deliveryPersonPhone,
        estimatedDelivery,
        notes,
    ]);

    const handleStatusChange = (status: OrderStatus) => {
        setOrderStatus(status);

        // Pre-fill what the admin would otherwise have to type.
        if (status === "shipped") {
            setTrackingNumber((current) => current || generateDispatchReference());
            setEstimatedDelivery((current) => current || todayLocal());
        }
    };

    const validateShipping = () => {
        const next: ShippingErrors = {};

        if (!trackingNumber.trim()) {
            next.trackingNumber = "Dispatch reference is required";
        }
        if (!deliveryPersonName.trim()) {
            next.deliveryPersonName = "Delivery person name is required";
        }
        if (!deliveryPersonPhone.trim()) {
            next.deliveryPersonPhone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(cleanPhone(deliveryPersonPhone))) {
            next.deliveryPersonPhone = "Enter a valid 10-digit mobile number";
        }
        if (!estimatedDelivery) {
            next.estimatedDelivery = "Expected delivery date is required";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = (codCollected: boolean) => {
        mutate(
            {
                orderId: order.id,
                orderStatus,
                trackingNumber: trackingNumber.trim(),
                deliveryPersonName: deliveryPersonName.trim(),
                deliveryPersonPhone: deliveryPersonPhone.trim()
                    ? cleanPhone(deliveryPersonPhone)
                    : "",
                estimatedDelivery:
                    estimatedDelivery
                        ? new Date(estimatedDelivery)
                        : undefined,
                notes: notes.trim(),
                ...(codCollected ? { codPaymentCollected: true } : {}),
            },
            {
                onSettled: () => setCodDialogOpen(false),
            }
        );
    };

    const handleSave = () => {
        if (isPending) return;

        if (shippingRequired && !validateShipping()) return;

        if (needsCodConfirmation) {
            setCodDialogOpen(true);
            return;
        }

        submit(false);
    };

    const handleCodNotCollected = () => {
        setCodDialogOpen(false);
        // Nothing is saved: the status goes back to what it was.
        setOrderStatus(order.orderStatus);
        showSnackbar(
            "Order status was not changed because the payment was not collected.",
            "warning"
        );
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
                        onChange={handleStatusChange}
                        disabled={isPending}
                        options={statusOptions}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                </Grid>
            </Grid>

            {showShippingSections && (

                <>

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
                            required={shippingRequired}
                            label="Dispatch Reference"
                            placeholder="Enter dispatch reference"
                            value={trackingNumber}
                            onChange={(event) => {
                                setTrackingNumber(event.target.value);
                                if (errors.trackingNumber) {
                                    setErrors((prev) => ({ ...prev, trackingNumber: "" }));
                                }
                            }}
                            error={!!errors.trackingNumber}
                            helperText={
                                errors.trackingNumber ||
                                (shippingRequired
                                    ? "Auto-generated for in-house delivery. Replace it with the courier or Porter reference if you use one."
                                    : undefined)
                            }
                            disabled={isPending}
                        />
                    </Stack>

                    <Divider />

                </>

            )}

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
                            required={shippingRequired}
                            label="Delivery Person Name"
                            value={deliveryPersonName}
                            onChange={(event) => {
                                setDeliveryPersonName(event.target.value);
                                if (errors.deliveryPersonName) {
                                    setErrors((prev) => ({ ...prev, deliveryPersonName: "" }));
                                }
                            }}
                            error={!!errors.deliveryPersonName}
                            helperText={errors.deliveryPersonName}
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
                            required={shippingRequired}
                            label="Delivery Person Phone"
                            value={deliveryPersonPhone}
                            onChange={(event) => {
                                setDeliveryPersonPhone(event.target.value);
                                if (errors.deliveryPersonPhone) {
                                    setErrors((prev) => ({ ...prev, deliveryPersonPhone: "" }));
                                }
                            }}
                            error={!!errors.deliveryPersonPhone}
                            helperText={errors.deliveryPersonPhone}
                            disabled={isPending}
                            slotProps={{ htmlInput: { inputMode: "tel" } }}
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    required={shippingRequired}
                    type="date"
                    label="Expected Delivery Date"
                    value={estimatedDelivery}
                    onChange={(event) => {
                        setEstimatedDelivery(event.target.value);
                        if (errors.estimatedDelivery) {
                            setErrors((prev) => ({ ...prev, estimatedDelivery: "" }));
                        }
                    }}
                    error={!!errors.estimatedDelivery}
                    helperText={
                        errors.estimatedDelivery ||
                        (shippingRequired
                            ? "Defaults to today. Change it if the order was placed outside working hours."
                            : undefined)
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

            {/* COD cash confirmation */}
            <Dialog
                open={codDialogOpen}
                onClose={isPending ? undefined : handleCodNotCollected}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Cash payment collected?</DialogTitle>

                <DialogContent>
                    <Stack spacing={1.5}>
                        <Typography variant="body2">
                            This is a cash on delivery order. Call the delivery
                            person and confirm they collected{" "}
                            <strong>
                                ₹
                                {order.totalAmount.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </strong>{" "}
                            from the customer before marking it delivered.
                        </Typography>

                        {(order.deliveryPersonName || order.deliveryPersonPhone) && (
                            <Typography variant="body2" color="text.secondary">
                                Delivery person: {order.deliveryPersonName ?? "—"}
                                {order.deliveryPersonPhone
                                    ? ` · ${order.deliveryPersonPhone}`
                                    : ""}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCodNotCollected} disabled={isPending}>
                        No, not collected
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => submit(true)}
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Yes, collected"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}