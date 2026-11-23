import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#000000",
        color: "#00F0FF",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2.5,
            sm: 4,
            md: 6,
            lg: 8,
          },
        }}
      >
        {/* Main footer */}
        <Grid
          container
          columnSpacing={{
            xs: 0,
            md: 6,
            lg: 8,
          }}
          rowSpacing={{
            xs: 5,
            md: 0,
          }}
          sx={{
            pt: {
              xs: 5,
              sm: 6,
              md: 6,
            },
            pb: {
              xs: 5,
              sm: 6,
              md: 7,
            },
          }}
        >
          {/* Brand */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack spacing={2}>
              {/* SWACHHA Brand */}
              <Box
                component={Link}
                href="/"
                underline="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "fit-content",

                  color: "#00F0FF",

                  fontSize: {
                    xs: "2rem",
                    sm: "2.35rem",
                    md: "2.7rem",
                  },

                  fontWeight: 700,

                  letterSpacing:
                    "-0.06em",

                  lineHeight: 1,

                  transition:
                    "opacity 0.2s ease",

                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.8,
                  },
                }}
              >
                SWACHHA
              </Box>

              <Typography
                sx={{
                  maxWidth: {
                    xs: 340,
                    md: 330,
                  },
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.88rem",
                    sm: "0.92rem",
                  },
                  lineHeight: 1.55,
                  fontWeight: 400,
                }}
              >
                Professional housekeeping products for
                homes, offices, hospitals and
                industries.
              </Typography>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              sx={{
                mb: 2,
                color: "#00F0FF",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.84rem",
                },
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Quick Links
            </Typography>

            <Stack spacing={1.15}>
              <Link
                href="/"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  fontWeight: 400,
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                Home
              </Link>

              <Link
                href="/products"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  fontWeight: 400,
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                Shop
              </Link>
              <Link
                href="/orders"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                Track Order
              </Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Typography
              sx={{
                mb: 2,
                color: "#00F0FF",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.84rem",
                },
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Resources
            </Typography>

            <Stack spacing={1.15}>
              <Link
                href="/about"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                Contact Us
              </Link>

              <Link
                href="/offer-terms-and-conditions"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                Offer Terms and Conditions
              </Link>
              <Link
                href="/shipping-policy"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                Shipping Policy
              </Link>
              <Link
                href="/faq"
                underline="none"
                sx={{
                  width: "fit-content",
                  color: "#00F0FF",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.9rem",
                  },
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    color: "#00F0FF",
                    opacity: 0.65,
                  },
                }}
              >
                FAQ
              </Link>
            </Stack>
          </Grid>

          {/* Stay Up To Date */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              sx={{
                mb: 2,
                color: "#00F0FF",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.84rem",
                },
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Stay Up To Date
            </Typography>

            <Button
              href="https://wa.me/918766911307"
              variant="contained"
              sx={{
                minWidth: {
                  xs: 150,
                  sm: 170,
                },

                height: {
                  xs: 42,
                  sm: 44,
                },

                px: 3,

                borderRadius: 999,

                backgroundColor: "#00F0FF",
                color: "#000000",

                fontSize: {
                  xs: "0.8rem",
                  sm: "0.84rem",
                },

                fontWeight: 500,

                textTransform: "none",

                boxShadow: "none",

                "&:hover": {
                  backgroundColor: "#00F0FF",
                  color: "#000000",
                  boxShadow: "none",
                  opacity: 0.85,
                },
              }}
            >
              Get In Touch
            </Button>
          </Grid>
        </Grid>

        {/* Bottom divider */}
        <Box
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#00F0FF",
          }}
        />

        {/* Bottom row */}
        <Box
          sx={{
            minHeight: {
              xs: 95,
              sm: 80,
            },

            pt: {
              xs: 2.5,
              sm: 2,
            },

            pb: {
              xs: 9,
              sm: 2,
            },

            display: "flex",

            flexDirection: {
              xs: "column",
              md: "row",
            },

            alignItems: {
              xs: "flex-start",
              md: "center",
            },

            justifyContent: "space-between",

            gap: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Typography
            sx={{
              color: "#00F0FF",
              fontSize: {
                xs: "0.72rem",
                sm: "0.78rem",
              },
              lineHeight: 1.4,
            }}
          >
            © 2026 Swachha. All Rights Reserved.
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 2.5,
            }}
          >
            <Link
              href="/terms-and-conditions"
              underline="none"
              sx={{
                color: "#00F0FF",
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.78rem",
                },
                "&:hover": {
                  opacity: 0.65,
                },
              }}
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy-policy"
              underline="none"
              sx={{
                color: "#00F0FF",
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.78rem",
                },
                "&:hover": {
                  opacity: 0.65,
                },
              }}
            >
              Privacy Policy
            </Link>

            <Link
              href="/cancellation-refund-policy"
              underline="none"
              sx={{
                color: "#00F0FF",
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.78rem",
                },
                "&:hover": {
                  opacity: 0.65,
                },
              }}
            >
              Cancellation & Refunds Policy
            </Link>

            <Link
              href="/replacement-policy"
              underline="none"
              sx={{
                color: "#00F0FF",
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.78rem",
                },
                "&:hover": {
                  opacity: 0.65,
                },
              }}
            >
              Replacement Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}