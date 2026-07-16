import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CustomerLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}