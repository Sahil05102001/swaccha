import { useEffect, useRef } from "react";

import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@mui/material";

import { useVideos } from "@/features/admin/videos/hooks/useVideos";

function getYouTubeVideoId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        // youtube.com/shorts/VIDEO_ID
        if (parsedUrl.pathname.startsWith("/shorts/")) {
            return parsedUrl.pathname
                .split("/shorts/")[1]
                ?.split("/")[0] || null;
        }

        // youtube.com/watch?v=VIDEO_ID
        if (parsedUrl.pathname === "/watch") {
            return parsedUrl.searchParams.get("v");
        }

        // youtu.be/VIDEO_ID
        if (parsedUrl.hostname === "youtu.be") {
            return parsedUrl.pathname
                .replace("/", "")
                .split("/")[0] || null;
        }

        // youtube.com/embed/VIDEO_ID
        if (parsedUrl.pathname.startsWith("/embed/")) {
            return parsedUrl.pathname
                .split("/embed/")[1]
                ?.split("/")[0] || null;
        }

        return null;
    } catch {
        return null;
    }
}

export default function HomepageVideos() {
    const { data: videos = [], isLoading } = useVideos();

    const iframeRefs = useRef<
        Record<string, HTMLIFrameElement | null>
    >({});

    const activeVideos = videos
        .filter((video) => video.isActive)
        .sort(
            (a, b) =>
                a.displayOrder - b.displayOrder
        )
        .slice(0, 5);

    useEffect(() => {
        if (activeVideos.length === 0) {
            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const iframe =
                            entry.target as HTMLIFrameElement;

                        if (entry.isIntersecting) {
                            iframe.contentWindow?.postMessage(
                                JSON.stringify({
                                    event: "command",
                                    func: "playVideo",
                                    args: [],
                                }),
                                "https://www.youtube.com"
                            );
                        } else {
                            iframe.contentWindow?.postMessage(
                                JSON.stringify({
                                    event: "command",
                                    func: "pauseVideo",
                                    args: [],
                                }),
                                "https://www.youtube.com"
                            );
                        }
                    });
                },
                {
                    threshold: 0.5,
                }
            );

        Object.values(iframeRefs.current).forEach(
            (iframe) => {
                if (iframe) {
                    observer.observe(iframe);
                }
            }
        );

        return () => {
            observer.disconnect();
        };
    }, [activeVideos]);

    if (
        isLoading ||
        activeVideos.length === 0
    ) {
        return null;
    }

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="xl">
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        mb: 4,
                    }}
                >
                    Watch & Learn
                </Typography>

                <Grid container spacing={3}>
                    {activeVideos.map((video) => {
                        const videoId =
                            getYouTubeVideoId(
                                video.videoUrl
                            );

                        if (!videoId) {
                            return null;
                        }

                        const embedUrl =
                            `https://www.youtube.com/embed/${videoId}` +
                            `?enablejsapi=1` +
                            `&autoplay=1` +
                            `&mute=1` +
                            `&playsinline=1` +
                            `&controls=0` +
                            `&rel=0` +
                            `&loop=1` +
                            `&playlist=${videoId}` +
                            `&modestbranding=1` +
                            `&iv_load_policy=3`;

                        return (
                            <Grid
                                key={video.id}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                    lg: 2.4,
                                }}
                            >
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            aspectRatio: "9 / 16",
                                            bgcolor: "black",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Box
                                            component="iframe"
                                            ref={(
                                                element: HTMLIFrameElement | null
                                            ) => {
                                                iframeRefs.current[
                                                    video.id
                                                ] = element;
                                            }}
                                            src={embedUrl}
                                            title={video.title}
                                            allow="autoplay; encrypted-media; picture-in-picture"
                                            allowFullScreen
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                width: "100%",
                                                height: "100%",
                                                border: 0,
                                            }}
                                        />
                                    </Box>

                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                            }}
                                        >
                                            {video.title}
                                        </Typography>

                                        {video.description && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display:
                                                        "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient:
                                                        "vertical",
                                                    overflow:
                                                        "hidden",
                                                }}
                                            >
                                                {
                                                    video.description
                                                }
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}