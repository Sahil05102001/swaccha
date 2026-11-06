
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
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

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: settings } = useStoreSettings();

  const getActiveValue = () => {
    if (location.pathname === "/") {
      return "/";
    }

    if (location.pathname.startsWith("/products")) {
      return "/products";
    }

    if (location.pathname.startsWith("/contact")) {
      return "/contact";
    }

    if (location.pathname.startsWith("/cart")) {
      return "/cart";
    }

    return "/";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        overflowX: "clip",
      }}
    >
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
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <Paper
        elevation={0}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          position: "fixed",
          left: {
            xs: 8,
            sm: 16,
          },
          right: {
            xs: 8,
            sm: 16,
          },
          bottom: {
            xs: 8,
            sm: 12,
          },
          zIndex: 1200,
          borderRadius: "22px",
          overflow: "hidden",

          // Transparent electric-blue glass effect
          background: "rgba(0, 240, 255, 0.16)",
          border: "1px solid rgba(0, 240, 255, 0.45)",
          boxShadow: "0 8px 28px rgba(0, 240, 255, 0.12)",
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
        }}
      >
        <BottomNavigation
          value={getActiveValue()}
          onChange={(_, value) => {
            navigate(value);
          }}
          showLabels
          sx={{
            height: {
              xs: 64,
              sm: 68,
            },
            backgroundColor: "transparent",
            px: 0.5,

            "& .MuiBottomNavigationAction-root": {
              minWidth: 0,
              maxWidth: "none",
              flex: 1,
              minHeight: "100%",
              px: 0.25,
              py: 0.75,
              color: "#000000",
              opacity: 1,
              borderRadius: "16px",
              mx: 0.25,
              backgroundColor: "transparent",
            },

            "& .MuiBottomNavigationAction-root .MuiSvgIcon-root": {
              fontSize: {
                xs: 24,
                sm: 26,
              },
              color: "#000000",
            },

            "& .MuiBottomNavigationAction-label": {
              mt: 0.5,
              fontSize: {
                xs: "0.68rem",
                sm: "0.72rem",
              },
              lineHeight: 1.1,
              fontWeight: 500,
              color: "#000000",
              opacity: 1,
              whiteSpace: "nowrap",
            },

            // Keep selected and unselected items visually identical
            "& .MuiBottomNavigationAction-root.Mui-selected": {
              color: "#000000",
              backgroundColor: "transparent",
            },

            "& .MuiBottomNavigationAction-root.Mui-selected .MuiSvgIcon-root": {
              color: "#000000",
              transform: "none",
            },

            "& .MuiBottomNavigationAction-root.Mui-selected .MuiBottomNavigationAction-label": {
              fontSize: {
                xs: "0.68rem",
                sm: "0.72rem",
              },
              fontWeight: 500,
              color: "#000000",
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="/"
            icon={<HomeOutlinedIcon />}
          />

          <BottomNavigationAction
            label="Category"
            value="/products"
            icon={<CategoryOutlinedIcon />}
          />

          <BottomNavigationAction
            label="Contact Us"
            value="/contact"
            icon={<ContactSupportOutlinedIcon />}
          />

          <BottomNavigationAction
            label="Cart"
            value="/cart"
            icon={<ShoppingCartOutlinedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
