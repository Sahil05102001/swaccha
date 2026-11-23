
import {
  memo,
  Suspense,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import HistoryIcon from "@mui/icons-material/History";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { auth } from "@/firebase/auth";
import { adminTheme } from "../theme/adminTheme";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import { useMaintenance } from "@/features/maintenance/hooks/useMaintenance";
import { useAuth } from "@/features/auth/AuthContext";
import {
  DesktopOnlyNotice,
  MobileAdvisoryDialog,
} from "../components/MobileNotices";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import RedeemIcon from "@mui/icons-material/Redeem";

const DRAWER_WIDTH = 260;
const HEADER_HEIGHT = 64;

const COLORS = {
  sidebar: "#0B0B0B",
  sidebarText: "rgba(255,255,255,0.78)",
  sidebarMuted: "rgba(255,255,255,0.55)",
  sidebarBorder: "rgba(255,255,255,0.08)",
  hover: "rgba(255,255,255,0.06)",
  selectedBg: "rgba(255,255,255,0.09)",
  accent: "#FFC83D",
  canvas: "#F4F5F7",
  border: "#E5E7EB",
};

type MenuItem = {
  text: string;
  icon: ReactNode;
  path: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: "Overview",
    items: [{ text: "Dashboard", icon: <DashboardIcon />, path: "/admin" }],
  },
  {
    title: "Catalog",
    items: [
      { text: "Products", icon: <Inventory2Icon />, path: "/admin/products" },
      { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        text: "Stock History",
        icon: <HistoryIcon />,
        path: "/admin/stock-history",
      },
    ],
  },
  {
    title: "Storefront",
    items: [
      {
        text: "Category Circles",
        icon: <CircleIcon />,
        path: "/admin/category-circles",
      },
      {
        text: "Hero Banners",
        icon: <ViewCarouselIcon />,
        path: "/admin/hero-banners",
      },
      {
        text: "Best Sellers",
        icon: <LocalFireDepartmentIcon />,
        path: "/admin/best-sellers",
      },
      {
        text: "Lightning Deals",
        icon: <FlashOnIcon />,
        path: "/admin/lightning-deals",
      },
      {
        text: "Exclusive Offers",
        icon: <RedeemIcon />,
        path: "/admin/exclusive-offers",
      },
      {
        text: "Featured Products",
        icon: <StarIcon />,
        path: "/admin/featured-products",
      },
      { text: "Offer Zone", icon: <LocalOfferIcon />, path: "/admin/offer-zone" },
      { text: "Ad Banner", icon: <CampaignIcon />, path: "/admin/ad-banner" },
      { text: "Videos", icon: <VideoLibraryIcon />, path: "/admin/videos" },
      {
        text: "Brand Statement",
        icon: <FormatQuoteIcon />,
        path: "/admin/cms/brand-statement",
      },
    ],
  },
  {
    title: "Orders & Customers",
    items: [
      { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
      { text: "Customers", icon: <PeopleIcon />, path: "/admin/customers" },
      {
        text: "Reviews",
        icon: <RateReviewOutlinedIcon />,
        path: "/admin/reviews",
      },
      {
        text: "Coupons",
        icon: <ConfirmationNumberOutlinedIcon />,
        path: "/admin/coupons",
      },
      {
        text: "Shipping",
        icon: <DeliveryDiningOutlinedIcon />,
        path: "/admin/shipping",
      },
      {
        text: "Tax (GST)",
        icon: <ReceiptLongOutlinedIcon />,
        path: "/admin/tax",
      },
      {
        text: "B2B Enquiries",
        icon: <InboxOutlinedIcon />,
        path: "/admin/b2b-enquiries",
      },
    ],
  },
  {
    title: "Reports",
    items: [
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
    ],
  },
  {
    title: "Content & Settings",
    items: [
      { text: "About", icon: <InfoOutlinedIcon />, path: "/admin/cms/about" },
      {
        text: "Contact",
        icon: <ContactSupportOutlinedIcon />,
        path: "/admin/cms/contact",
      },
      { text: "FAQ", icon: <HelpIcon />, path: "/admin/cms/faq" },
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
        text: "Offer Terms & Conditions",
        icon: <DescriptionOutlinedIcon />,
        path: "/admin/cms/offer-terms",
      },
      {
        text: "Replacement Policy",
        icon: <DescriptionOutlinedIcon />,
        path: "/admin/cms/replacement",
      },
      {
        text: "Maintenance Mode",
        icon: <ConstructionOutlinedIcon />,
        path: "/admin/maintenance",
      },
      { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
    ],
  },
  {
    title: "Help",
    items: [
      {
        text: "Help & Support",
        icon: <HelpCenterOutlinedIcon />,
        path: "/admin/help",
      },
    ],
  },
];

// Phones show only the everyday options. Desktop keeps the full menu.
const MOBILE_PATHS = new Set([
  "/admin",
  "/admin/orders",
  "/admin/customers",
  "/admin/reviews",
  "/admin/coupons",
  "/admin/shipping",
  "/admin/tax",
  "/admin/maintenance",
  "/admin/help",
]);

const mobileSections: MenuSection[] = menuSections
  .map((section) => ({
    ...section,
    items: section.items.filter((item) => MOBILE_PATHS.has(item.path)),
  }))
  .filter((section) => section.items.length > 0);

const ADVISORY_KEY = "admin-mobile-advisory";

/** A page is allowed on phones if it is a phone menu page or opens from one. */
const isMobilePath = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, "") || "/";

  return [...MOBILE_PATHS].some((path) =>
    path === "/admin"
      ? clean === "/admin"
      : clean === path || clean.startsWith(`${path}/`),
  );
};

