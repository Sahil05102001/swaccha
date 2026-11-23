import { useEffect, useRef, useState } from "react";


import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";


import { useVideos } from "@/features/admin/videos/hooks/useVideos";
import { getYouTubeId, youtubeThumb } from "@/features/admin/videos/utils/youtube";


/**
 * Muted, looping YouTube video with no controls.
 * The player only exists while the tile is on screen.
 */
function YouTubeTile({ id, sx }: { id: string; sx: SxProps<Theme> }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const element = ref.current;
    if (!element) return;


    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );


    observer.observe(element);
    return () => observer.disconnect();
  }, []);


  return (
    <Box ref={ref} sx={sx}>
      <Box
        component="img"
        src={youtubeThumb(id)}
        alt=""
        loading="lazy"
        decoding="async"
        onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
          if (!event.currentTarget.dataset.fallback) {
            event.currentTarget.dataset.fallback = "1";
            event.currentTarget.src = youtubeThumb(id, "hqdefault");
          }
        }}
        sx={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />


      {visible && (
        <Box
          component="iframe"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3`}
          title="Swachha customer video"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            // No taps or hover UI on the video; swipes reach the carousel.
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
}


export default function HomepageVideos() {
  const theme = useTheme();
  // Render one layout only, so each video is mounted once.
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });


  const { data: videos = [], isLoading } = useVideos();


  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});


  const activeVideos = videos
    .filter((video) => video.isActive && video.videoUrl)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 5);


  // Only for older Cloudinary videos: play while visible, pause when not.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;


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


    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });


    return () => observer.disconnect();
  }, [activeVideos.length, isDesktop]);


  if (isLoading || activeVideos.length === 0) {
    return null;
  }


  const frameSx = {
    position: "relative",
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    borderRadius: { xs: "18px", sm: "20px", md: "18px", lg: "20px" },
    backgroundColor: "#000000",
    aspectRatio: "9 / 16",
  } as const;


  const renderVideo = (video: (typeof activeVideos)[number]) => {
    const youtubeId = getYouTubeId(video.videoUrl);


    if (youtubeId) {
      return <YouTubeTile key={video.id} id={youtubeId} sx={frameSx} />;
    }


    // Older Cloudinary video.
    return (
      <Box key={video.id} sx={frameSx}>
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
          preload="none"
          poster={video.thumbnailUrl || undefined}
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
  };


  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        py: { xs: 5, sm: 6, md: 7, lg: 8 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: "100%",
          px: { xs: 2, sm: 3, md: 5, lg: 6 },
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "#111111",
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "2.3rem", md: "2.65rem", lg: "2.9rem" },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.045em",
            mb: { xs: 3, sm: 3.5, md: 4 },
          }}
        >
          Why Our Customers Love Us
        </Typography>


        <Box
          sx={{
            "--gap": { md: "16px", lg: "20px" },
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: "var(--gap)",
            width: "100%",
          }}
        >
          {activeVideos.map((video) => (
            <Box
              key={video.id}
              sx={{
                flex: "0 0 calc((100% - 4 * var(--gap)) / 5)",
                minWidth: 0,
              }}
            >
              {renderVideo(video)}
            </Box>
          ))}
        </Box>


        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "safe center",
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            gap: { xs: 1.5, sm: 2 },
            pb: 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { display: "none" },
            "& > :first-of-type": { ml: "auto" },
            "& > :last-of-type": { mr: "auto" },
          }}
        >
          {activeVideos.map((video) => (
            <Box
              key={video.id}
              sx={{
                flex: { xs: "0 0 72%", sm: "0 0 280px" },
                width: { xs: "72%", sm: 280 },
                minWidth: 0,
              }}
            >
              {renderVideo(video)}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}