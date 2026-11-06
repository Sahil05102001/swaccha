import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNavigate } from "react-router-dom";

import OrderCard from "../components/OrderCard";
import { useOrders } from "../hooks/useOrders";
import { useLiveOrders } from "../hooks/useLiveOrders";

// Swachha UI palette
const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  radio: "#B0B0B0",
};

// Same on every screen size.
const PAGE_SIZE = 3;

function PageShell({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: COLORS.white,
        color: COLORS.text,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
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

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useOrders();

  useLiveOrders();

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  const pageCount = Math.ceil(orders.length / PAGE_SIZE);
  // Clamped, so if the order count shrinks you never land on an empty page.
  const currentPage = Math.min(page, Math.max(pageCount, 1));

  const paginatedOrders = useMemo(
    () =>
      orders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [orders, currentPage]
  );

  // Scroll back to the top of the list when the page changes
  // (skipped on first load so the page doesn't jump).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    listTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  if (isLoading) {
    return (
      <PageShell center>
        <CircularProgress
          aria-label="Loading your orders"
          sx={{ color: COLORS.blue }}
        />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell>
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            color: COLORS.text,
            bgcolor: COLORS.white,
            borderColor: COLORS.border,
            borderRadius: 2,
          }}
        >
          Failed to load your orders.
        </Alert>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header */}
      <Box
        ref={listTopRef}
        sx={{
          mb: { xs: 3, md: 5 },
          pb: { xs: 2, md: 3 },
          borderBottom: `1px solid ${COLORS.border}`,
          position: "relative",
          scrollMarginTop: 16,
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: -1,
            width: { xs: 48, md: 72 },
            height: 2,
            bgcolor: COLORS.blue,
          },
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: COLORS.text,
          }}
        >
          My orders
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            color: COLORS.muted,
            fontSize: { xs: "0.875rem", md: "1rem" },
          }}
        >
          View and track all your orders.
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Stack
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            py: { xs: 6, md: 10 },
            px: 2,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 88, sm: 112 },
              height: { xs: 88, sm: 112 },
              borderRadius: "50%",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: { xs: 40, sm: 52 }, color: COLORS.blue }}
            />
          </Box>

          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.35rem", sm: "1.75rem" },
              color: COLORS.text,
            }}
          >
            No orders yet
          </Typography>

          <Typography
            sx={{
              maxWidth: 400,
              color: COLORS.muted,
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            You haven't placed any orders yet. Start shopping to see your
            orders here.
          </Typography>

          <Button
            onClick={() => navigate("/products")}
            disableElevation
            disableRipple
            sx={{
              mt: 1,
              px: 4,
              py: 1.25,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",
              color: COLORS.white,
              bgcolor: COLORS.black,
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.black, boxShadow: "none" },
            }}
          >
            Browse products
          </Button>
        </Stack>
      ) : (
        <>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            {paginatedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </Stack>

          {pageCount > 1 && (
            <Stack
              sx={{
                alignItems: "center",
                mt: { xs: 3, md: 4 },
              }}
            >
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(_, nextPage) => setPage(nextPage)}
                siblingCount={0}
                boundaryCount={1}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: COLORS.text,
                    borderColor: COLORS.border,
                    transition: "none",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: COLORS.black,
                    color: COLORS.white,
                    "&:hover": { bgcolor: COLORS.black },
                  },
                  "& .MuiPaginationItem-root:hover": {
                    bgcolor: "#F5F5F5",
                  },
                }}
              />

              <Typography
                sx={{
                  mt: 1,
                  fontSize: "0.85rem",
                  color: COLORS.muted,
                }}
              >
                Page {currentPage} of {pageCount}
              </Typography>
            </Stack>
          )}
        </>
      )}
    </PageShell>
  );
}