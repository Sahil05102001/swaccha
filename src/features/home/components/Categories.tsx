import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import BathroomIcon from "@mui/icons-material/Bathroom";
import WindowIcon from "@mui/icons-material/Window";
import SoapIcon from "@mui/icons-material/Soap";

const categories = [
  {
    title: "Floor Cleaner",
    icon: <CleaningServicesIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Toilet Cleaner",
    icon: <BathroomIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Glass Cleaner",
    icon: <WindowIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Hand Wash",
    icon: <SoapIcon sx={{ fontSize: 45 }} />,
  },
];

export default function Categories() {
  return (
    <Box
      sx={{
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
          }}
        >
          Shop by Category
        </Typography>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid
              key={category.title}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  p: 4,
                  cursor: "pointer",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                    }}
                  >
                    {category.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {category.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}