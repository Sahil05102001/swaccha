import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Link as MuiLink,
    Rating,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import {
    deleteAdminReply,
    deleteReviewAsAdmin,
    fetchAdminReviewsPage,
    saveAdminReply,
    type AdminReviewsPage as PageData,
    type Review,
} from "@/features/reviews/services/reviewService";

const formatDate = (ts?: { toDate: () => Date }) =>
    ts
        ? ts.toDate().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "";

function ReviewRow({
    review,
    onChanged,
    onDelete,
}: {
    review: Review;
    onChanged: () => void;
    onDelete: () => void;
}) {
    const { showSnackbar } = useSnackbar();
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(review.adminReply?.text ?? "");
    const [busy, setBusy] = useState(false);

    const run = async (action: () => Promise<void>, success: string) => {
        setBusy(true);
        try {
            await action();
            showSnackbar(success, "success");
            setEditing(false);
            onChanged();
        } catch (error) {
            showSnackbar(
                error instanceof Error ? error.message : "Something went wrong.",
                "error"
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <Box sx={{ py: 2.5 }}>
            <Stack
                direction="row"
                sx={{ alignItems: "center", flexWrap: "wrap", columnGap: 1.5, rowGap: 0.5 }}
            >
                <Rating value={review.rating} readOnly size="small" />
                <Typography sx={{ fontWeight: 700, wordBreak: "break-word" }}>
                    {review.title}
                </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                {review.userName} · {formatDate(review.createdAt)}
                {review.editedAt && ` · Edited ${formatDate(review.editedAt)}`} ·{" "}
                <MuiLink component={Link} to={`/products/${review.productId}`} underline="hover">
                    {review.productName ?? "View product"}
                </MuiLink>
            </Typography>

            <Typography
                sx={{ mt: 1, whiteSpace: "pre-line", wordBreak: "break-word" }}
                variant="body2"
            >
                {review.body}
            </Typography>

            {/* Reply */}
            <Box sx={{ mt: 1.5 }}>
                {editing ? (
                    <Stack spacing={1}>
                        <TextField
                            multiline
                            minRows={2}
                            maxRows={6}
                            fullWidth
                            size="small"
                            label="Your reply"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={busy}
                            slotProps={{ htmlInput: { maxLength: 1000 } }}
                            helperText={`${text.length}/1000`}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={busy || !text.trim()}
                                onClick={() =>
                                    run(() => saveAdminReply(review.id, text), "Reply saved.")
                                }
                            >
                                {busy ? "Saving..." : "Save reply"}
                            </Button>
                            <Button
                                size="small"
                                disabled={busy}
                                onClick={() => {
                                    setText(review.adminReply?.text ?? "");
                                    setEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                ) : review.adminReply ? (
                    <Box sx={{ p: 1.5, border: 1, borderColor: "divider", borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            Your reply · {formatDate(review.adminReply.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                            {review.adminReply.text}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" onClick={() => setEditing(true)} disabled={busy}>
                                Edit reply
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                disabled={busy}
                                onClick={() =>
                                    run(() => deleteAdminReply(review.id), "Reply deleted.")
                                }
                            >
                                Delete reply
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Button size="small" variant="outlined" onClick={() => setEditing(true)}>
                        Reply
                    </Button>
                )}
            </Box>

            <Box sx={{ mt: 1.5 }}>
                <Button size="small" color="error" onClick={onDelete} disabled={busy}>
                    Delete review
                </Button>
            </Box>
        </Box>
    );
}

export default function AdminReviewsPage() {
    const { showSnackbar } = useSnackbar();

    // Pages already loaded, so going back costs no reads.
    const cache = useRef(new Map<number, PageData>());

    const [page, setPage] = useState(1);
    const [reloadKey, setReloadKey] = useState(0);
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    const [deleting, setDeleting] = useState<Review | null>(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const cached = cache.current.get(page);
        if (cached) {
            setData(cached);
            setLoading(false);
            setFailed(false);
            return;
        }

        const previous: QueryDocumentSnapshot | null =
            page > 1 ? cache.current.get(page - 1)?.last ?? null : null;

        if (page > 1 && !previous) {
            setPage(1);
            return;
        }

        setLoading(true);
        setFailed(false);

        fetchAdminReviewsPage(previous)
            .then((result) => {
                if (cancelled) return;
                cache.current.set(page, result);
                setData(result);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [page, reloadKey]);

    // Reload from page 1 after any change.
    const refresh = () => {
        cache.current.clear();
        setPage(1);
        setReloadKey((key) => key + 1);
    };

    const confirmDelete = async () => {
        if (!deleting) return;
        setDeleteBusy(true);
        try {
            await deleteReviewAsAdmin(deleting);
            showSnackbar("Review deleted.", "success");
            setDeleting(null);
            refresh();
        } catch (error) {
            showSnackbar(
                error instanceof Error ? error.message : "Could not delete the review.",
                "error"
            );
        } finally {
            setDeleteBusy(false);
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title="Reviews"
                subtitle="Reply to customer reviews or remove inappropriate ones."
            />

            <SectionCard>
                {loading && !data ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : failed ? (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={() => setReloadKey((k) => k + 1)}>
                                Retry
                            </Button>
                        }
                    >
                        Failed to load reviews.
                    </Alert>
                ) : !data || data.reviews.length === 0 ? (
                    <Typography color="text.secondary">No reviews yet.</Typography>
                ) : (
                    <>
                        <Box sx={{ opacity: loading ? 0.5 : 1 }}>
                            {data.reviews.map((review, index) => (
                                <Box key={review.id}>
                                    {index > 0 && <Divider />}
                                    <ReviewRow
                                        review={review}
                                        onChanged={refresh}
                                        onDelete={() => setDeleting(review)}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mt: 2, alignItems: "center", justifyContent: "center" }}
                        >
                            <Button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
                                Previous
                            </Button>
                            <Typography variant="body2" color="text.secondary">
                                Page {page}
                            </Typography>
                            <Button disabled={!data.hasMore || loading} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </Button>
                        </Stack>
                    </>
                )}
            </SectionCard>

            <Dialog open={!!deleting} onClose={deleteBusy ? undefined : () => setDeleting(null)}>
                <DialogTitle>Delete this review?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        The review and any reply will be removed permanently, and the
                        product's rating will be recalculated.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleting(null)} disabled={deleteBusy}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={confirmDelete} disabled={deleteBusy}>
                        {deleteBusy ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
}