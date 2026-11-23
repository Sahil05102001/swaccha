import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import VideoFileIcon from "@mui/icons-material/VideoFile";

import AdminSelect from "@/features/admin/components/AdminSelect";

import type { VideoCard, VideoCardFormData } from "../types/video";
import { getYouTubeId, youtubeShortLink, youtubeThumb } from "../utils/youtube";

interface VideoFormProps {
  video?: VideoCard | null;
  existingVideos?: VideoCard[];
  onSubmit: (data: VideoCardFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const defaultForm: VideoCardFormData = {
  videoUrl: "",
  publicId: "",
  thumbnailUrl: "",
  isActive: true,
  displayOrder: 1,
};

export default function VideoForm({
  video,
  existingVideos = [],
  onSubmit,
  onCancel,
  loading = false,
}: VideoFormProps) {
  const [form, setForm] = useState<VideoCardFormData>(defaultForm);
  const [urlError, setUrlError] = useState("");

  const usedOrders = useMemo(
    () =>
      new Set(
        existingVideos
          .filter((item) => item.id !== video?.id)
          .map((item) => item.displayOrder),
      ),
    [existingVideos, video?.id],
  );

  const availableOrders = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => index + 1).filter((order) =>
        video ? true : !usedOrders.has(order),
      ),
    [video, usedOrders],
  );

  useEffect(() => {
    if (video) {
      setForm({
        videoUrl: video.videoUrl,
        publicId: "",
        thumbnailUrl: "",
        isActive: video.isActive,
        displayOrder: video.displayOrder,
      });
    } else {
      const firstAvailableOrder = [1, 2, 3, 4, 5].find(
        (order) => !usedOrders.has(order),
      );

      setForm({ ...defaultForm, displayOrder: firstAvailableOrder ?? 1 });
    }

    setUrlError("");
  }, [video, usedOrders]);

  const updateField = <K extends keyof VideoCardFormData>(
    field: K,
    value: VideoCardFormData[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "videoUrl") setUrlError("");
  };

  const videoId = getYouTubeId(form.videoUrl);

  const handleSubmit = () => {
    if (!form.videoUrl.trim()) {
      setUrlError("Please paste a YouTube link.");
      return;
    }

    if (!videoId) {
      setUrlError(
        "This doesn't look like a YouTube link. Use a Shorts or video link from YouTube.",
      );
      return;
    }

    onSubmit({
      videoUrl: youtubeShortLink(videoId),
      publicId: "",
      thumbnailUrl: "",
      isActive: form.isActive,
      displayOrder: form.displayOrder,
    });
  };

  const canSubmit =
    !loading &&
    Boolean(form.videoUrl.trim()) &&
    Number.isInteger(form.displayOrder) &&
    form.displayOrder >= 1 &&
    form.displayOrder <= 5;

  return (
    <Stack spacing={2.5} sx={{ pt: 1 }}>
      <TextField
        fullWidth
        label="YouTube link"
        placeholder="https://www.youtube.com/shorts/..."
        value={form.videoUrl}
        onChange={(event) => updateField("videoUrl", event.target.value)}
        error={Boolean(urlError)}
        helperText={
          urlError ||
          "Paste a YouTube Shorts or video link. The video must be Public or Unlisted, with embedding allowed."
        }
        disabled={loading}
        slotProps={{
          input: {
            startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
          },
        }}
      />

      {videoId ? (
        <Box
          sx={{
            width: 160,
            aspectRatio: "9 / 16",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#000",
          }}
        >
          <Box
            component="img"
            src={youtubeThumb(videoId)}
            alt="Video thumbnail"
            onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
              if (!event.currentTarget.dataset.fallback) {
                event.currentTarget.dataset.fallback = "1";
                event.currentTarget.src = youtubeThumb(videoId, "hqdefault");
              }
            }}
            sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            color: "text.secondary",
          }}
        >
          <VideoFileIcon />
          <Typography variant="body2">
            Paste a YouTube link to preview the thumbnail here.
          </Typography>
        </Box>
      )}

      <AdminSelect
        fullWidth
        label="Display order"
        value={form.displayOrder}
        onChange={(event) => updateField("displayOrder", Number(event.target.value))}
        disabled={loading}
        helperText={
          availableOrders.length > 0
            ? "Only available positions are shown. You can change the order later."
            : "All five positions are occupied."
        }
      >
        {availableOrders.map((order) => (
          <MenuItem key={order} value={order}>
            Position {order}
          </MenuItem>
        ))}
      </AdminSelect>

      <FormControlLabel
        control={
          <Switch
            checked={form.isActive}
            onChange={(event) => updateField("isActive", event.target.checked)}
            disabled={loading}
          />
        }
        label="Show this video on homepage"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 1 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
          {loading ? "Saving..." : video ? "Update video" : "Add video"}
        </Button>
      </Box>
    </Stack>
  );
}