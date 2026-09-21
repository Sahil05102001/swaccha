import { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import HelpIcon from "@mui/icons-material/Help";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CampaignIcon from "@mui/icons-material/Campaign";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/admin",
  },
  {
    text: "Products",
    icon: <Inventory2Icon />,
    path: "/admin/products",
  },
  {
    text: "Categories",
    icon: <CategoryIcon />,
    path: "/admin/categories",
  },
  {
    text: "Category Circles",
    icon: <CircleIcon />,
    path: "/admin/category-circles",
  },
  {
    text: "Best Sellers",
    icon: <LocalFireDepartmentIcon />,
    path: "/admin/best-sellers",
  },
  {
    text: "Featured Products",
    icon: <StarIcon />,
    path: "/admin/featured-products",
  },
  {
    text: "Offer Zone",
    icon: <LocalOfferIcon />,
    path: "/admin/offer-zone",
  },
  {
    text: "Ad Banner",
    icon: <CampaignIcon />,
    path: "/admin/ad-banner",
  },
  {
    text: "Videos",
    icon: <VideoLibraryIcon />,
    path: "/admin/videos",
  },
  {
    text: "Orders",
    icon: <ShoppingCartIcon />,
    path: "/admin/orders",
  },
  {
    text: "Customers",
    icon: <PeopleIcon />,
    path: "/admin/customers",
  },
  {
    text: "Sales Report",
    icon: <AssessmentIcon />,
    path: "/admin/reports/sales",
  },
  {
    text: "Inventory Report",
    icon: <AssessmentIcon />,
    path: "/admin/reports/inventory",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/admin/settings",
  },
  {
    text: "About",
    icon: <InfoOutlinedIcon />,
    path: "/admin/cms/about",
  },
  {
    text: "Contact",
    icon: <ContactSupportOutlinedIcon />,
    path: "/admin/cms/contact",
  },
  {
    text: "FAQ",
    icon: <HelpIcon />,
    path: "/admin/cms/faq",
  },
  {
    text: "Privacy Policy",
    icon: <PrivacyTipOutlinedIcon />,
    path: "/admin/cms/privacy",
  },
  {
    text: "Terms & Conditions",
    icon: <DescriptionOutlinedIcon />,
    path: "/admin/cms/terms",
  },
  {
    text: "Shipping Policy",
    icon: <LocalShippingOutlinedIcon />,
    path: "/admin/cms/shipping",
  },
  {
    text: "Cancellation & Refund",
    icon: <CancelOutlinedIcon />,
    path: "/admin/cms/cancellation",
  },
  {
    text: "Brand Statement",
    icon: <FormatQuoteIcon />,
    path: "/admin/cms/brand-statement",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const currentDrawerWidth = collapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  const handleNavigation = (path: string) => {
    navigate(path);

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Fixed Sidebar Header */}
      <Box
        sx={{
          flexShrink: 0,
          backgroundColor: "background.paper",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "64px !important",
            px: collapsed ? 1 : 2,
            justifyContent: collapsed
              ? "center"
              : "flex-start",
          }}
        >
          {!collapsed && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Swachha
            </Typography>
          )}

          {collapsed && (
            <IconButton
              onClick={() => setCollapsed(false)}
              size="small"
              aria-label="Open admin menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        <Divider />

        {/* Collapse control lives inside menu, not beside Swachha */}
        {!collapsed && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              px: 1,
              py: 0.5,
            }}
          >
            <IconButton
              onClick={() => setCollapsed(true)}
              size="small"
              aria-label="Collapse admin menu"
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Scrollable Menu */}
      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: collapsed ? 1 : 1.5,
          py: 1,

          "&::-webkit-scrollbar": {
            width: 6,
          },

          "&::-webkit-scrollbar-thumb": {
            borderRadius: 3,
          },
        }}
      >
        {menuItems.map((item) => {
          const selected =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(
                  item.path
                );

          const button = (
            <ListItemButton
              selected={selected}
              onClick={() =>
                handleNavigation(item.path)
              }
              sx={{
                minHeight: 48,
                mb: 0.5,
                px: collapsed ? 1.5 : 2,
                borderRadius: 1.5,
                justifyContent: collapsed
                  ? "center"
                  : "initial",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      sx: {
                        whiteSpace: "nowrap",
                      },
                    },
                  }}
                />
              )}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip
              key={item.text}
              title={item.text}
              placement="right"
              arrow
            >
              {button}
            </Tooltip>
          ) : (
            <Box key={item.text}>
              {button}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            md: `calc(100% - ${currentDrawerWidth}px)`,
          },
          ml: {
            md: `${currentDrawerWidth}px`,
          },
          transition: theme.transitions.create(
            ["width", "margin"],
            {
              duration:
                theme.transitions.duration.standard,
            }
          ),
        }}
      >
        <Toolbar>
          {/* Mobile menu button ONLY */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() =>
                setMobileOpen(true)
              }
              sx={{
                mr: 2,
              }}
              aria-label="Open admin menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Swachha Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: currentDrawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: currentDrawerWidth,
            boxSizing: "border-box",
            overflow: "hidden",

            transition: theme.transitions.create(
              "width",
              {
                duration:
                  theme.transitions.duration.standard,
              }
            ),
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            md: `calc(100% - ${currentDrawerWidth}px)`,
          },
          transition: theme.transitions.create(
            ["width", "margin"],
            {
              duration:
                theme.transitions.duration.standard,
            }
          ),
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}