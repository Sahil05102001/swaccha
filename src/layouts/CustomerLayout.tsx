import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Navbar will come here */}

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Outlet />
      </Container>

      {/* Footer will come here */}
    </Box>
  );
}