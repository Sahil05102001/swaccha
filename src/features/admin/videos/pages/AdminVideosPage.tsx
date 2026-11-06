import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import {
  useAddVideo,
  useDeleteVideo,
  useUpdateVideo,
  useVideos,
} from "../hooks/useVideos";

import VideoForm from "../components/VideoForm";

import type {
  VideoCard,
  VideoCardFormData,
} from "../types/video";

export default function AdminVideosPage() {
  const {
    data: videos = [],
    isLoading,
  } = useVideos();

  const addMutation = useAddVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [editingVideo, setEditingVideo] =
    useState<VideoCard | null>(null);

  const activeVideos = videos.filter(
    (video) => video.isActive,
  ).length;

  const handleAdd = () => {
    if (videos.length >= 5) {
      return;
    }

    setEditingVideo(null);
    setFormOpen(true);
  };

  const handleEdit = (video: VideoCard) => {
    setEditingVideo(video);
    setFormOpen(true);
  };

  const handleClose = () => {
    if (
      addMutation.isPending ||
      updateMutation.isPending
    ) {
      return;
    }

    setFormOpen(false);
    setEditingVideo(null);
  };

  const handleSubmit = async (
    data: VideoCardFormData,
  ) => {
    try {
      if (editingVideo) {
        await updateMutation.mutateAsync({
          id: editingVideo.id,
          data,
        });
      } else {
        await addMutation.mutateAsync(data);
      }

      setFormOpen(false);
      setEditingVideo(null);
    } catch (error) {
      console.error("Failed to save video:", error);
    }
  };

  const handleDelete = (video: VideoCard) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video?",
      )
    ) {
      return;
    }

    setSelectedId(video.id);

    deleteMutation.mutate(
      {
        id: video.id,
        publicId: video.publicId,
      },
      {
        onSettled: () => {
          setSelectedId(null);
        },
      },
    );
  };

  const formLoading =
    addMutation.isPending ||
    updateMutation.isPending;

  return (
    <PageContainer>
      <PageHeader
        title="Homepage Videos"
        subtitle="Manage the customer videos displayed on the homepage."
      />

      <Box sx={{ mt: 3, width: "100%" }}>
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F5FBF8 100%)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              "&:last-child": {
                pb: { xs: 2, sm: 2.5, md: 3 },
              },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    backgroundColor: "#E8F7F1",
                    color: "#005B41",
                  }}
                >
                  <VideoLibraryOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, lineHeight: 1.2 }}
                  >
                    Customer Videos
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {activeVideos} active
                    {" · "}
                    {videos.length}/5 videos used
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={
                  isLoading || videos.length >= 5
                }
                sx={{
                  flexShrink: 0,
                  minWidth: { xs: "100%", sm: 150 },
                }}
              >
                {videos.length >= 5
                  ? "Maximum Reached"
                  : "Add Video"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : videos.length === 0 ? (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <VideoLibraryOutlinedIcon
                sx={{
                  fontSize: 48,
                  color: "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                No homepage videos yet
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 3 }}
              >
                Add customer videos to display them on the homepage.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add First Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2.5 },
              width: "100%",
            }}
          >
            {videos.map((video) => (
              <Card
                key={video.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                    backgroundColor: "#111111",
                  }}
                >
                  <Box
                    component="video"
                    src={video.videoUrl}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "#111111",
                    }}
                  />

                  <Chip
                    label={video.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={video.isActive ? "success" : "default"}
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      fontWeight: 700,
                      backgroundColor: video.isActive
                        ? "#FFFFFF"
                        : "#EEEEEE",
                    }}
                  />

                  <Chip
                    label={`Order ${video.displayOrder}`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontWeight: 700,
                      backgroundColor: "rgba(255,255,255,0.94)",
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    p: { xs: 2, sm: 2.25 },
                    "&:last-child": {
                      pb: { xs: 2, sm: 2.25 },
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Homepage video
                    {" · "}
                    Position {video.displayOrder}
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ mt: "auto" }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => handleEdit(video)}
                    >
                      Edit
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      disabled={
                        deleteMutation.isPending &&
                        selectedId === video.id
                      }
                      onClick={() => handleDelete(video)}
                    >
                      {deleteMutation.isPending &&
                      selectedId === video.id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Dialog
        open={formOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ fontWeight: 700, pr: 6 }}
        >
          {editingVideo
            ? "Edit Homepage Video"
            : "Add Homepage Video"}

          <IconButton
            onClick={handleClose}
            disabled={formLoading}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
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
    </PageContainer>
  );
}