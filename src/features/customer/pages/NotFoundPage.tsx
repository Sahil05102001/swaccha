import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h2">
        404
      </Typography>

      <Typography>
        Page not found.
      </Typography>

      <Button
        component={Link}
        to={ROUTES.HOME}
        variant="contained"
      >
        Back to Home
      </Button>
    </Box>
  );
}