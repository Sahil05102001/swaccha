import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { useSnackbar } from "@/contexts/SnackbarContext";

import VideoForm from "../components/VideoForm";
import {
  useAddVideo,
  useDeleteVideo,
  useUpdateVideo,
  useVideos,
} from "../hooks/useVideos";
import type { VideoCard, VideoCardFormData } from "../types/video";
import { getYouTubeId, youtubeThumb } from "../utils/youtube";
import { scrollToTop } from "src/features/admin/utils/scrollToTop"

export default function AdminVideosPage() {
  const { showSnackbar } = useSnackbar();

  const { data: videos = [], isLoading, refetch, isRefetching } = useVideos();

  const addMutation = useAddVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();

  const [formOpen, setFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoCard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VideoCard | null>(null);

  const activeVideos = videos.filter((video) => video.isActive).length;
  const formLoading = addMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    if (videos.length >= 5) return;
    setEditingVideo(null);
    setFormOpen(true);
  };

  const handleEdit = (video: VideoCard) => {
    setEditingVideo(video);
    setFormOpen(true);
  };

  const handleClose = () => {
    if (formLoading) return;
    setFormOpen(false);
    setEditingVideo(null);
  };

  const handleSubmit = async (data: VideoCardFormData) => {
    try {
      if (editingVideo) {
        await updateMutation.mutateAsync({ id: editingVideo.id, data });
        showSnackbar("Video updated.", "success");
      } else {
        await addMutation.mutateAsync(data);
        showSnackbar("Video added.", "success");
      }

      setFormOpen(false);
      setEditingVideo(null);
      scrollToTop();
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save video.",
        "error",
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          showSnackbar("Video deleted.", "success");
          setDeleteTarget(null);
          scrollToTop();
        },
        onError: () => showSnackbar("Failed to delete video.", "error"),
      },
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Homepage Videos"
        subtitle={`${activeVideos} active · ${videos.length}/5 videos used. Videos play from YouTube.`}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disabled={isLoading || videos.length >= 5}
            >
              {videos.length >= 5 ? "Maximum reached" : "Add video"}
            </Button>
          </Stack>
        }
      />

      {isLoading ? (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={170} />
          ))}
        </Box>
      ) : videos.length === 0 ? (
        <Card variant="outlined" sx={{ py: 8, textAlign: "center", px: 2 }}>
          <VideoLibraryOutlinedIcon sx={{ fontSize: 44, color: "text.disabled", mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            No homepage videos yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Add a YouTube link to show customer videos on the homepage.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add first video
          </Button>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          {videos.map((video) => {
            const id = getYouTubeId(video.videoUrl);
            const deleting =
              deleteMutation.isPending && deleteTarget?.id === video.id;

            return (
              <Card key={video.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      width: 96,
                      flexShrink: 0,
                      aspectRatio: "9 / 16",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#111111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      p: id ? 0 : 1,
                    }}
                  >
                    {id ? (
                      <Box
                        component="img"
                        src={youtubeThumb(id, "hqdefault")}
                        alt="Video thumbnail"
                        loading="lazy"
                        sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: "#FFFFFF" }}>
                        Cloudinary video
                      </Typography>
                    )}
                  </Box>

                  <Stack sx={{ minWidth: 0, flex: 1 }} spacing={1}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={video.isActive ? "Active" : "Inactive"}
                        color={video.isActive ? "success" : "default"}
                      />
                      <Chip size="small" variant="outlined" label={`Position ${video.displayOrder}`} />
                      {!id && (
                        <Chip size="small" variant="outlined" color="warning" label="Replace with YouTube" />
                      )}
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {id ? video.videoUrl : "Edit this video to switch it to a YouTube link."}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: "auto !important", pt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => handleEdit(video)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlinedIcon />}
                        disabled={deleting}
                        onClick={() => setDeleteTarget(video)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Box>
      )}

      <Dialog open={formOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          {editingVideo ? "Edit homepage video" : "Add homepage video"}
          <IconButton
            onClick={handleClose}
            disabled={formLoading}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <VideoForm
            video={editingVideo}
            existingVideos={videos}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete video?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes the video from the homepage. The video on YouTube is not affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}