import { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    FormControlLabel,
} from "@mui/material";

import type {
    VideoCard,
    VideoCardFormData,
} from "../types/video";

interface VideoFormProps {
    video?: VideoCard | null;
    onSubmit: (data: VideoCardFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

const defaultForm: VideoCardFormData = {
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    type: "other",
    href: "",
    isActive: true,
    displayOrder: 1,
};

export default function VideoForm({
    video,
    onSubmit,
    onCancel,
    loading = false,
}: VideoFormProps) {
    const [form, setForm] =
        useState<VideoCardFormData>(defaultForm);

    useEffect(() => {
        if (video) {
            setForm({
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl,
                type: video.type,
                href: video.href,
                isActive: video.isActive,
                displayOrder: video.displayOrder,
            });
        } else {
            setForm(defaultForm);
        }
    }, [video]);

    const updateField = <
        K extends keyof VideoCardFormData
    >(
        field: K,
        value: VideoCardFormData[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <Stack spacing={2.5}>
            <TextField
                fullWidth
                label="Video Title"
                value={form.title}
                onChange={(e) =>
                    updateField("title", e.target.value)
                }
            />

            <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={(e) =>
                    updateField(
                        "description",
                        e.target.value
                    )
                }
            />

            <TextField
                fullWidth
                label="Video URL"
                value={form.videoUrl}
                onChange={(e) =>
                    updateField(
                        "videoUrl",
                        e.target.value
                    )
                }
                placeholder="https://..."
            />

            <TextField
                fullWidth
                label="Thumbnail URL"
                value={form.thumbnailUrl}
                onChange={(e) =>
                    updateField(
                        "thumbnailUrl",
                        e.target.value
                    )
                }
                placeholder="https://..."
            />

            <FormControl fullWidth>
                <InputLabel>Video Type</InputLabel>

                <Select
                    value={form.type}
                    label="Video Type"
                    onChange={(e) =>
                        updateField(
                            "type",
                            e.target.value as VideoCardFormData["type"]
                        )
                    }
                >
                    <MenuItem value="product-launch">
                        Product Launch
                    </MenuItem>

                    <MenuItem value="tutorial">
                        Product Tutorial
                    </MenuItem>

                    <MenuItem value="customer-review">
                        Customer Review
                    </MenuItem>

                    <MenuItem value="other">
                        Other
                    </MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Button / Link"
                value={form.href}
                onChange={(e) =>
                    updateField("href", e.target.value)
                }
                placeholder="/products"
                helperText="Optional"
            />

            <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={form.displayOrder}
                onChange={(e) =>
                    updateField(
                        "displayOrder",
                        Number(e.target.value)
                    )
                }
                slotProps={{
                    htmlInput: {
                        min: 1,
                    },
                }}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={form.isActive}
                        onChange={(e) =>
                            updateField(
                                "isActive",
                                e.target.checked
                            )
                        }
                    />
                }
                label="Show this video on homepage"
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={{ textTransform: "none" }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                    }}
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