import { useEffect, useState } from "react";



import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";



import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useNavigate } from "react-router-dom";



import { useAuth } from "@/features/auth/AuthContext";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import {
  useWishlist,
  useRemoveFromWishlist,
} from "@/features/wishlist/hooks/useWishlist";



import type { WishlistItem } from "../types/wishlist";



const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};



const pillButtonBase = {
  borderRadius: 999,
  px: 3,
  py: 1,
  fontWeight: 600,
  fontSize: "0.875rem",
  textTransform: "none",
  boxShadow: "none",
  transition: "none",
} as const;



export default function WishlistPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();



  const {
    data: wishlistItems = [],
    isLoading,
    isError,
    error,
  } = useWishlist(Boolean(user) && !authLoading);



  const visibleItems = wishlistItems.filter((item) => item.isActive !== false);


  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);


  const pageCount = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE));
  const pageItems = visibleItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  // If the last item on a page is removed, step back to the previous page.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);



  const addToCart = useAddToCart();
  const removeWishlist = useRemoveFromWishlist();



  const [feedback, setFeedback] = useState<{
    message: string;
    severity: "success" | "error" | "info";
  } | null>(null);



  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: WishlistItem,
  ) => {
    event.stopPropagation();



    if (authLoading) return;



    if (!user) {
      navigate("/login", {
        state: { from: `/products/${item.id}` },
      });
      return;
    }



    if (item.stock <= 0) {
      setFeedback({
        message: "This product is currently out of stock.",
        severity: "info",
      });
      return;
    }



    if (addToCart.isPending) return;



    addToCart.mutate(
      {
        productId: item.id,
        quantity: 1,
        product: item,
      },
      {
        onSuccess: () => {
          setFeedback({
            message: `${item.name} added to cart.`,
            severity: "success",
          });
        },
        onError: (error) => {
          setFeedback({
            message:
              error instanceof Error
                ? error.message
                : "Unable to add this product to your cart.",
            severity: "error",
          });
        },
      },
    );
  };



  const handleRemove = (
    event: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
  ) => {
    event.stopPropagation();



    if (removeWishlist.isPending) return;



    removeWishlist.mutate(itemId, {
      onSuccess: () => {
        setFeedback({
          message: "Product removed from wishlist.",
          severity: "success",
        });
      },
      onError: () => {
        setFeedback({
          message: "Unable to remove this product. Please try again.",
          severity: "error",
        });
      },
    });
  };



  const feedbackSnackbar = (
    <Snackbar
      open={Boolean(feedback)}
      autoHideDuration={3000}
      onClose={() => setFeedback(null)}
    >
      {feedback ? (
        <Alert
          severity={feedback.severity}
          onClose={() => setFeedback(null)}
          variant="filled"
        >
          {feedback.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );



  if (authLoading || isLoading) {
    return (
      <>
        <Container
          sx={{
            minHeight: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: COLORS.blue }} />
        </Container>
        {feedbackSnackbar}
      </>
    );
  }



  if (!user) {
    return (
      <>
        <Container
          maxWidth="sm"
          sx={{
            minHeight: "60vh",
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: COLORS.text,
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Sign in to view your wishlist
          </Typography>



          <Typography sx={{ mt: 1, mb: 3, color: COLORS.muted }}>
            Log in to see your saved products.
          </Typography>



          <Button
            disableElevation
            onClick={() =>
              navigate("/login", {
                state: { from: "/wishlist" },
              })
            }
            sx={{
              ...pillButtonBase,
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
            }}
          >
            Log In
          </Button>
        </Container>
        {feedbackSnackbar}
      </>
    );
  }



  if (isError) {
    return (
      <>
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Alert severity="error">
            {error instanceof Error
              ? error.message
              : "Unable to load your wishlist. Please try again."}
          </Alert>
        </Container>
        {feedbackSnackbar}
      </>
    );
  }



  if (visibleItems.length === 0) {
    return (
      <>
        <Container
          maxWidth="sm"
          sx={{
            minHeight: "60vh",
            px: { xs: 2, sm: 3 },
            py: { xs: 6, sm: 10 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              mb: 3,
              borderRadius: "50%",
              border: `2px solid ${COLORS.blue}`,
              color: COLORS.blue,
            }}
          >
            <FavoriteBorderRoundedIcon sx={{ fontSize: 30 }} />
          </Box>



          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.35rem", sm: "1.6rem" },
              color: COLORS.text,
            }}
          >
            Your wishlist is empty
          </Typography>



          <Typography
            sx={{ mt: 1, mb: 3, fontSize: "0.95rem", color: COLORS.muted }}
          >
            Save items you like and they will show up here.
          </Typography>



          <Button
            disableRipple
            disableElevation
            onClick={() => navigate("/products")}
            variant="contained"
            sx={{
              ...pillButtonBase,
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
            }}
          >
            Browse Products
          </Button>
        </Container>
        {feedbackSnackbar}
      </>
    );
  }



  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 6 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            mb: { xs: 2.5, sm: 4 },
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.4rem", sm: "1.75rem" },
              color: COLORS.text,
            }}
          >
            My Wishlist
          </Typography>



          <Typography sx={{ fontSize: "0.875rem", color: COLORS.muted }}>
            {visibleItems.length}{" "}
            {visibleItems.length === 1 ? "item" : "items"}
          </Typography>
        </Stack>



        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {pageItems.map((item) => (
            <Paper
              key={item.id}
              component="article"
              variant="outlined"
              elevation={0}
              tabIndex={0}
              role="link"
              aria-label={`View ${item.name} details`}
              onClick={() => navigate(`/products/${item.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate(`/products/${item.id}`);
                }
              }}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                borderColor: COLORS.border,
                bgcolor: COLORS.white,
                backgroundImage: "none",
                boxShadow: "none",
                cursor: "pointer",
                "&:focus-visible": {
                  outline: `2px solid ${COLORS.blue}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "80px minmax(0, 1fr)",
                    sm: "112px minmax(0, 1fr) auto",
                  },
                  columnGap: { xs: 1.5, sm: 2.5 },
                  rowGap: 1.5,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 80, sm: 112 },
                    height: { xs: 80, sm: 112 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 1.5,
                    bgcolor: COLORS.white,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={item.images?.[0] ?? ""}
                    alt={item.name}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: 0.75,
                    }}
                  />
                </Box>



                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      color: COLORS.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.name}
                  </Typography>



                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "0.825rem",
                      lineHeight: 1.5,
                      color: COLORS.muted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: { xs: 1, sm: 2 },
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description}
                  </Typography>



                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{ mt: 1, alignItems: "baseline", flexWrap: "wrap", gap: 1 }}
                  >
                    <Typography
                      sx={{ fontWeight: 700, fontSize: "1.05rem", color: COLORS.text }}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </Typography>



                    {item.mrp > item.price && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: COLORS.muted,
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{item.mrp.toLocaleString("en-IN")}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#007F89" }}
                        >
                          {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off
                        </Typography>
                      </>
                    )}
                  </Stack>



                  {item.stock <= 0 && (
                    <Typography
                      sx={{ mt: 0.5, fontSize: "0.8rem", fontWeight: 600, color: "#B42318" }}
                    >
                      Out of stock
                    </Typography>
                  )}
                </Box>



                <Stack
                  direction={{ xs: "row", sm: "column" }}
                  spacing={1}
                  sx={{
                    gridColumn: { xs: "1 / -1", sm: "auto" },
                    alignItems: "stretch",
                  }}
                >
                  <Button
                    disableRipple
                    disableElevation
                    variant="contained"
                    disabled={authLoading || addToCart.isPending || item.stock <= 0}
                    onClick={(event) => handleAddToCart(event, item)}
                    sx={{
                      ...pillButtonBase,
                      bgcolor: COLORS.black,
                      color: COLORS.white,
                      flex: 1,
                      "&:hover": {
                        bgcolor: COLORS.text,
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        bgcolor: COLORS.border,
                        color: COLORS.muted,
                      },
                    }}
                  >
                    {item.stock <= 0 ? "Out of stock" : "Add to Cart"}
                  </Button>



                  <Button
                    disableRipple
                    variant="outlined"
                    disabled={removeWishlist.isPending}
                    onClick={(event) => handleRemove(event, item.id)}
                    sx={{
                      ...pillButtonBase,
                      color: COLORS.text,
                      borderColor: COLORS.border,
                      flex: 1,
                      "&:hover": {
                        borderColor: COLORS.text,
                        bgcolor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>


        {pageCount > 1 && (
          <Stack sx={{ mt: { xs: 3, sm: 4 }, alignItems: "center" }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => {
                setPage(value);
                window.scrollTo({ top: 0 });
              }}
              shape="rounded"
              siblingCount={0}
              sx={{
                "& .MuiPaginationItem-root": { borderRadius: 0 },
                "& .Mui-selected": {
                  bgcolor: "#00D9FF !important",
                  color: "#212121",
                  fontWeight: 700,
                },
              }}
            />
          </Stack>
        )}
      </Container>
      {feedbackSnackbar}
    </>
  );
}