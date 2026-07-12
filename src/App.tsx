import { Box, Button, Card, CardContent, Typography } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom color="primary">
            Swachha
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Material UI Theme configured successfully.
          </Typography>

          <Button variant="contained">
            Continue Building
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;