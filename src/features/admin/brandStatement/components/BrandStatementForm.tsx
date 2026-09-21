import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Stack,
    Switch,
    TextField,
    FormControlLabel,
} from "@mui/material";

import type {
    BrandStatement,
    BrandStatementFormData,
} from "../types/brandStatement";

interface BrandStatementFormProps {
    statement?: BrandStatement | null;
    onSubmit: (data: BrandStatementFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

const defaultForm: BrandStatementFormData = {
    brandName: "SWACHHA",
    title: "CLEAN TODAY, GREENER TOMORROW.",
    description:
        "At Swachha, we believe a clean space leads to a healthy life and a better planet.",
    tagline: "Better for you. Better for the earth.",
    imageUrl: "",
    isActive: true,
};

export default function BrandStatementForm({
    statement,
    onSubmit,
    onCancel,
    loading = false,
}: BrandStatementFormProps) {
    const [form, setForm] =
        useState<BrandStatementFormData>(defaultForm);

    useEffect(() => {
        if (statement) {
            setForm({
                brandName: statement.brandName,
                title: statement.title,
                description: statement.description,
                tagline: statement.tagline,
                imageUrl: statement.imageUrl,
                isActive: statement.isActive,
            });
        } else {
            setForm(defaultForm);
        }
    }, [statement]);

    const updateField = <
        K extends keyof BrandStatementFormData
    >(
        field: K,
        value: BrandStatementFormData[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    return (
        <Stack spacing={2.5}>
            <TextField
                fullWidth
                label="Brand Name"
                value={form.brandName}
                onChange={(e) =>
                    updateField("brandName", e.target.value)
                }
            />

            <TextField
                fullWidth
                label="Main Quote / Title"
                value={form.title}
                onChange={(e) =>
                    updateField("title", e.target.value)
                }
                helperText="Main statement displayed on the homepage"
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
                label="Tagline"
                value={form.tagline}
                onChange={(e) =>
                    updateField("tagline", e.target.value)
                }
            />

            <TextField
                fullWidth
                label="Background Image URL"
                value={form.imageUrl}
                onChange={(e) =>
                    updateField("imageUrl", e.target.value)
                }
                placeholder="https://..."
                helperText="Use the Swachha brand image generated for this section"
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
                label="Show this section on homepage"
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
                    onClick={() => onSubmit(form)}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    {loading
                        ? "Saving..."
                        : "Save Changes"}
                </Button>
            </Box>
        </Stack>
    );
}