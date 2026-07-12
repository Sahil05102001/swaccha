import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h3" color="primary" gutterBottom>
            Welcome to Swachha
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Professional Housekeeping Products for Homes and Businesses.
          </Typography>

          <Button variant="contained">
            Shop Now
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}