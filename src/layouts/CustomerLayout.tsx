import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

export default function CustomerLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}