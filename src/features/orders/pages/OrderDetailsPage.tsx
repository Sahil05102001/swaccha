import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import type { ReactNode } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import CancelOrderButton from "../components/CancelOrderButton";
import DeliveredHelpNote from "../components/DeliveredHelpNote";
import OrderLiveTracker from "../components/OrderLiveTracker";
import OrderStatusChip from "../components/OrderStatusChip";
import RefundNote from "../components/RefundNote";
import { useOrder } from "../hooks/useOrders";
import { buildInvoiceData } from "../utils/buildInvoiceData";
import { generateInvoice } from "../utils/generateInvoice";

const COLORS = {
    blue: "#00D9FF",
    teal: "#007F89",
    white: "#FFFFFF",
    black: "#000000",
    text: "#212121",
    muted: "#757575",
    border: "#E0E0E0",
    page: "#F5F7FA",
};

const rupees = (value: number) =>
    `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

function Section({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <Box
            component="section"
            sx={{
                p: { xs: 2, sm: 3 },
                border: `1px solid ${COLORS.border}`,
                borderRadius: "12px",
                bgcolor: COLORS.white,
                minWidth: 0,
            }}
        >
            <Typography
                component="h2"
                sx={{
                    mb: 1.5,
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    color: COLORS.text,
                }}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
}

function Row({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: ReactNode;
    strong?: boolean;
}) {
    return (
        <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "baseline", gap: 2 }}
        >
            <Typography
                sx={{
                    color: strong ? COLORS.text : COLORS.muted,
                    fontWeight: strong ? 700 : 400,
                    fontSize: strong ? "1.05rem" : "0.92rem",
                }}
            >
                {label}
            </Typography>
            <Typography
                component="div"
                sx={{
                    color: strong ? COLORS.teal : COLORS.text,
                    fontWeight: strong ? 700 : 500,
                    fontSize: strong ? "1.15rem" : "0.92rem",
                    textAlign: "right",
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </Typography>
        </Stack>
    );
}

function PageShell({
    children,
    center = false,
}: {
    children: ReactNode;
    center?: boolean;
}) {
    return (
        <Box
            component="main"
            sx={{
                bgcolor: COLORS.page,
                minHeight: "100vh",
                width: "100%",
                overflowX: "hidden",
                py: { xs: 2.5, sm: 3.5, md: 4 },
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    px: { xs: 2, sm: 3 },
                    ...(center && {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh",
                    }),
                }}
            >
                {children}
            </Container>
        </Box>
    );
}

export default function OrderDetailsPage() {
    const { id = "" } = useParams();
    const { data: order, isLoading, isError } = useOrder(id);

    if (isLoading) {
        return (
            <PageShell center>
                <CircularProgress
                    aria-label="Loading order"
                    sx={{ color: COLORS.blue }}
                />
            </PageShell>
        );
    }

    if (isError || !order) {
        return (
            <PageShell>
                <Alert severity="error">Failed to load order.</Alert>
            </PageShell>
        );
    }

    const isDelivered = order.orderStatus === "delivered";
    const address = order.shippingAddress;

    const paymentLabel =
        order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online";

    const paymentStatusLabel = order.paymentStatus
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

    const hasDeliveryInfo =
        order.trackingNumber ||
        order.deliveryPersonName ||
        order.deliveryPersonPhone ||
        (order.estimatedDelivery && !isDelivered) ||
        order.deliveredAt;

    return (
        <PageShell>
            <Stack spacing={{ xs: 2, md: 2.5 }}>
                {/* Header */}
                <Box>
                    <Button
                        component={RouterLink}
                        to="/orders"
                        disableRipple
                        startIcon={<ArrowBackIcon fontSize="small" />}
                        sx={{
                            mb: 1,
                            ml: -1,
                            px: 1,
                            textTransform: "none",
                            fontWeight: 600,
                            color: COLORS.teal,
                            "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                        }}
                    >
                        Back to my orders
                    </Button>

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            columnGap: 2,
                            rowGap: 1,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "1.4rem", sm: "1.75rem" },
                                    letterSpacing: "-0.02em",
                                    color: COLORS.text,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                Order #{order.orderNumber}
                            </Typography>
                            <Typography sx={{ mt: 0.25, fontSize: "0.875rem", color: COLORS.muted }}>
                                Placed on {formatDate(order.createdAt.toDate())}
                            </Typography>
                        </Box>

                        <OrderStatusChip status={order.orderStatus} />
                    </Stack>
                </Box>

                {/* Progress, refund info, support note: each shows only when it has something to say */}
                <OrderLiveTracker order={order} />
                <RefundNote order={order} />
                {isDelivered && <DeliveredHelpNote orderNumber={order.orderNumber} />}

                {/* Items */}
                <Section
                    title={`Items (${order.items.length})`}
                >
                    <Stack divider={<Divider sx={{ borderColor: COLORS.border }} />}>
                        {order.items.map((item, index) => (
                            <Stack
                                key={`${item.productId}-${index}`}
                                direction="row"
                                spacing={1.5}
                                sx={{ py: 1.5, alignItems: "center", minWidth: 0 }}
                            >
                                <Box
                                    component={RouterLink}
                                    to={`/products/${item.productId}`}
                                    sx={{ flexShrink: 0, lineHeight: 0 }}
                                >
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt=""
                                        loading="lazy"
                                        sx={{
                                            width: { xs: 56, sm: 68 },
                                            height: { xs: 56, sm: 68 },
                                            objectFit: "contain",
                                            bgcolor: COLORS.white,
                                            border: `1px solid ${COLORS.border}`,
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        component={RouterLink}
                                        to={`/products/${item.productId}`}
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            fontWeight: 600,
                                            fontSize: { xs: "0.9rem", sm: "0.95rem" },
                                            lineHeight: 1.4,
                                            color: COLORS.text,
                                            textDecoration: "none",
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ mt: 0.25, fontSize: "0.8rem", color: COLORS.muted }}>
                                        Qty {item.quantity} × {rupees(item.price)}
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{ flexShrink: 0, fontWeight: 700, fontSize: "0.95rem", color: COLORS.text }}
                                >
                                    {rupees(item.price * item.quantity)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Section>

                {/* Delivery address */}
                <Section title="Delivery address">
                    <Stack spacing={0.25}>
                        <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
                            {address.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", color: COLORS.muted }}>
                            {address.phoneNumber}
                        </Typography>
                        <Typography
                            sx={{ mt: 0.5, fontSize: "0.92rem", lineHeight: 1.7, color: COLORS.text, overflowWrap: "anywhere" }}
                        >
                            {[address.addressLine1, address.addressLine2]
                                .filter(Boolean)
                                .join(", ")}
                            <br />
                            {address.city}, {address.state} {address.postalCode}
                            <br />
                            {address.country}
                        </Typography>
                    </Stack>
                </Section>

                {/* Delivery information */}
                {hasDeliveryInfo && (
                    <Section title="Delivery information">
                        <Stack spacing={1.25}>
                            {order.estimatedDelivery && !isDelivered && (
                                <Row
                                    label="Expected delivery"
                                    value={formatDate(order.estimatedDelivery.toDate())}
                                />
                            )}
                            {order.deliveredAt && (
                                <Row
                                    label="Delivered on"
                                    value={formatDate(order.deliveredAt.toDate())}
                                />
                            )}
                            {order.deliveryPersonName && (
                                <Row label="Delivery partner" value={order.deliveryPersonName} />
                            )}
                            {order.deliveryPersonPhone && (
                                <Row label="Partner phone" value={order.deliveryPersonPhone} />
                            )}
                            {order.trackingNumber && (
                                <Row label="Reference" value={order.trackingNumber} />
                            )}
                        </Stack>
                    </Section>
                )}

                {/* Payment and summary */}
                <Section title="Payment summary">
                    <Stack spacing={1.25}>
                        <Row label="Payment method" value={paymentLabel} />
                        <Row label="Payment status" value={paymentStatusLabel} />

                        <Divider sx={{ borderColor: COLORS.border, my: 0.5 }} />

                        <Row label="Subtotal" value={rupees(order.subtotal)} />
                        <Row
                            label="Shipping"
                            value={order.shippingCharge > 0 ? rupees(order.shippingCharge) : "Free"}
                        />
                        {!!order.discount && (
                            <Row
                                label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
                                value={`-${rupees(order.discount)}`}
                            />
                        )}

                        <Divider sx={{ borderColor: COLORS.border, my: 0.5 }} />

                        <Row label="Total" value={rupees(order.totalAmount)} strong />
                    </Stack>
                </Section>

                {/* Actions */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    {isDelivered && (
                        <Button
                            fullWidth
                            disableRipple
                            startIcon={<DownloadOutlinedIcon />}
                            onClick={() => generateInvoice(buildInvoiceData(order))}
                            sx={{
                                py: 1.1,
                                px: 3,
                                borderRadius: 999,
                                fontWeight: 600,
                                textTransform: "none",
                                color: COLORS.white,
                                bgcolor: COLORS.black,
                                border: `1px solid ${COLORS.black}`,
                                boxShadow: "none",
                                "&:hover": { bgcolor: COLORS.black, boxShadow: "none" },
                            }}
                        >
                            Download invoice
                        </Button>
                    )}
                    <CancelOrderButton order={order} />
                </Stack>
            </Stack>
        </PageShell>
    );
}
