import {
  Box,
  Link as MuiLink,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

import { getRating } from "@/features/reviews/utils/rating";

import type { Product } from "../types/product";

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({
  product,
}: ProductHeaderProps) {
  const { average: ratingAverage, count: ratingCount } = getRating(product);

  return (
    <Stack
      spacing={{
        xs: 0.75,
        sm: 1,
      }}
    >
      {/* Brand */}
      {product.brand && (
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: "#007F89",
            fontWeight: 800,
            fontSize: {
              xs: "0.68rem",
              sm: "0.75rem",
            },
            letterSpacing: "0.12em",
            lineHeight: 1.4,
            textTransform: "uppercase",
          }}
        >
          {product.brand}
        </Typography>
      )}

      {/* Product name */}
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            fontSize: {
              xs: "1.65rem",
              sm: "2rem",
              md: "2.35rem",
            },
            lineHeight: {
              xs: 1.2,
              sm: 1.18,
            },
            letterSpacing: "-0.025em",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {product.name}
        </Typography>
      </Box>

      {/* Rating: links down to the reviews section */}
      <Stack
        direction="row"
        spacing={0.9}
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          pt: 0.25,
        }}
      >
        {ratingCount > 0 ? (
          <>
            <Rating
              value={ratingAverage}
              precision={0.1}
              readOnly
              size="small"
              sx={{
                color: "#F5A623",
                "& .MuiRating-iconEmpty": {
                  color: "#D8DDD7",
                },
              }}
            />

            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {ratingAverage.toFixed(1)}
            </Typography>

            <MuiLink
              href="#reviews"
              underline="hover"
              variant="body2"
              color="text.secondary"
            >
              ({ratingCount}{" "}
              {ratingCount === 1 ? "review" : "reviews"})
            </MuiLink>
          </>
        ) : (
          <MuiLink
            href="#reviews"
            underline="hover"
            variant="body2"
            color="text.secondary"
          >
            No reviews yet
          </MuiLink>
        )}
      </Stack>
    </Stack>
  );
}