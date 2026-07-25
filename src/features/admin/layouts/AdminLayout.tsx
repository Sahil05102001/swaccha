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
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;

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
    text: "Analytics",
    icon: <AnalyticsIcon />,
    path: "/admin/analytics",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Swachha
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={
              item.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.path)
            }
            onClick={() => {
              navigate(item.path);

              if (isMobile) {
                setMobileOpen(false);
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },
          ml: {
            md: `${drawerWidth}px`,
          },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{
                mr: 2,
              }}
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
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}