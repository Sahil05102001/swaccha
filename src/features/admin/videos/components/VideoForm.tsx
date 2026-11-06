import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import LinkIcon from "@mui/icons-material/Link";
import VideoFileIcon from "@mui/icons-material/VideoFile";

import type {
  VideoCard,
  VideoCardFormData,
} from "../types/video";

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
  const [form, setForm] =
    useState<VideoCardFormData>(defaultForm);

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
      Array.from({ length: 5 }, (_, index) => index + 1)
        .filter(
          (order) =>
            video
              ? true
              : !usedOrders.has(order),
        ),
    [video, usedOrders],
  );

  useEffect(() => {
    if (video) {
      setForm({
        videoUrl: video.videoUrl,
        publicId: video.publicId ?? "",
        thumbnailUrl: video.thumbnailUrl ?? "",
        isActive: video.isActive,
        displayOrder: video.displayOrder,
      });
    } else {
      const firstAvailableOrder = Array.from(
        { length: 5 },
        (_, index) => index + 1,
      ).find((order) => !usedOrders.has(order));

      setForm({
        ...defaultForm,
        displayOrder: firstAvailableOrder ?? 1,
      });
    }

    setUrlError("");
  }, [video, usedOrders]);

  const updateField = <
    K extends keyof VideoCardFormData,
  >(
    field: K,
    value: VideoCardFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "videoUrl") {
      setUrlError("");
    }
  };

  const handleSubmit = () => {
    const videoUrl = form.videoUrl.trim();

    if (!videoUrl) {
      setUrlError("Please enter a video URL.");
      return;
    }

    try {
      const parsedUrl = new URL(videoUrl);

      if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
      ) {
        setUrlError(
          "Please enter a valid HTTP or HTTPS video URL.",
        );
        return;
      }
    } catch {
      setUrlError("Please enter a valid video URL.");
      return;
    }

    onSubmit({
      videoUrl,
      publicId: "",
      thumbnailUrl: form.thumbnailUrl.trim(),
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
        label="Cloudinary Video URL"
        placeholder="https://res.cloudinary.com/..."
        value={form.videoUrl}
        onChange={(event) =>
          updateField("videoUrl", event.target.value)
        }
        error={Boolean(urlError)}
        helperText={
          urlError ||
          "Paste the secure URL of the video uploaded to your Cloudinary folder."
        }
        disabled={loading}
        slotProps={{
          input: {
            startAdornment: (
              <LinkIcon
                sx={{ mr: 1, color: "text.secondary" }}
              />
            ),
          },
        }}
      />

      <TextField
        fullWidth
        label="Thumbnail URL (optional)"
        placeholder="https://res.cloudinary.com/..."
        value={form.thumbnailUrl}
        onChange={(event) =>
          updateField("thumbnailUrl", event.target.value)
        }
        helperText="Optional image URL for the video thumbnail, if used by your homepage component."
        disabled={loading}
      />

      {form.videoUrl.trim() ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          <Box
            component="video"
            src={form.videoUrl}
            controls
            muted
            playsInline
            preload="metadata"
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: 420,
            }}
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
            Paste a video URL to preview it here.
          </Typography>
        </Box>
      )}

      <FormControl fullWidth disabled={loading}>
        <InputLabel id="video-display-order-label">
          Display Order
        </InputLabel>

        <Select
          labelId="video-display-order-label"
          label="Display Order"
          value={form.displayOrder}
          onChange={(event) =>
            updateField(
              "displayOrder",
              Number(event.target.value),
            )
          }
        >
          {availableOrders.map((order) => (
            <MenuItem key={order} value={order}>
              Position {order}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText>
          {availableOrders.length > 0
            ? "Only available positions are shown. You can change the order later."
            : "All five positions are occupied."}
        </FormHelperText>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={form.isActive}
            onChange={(event) =>
              updateField("isActive", event.target.checked)
            }
            disabled={loading}
          />
        }
        label="Show this video on homepage"
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          pt: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading
            ? "Saving..."
            : video
              ? "Update Video"
              : "Add Video"}
        </Button>
      </Box>
    </Stack>
  );
}