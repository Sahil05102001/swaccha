
import {
    Box,
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

    // Support both new responsive banners and legacy records.
    const desktopImageUrl =
        statement.desktopImageUrl ||
        statement.imageUrl ||
        "";

    const mobileImageUrl =
        statement.mobileImageUrl ||
        desktopImageUrl;

    const hasImage = Boolean(
        desktopImageUrl.trim(),
    );

    return (
        <Box
            component="section"
            sx={{
                width: "100%",
                overflow: "hidden",
                backgroundColor: "#000000",
            }}
        >
            {hasImage ? (
                <Box
                    component="picture"
                    sx={{
                        display: "block",
                        width: "100%",
                        lineHeight: 0,
                    }}
                >
                    {mobileImageUrl && (
                        <source
                            media="(max-width: 767px)"
                            srcSet={mobileImageUrl}
                        />
                    )}

                    <Box
                        component="img"
                        src={desktopImageUrl}
                        alt={
                            statement.brandName ||
                            "Swachha brand statement"
                        }
                        loading="lazy"
                        draggable={false}
                        sx={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",
                            border: 0,
                            userSelect: "none",
                        }}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        minHeight: {
                            xs: 390,
                            sm: 450,
                            md: 540,
                            lg: 600,
                        },
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            maxWidth: {
                                xs: "100%",
                                md: 850,
                            },
                            px: {
                                xs: 2.5,
                                sm: 4,
                                md: 6,
                                lg: 8,
                            },
                            py: {
                                xs: 5,
                                sm: 6,
                                md: 8,
                            },
                        }}
                    >
                        {statement.brandName && (
                            <Typography
                                component="div"
                                sx={{
                                    display: "inline-block",
                                    mb: {
                                        xs: 1.2,
                                        sm: 1.5,
                                        md: 1.8,
                                    },
                                    color: "#00F0FF",
                                    fontSize: {
                                        xs: "0.65rem",
                                        sm: "0.72rem",
                                        md: "0.78rem",
                                    },
                                    fontWeight: 700,
                                    letterSpacing: "0.14em",
                                    lineHeight: 1.2,
                                    textTransform: "uppercase",
                                }}
                            >
                                {statement.brandName}
                            </Typography>
                        )}

                        <Typography
                            component="h2"
                            sx={{
                                maxWidth: {
                                    xs: "100%",
                                    sm: 680,
                                    md: 780,
                                },
                                color: "#FFFFFF",
                                fontSize: {
                                    xs: "2.35rem",
                                    sm: "3.3rem",
                                    md: "4.5rem",
                                    lg: "5.2rem",
                                },
                                fontWeight: 700,
                                lineHeight: {
                                    xs: 0.98,
                                    sm: 0.96,
                                    md: 0.94,
                                },
                                letterSpacing: "-0.055em",
                                overflowWrap: "break-word",
                                mb: {
                                    xs: 1.8,
                                    sm: 2.2,
                                    md: 2.8,
                                },
                            }}
                        >
                            {statement.title}
                        </Typography>

                        {statement.description && (
                            <Typography
                                sx={{
                                    maxWidth: {
                                        xs: "100%",
                                        sm: 560,
                                        md: 640,
                                    },
                                    color: "rgba(255,255,255,0.82)",
                                    fontSize: {
                                        xs: "0.86rem",
                                        sm: "0.96rem",
                                        md: "1.05rem",
                                    },
                                    lineHeight: 1.6,
                                    mb: statement.tagline
                                        ? {
                                            xs: 1.8,
                                            sm: 2.2,
                                            md: 2.5,
                                        }
                                        : 0,
                                }}
                            >
                                {statement.description}
                            </Typography>
                        )}

                        {statement.tagline && (
                            <Typography
                                component="p"
                                sx={{
                                    maxWidth: {
                                        xs: "100%",
                                        sm: 600,
                                        md: 700,
                                    },
                                    color: "#FFFFFF",
                                    fontSize: {
                                        xs: "0.98rem",
                                        sm: "1.12rem",
                                        md: "1.28rem",
                                    },
                                    fontWeight: 600,
                                    lineHeight: 1.35,
                                    letterSpacing: "-0.015em",
                                    m: 0,
                                }}
                            >
                                {statement.tagline}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
