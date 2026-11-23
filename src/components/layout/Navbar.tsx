import { useEffect, useMemo, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types/product";
import type { SxProps, Theme } from "@mui/material";
import { useProfile } from "@/features/profile/hooks/useProfile";

import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase/auth";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "@/features/cart/hooks/useCart";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

import { useAuth } from "@/features/auth/AuthContext";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

const PRODUCTS_PATH = "/products";

// One WhatsApp number for every screen size (country code included).
const WHATSAPP_URL = "https://wa.me/918766911307";

// While you type on the products page, the list updates after this short pause.
const SEARCH_URL_DELAY_MS = 250;

const CYAN = "#00F0FF";

const desktopLinks = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: PRODUCTS_PATH },
  { label: "Offer Zone", to: "/offer-zone" },
  { label: "Physical Store", to: "/our-store" },
  { label: "About Us", to: "/about" },
  { label: "B2B", to: "/bulk-order" },
];

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${CYAN}`,
    outlineOffset: 2,
  },
};

// Desktop link
const getLinkSx = (active: boolean): SxProps<Theme> => ({
  minWidth: "auto",
  p: 0,
  py: 0.5,
  color: active ? CYAN : "#FFFFFF",
  fontSize: { md: "0.9rem", lg: "1.05rem" },
  fontWeight: active ? 600 : 400,
  textTransform: "none",
  borderRadius: 0,
  whiteSpace: "nowrap",
  "&:hover": { color: CYAN, backgroundColor: "transparent" },
  ...focusRing,
});

// Desktop round icon button
const desktopIconSx: SxProps<Theme> = {
  color: CYAN,
  width: 40,
  height: 40,
  p: 0,
  flexShrink: 0,
  "&:hover": { backgroundColor: "rgba(0,240,255,0.08)" },
  ...focusRing,
};

// Phone / tablet ring icon button (scales with the screen width)
const ringSx: SxProps<Theme> = {
  width: "clamp(30px, 8.5vw, 38px)",
  height: "clamp(30px, 8.5vw, 38px)",
  p: 0,
  flexShrink: 0,
  color: CYAN,
  border: `1px solid ${CYAN}`,
  borderRadius: "50%",
  "&:hover": { backgroundColor: "rgba(0,240,255,0.08)" },
  ...focusRing,
};

const ringIconSx: SxProps<Theme> = {
  fontSize: "clamp(16px, 4.4vw, 20px)",
};

// Login pill (filled cyan, matches the store look)
// Login button: white pill, thick black outline, bold black capitals.
const getLoginSx = (compact: boolean): SxProps<Theme> => ({
  flexShrink: 0,
  minWidth: 0,
  height: compact ? 32 : 40,
  px: compact ? 1.75 : 3,
  borderRadius: 999,
  bgcolor: "transparent",
  color: CYAN,
  border: `2px solid ${CYAN}`,
  fontSize: compact ? "0.72rem" : { md: "0.85rem", lg: "0.92rem" },
  fontWeight: 800,
  letterSpacing: "0.06em",
  lineHeight: 1,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  boxShadow: "none",
  transition: "none",
  "&:hover": {
    bgcolor: "rgba(0,240,255,0.1)",
    borderColor: CYAN,
    boxShadow: "none",
  },
  ...focusRing,
});

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const isProductsPage = location.pathname === PRODUCTS_PATH;

  // What the products page is currently filtered by (?search=...).
  const urlSearch = isProductsPage
    ? (new URLSearchParams(location.search).get("search") ?? "").trim()
    : "";

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: products = [] } = useProducts();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const isProductsPageRef = useRef(isProductsPage);
  const locationSearchRef = useRef(location.search);
  const lastSyncedSearchRef = useRef<string | null>(null);
  const urlUpdateTimerRef = useRef<number | null>(null);

  const { data: cartItems = [] } = useCart();
  const { user } = useAuth();

  const { data: profile } = useProfile();
  const isAdmin = Boolean(user && profile?.role === "admin");

  // Only signed-in users have a wishlist (it is read from Firestore).
  const { data: wishlistItems = [] } = useWishlist(Boolean(user));

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuOpen = accountMenuOpen && Boolean(user);

  useEffect(() => {
    isProductsPageRef.current = isProductsPage;
    locationSearchRef.current = location.search;
  }, [isProductsPage, location.search]);

  // Keeps this search box in step with the products page address:
  // for example, removing the "Search: ..." chip on that page also clears the box here.
  useEffect(() => {
    if (!isProductsPage) {
      lastSyncedSearchRef.current = null;
      return;
    }

    if (urlSearch === lastSyncedSearchRef.current) {
      return;
    }

    lastSyncedSearchRef.current = urlSearch;
    setSearch(urlSearch);
  }, [isProductsPage, urlSearch]);

  useEffect(() => {
    return () => {
      if (urlUpdateTimerRef.current !== null) {
        window.clearTimeout(urlUpdateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 150);

    return () => window.clearTimeout(timer);
  }, [search]);

  // The side drawer only exists on small screens: close it when the
  // screen grows to desktop size (for example, rotating a tablet).
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  // The account menu is attached to the navbar. If the page scrolls or the
  // window resizes, close it instead of letting it drift away.
  useEffect(() => {
    if (!menuOpen) return;

    const close = () => setAccountMenuOpen(false);

    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [menuOpen]);

  const suggestions = useMemo(() => {
    if (debouncedSearch.length < 2) return [];

    // Every word typed must appear somewhere in the product,
    // so "cotton mop" finds "Premium Cotton Mop".
    const terms = debouncedSearch.split(/\s+/).filter(Boolean);

    return products
      .filter((product) => {
        if (!product.isActive) return false;

        const searchableText = [
          product.name,
          product.brand,
          product.sku,
          product.category,
          product.subcategory,
        ]
          .map((value) => (value ?? "").toLowerCase())
          .join(" ");

        return terms.every((term) => searchableText.includes(term));
      })
      .slice(0, 5);
  }, [products, debouncedSearch]);

  const showSuggestions = searchOpen && search.trim().length >= 2;

  const formatSuggestionPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  const cancelPendingUrlUpdate = () => {
    if (urlUpdateTimerRef.current !== null) {
      window.clearTimeout(urlUpdateTimerRef.current);
      urlUpdateTimerRef.current = null;
    }
  };

  // Writes the search text into the products page address, which filters the list.
  const applyUrlSearch = (value: string) => {
    if (!isProductsPageRef.current) return;

    const trimmed = value.trim();

    const params = new URLSearchParams(locationSearchRef.current);
    const currentValue = (params.get("search") ?? "").trim();

    if (trimmed === currentValue) return;

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    lastSyncedSearchRef.current = trimmed;

    navigate(
      {
        pathname: PRODUCTS_PATH,
        search: query ? `?${query}` : "",
      },
      { replace: true },
    );
  };

  const scheduleUrlSearchUpdate = (value: string) => {
    if (!isProductsPageRef.current) return;

    cancelPendingUrlUpdate();

    urlUpdateTimerRef.current = window.setTimeout(() => {
      urlUpdateTimerRef.current = null;
      applyUrlSearch(value);
    }, SEARCH_URL_DELAY_MS);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setActiveSuggestionIndex(-1);
    scheduleUrlSearchUpdate(value);
  };

  const handleClearSearch = () => {
    cancelPendingUrlUpdate();
    setSearch("");
    setDebouncedSearch("");
    setActiveSuggestionIndex(-1);
    applyUrlSearch("");
  };

  const handleSelectSuggestion = (product: Product) => {
    cancelPendingUrlUpdate();
    setSearchOpen(false);
    setSearch("");
    setDebouncedSearch("");
    setActiveSuggestionIndex(-1);
    setMobileOpen(false);
    navigate(`/products/${product.id}`);
  };

  const handleSearch = () => {
    cancelPendingUrlUpdate();

    const value = search.trim();

    lastSyncedSearchRef.current = value;

    navigate(
      value
        ? `${PRODUCTS_PATH}?search=${encodeURIComponent(value)}`
        : PRODUCTS_PATH,
      { replace: isProductsPage },
    );

    setSearchOpen(false);
    setMobileOpen(false);
    setActiveSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown" && showSuggestions) {
      event.preventDefault();

      setActiveSuggestionIndex((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1,
      );
      return;
    }

    if (event.key === "ArrowUp" && showSuggestions) {
      event.preventDefault();

      setActiveSuggestionIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }

    if (
      event.key === "Enter" &&
      showSuggestions &&
      activeSuggestionIndex >= 0 &&
      suggestions[activeSuggestionIndex]
    ) {
      event.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestionIndex]);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }

    if (event.key === "Escape") {
      setSearchOpen(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleToggleMenu = (event: ReactMouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setAccountMenuOpen((current) => !current);
  };

  const handleCloseMenu = () => {
    setAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleCloseMenu();
    }
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isLinkActive = (to: string) =>
    to === "/"
      ? location.pathname === "/"
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  // Small "x" inside the search box to wipe the text in one tap.
  const renderClearButton = (iconSize: number) => {
    if (!search) return null;

    return (
      <IconButton
        aria-label="Clear search"
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClearSearch}
        size="small"
        sx={{
          color: "rgba(255,255,255,0.7)",
          p: 0.5,
          "&:hover": { color: CYAN },
        }}
      >
        <CloseIcon sx={{ fontSize: iconSize }} />
      </IconButton>
    );
  };

  const renderSearchSuggestions = () => {
    if (!showSuggestions) return null;

    return (
      <Box
        role="listbox"
        aria-label="Product suggestions"
        sx={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          zIndex: (t) => t.zIndex.modal + 1,
          bgcolor: "#080B12",
          color: "#FFFFFF",
          border: "1px solid rgba(0,240,255,0.45)",
          borderRadius: 0,
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          maxHeight: "min(380px, 60vh)",
          overflowY: "auto",
        }}
      >
        {suggestions.length > 0 ? (
          suggestions.map((product, index) => (
            <Box
              key={product.id}
              role="option"
              aria-selected={activeSuggestionIndex === index}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelectSuggestion(product)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.25,
                cursor: "pointer",
                borderBottom:
                  index < suggestions.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                bgcolor:
                  activeSuggestionIndex === index
                    ? "rgba(0,240,255,0.1)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(0,240,255,0.1)",
                },
              }}
            >
              <Box
                component="img"
                src={product.images?.[0] || undefined}
                alt=""
                loading="lazy"
                sx={{
                  width: 52,
                  height: 52,
                  flexShrink: 0,
                  objectFit: "contain",
                  bgcolor: "#FFFFFF",
                  borderRadius: 0,
                }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.name}
                </Typography>

                {product.brand && (
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: "0.72rem",
                      color: "#AAB6C6",
                    }}
                  >
                    {product.brand}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.75,
                    mt: 0.4,
                  }}
                >
                  <Typography
                    sx={{
                      color: CYAN,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {formatSuggestionPrice(product.price)}
                  </Typography>

                  {product.mrp > product.price && (
                    <>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.73rem",
                          color: "#AAB6C6",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatSuggestionPrice(product.mrp)}
                      </Typography>

                      {product.discount > 0 && (
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.7rem",
                            color: CYAN,
                          }}
                        >
                          {product.discount}% off
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              p: 2,
              fontSize: "0.85rem",
              color: "#AAB6C6",
            }}
          >
            No matching products found.
          </Typography>
        )}

        <Divider sx={{ borderColor: "rgba(0,240,255,0.18)" }} />

        <Box
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleSearch}
          sx={{
            px: 1.75,
            py: 1.25,
            cursor: "pointer",
            color: CYAN,
            fontSize: "0.82rem",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "rgba(0,240,255,0.08)",
            },
          }}
        >
          Search all products for "{search.trim()}" →
        </Box>
      </Box>
    );
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          width: "100%",
          borderRadius: 0,
          bgcolor: "#000000",
          color: "#FFFFFF",
          borderBottom: "1px solid rgba(0,240,255,0.18)",
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        {/* =====================================================
            DESKTOP NAVBAR (md and up)
            Logo | links ............ search, whatsapp, orders,
                                      account / login, cart
        ====================================================== */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { md: 80, lg: 92 },
              px: { md: 3, lg: 6 },
              gap: { md: 2, lg: 4 },
            }}
          >
            {/* Brand */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                textDecoration: "none",
                color: CYAN,
                fontSize: { md: "2rem", lg: "2.8rem" },
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                "&:hover": { color: CYAN },
                ...focusRing,
              }}
            >
              SWACHHA
            </Box>

            {/* Links */}
            <Box
              component="nav"
              aria-label="Main navigation"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { md: 2, lg: 3.5 },
                flex: 1,
                minWidth: 0,
              }}
            >
              {desktopLinks.map((link) => (
                <Button
                  key={link.to}
                  component={Link}
                  to={link.to}
                  aria-current={isLinkActive(link.to) ? "page" : undefined}
                  sx={getLinkSx(isLinkActive(link.to))}
                >
                  {link.label}
                </Button>
              )
              )
              }
              {isAdmin && (
                <Button
                  component={Link}
                  to="/admin"
                  sx={getLinkSx(isLinkActive("/admin"))}
                >
                  Admin Panel
                </Button>
              )}
            </Box>

            {/* Utility icons: search, whatsapp, orders, account, cart */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { md: 0.5, lg: 1 },
                flexShrink: 0,
              }}
            >
              <IconButton
                onClick={() => setSearchOpen((current) => !current)}
                aria-label="Search"
                aria-expanded={searchOpen}
                sx={desktopIconSx}
              >
                <SearchIcon sx={{ fontSize: 22 }} />
              </IconButton>

              <IconButton
                component="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                sx={desktopIconSx}
              >
                <WhatsAppIcon sx={{ fontSize: 22 }} />
              </IconButton>

              <IconButton
                component={Link}
                to="/orders"
                aria-label="My orders"
                sx={desktopIconSx}
              >
                <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
              </IconButton>

              {user ? (
                <IconButton
                  onClick={handleToggleMenu}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  sx={desktopIconSx}
                >
                  <AccountCircleOutlinedIcon sx={{ fontSize: 24 }} />
                </IconButton>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  disableElevation
                  sx={[getLoginSx(false) as object, { height: 44 }]}
                >
                  Login
                </Button>
              )}

              <IconButton
                component={Link}
                to="/cart"
                aria-label={`Shopping cart${totalItems ? `, ${totalItems} items` : ""
                  }`}
                sx={desktopIconSx}
              >
                <Badge
                  badgeContent={totalItems}
                  color="error"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.58rem",
                      minWidth: 15,
                      height: 15,
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>

          {/* Search bar */}
          {searchOpen && (
            <Box sx={{ width: "100%", px: { md: 3, lg: 6 }, pb: 2 }}>
              <Box
                sx={{
                  maxWidth: 720,
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  minHeight: 44,
                  px: 2,
                  borderRadius: 0,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(0,240,255,0.45)",
                }}
              >
                <SearchIcon sx={{ color: CYAN }} />

                <InputBase
                  autoFocus
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  sx={{
                    ml: 1,
                    flex: 1,
                    color: "#FFFFFF",
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.6)",
                      opacity: 1,
                    },
                  }}
                />

                {renderClearButton(20)}

                {renderSearchSuggestions()}
              </Box>
            </Box>
          )}
        </Box>

        {/* =====================================================
            PHONE / TABLET NAVBAR (below md)
            Hamburger, logo ........ search, [whatsapp, orders on
            tablets], account / login, cart
        ====================================================== */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1.5, sm: 2.5 },
              gap: { xs: 0.75, sm: 1.5 },
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              sx={{
                color: CYAN,
                width: 36,
                height: 36,
                ml: -0.75,
                p: 0,
                flexShrink: 0,
                ...focusRing,
              }}
            >
              <MenuIcon sx={{ fontSize: 26 }} />
            </IconButton>

            <Box
              component={Link}
              to="/"
              sx={{
                color: CYAN,
                textDecoration: "none",
                fontSize: "clamp(1.05rem, 5.6vw, 1.7rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                flexShrink: 0,
                whiteSpace: "nowrap",
                ...focusRing,
              }}
            >
              SWACHHA
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(5px, 1.8vw, 10px)",
                flexShrink: 0,
              }}
            >
              <IconButton
                onClick={() => setSearchOpen((current) => !current)}
                aria-label="Search"
                aria-expanded={searchOpen}
                sx={ringSx}
              >
                <SearchIcon sx={ringIconSx} />
              </IconButton>

              {/* WhatsApp and Orders: shown on tablets, inside the
                  drawer on phones so the bar never gets crowded. */}
              <IconButton
                component="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                sx={[
                  ringSx as object,
                  { display: { xs: "none", sm: "inline-flex" } },
                ]}
              >
                <WhatsAppIcon sx={ringIconSx} />
              </IconButton>

              <IconButton
                component={Link}
                to="/orders"
                aria-label="My orders"
                sx={[
                  ringSx as object,
                  { display: { xs: "none", sm: "inline-flex" } },
                ]}
              >
                <LocalShippingOutlinedIcon sx={ringIconSx} />
              </IconButton>

              {user ? (
                <IconButton
                  onClick={handleToggleMenu}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  sx={ringSx}
                >
                  <AccountCircleOutlinedIcon sx={ringIconSx} />
                </IconButton>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  disableElevation
                  sx={getLoginSx(true)}
                >
                  Login
                </Button>
              )}

              <Badge
                badgeContent={totalItems}
                color="error"
                max={99}
                overlap="circular"
                sx={{
                  flexShrink: 0,
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                  },
                }}
              >
                <IconButton
                  component={Link}
                  to="/cart"
                  aria-label={`Shopping cart, ${totalItems} items`}
                  sx={ringSx}
                >
                  <ShoppingCartOutlinedIcon sx={ringIconSx} />
                </IconButton>
              </Badge>
            </Box>
          </Toolbar>

          {/* Search bar */}
          {searchOpen && (
            <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pb: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 40,
                  position: "relative",
                  px: 1.5,
                  borderRadius: 0,
                  backgroundColor: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(0,240,255,0.45)",
                }}
              >
                <SearchIcon sx={{ color: CYAN, fontSize: 20 }} />

                <InputBase
                  autoFocus
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  sx={{
                    ml: 1,
                    flex: 1,
                    minWidth: 0,
                    color: "#FFFFFF",
                    // 16px stops iPhones from zooming the page on focus.
                    fontSize: "1rem",
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.58)",
                      opacity: 1,
                    },
                  }}
                />

                {renderClearButton(18)}

                {renderSearchSuggestions()}
              </Box>
            </Box>
          )}
        </Box>

        {/* Announcement label below the navbar */}
        <Box
          sx={{
            width: "100%",
            boxSizing: "border-box",
            px: { xs: 1.5, sm: 2.5, md: 3, lg: 6 },
            pt: { xs: 0.5, sm: 0.75, md: 1 },
            pb: { xs: 1.5, md: 1.25 },
            bgcolor: "#000000",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              maxWidth: "100%",
              bgcolor: "#5A5A5A",
              color: "#FFFFFF",
              px: 1.2,
              py: { xs: 0.6, md: 0.65 },
            }}
          >
            <Typography
              component="p"
              sx={{
                m: 0,
                fontSize: {
                  xs: "clamp(0.58rem, 2.7vw, 0.7rem)",
                  sm: "0.68rem",
                  md: "0.75rem",
                },
                fontWeight: 700,
                letterSpacing: { xs: "0.07em", md: "0.08em" },
                lineHeight: { xs: 1.35, md: 1.3 },
                overflowWrap: "anywhere",
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "inline", sm: "none" } }}
              >
                QUALITY HOUSEKEEPING PRODUCTS · NAGPUR
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                QUALITY HOUSEKEEPING PRODUCTS FOR HOMES AND BUSINESSES IN
                NAGPUR
              </Box>
            </Typography>
          </Box>
        </Box>
      </AppBar>

      {/* =====================================================
          ACCOUNT MENU
          - disableScrollLock: opening it no longer hides the page
            scrollbar, which is what shifted the layout on the right.
          - Closes on scroll / resize (see effect above) so it never
            drifts away from the navbar.
          - Always opens right-aligned under the account icon and
            stays inside the screen.
      ====================================================== */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        disableScrollLock
        transitionDuration={{ enter: 150, exit: 0 }}
        marginThreshold={8}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 210,
              maxWidth: "calc(100vw - 16px)",
              borderRadius: 0,
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "rgba(0,240,255,0.08)",
              },
            },
          },
        }}
      >
        <MenuItem component={Link} to="/orders" onClick={handleCloseMenu}>
          <ListItemIcon sx={{ color: CYAN }}>
            <ShoppingBagOutlinedIcon fontSize="small" />
          </ListItemIcon>
          My Orders
        </MenuItem>

        <MenuItem component={Link} to="/wishlist" onClick={handleCloseMenu}>
          <ListItemIcon sx={{ color: CYAN }}>
            <FavoriteBorderOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Wishlist
        </MenuItem>

        <MenuItem component={Link} to="/profile" onClick={handleCloseMenu}>
          <ListItemIcon sx={{ color: CYAN }}>
            <AccountCircleOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ color: CYAN }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* =====================================================
          MOBILE DRAWER
          Page scroll stays locked behind it while it is open.
      ====================================================== */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "86%", sm: 360 },
              maxWidth: 360,
              borderRadius: 0,
              backgroundColor: "#000000",
              color: "#FFFFFF",
              pb: "env(safe-area-inset-bottom, 0px)",
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer header */}
          <Box
            sx={{
              minHeight: 58,
              flexShrink: 0,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,240,255,0.16)",
            }}
          >
            <Box
              component="span"
              sx={{
                color: CYAN,
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              SWACHHA
            </Box>

            <IconButton
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              sx={{ color: CYAN, borderRadius: 0, ...focusRing }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drawer navigation */}
          <List
            sx={{
              flex: 1,
              minHeight: 0,
              px: 1,
              py: 1,
              overflowY: "auto",
              overscrollBehavior: "contain",

              "& .MuiListItemButton-root": {
                borderRadius: 0,
                mb: 0.25,
                "&:hover": {
                  backgroundColor: "rgba(0,240,255,0.08)",
                },
              },

              "& .MuiListItemText-primary": {
                fontSize: "0.92rem",
              },
            }}
          >
            <ListItemButton onClick={() => handleMobileNavigation("/")}>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleMobileNavigation(PRODUCTS_PATH)}
            >
              <ListItemText primary="Shop All" />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleMobileNavigation("/offer-zone")}
            >
              <ListItemText primary="Offer Zone" />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleMobileNavigation("/our-store")}
            >
              <ListItemText primary="Physical Store" />
            </ListItemButton>

            <ListItemButton onClick={() => handleMobileNavigation("/about")}>
              <ListItemText primary="About Us" />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleMobileNavigation("/bulk-order")}
            >
              <ListItemText primary="Enterprise & B2B" />
            </ListItemButton>

            <ListItemButton onClick={() => handleMobileNavigation("/contact")}>
              <ListItemText primary="Contact Us" />
            </ListItemButton>

            <ListItemButton onClick={() => handleMobileNavigation("/faq")}>
              <ListItemText primary="FAQ" />
            </ListItemButton>

            <Divider
              sx={{ my: 1, borderColor: "rgba(255,255,255,0.12)" }}
            />

            <ListItemButton onClick={() => handleMobileNavigation("/orders")}>
              <ListItemIcon sx={{ color: CYAN }}>
                <LocalShippingOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleMobileNavigation("/wishlist")}
            >
              <ListItemIcon sx={{ color: CYAN }}>
                <FavoriteBorderIcon />
              </ListItemIcon>

              <ListItemText primary="Wishlist" />

              <Badge
                badgeContent={wishlistItems.length}
                color="error"
                max={99}
                sx={{ mr: 1 }}
              />
            </ListItemButton>

            <ListItemButton onClick={() => handleMobileNavigation("/cart")}>
              <ListItemIcon sx={{ color: CYAN }}>
                <ShoppingCartOutlinedIcon />
              </ListItemIcon>

              <ListItemText primary="Cart" />

              <Badge
                badgeContent={totalItems}
                color="error"
                max={99}
                sx={{ mr: 1 }}
              />
            </ListItemButton>

            <ListItemButton
              component="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon sx={{ color: CYAN }}>
                <WhatsAppIcon />
              </ListItemIcon>
              <ListItemText primary="Chat on WhatsApp" />
            </ListItemButton>

            <Divider
              sx={{ my: 1, borderColor: "rgba(255,255,255,0.12)" }}
            />

            {user ? (
              <>
                <ListItemButton
                  onClick={() => handleMobileNavigation("/profile")}
                >
                  <ListItemIcon sx={{ color: CYAN }}>
                    <AccountCircleOutlinedIcon />
                  </ListItemIcon>

                  <ListItemText primary="Account" />
                </ListItemButton>

                {isAdmin && (
                  <ListItemButton
                    onClick={() => handleMobileNavigation("/admin")}
                  >
                    <ListItemIcon sx={{ color: CYAN }}>
                      <AdminPanelSettingsOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin Panel" />
                  </ListItemButton>
                )}

                <ListItemButton
                  onClick={async () => {
                    await handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  <ListItemIcon sx={{ color: CYAN }}>
                    <LogoutOutlinedIcon />
                  </ListItemIcon>

                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <Box sx={{ px: 1, py: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  onClick={() => handleMobileNavigation("/login")}
                  sx={[getLoginSx(false) as object, { height: 44 }]}
                >
                  Login
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}