const isSelected = (pathname: string, path: string) =>
  path === "/admin"
    ? pathname === "/admin"
    : pathname === path || pathname.startsWith(`${path}/`);

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
  mobileMenu: boolean;
  onNavigate: (path: string) => void;
  onToggle: () => void;
}

// Only re-renders when the page, collapse state or handlers change.
const Sidebar = memo(function Sidebar({
  pathname,
  collapsed,
  mobileMenu,
  onNavigate,
  onToggle,
}: SidebarProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: COLORS.sidebar,
        color: COLORS.sidebarText,
      }}
    >
      <Toolbar
        sx={{
          flexShrink: 0,
          minHeight: `${HEADER_HEIGHT}px !important`,
          px: 2.5,
          justifyContent: "space-between",
          borderBottom: `1px solid ${COLORS.sidebarBorder}`,
        }}
      >
        {!collapsed && (
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Swachha
            <Box component="span" sx={{ color: COLORS.accent }}>
              .
            </Box>
          </Typography>
        )}

        <IconButton
          disableRipple
          onClick={onToggle}
          size="small"
          aria-label={collapsed ? "Expand admin menu" : "Close admin menu"}
          sx={{ color: COLORS.sidebarText, borderRadius: 0 }}
        >
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
      </Toolbar>

      <List
        component="nav"
        aria-label="Admin navigation"
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 0,
          py: 1,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.2) transparent",
        }}
      >
        {(mobileMenu ? mobileSections : menuSections).map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            {!collapsed && (
              <Typography
                component="div"
                sx={{
                  px: 2.5,
                  pt: 1.5,
                  pb: 0.5,
                  color: COLORS.sidebarMuted,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  lineHeight: 1.6,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {section.title}
              </Typography>
            )}

            {section.items.map((item) => {
              const selected = isSelected(pathname, item.path);

              const button = (
                <ListItemButton
                  selected={selected}
                  disableRipple
                  onClick={() => onNavigate(item.path)}
                  aria-current={selected ? "page" : undefined}
                  sx={{
                    minHeight: 42,
                    px: collapsed ? 1.5 : 2.5,
                    borderRadius: 0,
                    borderLeft: "3px solid transparent",
                    justifyContent: collapsed ? "center" : "initial",
                    color: COLORS.sidebarText,
                    "&.Mui-selected": {
                      bgcolor: COLORS.selectedBg,
                      color: "#fff",
                      borderLeftColor: COLORS.accent,
                      "& .MuiListItemIcon-root": { color: COLORS.accent },
                    },
                    "&.Mui-selected:hover": { bgcolor: COLORS.selectedBg },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 1.75,
                      justifyContent: "center",
                      color: "inherit",
                      "& svg": { fontSize: 20 },
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
                            whiteSpace: "normal",
                            fontSize: "0.875rem",
                            fontWeight: selected ? 700 : 500,
                            lineHeight: 1.4,
                          },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              );

              return collapsed ? (
                <Tooltip
                  key={item.path}
                  title={item.text}
                  placement="right"
                  arrow={false}
                >
                  {button}
                </Tooltip>
              ) : (
                <Box key={item.path}>{button}</Box>
              );
            })}
          </Box>
        ))}
      </List>
    </Box>
  );
});

const headerButtonSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.5,
  py: 0.75,
  minHeight: 0,
  borderRadius: "8px",
  border: `1px solid ${COLORS.border}`,
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "text.primary",
  textTransform: "none",
} as const;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { data: maintenance } = useMaintenance();

  // Build the admin theme on top of the existing store theme.
  const resolvedAdminTheme = useMemo(() => adminTheme(theme), [theme]);

  // noSsr: read the screen size on the first render, so a phone never
  // starts loading a desktop-only page before it is blocked.
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const blocked = isMobile && !isMobilePath(pathname);

  // One warning per sign-in on a phone.
  const { user } = useAuth();
  const signInKey = user
    ? `${user.uid}|${user.metadata.lastSignInTime ?? ""}`
    : "";
  const [advisoryOpen, setAdvisoryOpen] = useState(false);

  useEffect(() => {
    if (!isMobile || !signInKey) return;

    try {
      if (sessionStorage.getItem(ADVISORY_KEY) === signInKey) return;
    } catch {
      // Storage unavailable: show it, it is harmless.
    }

    setAdvisoryOpen(true);
  }, [isMobile, signInKey]);

  const closeAdvisory = () => {
    setAdvisoryOpen(false);

    try {
      sessionStorage.setItem(ADVISORY_KEY, signInKey);
    } catch {
      // Ignore.
    }
  };;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentDrawerWidth = collapsed ? 0 : DRAWER_WIDTH;

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      setMobileOpen(false);
    },
    [navigate],
  );

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleLogout = useCallback(async () => {
    try {
      // Leave the admin pages first, so nothing refetches without a login.
      navigate("/login", { replace: true });
      await signOut(auth);
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed:", error);
      showSnackbar("Could not log out. Please try again.", "error");
    }
  }, [navigate, queryClient, showSnackbar]);

  const sidebar = (
    <Sidebar
      pathname={pathname}
      collapsed={collapsed && !isMobile}
      mobileMenu={isMobile}
      onNavigate={handleNavigation}
      onToggle={isMobile ? closeMobile : toggleCollapsed}
    />
  );

  return (
    <ThemeProvider theme={resolvedAdminTheme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CssBaseline />

        {/* Top bar */}
        <Box
          component="header"
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            left: { xs: 0, md: `${currentDrawerWidth}px` },
            height: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: { xs: 2, md: 3 },
            bgcolor: "#fff",
            borderBottom: `1px solid ${COLORS.border}`,
            zIndex: (t) => t.zIndex.appBar,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
          >
            {(isMobile || collapsed) && (
              <IconButton
                disableRipple
                onClick={() =>
                  isMobile ? setMobileOpen(true) : setCollapsed(false)
                }
                aria-label="Open admin menu"
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.05rem", sm: "1.25rem" },
                fontWeight: 700,
                color: "text.primary",
                whiteSpace: "nowrap",
              }}
            >
              Swachha Console
            </Typography>

            {maintenance?.enabled && (
              <Chip
                label="Maintenance ON"
                size="small"
                color="error"
                onClick={() => navigate("/admin/maintenance")}
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MuiLink
              component={Link}
              to="/"
              underline="none"
              aria-label="View store"
              sx={headerButtonSx}
            >
              <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                View store
              </Box>
            </MuiLink>

            <Button
              onClick={handleLogout}
              disableRipple
              aria-label="Log out"
              sx={headerButtonSx}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Log out
              </Box>
            </Button>
          </Box>
        </Box>

        {/* Mobile drawer */}
        <Drawer
          open={mobileOpen}
          onClose={closeMobile}
          variant="temporary"
          transitionDuration={0}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: COLORS.sidebar,
              borderRight: "none",
              borderRadius: 0,
            },
          }}
        >
          {sidebar}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: currentDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: currentDrawerWidth,
              boxSizing: "border-box",
              overflow: "hidden",
              visibility: collapsed ? "hidden" : "visible",
              bgcolor: COLORS.sidebar,
              borderRight: "none",
              borderRadius: 0,
            },
          }}
        >
          {sidebar}
        </Drawer>

        {/* Main content. The page changes here; the sidebar never remounts. */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 1.5, sm: 2.5, md: 3 },
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            bgcolor: "background.default",
          }}
        >
          <Box sx={{ height: HEADER_HEIGHT }} />

          {blocked ? (
            <DesktopOnlyNotice onBack={() => navigate("/admin")} />
          ) : (
            <Suspense
              fallback={
                <Box
                  sx={{
                    minHeight: "40vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={28} aria-label="Loading page" />
                </Box>
              }
            >
              <Outlet />
            </Suspense>
          )}
        </Box>

        <MobileAdvisoryDialog
          open={advisoryOpen && isMobile}
          onClose={closeAdvisory}
        />
      </Box>
    </ThemeProvider>
  );
}
