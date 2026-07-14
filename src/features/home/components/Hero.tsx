import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import BusinessIcon from "@mui/icons-material/Business";

import productImage from "@/assets/images/products/floor-cleaner.png";

export default function Hero() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #F8FAF8 0%, #E8F5E9 100%)",
        py: {
          xs: 6,
          md: 10,
        },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Chip
              label="Trusted Cleaning Brand"
              color="primary"
              sx={{ mb: 3 }}
            />

            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Professional Housekeeping Products
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                fontWeight: 400,
              }}
            >
              Premium floor cleaners and housekeeping solutions for
              homes, offices, hospitals, hotels and industries.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              sx={{
                mb: 4,
              }}
            >
              <Button variant="contained" size="large">
                Shop Now
              </Button>

              <Button variant="outlined" size="large">
                Explore Products
              </Button>
            </Stack>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <VerifiedIcon color="success" />
                <Typography>Premium Quality Products</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BusinessIcon color="primary" />
                <Typography>Bulk Orders for Businesses</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocalShippingIcon color="warning" />
                <Typography>Fast & Reliable Delivery</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={productImage}
              alt="Swachha Floor Cleaner"
              sx={{
                width: "100%",
                maxWidth: 420,
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}