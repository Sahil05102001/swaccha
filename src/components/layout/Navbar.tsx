import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      sx={{ bgcolor: "white" }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 700 }}
        >
          Swachha
        </Typography>

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
            sx={{ ml: 1, flex: 1 }}
          />
        </Box>

        <Button color="inherit">Home</Button>

        <Button color="inherit">Products</Button>

        <Button color="inherit">About</Button>

        <Button color="inherit">Contact</Button>

        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>

        <IconButton>
          <ShoppingCartOutlinedIcon />
        </IconButton>

        <Button variant="contained">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}