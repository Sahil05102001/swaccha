import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import type { QueryDocumentSnapshot } from "firebase/firestore";

import { useAuth } from "@/features/auth/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";

import {
  deleteMyReview,
  fetchReviewsPage,
  REVIEWS_PAGE_SIZE,
  type Review,
} from "../services/reviewService";
import ReviewDialog from "./ReviewDialog";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  ratingSum: number;
  ratingCount: number;
  onChanged?: () => void;
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

const READ_MORE_AT = 220;

type CachedPage = { reviews: Review[]; last: QueryDocumentSnapshot | null };

const formatDate = (ts?: { toDate: () => Date }) =>
  ts
    ? ts.toDate().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const stars = (value: number, size: string) => (
  <Rating
    value={value}
    precision={0.5}
    readOnly
    icon={<StarRoundedIcon fontSize="inherit" />}
    emptyIcon={
      <StarRoundedIcon fontSize="inherit" sx={{ color: COLORS.border }} />
    }
    sx={{ fontSize: size, "& .MuiRating-iconFilled": { color: "#F5A623" } }}
  />
);

const linkButtonSx = {
  p: 0,
  minWidth: 0,
  fontSize: "0.8rem",
  fontWeight: 600,
  textTransform: "none",
  color: COLORS.text,
  textDecoration: "underline",
  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
} as const;

const pillSx = {
  borderRadius: 999,
  px: 2.5,
  py: 0.75,
  fontWeight: 600,
  fontSize: "0.85rem",
  textTransform: "none",
  color: COLORS.text,
  border: `1px solid ${COLORS.border}`,
  boxShadow: "none",
  transition: "none",
  "&:hover": { borderColor: COLORS.text, bgcolor: "transparent" },
  "&.Mui-disabled": { color: COLORS.muted, borderColor: COLORS.border },
} as const;

