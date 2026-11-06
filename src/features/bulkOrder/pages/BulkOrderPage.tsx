
import { useState, type FormEvent, type ChangeEvent } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PageContainer from "@/components/common/PageContainer";
import { submitB2BEnquiry } from "@/features/bulkOrder/services/b2bEnquiryService";

const steps = [
    {
        number: "01",
        title: "Tell us what you need",
        description: "Share your products, quantities, and contact details.",
    },
    {
        number: "02",
        title: "We review your enquiry",
        description: "Your requirements are recorded for follow-up.",
    },
    {
        number: "03",
        title: "Discuss your order",
        description: "Our team can follow up to discuss the next steps.",
    },
];

const initialForm = {
    name: "",
    businessName: "",
    phone: "",
    email: "",
    products: "",
    quantity: "",
    message: "",
};

export default function BulkOrderPage() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await submitB2BEnquiry({
                name: form.name.trim(),
                businessName: form.businessName.trim(),
                phone: form.phone.trim(),
                email: form.email.trim() || undefined,
                products: form.products.trim(),
                quantity: form.quantity.trim(),
                message: form.message.trim() || undefined,
            });

            setSuccessMessage(
                "Thank you for your enquiry! Our sales representative will get in touch with you shortly.",
            );
            setForm(initialForm);
        } catch (error: unknown) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to submit your enquiry. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer spacing={5}>
            {/* Hero */}
            <Box
                sx={{
                    p: { xs: 3, sm: 5 },
                    bgcolor: "#F7FAFB",
                    border: "1px solid #E2EAEC",
                }}
            >
                <Stack spacing={3} sx={{ maxWidth: 720 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: "#008C9E", fontWeight: 700 }}
                    >
                        SWACHHA BUSINESS SUPPLIES
                    </Typography>

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                sm: "2.8rem",
                                md: "3.4rem",
                            },
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: "#17252B",
                        }}
                    >
                        Bulk supplies.
                        <br />
                        Simpler business ordering.
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", md: "1.1rem" },
                            lineHeight: 1.8,
                            color: "#52656B",
                            maxWidth: 580,
                        }}
                    >
                        Looking for housekeeping and cleaning supplies for your
                        business? Tell us what you need and submit a bulk enquiry.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: 2,
                        }}
                    >
                        <Button
                            component="a"
                            href="#bulk-enquiry"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 3,
                                py: 1.3,
                                borderRadius: 1,
                                bgcolor: "#00AFC4",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "none",
                                "&:active": {
                                    bgcolor: "#00AFC4",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Request a Bulk Quote
                        </Button>

                        <Button
                            component={RouterLink}
                            to="/products"
                            variant="text"
                            sx={{
                                color: "#17252B",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:active": {
                                    bgcolor: "transparent",
                                },
                            }}
                        >
                            Browse products →
                        </Button>
                    </Box>
                </Stack>
            </Box>
            {/* How it works */}
            <Box>
                <Stack spacing={1} sx={{ mb: 3 }}>
                    <Typography
                        component="h2"
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#17252B" }}
                    >
                        How it works
                    </Typography>

                    <Typography sx={{ color: "#64747A", lineHeight: 1.7 }}>
                        Three simple steps to get your bulk enquiry started.
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    {steps.map((step) => (
                        <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                            <Box
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    bgcolor: "#F7FAFB",
                                    border: "1px solid #E8EFF0",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "1.4rem",
                                        fontWeight: 700,
                                        color: "#008C9E",
                                        mb: 2,
                                    }}
                                >
                                    {step.number}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: "#17252B",
                                    }}
                                >
                                    {step.title}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#64747A",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {step.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Enquiry and customer support */}
            <Box
                id="bulk-enquiry"
                sx={{
                    scrollMarginTop: 100,
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "0.8fr 1.2fr",
                    },
                    gap: { xs: 4, md: 5 },
                    alignItems: "start",
                    p: { xs: 2, sm: 4 },
                    border: "1px solid #E2EAEC",
                }}
            >
                {/* Customer support */}
                <Stack spacing={2}>
                    <Typography
                        variant="overline"
                        sx={{ color: "#008C9E", fontWeight: 700 }}
                    >
                        BULK ENQUIRY
                    </Typography>

                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: "1.9rem", md: "2.3rem" },
                            fontWeight: 700,
                            lineHeight: 1.25,
                            color: "#17252B",
                        }}
                    >
                        Tell us about your requirements.
                    </Typography>

                    <Typography
                        sx={{ color: "#64747A", lineHeight: 1.8 }}
                    >
                        Fill in the details and submit your enquiry. Fields
                        marked with an asterisk are required.
                    </Typography>

                    <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
                        <Box
                            component="img"
                            src="https://res.cloudinary.com/xxjcpz3y/image/upload/v1792986991/female-customer-support_j31khl.webp"
                            alt="Customer support representative"
                            loading="lazy"
                            sx={{
                                display: "block",
                                width: "100%",
                                maxHeight: 300,
                                objectFit: "contain",
                            }}
                        />

                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                                bgcolor: "#F7FAFB",
                                border: "1px solid #E2EAEC",
                            }}
                        >
                            <Typography
                                aria-hidden="true"
                                sx={{
                                    color: "#008C9E",
                                    fontSize: "1.7rem",
                                    lineHeight: 1.4,
                                }}
                            >
                                ⏱
                            </Typography>

                            <Box>
                                <Typography
                                    sx={{
                                        color: "#17252B",
                                        fontWeight: 700,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Get your enquiry resolution within{" "}
                                    <Box
                                        component="span"
                                        sx={{ color: "#008C9E" }}
                                    >
                                        12–48 hours.
                                    </Box>
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: "0.875rem",
                                        color: "#64747A",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Our sales representative will get in touch
                                    with you shortly.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Stack>

                {/* Enquiry form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Stack spacing={2}>
                        {successMessage && (
                            <Alert severity="success">
                                {successMessage}
                            </Alert>
                        )}

                        {errorMessage && (
                            <Alert severity="error">
                                {errorMessage}
                            </Alert>
                        )}

                        <TextField
                            label="Your name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoComplete="name"
                            slotProps={{
                                htmlInput: { maxLength: 100 },
                            }}
                        />

                        <TextField
                            label="Business name"
                            name="businessName"
                            value={form.businessName}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoComplete="organization"
                            slotProps={{
                                htmlInput: { maxLength: 150 },
                            }}
                        />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Phone number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    autoComplete="tel"
                                    slotProps={{
                                        htmlInput: { maxLength: 20 },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                    autoComplete="email"
                                    slotProps={{
                                        htmlInput: { maxLength: 254 },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Products required"
                            name="products"
                            value={form.products}
                            onChange={handleChange}
                            required
                            fullWidth
                            multiline
                            minRows={2}
                            placeholder="e.g. Floor cleaner, garbage bags, tissue paper"
                            slotProps={{
                                htmlInput: { maxLength: 2000 },
                            }}
                        />

                        <TextField
                            label="Required quantity"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                            fullWidth
                            placeholder="e.g. 100 units per month"
                            slotProps={{
                                htmlInput: { maxLength: 200 },
                            }}
                        />

                        <TextField
                            label="Additional message (optional)"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            minRows={3}
                            placeholder="Delivery location, preferred timeline, or other details"
                            slotProps={{
                                htmlInput: { maxLength: 2000 },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: 1,
                                bgcolor: "#00AFC4",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "none",
                                transition: "none",
                                "&:hover": {
                                    bgcolor: "#00AFC4",
                                    boxShadow: "none",
                                    transform: "none",
                                },
                                "&:active": {
                                    bgcolor: "#00AFC4",
                                    boxShadow: "none",
                                    transform: "none",
                                },
                            }}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                        sx={{ mr: 1 }}
                                    />
                                    Submitting enquiry...
                                </>
                            ) : (
                                "Submit Bulk Enquiry"
                            )}
                        </Button>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#64747A",
                                textAlign: "center",
                            }}
                        >
                            Your enquiry will be submitted securely to Swachha.
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </PageContainer>
    );
}
