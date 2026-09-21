import { useState } from "react";

import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import {
    useBrandStatement,
    useSaveBrandStatement,
} from "../hooks/useBrandStatement";

import BrandStatementForm from "../components/BrandStatementForm";

import type { BrandStatementFormData } from "../types/brandStatement";

export default function AdminBrandStatementPage() {
    const { data: statement, isLoading } =
        useBrandStatement();

    const saveMutation = useSaveBrandStatement();

    const [formOpen, setFormOpen] = useState(false);

    const handleSubmit = async (
        data: BrandStatementFormData
    ) => {
        try {
            await saveMutation.mutateAsync(data);
            setFormOpen(false);
        } catch (error) {
            console.error(
                "Failed to save brand statement:",
                error
            );
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title="Brand Statement"
                subtitle="Manage the brand statement section displayed above the footer."
            />

            <Box sx={{ mt: 3 }}>
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
                ) : (
                    <Card>
                        <CardContent>
                            {statement ? (
                                <>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 1,
                                        }}
                                    >
                                        {statement.title}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        {statement.description}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ mb: 2 }}
                                    >
                                        {statement.tagline}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Status:{" "}
                                        {statement.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </Typography>
                                </>
                            ) : (
                                <Typography color="text.secondary">
                                    No brand statement configured yet.
                                </Typography>
                            )}

                            <Box sx={{ mt: 3 }}>
                                <Box
                                    component="button"
                                    onClick={() =>
                                        setFormOpen(true)
                                    }
                                    sx={{
                                        border: 0,
                                        borderRadius: 1.5,
                                        px: 3,
                                        py: 1.25,
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {statement
                                        ? "Edit Brand Statement"
                                        : "Add Brand Statement"}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>

            <Dialog
                open={formOpen}
                onClose={() => {
                    if (!saveMutation.isPending) {
                        setFormOpen(false);
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    Brand Statement

                    <IconButton
                        onClick={() => setFormOpen(false)}
                        disabled={saveMutation.isPending}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <BrandStatementForm
                            statement={statement}
                            onSubmit={handleSubmit}
                            onCancel={() =>
                                setFormOpen(false)
                            }
                            loading={saveMutation.isPending}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}