function ReviewItem({
  review,
  mine,
  onEdit,
  onDelete,
}: {
  review: Review;
  mine: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const long = review.body.length > READ_MORE_AT;
  const shown =
    long && !expanded
      ? `${review.body.slice(0, READ_MORE_AT).trimEnd()}…`
      : review.body;

  return (
    <Box sx={{ py: { xs: 2, sm: 2.5 } }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", flexWrap: "wrap", columnGap: 1, rowGap: 0.5 }}
      >
        {stars(review.rating, "1.1rem")}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: COLORS.text,
            wordBreak: "break-word",
          }}
        >
          {review.title}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          mt: 0.5,
          alignItems: "center",
          flexWrap: "wrap",
          columnGap: 1.25,
          rowGap: 0.25,
          fontSize: "0.78rem",
          color: COLORS.muted,
        }}
      >
        <span>{mine ? "You" : review.userName}</span>
        <span>{formatDate(review.createdAt)}</span>
        {review.editedAt && <span>Edited on {formatDate(review.editedAt)}</span>}
        <Box
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}
        >
          <VerifiedOutlinedIcon sx={{ fontSize: 14 }} />
          Verified purchase
        </Box>
      </Stack>

      <Typography
        sx={{
          mt: 1,
          fontSize: "0.9rem",
          lineHeight: 1.65,
          color: COLORS.text,
          whiteSpace: "pre-line",
          wordBreak: "break-word",
        }}
      >
        {shown}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        {long && (
          <Button
            disableRipple
            onClick={() => setExpanded((prev) => !prev)}
            sx={linkButtonSx}
          >
            {expanded ? "Show less" : "Read more"}
          </Button>
        )}
        {mine && (
          <>
            <Button disableRipple onClick={onEdit} sx={linkButtonSx}>
              Edit
            </Button>
            <Button disableRipple onClick={onDelete} sx={linkButtonSx}>
              Delete
            </Button>
          </>
        )}
      </Stack>

      {review.adminReply && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            bgcolor: "#FAFAFA",
          }}
        >
          <Typography
            sx={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.text }}
          >
            Response from Swachha
            <Box
              component="span"
              sx={{ ml: 1, fontWeight: 400, color: COLORS.muted }}
            >
              {formatDate(review.adminReply.createdAt)}
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: COLORS.text,
              whiteSpace: "pre-line",
              wordBreak: "break-word",
            }}
          >
            {review.adminReply.text}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function ProductReviews({
  productId,
  productName,
  ratingSum,
  ratingCount,
  onChanged,
}: ProductReviewsProps) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Key 0 = the single preview review. Keys 1, 2, 3... = pages of 3.
  // Visited pages are kept, so going back never re-reads from Firestore.
  const cache = useRef(new Map<number, CachedPage>());

  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [editing, setEditing] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState<Review | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const average = ratingCount > 0 ? ratingSum / ratingCount : 0;
  const pageCount = Math.max(1, Math.ceil(ratingCount / REVIEWS_PAGE_SIZE));

  // A different product starts clean. (Declared first so it runs before the fetch.)
  useEffect(() => {
    cache.current.clear();
    setShowAll(false);
    setPage(1);
  }, [productId]);

  useEffect(() => {
    let cancelled = false;

    // No reviews on this product: nothing to read from Firestore.
    if (ratingCount === 0) {
      setReviews([]);
      setLoading(false);
      setFailed(false);
      return;
    }

    const key = showAll ? page : 0;

    const cached = cache.current.get(key);
    if (cached) {
      setReviews(cached.reviews);
      setLoading(false);
      setFailed(false);
      return;
    }

    let after: QueryDocumentSnapshot | null = null;
    let count = showAll ? REVIEWS_PAGE_SIZE : 1;
    let prefix: Review[] = [];
    let prefixLast: QueryDocumentSnapshot | null = null;

    if (showAll && page === 1) {
      // Reuse the preview review already loaded; fetch only the rest of page 1.
      const preview = cache.current.get(0);
      if (preview) {
        after = preview.last;
        count = REVIEWS_PAGE_SIZE - preview.reviews.length;
        prefix = preview.reviews;
        prefixLast = preview.last;
      }
    } else if (showAll) {
      after = cache.current.get(page - 1)?.last ?? null;
      if (!after) {
        setPage(1);
        return;
      }
    }

    setLoading(true);
    setFailed(false);

    fetchReviewsPage(productId, after, count)
      .then((result) => {
        if (cancelled) return;
        const merged: CachedPage = {
          reviews: [...prefix, ...result.reviews],
          last: result.last ?? prefixLast,
        };
        cache.current.set(key, merged);
        setReviews(merged.reviews);
      })
      .catch((err) => {
        console.error("Failed to load reviews:", err?.code, err?.message);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showAll, page, productId, reloadKey, ratingCount]);

  const refresh = () => {
    cache.current.clear();
    setPage(1);
    setReloadKey((key) => key + 1);
    onChanged?.();
  };

  const goTo = (next: number) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showFewer = () => {
    setShowAll(false);
    setPage(1);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteMyReview(deleting);
      showSnackbar("Review deleted.", "success");
      setDeleting(null);
      refresh();
    } catch {
      showSnackbar("Could not delete your review. Please try again.", "error");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <Paper
      ref={sectionRef}
      id="reviews"
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        borderColor: COLORS.border,
        bgcolor: COLORS.white,
        backgroundImage: "none",
        boxShadow: "none",
        scrollMarginTop: 16,
      }}
    >
      {/* Summary */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: { xs: 2, sm: 3 },
          alignItems: "center",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
            color: COLORS.text,
            flex: 1,
          }}
        >
          Customer Reviews
        </Typography>

        {ratingCount > 0 ? (
          <Stack sx={{ alignItems: "flex-end" }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: "1.25rem", color: COLORS.text }}
              >
                {average.toFixed(1)}
              </Typography>
              {stars(average, "1.2rem")}
            </Stack>
            <Typography sx={{ fontSize: "0.78rem", color: COLORS.muted }}>
              {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
            </Typography>
          </Stack>
        ) : null}
      </Stack>

      {/* List */}
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        {loading && reviews.length === 0 && ratingCount > 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <CircularProgress size={26} sx={{ color: COLORS.blue }} />
          </Box>
        ) : failed ? (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ my: 2, borderRadius: 2, fontSize: "0.85rem" }}
          >
            Could not load reviews.{" "}
            <Button
              disableRipple
              onClick={() => setReloadKey((key) => key + 1)}
              sx={linkButtonSx}
            >
              Try again
            </Button>
          </Alert>
        ) : reviews.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600, color: COLORS.text }}>
              No reviews yet
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: "0.85rem", color: COLORS.muted }}>
              Buy this product and share what you think once it's delivered.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ opacity: loading ? 0.5 : 1 }}>
            {reviews.map((review, index) => (
              <Box
                key={review.id}
                sx={{
                  borderTop: index > 0 ? `1px solid ${COLORS.border}` : 0,
                }}
              >
                <ReviewItem
                  review={review}
                  mine={review.userId === user?.uid}
                  onEdit={() => setEditing(review)}
                  onDelete={() => setDeleting(review)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* See all reviews (only when there is more than one) */}
      {!showAll && ratingCount > 1 && !failed && reviews.length > 0 && (
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            textAlign: "center",
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <Button
            disableRipple
            onClick={() => setShowAll(true)}
            sx={pillSx}
          >
            See all {ratingCount} reviews
          </Button>
        </Box>
      )}

      {/* Pagination + collapse (when showing all) */}
      {showAll && !failed && (
        <Stack
          spacing={1.5}
          sx={{
            p: { xs: 2, sm: 2.5 },
            alignItems: "center",
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          {pageCount > 1 && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Button
                disableRipple
                disabled={page <= 1 || loading}
                onClick={() => goTo(page - 1)}
                sx={pillSx}
              >
                Previous
              </Button>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: COLORS.muted,
                  whiteSpace: "nowrap",
                }}
              >
                Page {page} of {pageCount}
              </Typography>

              <Button
                disableRipple
                disabled={page >= pageCount || loading}
                onClick={() => goTo(page + 1)}
                sx={pillSx}
              >
                Next
              </Button>
            </Stack>
          )}

          <Button disableRipple onClick={showFewer} sx={linkButtonSx}>
            Show fewer reviews
          </Button>
        </Stack>
      )}

      {/* Edit (author only) */}
      {editing && (
        <ReviewDialog
          open
          onClose={() => setEditing(null)}
          onSaved={() => {
            showSnackbar("Review updated.", "success");
            refresh();
          }}
          productId={productId}
          productName={productName}
          orderId={editing.orderId}
        />
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!deleting}
        onClose={deleteBusy ? undefined : () => setDeleting(null)}
        transitionDuration={0}
        slotProps={{
          paper: {
            sx: {
              m: 2,
              width: "100%",
              maxWidth: 360,
              p: 2.5,
              borderRadius: 3,
              boxShadow: "none",
              border: `1px solid ${COLORS.border}`,
              backgroundImage: "none",
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 700, color: COLORS.text }}>
          Delete your review?
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: "0.875rem", color: COLORS.muted }}>
          This can't be undone.
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
          <Button
            fullWidth
            disableRipple
            disabled={deleteBusy}
            onClick={() => setDeleting(null)}
            sx={pillSx}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            disableRipple
            disableElevation
            variant="contained"
            disabled={deleteBusy}
            onClick={confirmDelete}
            sx={{
              ...pillSx,
              bgcolor: COLORS.black,
              color: COLORS.white,
              border: `1px solid ${COLORS.black}`,
              "&:hover": { bgcolor: COLORS.text },
              "&.Mui-disabled": { bgcolor: COLORS.border, color: COLORS.muted },
            }}
          >
            {deleteBusy ? "Deleting..." : "Delete"}
          </Button>
        </Stack>
      </Dialog>
    </Paper>
  );
}