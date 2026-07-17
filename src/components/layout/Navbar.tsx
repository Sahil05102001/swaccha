import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase/auth";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectCartItems } from "@/features/cart/cartSlice";
import { selectWishlistItems } from "@/features/wishlist/wishlistSlice";
import logo from "@/assets/images/logo/Logo.png";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const cartItems = useAppSelector(selectCartItems);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const { user } = useAuth();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleCloseMenu();
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      sx={{ bgcolor: "white" }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            mr: 2,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Swachha Logo"
            sx={{
              height: 52,
              width: "auto",
              display: "block",
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            px: 2,
          }}
        >
          <SearchIcon color="action" />

          <InputBase
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = search.trim();

                if (value) {
                  navigate(`/products?search=${encodeURIComponent(value)}`);
                } else {
                  navigate("/products");
                }
              }
            }}
            sx={{
              ml: 1,
              flex: 1,
            }}
          />
        </Box>

        <Button
          component={Link}
          to="/"
          color="inherit"
        >
          Home
        </Button>

        <Button
          component={Link}
          to="/products"
          color="inherit"
        >
          Products
        </Button>

        <Button color="inherit">
          About
        </Button>

        <Button color="inherit">
          Contact
        </Button>

        <IconButton
          component={Link}
          to="/wishlist"
        >
          <Badge
            badgeContent={wishlistItems.length}
            color="error"
          >
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>

        <IconButton
          component={Link}
          to="/cart"
        >
          <Badge
            badgeContent={totalItems}
            color="error"
          >
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {user ? (
          <Button
            variant="contained"
            onClick={handleOpenMenu}
          >
            {user.displayName ?? "Account"}
          </Button>
        ) : (
          <Button
            component={Link}
            to="/login"
            variant="contained"
          >
            Login
          </Button>
        )}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <ShoppingBagOutlinedIcon fontSize="small" />
            </ListItemIcon>
            My Orders
          </MenuItem>

          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <FavoriteBorderOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Wishlist
          </MenuItem>

          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleCloseMenu}
          >
            <ListItemIcon>
              <AccountCircleOutlinedIcon fontSize="small" />
            </ListItemIcon>

            Profile
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}