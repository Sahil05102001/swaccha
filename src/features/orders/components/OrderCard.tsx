import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { Link, useNavigate } from "react-router-dom";

import OrderStatusChip from "./OrderStatusChip";

import { useAuth } from "@/features/auth/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import ReviewDialog from "@/features/reviews/components/ReviewDialog";

import type { Order, OrderItem } from "../types/order";
import { generateInvoice } from "../utils/generateInvoice";

import CancelOrderButton from "./CancelOrderButton";
import RefundNote from "./RefundNote";
import OrderLiveTracker from "./OrderLiveTracker";

interface OrderCardProps {
  order: Order;
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

const pillButtonBase = {
  borderRadius: 999,
  py: 1.1,
  px: 3,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "none",
  whiteSpace: "nowrap",
} as const;

function Detail({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          color: COLORS.muted,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.25,
          fontWeight: highlight ? 700 : 500,
          fontSize: highlight ? "1.15rem" : "1rem",
          color: highlight ? COLORS.blue : COLORS.text,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);

  const orderDate = order.createdAt.toDate();

  // Invoice and reviews are only available once the order is delivered.
  const isDelivered = order.orderStatus === "delivered";
  const canReview = isDelivered && !!user?.emailVerified;

  const handleDownloadInvoice = () => {
    generateInvoice({
      orderId: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.shippingAddress.phoneNumber,
      paymentMethod: order.paymentMethod.toUpperCase(),
      paymentStatus: order.paymentStatus,
      orderDate: orderDate.toLocaleString(),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      discount: order.discount ?? 0,
      total: order.totalAmount,
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: COLORS.white,
        backgroundImage: "none",
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          "&:last-child": { pb: { xs: 2, sm: 3 } },
        }}
      >
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          {/* Top row: order number + date, status chip */}
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
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  color: COLORS.text,
                  wordBreak: "break-all",
                }}
              >
                #{order.orderNumber}
              </Typography>
              <Typography
                sx={{ mt: 0.25, fontSize: "0.85rem", color: COLORS.muted }}
              >
                {orderDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>

            <OrderStatusChip status={order.orderStatus} />
          </Stack>

          <Divider sx={{ borderColor: COLORS.border }} />

          <OrderLiveTracker order={order} />

          {/* Details */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Detail label="Items" value={`${order.items.length}`} />
            <Detail
              label="Payment"
              value={order.paymentMethod.toUpperCase()}
            />
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" } }}>
              <Detail
                label="Total"
                value={`₹${order.totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                highlight
              />
            </Box>
          </Box>

          {/* Delivery details (once shipped) */}
          {order.orderStatus === "shipped" && order.deliveryPersonName && (
            <Box
              sx={{
                p: 1.5,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
                bgcolor: "#FAFAFA",
              }}
            >
              <Typography
                sx={{
                  mb: 1.25,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: COLORS.muted,
                }}
              >
                On its way
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                  gap: 2,
                }}
              >
                {order.estimatedDelivery && (
                  <Detail
                    label="Expected"
                    value={order.estimatedDelivery
                      .toDate()
                      .toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  />
                )}
                <Detail label="Delivery partner" value={order.deliveryPersonName} />
                {order.deliveryPersonPhone && (
                  <Detail label="Phone" value={order.deliveryPersonPhone} />
                )}
                {order.trackingNumber && (
                  <Detail label="Reference" value={order.trackingNumber} />
                )}
              </Box>
            </Box>
          )}

          {order.orderStatus === "delivered" && order.deliveredAt && (
            <Typography sx={{ fontSize: "0.85rem", color: COLORS.muted }}>
              Delivered on{" "}
              {order.deliveredAt.toDate().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          )}

          <RefundNote order={order} />

          {/* Reviews: only for delivered orders */}
          {isDelivered && (
            <Box
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderBottom: `1px solid ${COLORS.border}`,
                  bgcolor: "#FAFAFA",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: COLORS.muted,
                  }}
                >
                  Rate your items
                </Typography>
              </Box>

              {!user?.emailVerified && (
                <Typography
                  sx={{
                    px: 1.5,
                    py: 1,
                    fontSize: "0.8rem",
                    color: COLORS.muted,
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}
                >
                  Verify your email to write reviews.{" "}
                  <MuiLink
                    component={Link}
                    to="/profile"
                    underline="hover"
                    sx={{ fontWeight: 600, color: COLORS.text }}
                  >
                    Go to profile
                  </MuiLink>
                </Typography>
              )}

              {order.items.map((item, index) => (
                <Stack
                  key={`${item.productId}-${index}`}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    p: 1.5,
                    alignItems: "center",
                    borderTop: index > 0 ? `1px solid ${COLORS.border}` : 0,
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: COLORS.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Button
                    disableRipple
                    disabled={!canReview}
                    startIcon={<RateReviewOutlinedIcon />}
                    onClick={() => setReviewItem(item)}
                    sx={{
                      flexShrink: 0,
                      borderRadius: 999,
                      px: { xs: 1.5, sm: 2 },
                      py: 0.5,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textTransform: "none",
                      color: COLORS.text,
                      border: `1px solid ${COLORS.border}`,
                      "&:hover": {
                        borderColor: COLORS.text,
                        bgcolor: "transparent",
                      },
                      "&.Mui-disabled": {
                        color: COLORS.muted,
                        borderColor: COLORS.border,
                      },
                    }}
                  >
                    Review
                  </Button>
                </Stack>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ pt: 0.5 }}
          >
            <Button
              fullWidth
              disableRipple
              onClick={() => navigate(`/orders/${order.id}`)}
              sx={{
                ...pillButtonBase,
                color: COLORS.text,
                bgcolor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                "&:hover": {
                  bgcolor: COLORS.white,
                  borderColor: COLORS.text,
                  boxShadow: "none",
                },
              }}
            >
              View details
            </Button>

            {isDelivered && (
              <Button
                fullWidth
                disableRipple
                startIcon={<DownloadOutlinedIcon />}
                onClick={handleDownloadInvoice}
                sx={{
                  ...pillButtonBase,
                  color: COLORS.white,
                  bgcolor: COLORS.black,
                  border: `1px solid ${COLORS.black}`,
                  "&:hover": { bgcolor: COLORS.black, boxShadow: "none" },
                }}
              >
                Download invoice
              </Button>
            )}
            <CancelOrderButton order={order} />
          </Stack>
        </Stack>
      </CardContent>

      {reviewItem && (
        <ReviewDialog
          open
          onClose={() => setReviewItem(null)}
          onSaved={(isEdit) =>
            showSnackbar(
              isEdit ? "Review updated." : "Thanks for your review!",
              "success"
            )
          }
          productId={reviewItem.productId}
          productName={reviewItem.name}
          orderId={order.id}
        />
      )}
    </Card>
  );
}