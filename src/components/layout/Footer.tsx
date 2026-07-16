import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import logo from "@/assets/images/logo/Logo.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        bgcolor: "#1E293B",
        color: "white",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src={logo}
              alt="Swachha Logo"
              sx={{
                height: 70,
                width: "auto",
                mb: 2,
                display: "block",
              }}
            />

            <Typography color="grey.400">
              Professional housekeeping products for homes,
              offices, hospitals and industries.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Quick Links
            </Typography>

            <Stack spacing={1}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>

              <Link href="/products" color="inherit" underline="hover">
                Products
              </Link>

              <Link href="/wishlist" color="inherit" underline="hover">
                Wishlist
              </Link>

              <Link href="/cart" color="inherit" underline="hover">
                Cart
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Contact
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EmailOutlinedIcon fontSize="small" />
                <Typography>
                  swachha.business@gmail.com
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PhoneOutlinedIcon fontSize="small" />
                <Typography>
                  +91 92842 34943
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              About
            </Typography>

            <Typography color="grey.400">
              Trusted cleaning solutions with premium
              quality, long-lasting fragrance, and
              exceptional performance.
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <Typography color="grey.500">
            © 2026 Swachha. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}