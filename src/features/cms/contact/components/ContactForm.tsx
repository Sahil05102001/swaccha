import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { useContactSettings } from "../hooks/useContactSettings";
import BusinessHoursEditor from "./BusinessHoursEditor";
import SocialLinksEditor from "./SocialLinksEditor";
import type { ContactSettings } from "../types/contact";

export default function ContactForm() {
    const {
        contactSettings,
        isLoading,
        isSaving,
        saveContactSettings,
    } = useContactSettings();

    const [form, setForm] = useState<ContactSettings | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (contactSettings) {
            setForm(contactSettings);
        }
    }, [contactSettings]);

    if (isLoading || !form) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 6,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const handleChange =
        (field: keyof ContactSettings) =>
            (
                event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                >,
            ) => {
                setForm({
                    ...form,
                    [field]: event.target.value,
                });
            };

    function handleBusinessHoursChange(
        businessHours: ContactSettings["businessHours"],
    ) {
        setForm((previous) => {
            if (!previous) {
                return previous;
            }

            return {
                ...previous,
                businessHours,
            };
        });
    }

    function handleSocialLinksChange(
        socialLinks: ContactSettings["socialLinks"],
    ) {
        setForm((previous) => {
            if (!previous) {
                return previous;
            }

            return {
                ...previous,
                socialLinks,
            };
        });
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!form) {
            return;
        }

        await saveContactSettings(form);

        setSuccess(true);

        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    }

    return (
        <Paper sx={{ p: 4 }}>
            <Typography
                variant="h5"
                sx={{ mb: 3 }}
            >
                Contact Page Settings
            </Typography>

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                >
                    Contact settings saved successfully.
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <Grid
                    container
                    spacing={3}
                >
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Hero Title"
                            value={form.heroTitle}
                            onChange={handleChange("heroTitle")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Hero Subtitle"
                            value={form.heroSubtitle}
                            onChange={handleChange("heroSubtitle")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">
                            Business Information
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Business Name"
                            value={form.businessName}
                            onChange={handleChange("businessName")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={form.email}
                            onChange={handleChange("email")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={form.phone}
                            onChange={handleChange("phone")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="WhatsApp"
                            value={form.whatsapp}
                            onChange={handleChange("whatsapp")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Website"
                            value={form.website}
                            onChange={handleChange("website")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">
                            Address
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Address Line 1"
                            value={form.addressLine1}
                            onChange={handleChange("addressLine1")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Address Line 2"
                            value={form.addressLine2}
                            onChange={handleChange("addressLine2")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="City"
                            value={form.city}
                            onChange={handleChange("city")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="State"
                            value={form.state}
                            onChange={handleChange("state")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Postal Code"
                            value={form.postalCode}
                            onChange={handleChange("postalCode")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Country"
                            value={form.country}
                            onChange={handleChange("country")}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Google Maps Embed URL"
                            value={form.googleMapsEmbedUrl}
                            onChange={handleChange(
                                "googleMapsEmbedUrl",
                            )}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <BusinessHoursEditor
                            businessHours={form.businessHours}
                            onChange={handleBusinessHoursChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <SocialLinksEditor
                            socialLinks={form.socialLinks}
                            onChange={handleSocialLinksChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : "Save Contact Settings"}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}