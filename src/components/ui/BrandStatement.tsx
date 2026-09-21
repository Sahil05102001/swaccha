import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import { useBrandStatement } from "@/features/admin/brandStatement/hooks/useBrandStatement";

export default function BrandStatement() {
    const { data: statement, isLoading } =
        useBrandStatement();

    if (
        isLoading ||
        !statement ||
        !statement.isActive
    ) {
        return null;
    }

    return (
        <Box
            sx={{
                py: { xs: 6, md: 8 },
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        position: "relative",
                        minHeight: {
                            xs: 420,
                            md: 500,
                        },
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        overflow: "hidden",
                        backgroundImage: `url(${statement.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {/* Overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.08) 100%)",
                        }}
                    />

                    {/* Content */}
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            maxWidth: 720,
                            px: {
                                xs: 3,
                                sm: 5,
                                md: 7,
                            },
                            py: 6,
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: "white",
                                fontWeight: 700,
                                letterSpacing: 2,
                                display: "block",
                                mb: 1,
                            }}
                        >
                            {statement.brandName}
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                color: "white",
                                fontWeight: 900,
                                lineHeight: 1.05,
                                mb: 3,
                                fontSize: {
                                    xs: "2.2rem",
                                    sm: "3rem",
                                    md: "4rem",
                                },
                            }}
                        >
                            {statement.title}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "rgba(255,255,255,0.9)",
                                maxWidth: 600,
                                fontSize: {
                                    xs: "1rem",
                                    md: "1.15rem",
                                },
                                lineHeight: 1.7,
                                mb: 2,
                            }}
                        >
                            {statement.description}
                        </Typography>

                        {statement.tagline && (
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "white",
                                    fontWeight: 700,
                                }}
                            >
                                {statement.tagline}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}