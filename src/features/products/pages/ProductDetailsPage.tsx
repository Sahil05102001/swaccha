import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  Paper,
  Typography,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import Grid from "@mui/material/Grid";

import { useProduct } from "../hooks/useProducts";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductReviews from "@/features/reviews/components/ProductReviews";

// Same palette as ProductCard so the whole site matches.
const COLORS = {
  blue: "#00DDEB",
  ink: "#111111",
  muted: "#68777A",
  pageBg: "#F5F7FA",
  panelBg: "#EAFBFE",
  imageBg: "#F7F7F2",
  badgeText: "#071207",
};

const PAGE_MAX_WIDTH = 1400;

const hideScrollbar = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
} as const;

export default function ProductDetailsPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(id);

  const [selectedImage, setSelectedImage] = useState(0);

  // Start on the first photo whenever a different product opens.
  useEffect(() => {
    setSelectedImage(0);
  }, [id]);

  // After a review is edited or deleted, reload product data so the
  // average and count update everywhere.
  const refreshProductData = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.some(
          (part) =>
            typeof part === "string" && part.toLowerCase().includes("product"),
        ),
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
          backgroundColor: COLORS.pageBg,
        }}
      >
        <CircularProgress
          size={40}
          thickness={4}
          sx={{ color: COLORS.blue }}
        />

        <Typography
          variant="body2"
          sx={{ color: COLORS.muted }}
        >
          Loading product...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ backgroundColor: COLORS.pageBg }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: PAGE_MAX_WIDTH,
            py: {
              xs: 4,
              sm: 6,
            },
          }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: "12px",
            }}
          >
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading this product."}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ backgroundColor: COLORS.pageBg }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: PAGE_MAX_WIDTH,
            py: {
              xs: 6,
              sm: 10,
            },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              maxWidth: 640,
              mx: "auto",
              px: {
                xs: 3,
                sm: 5,
              },
              py: {
                xs: 5,
                sm: 7,
              },
              borderRadius: "20px",
              border: `1px solid ${COLORS.blue}`,
              backgroundColor: COLORS.panelBg,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: COLORS.ink,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                mb: 1,
              }}
            >
              Product not found
            </Typography>

            <Typography
              sx={{
                color: COLORS.muted,
                mb: 3,
              }}
            >
              The product you're looking for may have
              been removed or is no longer available.
            </Typography>

            <Button
              component={Link}
              to="/products"
              variant="outlined"
              sx={{
                minHeight: 46,
                px: 3.5,
                borderRadius: 999,
                border: `1.5px solid ${COLORS.ink}`,
                backgroundColor: COLORS.blue,
                color: "#000000",
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: COLORS.blue,
                  borderColor: COLORS.ink,
                  boxShadow: "none",
                },
              }}
            >
              Browse all products
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const images = product.images ?? [];
  const activeIndex = Math.min(
    selectedImage,
    Math.max(images.length - 1, 0),
  );
  const activeImage = images[activeIndex] ?? "";

  // Review totals are stored on the product document.
  const { ratingSum = 0, ratingCount = 0 } = product as unknown as {
    ratingSum?: number;
    ratingCount?: number;
  };

  const reassuranceItems = [
    {
      title: "Quality Products",
      description:
        "Carefully selected for everyday use.",
      icon: VerifiedOutlinedIcon,
    },
    {
      title: "Secure Shopping",
      description:
        "Your order information stays protected.",
      icon: SecurityOutlinedIcon,
    },
    {
      title: "Easy Ordering",
      description:
        "Add to cart and place your order with ease.",
      icon: ShoppingBagOutlinedIcon,
    },
  ];

  const breadcrumbLinkSx = {
    color: COLORS.muted,
    fontSize: {
      xs: "0.78rem",
      sm: "0.875rem",
    },
    fontWeight: 500,
    "&:hover": {
      color: COLORS.ink,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: COLORS.pageBg,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: PAGE_MAX_WIDTH,
          py: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              sx={{
                fontSize: 17,
                color: COLORS.muted,
              }}
            />
          }
          sx={{
            mb: {
              xs: 1.5,
              sm: 2.5,
            },
            "& .MuiBreadcrumbs-ol": {
              flexWrap: "nowrap",
            },
          }}
        >
          <MuiLink
            component={Link}
            to="/"
            underline="hover"
            sx={breadcrumbLinkSx}
          >
            Home
          </MuiLink>

          <MuiLink
            component={Link}
            to="/products"
            underline="hover"
            sx={breadcrumbLinkSx}
          >
            Products
          </MuiLink>

          <Typography
            sx={{
              color: COLORS.ink,
              fontSize: {
                xs: "0.78rem",
                sm: "0.875rem",
              },
              fontWeight: 600,
              maxWidth: {
                xs: 150,
                sm: 320,
                md: 480,
              },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.name}
          </Typography>
        </Breadcrumbs>

        {/* Product details */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: {
              xs: "16px",
              sm: "20px",
            },
            border: `1px solid ${COLORS.blue}`,
            backgroundColor: "#FFFFFF",

            // "clip" keeps the rounded corners without breaking the sticky image column.
            overflow: "clip",
          }}
        >
          <Grid
            container
            sx={{
              alignItems: "stretch",
            }}
          >
            {/* Image gallery */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
              sx={{
                display: "flex",
                backgroundColor: COLORS.imageBg,
                borderBottom: {
                  xs: `1px solid ${COLORS.blue}`,
                  md: "none",
                },
                borderRight: {
                  xs: "none",
                  md: `1px solid ${COLORS.blue}`,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  minWidth: 0,
                  alignSelf: "flex-start",

                  // Image stays in view while the details scroll on desktop.
                  // If your navbar is sticky, raise "top" to its height + 16.
                  position: {
                    xs: "static",
                    md: "sticky",
                  },
                  top: {
                    md: 24,
                  },

                  p: {
                    xs: 1.5,
                    sm: 2.5,
                    md: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    // Phones and tablets: main image on top, thumbnails underneath.
                    // Large screens: thumbnails in a column on the left.
                    flexDirection: {
                      xs: "column-reverse",
                      lg: "row",
                    },

                    gap: {
                      xs: 1.25,
                      lg: 1.75,
                    },
                  }}
                >
                  {/* Thumbnails (only when there is more than one photo) */}
                  {images.length > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "row",
                          lg: "column",
                        },
                        flexShrink: 0,
                        gap: 1,
                        p: "2px",

                        overflowX: {
                          xs: "auto",
                          lg: "visible",
                        },
                        overflowY: {
                          xs: "visible",
                          lg: "auto",
                        },
                        maxHeight: {
                          lg: 560,
                        },

                        ...hideScrollbar,
                      }}
                    >
                      {images.map((image, index) => {
                        const isSelected = index === activeIndex;

                        return (
                          <Box
                            key={`${image}-${index}`}
                            component="button"
                            type="button"
                            onClick={() => setSelectedImage(index)}
                            aria-label={`Show photo ${index + 1}`}
                            aria-current={isSelected}
                            sx={{
                              display: "block",
                              flexShrink: 0,

                              width: {
                                xs: 56,
                                sm: 64,
                              },
                              height: {
                                xs: 56,
                                sm: 64,
                              },

                              p: 0,
                              m: 0,

                              overflow: "hidden",
                              cursor: "pointer",
                              lineHeight: 0,

                              borderRadius: "10px",
                              border: "2px solid",
                              borderColor: isSelected
                                ? COLORS.blue
                                : "rgba(17,17,17,0.12)",
                              backgroundColor: "#FFFFFF",

                              outline: "none",

                              "&:focus-visible": {
                                borderColor: COLORS.ink,
                              },
                            }}
                          >
                            <Box
                              component="img"
                              src={image}
                              alt={`${product.name} photo ${index + 1}`}
                              loading="lazy"
                              sx={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {/* Main image: a square frame, the standard shape for product photos */}
                  <Box
                    sx={{
                      // In a column (phones/tablets) the frame sizes itself from its width;
                      // in a row (large screens) it takes the space left beside the thumbnails.
                      flex: {
                        xs: "0 0 auto",
                        lg: 1,
                      },
                      alignSelf: {
                        xs: "stretch",
                        lg: "flex-start",
                      },
                      minWidth: 0,
                      aspectRatio: "1 / 1",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      overflow: "hidden",
                      borderRadius: "12px",

                      // Keeps the photo inside the frame, uncropped.
                      "& > *": {
                        width: "100%",
                        height: "100%",
                      },
                      "& img": {
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      },
                    }}
                  >
                    <ProductImage
                      image={activeImage}
                      name={product.name}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Product information */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                backgroundColor: COLORS.panelBg,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  minWidth: 0,
                  p: {
                    xs: 2,
                    sm: 3.5,
                    md: 4,
                    lg: 5,
                  },
                }}
              >
                <ProductInfo product={product} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Product reassurance */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: {
              xs: 1.25,
              sm: 2,
            },
            mt: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {reassuranceItems.map((item) => {
            const Icon = item.icon;

            return (
              <Paper
                key={item.title}
                variant="outlined"
                sx={{
                  p: {
                    xs: 1.75,
                    sm: 2.5,
                  },
                  borderRadius: {
                    xs: "14px",
                    sm: "16px",
                  },
                  border: `1px solid ${COLORS.blue}`,
                  backgroundColor: COLORS.panelBg,
                  boxShadow: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      backgroundColor: COLORS.blue,
                      color: COLORS.badgeText,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: COLORS.ink,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        lineHeight: 1.25,
                        mb: 0.4,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: COLORS.muted,
                        fontSize: "0.85rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Customer reviews */}
        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
          <ProductReviews
            productId={product.id}
            productName={product.name}
            ratingSum={ratingSum}
            ratingCount={ratingCount}
            onChanged={refreshProductData}
          />
        </Box>
      </Container>
    </Box>
  );
}