import { Suspense } from "react";
import {
  Badge,
  Box,
  ButtonBase,
  LinearProgress,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PromoMarquee from "@/components/ui/PromoMarquee";
import { useStoreSettings } from "@/features/admin/hooks/useStoreSettings";
import { useCart } from "@/features/cart/hooks/useCart";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: settings } = useStoreSettings();
  const { data: cartItems } = useCart();

  const cartItemCount = (cartItems ?? []).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const getActiveValue = (): string | null => {
    const path = location.pathname;

    if (path === "/") return "/";
    if (path.startsWith("/orders")) return "/orders";
    if (path.startsWith("/wishlist")) return "/wishlist";
    if (path.startsWith("/cart")) return "/cart";

    return null;
  };

  const activeValue = getActiveValue();

  const navItems = [
    { label: "Home", path: "/", Icon: HomeOutlinedIcon },
    { label: "Orders", path: "/orders", Icon: ReceiptLongOutlinedIcon },
    { label: "Wishlist", path: "/wishlist", Icon: FavoriteBorderOutlinedIcon },
    { label: "Cart", path: "/cart", Icon: ShoppingCartOutlinedIcon },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        overflowX: "clip",

        // Black behind the reserved space for the mobile bottom navigation,
        // so the gap below the footer matches the footer.
        bgcolor: "#000000",

        // Reserve space for mobile navigation and device safe area.
        pb: {
          xs: "calc(84px + env(safe-area-inset-bottom, 0px))",
          md: 0,
        },
      }}
    >
      <ScrollToTop />
      {/* Announcement bar */}
      <PromoMarquee
        text={
          settings?.announcementTopText ??
          "🔥 BUY 1 GET 1 FREE • FREE SHIPPING ON ORDERS ABOVE ₹999 • USE CODE: SWACHHA10"
        }
      />

      {/* Navbar stays pinned at the top */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <Navbar />
      </Box>

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          bgcolor: "#FFFFFF",
        }}
      >
        <Suspense fallback={<LinearProgress />}>
          <Outlet />
        </Suspense>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <Box
        component="nav"
        aria-label="Mobile navigation"
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          left: { xs: 10, sm: 16 },
          right: { xs: 10, sm: 16 },
          bottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
          zIndex: 1200,
          p: "8px",
          borderRadius: "28px",

          // Dark frosted glass.
          background: "rgba(10, 14, 20, 0.78)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {navItems.map(({ label, path, Icon }) => {
            const isActive = activeValue === path;

            const icon =
              path === "/cart" ? (
                <Badge
                  badgeContent={cartItemCount}
                  color="error"
                  max={99}
                  invisible={cartItemCount === 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      minWidth: 17,
                      height: 17,
                      px: 0.4,
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Badge>
              ) : (
                <Icon sx={{ fontSize: 24 }} />
              );

            return (
              <ButtonBase
                key={path}
                onClick={() => navigate(path)}
                aria-label={
                  path === "/cart"
                    ? `${label}, ${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`
                    : label
                }
                aria-current={isActive ? "page" : undefined}
                disableRipple
                sx={{
                  // The active item grows to fit its label.
                  flex: isActive ? "2.2 1 0" : "1 1 0",
                  minWidth: 0,
                  height: 48,
                  gap: 1,
                  borderRadius: "20px",
                  justifyContent: "center",
                  backgroundColor: isActive ? "#00DDEB" : "transparent",
                  color: isActive ? "#071207" : "#FFFFFF",
                  transition: "flex-grow 200ms ease, background-color 200ms ease",
                  WebkitTapHighlightColor: "transparent",

                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                  },

                  "&.Mui-focusVisible": {
                    outline: "2px solid #00DDEB",
                    outlineOffset: 2,
                  },
                }}
              >
                {icon}

                {isActive && (
                  <Typography
                    component="span"
                    noWrap
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    {label}
                  </Typography>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}