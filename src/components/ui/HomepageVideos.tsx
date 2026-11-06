import { useEffect, useRef } from "react";

import {
  Box,
  Container,
  Typography,
} from "@mui/material";

import { useVideos } from "@/features/admin/videos/hooks/useVideos";

export default function HomepageVideos() {
  const {
    data: videos = [],
    isLoading,
  } = useVideos();

  const videoRefs = useRef<
    Record<string, HTMLVideoElement | null>
  >({});

  const activeVideos = videos
    .filter((video) => video.isActive && video.videoUrl)
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder,
    )
    .slice(0, 5);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video =
            entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            void video.play().catch(() => {
              // Browser may block autoplay.
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 },
    );

    Object.values(videoRefs.current).forEach(
      (video) => {
        if (video) observer.observe(video);
      },
    );

    return () => observer.disconnect();
  }, [activeVideos.length]);

  if (isLoading || activeVideos.length === 0) {
    return null;
  }

  const videoCount = activeVideos.length;

  // Center one or two videos; use the full row for three to five.
  const desktopLayout =
    videoCount <= 2
      ? {
          gridTemplateColumns: `repeat(${videoCount}, minmax(0, 280px))`,
          justifyContent: "center",
        }
      : {
          gridTemplateColumns: `repeat(${videoCount}, minmax(0, 1fr))`,
          justifyContent: "stretch",
        };

  const renderVideo = (
    video: (typeof activeVideos)[number],
  ) => (
    <Box
      key={video.id}
      sx={{
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        borderRadius: {
          xs: "18px",
          sm: "20px",
          md: "18px",
          lg: "20px",
        },
        backgroundColor: "#000000",
        aspectRatio: "9 / 16",
      }}
    >
      <Box
        component="video"
        ref={(element: HTMLVideoElement | null) => {
          videoRefs.current[video.id] = element;
        }}
        src={video.videoUrl}
        title="Swachha customer video"
        aria-label="Swachha customer video"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        controls={false}
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          objectFit: "cover",
          backgroundColor: "#000000",
        }}
      />
    </Box>
  );

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        py: {
          xs: 5,
          sm: 6,
          md: 7,
          lg: 8,
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: "100%",
          px: {
            xs: 2,
            sm: 3,
            md: 5,
            lg: 6,
          },
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "#111111",
            textAlign: "center",
            fontSize: {
              xs: "2rem",
              sm: "2.3rem",
              md: "2.65rem",
              lg: "2.9rem",
            },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.045em",
            mb: {
              xs: 3,
              sm: 3.5,
              md: 4,
            },
          }}
        >
          Why Our Customers Love Us
        </Typography>

        {/* Mobile carousel */}
        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            gap: {
              xs: 1.5,
              sm: 2,
            },
            pb: 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {activeVideos.map((video) => (
            <Box
              key={video.id}
              sx={{
                flex: {
                  xs: "0 0 72%",
                  sm: "0 0 280px",
                },
                width: {
                  xs: "72%",
                  sm: 280,
                },
                minWidth: 0,
              }}
            >
              {renderVideo(video)}
            </Box>
          ))}
        </Box>

        {/* Desktop: adapt to the number of active videos */}
        <Box
          sx={{
            display: {
              xs: "none",
              md: "grid",
            },
            width: "100%",
            gap: {
              md: 2,
              lg: 2.5,
            },
            ...desktopLayout,
          }}
        >
          {activeVideos.map((video) =>
            renderVideo(video),
          )}
        </Box>
      </Container>
    </Box>
  );
}