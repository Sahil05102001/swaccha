import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import {
  useProducts,
  useUpdateProductFeatured,
} from "@/features/products/hooks/useProducts";

import type { Product } from "@/features/products/types/product";

const MAX_FEATURED = 5;

export default function AdminFeaturedProductsPage() {
  const {
    data: products = [],
    isLoading,
  } = useProducts();

  const updateProductMutation =
    useUpdateProductFeatured();

  const [error, setError] = useState("");

  const featuredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.isFeatured
      ),
    [products]
  );

  const featuredCount =
    featuredProducts.length;

  const handleToggle = async (
    product: Product
  ) => {
    const shouldFeature =
      !product.isFeatured;

    if (
      shouldFeature &&
      featuredCount >= MAX_FEATURED
    ) {
      setError(
        "You can only have 5 featured products."
      );
      return;
    }

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        isFeatured: shouldFeature,
      });
    } catch (err) {
      console.error(
        "Failed to update featured product:",
        err
      );

      setError(
        "Failed to update featured product."
      );
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Featured Products"
        subtitle="Choose up to 5 products to display in the Featured Products section on the homepage."
      />

      <Card
        sx={{
          mt: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1,
              alignItems: "center",
              justifyContent:
                "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Featured Products
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Only active products can
                appear on the homepage.
              </Typography>
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                color:
                  featuredCount >= MAX_FEATURED
                    ? "success.main"
                    : "text.secondary",
              }}
            >
              {featuredCount} /{" "}
              {MAX_FEATURED}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          sx={{
            p: 0,
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          {products.length === 0 ? (
            <Box sx={{ p: 4 }}>
              <Typography
                align="center"
                color="text.secondary"
              >
                No products available.
              </Typography>
            </Box>
          ) : (
            products.map(
              (product, index) => {
                const checked =
                  product.isFeatured;

                const disabled =
                  updateProductMutation.isPending ||
                  (!checked &&
                    featuredCount >=
                      MAX_FEATURED);

                return (
                  <Box
                    key={product.id}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onChange={() =>
                          handleToggle(product)
                        }
                      />

                      <Box
                        component="img"
                        src={
                          product.images?.[0] ||
                          ""
                        }
                        alt={product.name}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "cover",
                          borderRadius: 2,
                          bgcolor: "grey.100",
                          flexShrink: 0,
                        }}
                      />

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {product.category}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          ₹{product.price}
                        </Typography>

                        {!product.isActive && (
                          <Typography
                            variant="caption"
                            color="error"
                          >
                            Inactive
                          </Typography>
                        )}

                        {checked && (
                          <Typography
                            variant="caption"
                            color="success.main"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                            }}
                          >
                            Featured
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {index <
                      products.length - 1 && (
                      <Divider />
                    )}
                  </Box>
                );
              }
            )
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={!!error}
        autoHideDuration={3500}
        onClose={() => setError("")}
      >
        <Alert
          severity="warning"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}