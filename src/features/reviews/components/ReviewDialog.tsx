import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import { useAuth } from "@/features/auth/AuthContext";

import {
  getMyReview,
  REVIEW_LIMITS,
  saveReview,
} from "../services/reviewService";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (isEdit: boolean) => void;
  productId: string;
  productName: string;
  orderId: string;
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  radio: "#B0B0B0",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: COLORS.white,
    "& fieldset": { borderColor: COLORS.border, transition: "none" },
    "&:hover fieldset": { borderColor: COLORS.muted },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue, borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: COLORS.muted, transition: "none" },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.text },
  "& .MuiInputBase-input": { color: COLORS.text },
};

export default function ReviewDialog({
  open,
  onClose,
  onSaved,
  productId,
  productName,
  orderId,
}: ReviewDialogProps) {
  const { user } = useAuth();

  const [rating, setRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Each time the window opens, load this user's existing review (if any).
  useEffect(() => {
    if (!open || !user) return;

    let cancelled = false;

    setRating(null);
    setTitle("");
    setBody("");
    setIsEdit(false);
    setSubmitted(false);
    setError(null);
    setLoadingExisting(true);

    getMyReview(productId, user.uid)
      .then((review) => {
        if (cancelled || !review) return;
        setRating(review.rating);
        setTitle(review.title);
        setBody(review.body);
        setIsEdit(true);
      })
      .catch(() => {
        // Not fatal: the user can still write a new review.
      })
      .finally(() => {
        if (!cancelled) setLoadingExisting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, productId, user]);

  const trimmedBody = body.trim();

  const ratingError = submitted && !rating ? "Please select a rating" : "";
  const titleError = submitted && !title.trim() ? "Title is required" : "";
  const bodyError =
    submitted && trimmedBody.length < REVIEW_LIMITS.bodyMin
      ? trimmedBody.length === 0
        ? "Review is required"
        : `Write at least ${REVIEW_LIMITS.bodyMin} characters`
      : "";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || !user) return;

    setSubmitted(true);
    setError(null);

    if (!rating || !title.trim() || trimmedBody.length < REVIEW_LIMITS.bodyMin) {
      return;
    }

    setSaving(true);

    try {
      await saveReview({
        productId,
        productName,
        orderId,
        uid: user.uid,
        userName: user.displayName || "Customer",
        rating,
        title,
        body,
      });

      onSaved?.(isEdit);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save your review. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            m: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "100%" },
            borderRadius: 3,
            boxShadow: "none",
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.white,
            backgroundImage: "none",
          },
        },
      }}
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        {/* Header */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            p: { xs: 2, sm: 2.5 },
            alignItems: "center",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1rem", color: COLORS.text }}
            >
              {isEdit ? "Edit your review" : "Write a review"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: COLORS.muted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {productName}
            </Typography>
          </Box>

          <IconButton
            aria-label="Close"
            onClick={onClose}
            disabled={saving}
            disableRipple
            sx={{ color: COLORS.muted }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        {/* Form */}
        <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 2.5 } }}>
          {error && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{ borderRadius: 2, fontSize: "0.85rem" }}
            >
              {error}
            </Alert>
          )}

          <Box>
            <Typography
              sx={{
                mb: 0.5,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: COLORS.text,
              }}
            >
              Overall rating <span aria-hidden="true">*</span>
            </Typography>

            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
              disabled={loadingExisting || saving}
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={
                <StarRoundedIcon
                  fontSize="inherit"
                  sx={{ color: COLORS.border }}
                />
              }
              sx={{
                fontSize: { xs: "2rem", sm: "2.2rem" },
                "& .MuiRating-iconFilled": { color: "#F5A623" }
              }}
            />

            {ratingError && (
              <Typography
                sx={{ mt: 0.5, fontSize: "0.75rem", color: "error.main" }}
              >
                {ratingError}
              </Typography>
            )}
          </Box>

          <TextField
            required
            label="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleError}
            helperText={titleError}
            disabled={loadingExisting || saving}
            fullWidth
            sx={fieldSx}
            slotProps={{ htmlInput: { maxLength: REVIEW_LIMITS.titleMax } }}
          />

          <TextField
            required
            label="Your review"
            placeholder="What did you like or dislike about this product?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            error={!!bodyError}
            helperText={
              bodyError ||
              `${body.length}/${REVIEW_LIMITS.bodyMax} (minimum ${REVIEW_LIMITS.bodyMin})`
            }
            disabled={loadingExisting || saving}
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            sx={fieldSx}
            slotProps={{ htmlInput: { maxLength: REVIEW_LIMITS.bodyMax } }}
          />

          <Button
            type="submit"
            fullWidth
            disableRipple
            disableElevation
            variant="contained"
            disabled={saving || loadingExisting}
            sx={{
              py: 1.3,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "none",
              transition: "none",
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: COLORS.border, color: COLORS.muted },
            }}
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Update review"
                : "Submit review"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}