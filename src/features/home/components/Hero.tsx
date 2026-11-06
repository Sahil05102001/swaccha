import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Box } from "@mui/material";

import { useHeroBanners } from "@/features/admin/hero/hooks/useHeroBanners";

export default function Hero() {
  const {
    data: banners = [],
    isLoading,
    isError,
  } = useHeroBanners();

  const activeBanners = useMemo(
    () =>
      banners
        .filter(
          (banner) =>
            banner.isActive &&
            banner.desktopImageUrl
        )
        .sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder
        ),
    [banners]
  );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const touchStartX = useRef<number | null>(
    null
  );

  const touchEndX = useRef<number | null>(
    null
  );

  useEffect(() => {
    if (
      activeIndex >= activeBanners.length &&
      activeBanners.length > 0
    ) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    activeBanners.length,
  ]);

  useEffect(() => {
    if (activeBanners.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) =>
        current ===
        activeBanners.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () =>
      window.clearInterval(interval);
  }, [activeBanners.length]);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? activeBanners.length - 1
        : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current ===
      activeBanners.length - 1
        ? 0
        : current + 1
    );
  };

  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    touchStartX.current =
      event.changedTouches[0]?.clientX ??
      null;

    touchEndX.current = null;
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    touchEndX.current =
      event.changedTouches[0]?.clientX ??
      null;

    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (Math.abs(distance) < 50) {
      return;
    }

    if (distance > 0) {
      goToNext();
    } else {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (isLoading) {
    return (
      <Box
        component="section"
        sx={{
          width: "100%",
          backgroundColor: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: {
            xs: 220,
            sm: 300,
            md: 420,
            lg: 500,
          },
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border:
              "3px solid rgba(255,255,255,0.2)",
            borderTopColor: "#00F0FF",
            animation:
              "swachhaHeroSpin 800ms linear infinite",
            "@keyframes swachhaHeroSpin": {
              from: {
                transform: "rotate(0deg)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
          }}
        />
      </Box>
    );
  }

  if (
    isError ||
    activeBanners.length === 0
  ) {
    return null;
  }

  const banner =
    activeBanners[activeIndex];

  const bannerLink =
    banner.bannerLink?.trim() ||
    "/products";

  const isExternalLink =
    /^https?:\/\//i.test(
      bannerLink
    );

  const handleBannerClick = () => {
    if (isExternalLink) {
      window.location.href =
        bannerLink;

      return;
    }

    window.location.href =
      bannerLink.startsWith("/")
        ? bannerLink
        : `/${bannerLink}`;
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        backgroundColor: "#000000",
        position: "relative",
        touchAction: "pan-y",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner */}
      <Box
        role="link"
        tabIndex={0}
        aria-label="Open promotional banner"
        onClick={handleBannerClick}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            handleBannerClick();
          }
        }}
        sx={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
          lineHeight: 0,
          outline: "none",

          "&:focus-visible": {
            boxShadow:
              "inset 0 0 0 3px #00F0FF",
          },
        }}
      >
        <Box
          component="picture"
          sx={{
            display: "block",
            width: "100%",
            lineHeight: 0,
          }}
        >
          {banner.mobileImageUrl && (
            <source
              media="(max-width: 767px)"
              srcSet={
                banner.mobileImageUrl
              }
            />
          )}

          <Box
            component="img"
            src={banner.desktopImageUrl}
            alt=""
            draggable={false}
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              minWidth: 0,
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </Box>
      </Box>

      {/* Dots */}
      {activeBanners.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            bottom: {
              xs: 10,
              sm: 14,
              md: 18,
            },
            left: "50%",
            transform:
              "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            px: 1,
            py: 0.7,
            borderRadius: 999,
            backgroundColor:
              "rgba(0,0,0,0.35)",
            backdropFilter:
              "blur(8px)",
          }}
        >
          {activeBanners.map(
            (currentBanner, index) => (
              <Box
                key={currentBanner.id}
                component="button"
                type="button"
                aria-label={`Go to hero banner ${
                  index + 1
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
                sx={{
                  width:
                    index === activeIndex
                      ? 22
                      : 7,
                  height: 7,
                  padding: 0,
                  border: 0,
                  borderRadius: 999,
                  cursor: "pointer",
                  backgroundColor:
                    index === activeIndex
                      ? "#00F0FF"
                      : "rgba(255,255,255,0.55)",
                  transition:
                    "width 180ms ease, background-color 180ms ease",
                }}
              />
            )
          )}
        </Box>
      )}
    </Box>
  );
}