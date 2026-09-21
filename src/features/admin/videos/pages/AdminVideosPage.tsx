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
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

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
    const { data: videos = [], isLoading } = useVideos();

    const addMutation = useAddVideo();
    const updateMutation = useUpdateVideo();
    const deleteMutation = useDeleteVideo();

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState(false);

    const [editingVideo, setEditingVideo] =
        useState<VideoCard | null>(null);

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
        data: VideoCardFormData
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
            console.error(
                "Failed to save video:",
                error
            );
        }
    };

    const handleDelete = (id: string) => {
        if (
            window.confirm(
                "Are you sure you want to delete this video?"
            )
        ) {
            setSelectedId(id);

            deleteMutation.mutate(id, {
                onSettled: () => {
                    setSelectedId(null);
                },
            });
        }
    };

    const formLoading =
        addMutation.isPending ||
        updateMutation.isPending;

    return (
        <PageContainer>
            <PageHeader
                title="Homepage Videos"
                subtitle="Manage the 5 video cards displayed on the homepage."
            />

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleAdd}
                    disabled={videos.length >= 5}
                    sx={{
                        mb: 3,
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    {videos.length >= 5
                        ? "Maximum 5 Videos"
                        : "Add Video"}
                </Button>

                {isLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 6,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : videos.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                                align="center"
                            >
                                No homepage videos added yet.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {videos.map((video) => (
                            <Card key={video.id}>
                                <CardContent>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={2}
                                        sx={{
                                            alignItems: {
                                                xs: "stretch",
                                                sm: "center",
                                            },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            sx={{
                                                width: {
                                                    xs: "100%",
                                                    sm: 180,
                                                },
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                                bgcolor: "grey.100",
                                            }}
                                        />

                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {video.title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                {video.description}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <Chip
                                                    label={video.type}
                                                    size="small"
                                                />

                                                <Chip
                                                    label={`Order: ${video.displayOrder}`}
                                                    size="small"
                                                    variant="outlined"
                                                />

                                                <Chip
                                                    label={
                                                        video.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    size="small"
                                                    color={
                                                        video.isActive
                                                            ? "success"
                                                            : "default"
                                                    }
                                                />
                                            </Stack>
                                        </Box>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    handleEdit(video)
                                                }
                                                sx={{
                                                    textTransform: "none",
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="error"
                                                disabled={
                                                    deleteMutation.isPending &&
                                                    selectedId === video.id
                                                }
                                                onClick={() =>
                                                    handleDelete(video.id)
                                                }
                                                sx={{
                                                    textTransform: "none",
                                                }}
                                            >
                                                {deleteMutation.isPending &&
                                                    selectedId === video.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>

                                <Divider />
                            </Card>
                        ))}
                    </Stack>
                )}
            </Box>

            {/* Add / Edit Video Dialog */}
            <Dialog
                open={formOpen}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        pr: 6,
                    }}
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

                <DialogContent sx={{ pt: 2 }}>
                    <VideoForm
                        video={editingVideo}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                        loading={formLoading}
                    />
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}