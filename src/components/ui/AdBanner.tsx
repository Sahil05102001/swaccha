import { Box } from "@mui/material";

import { useAdBanner } from "@/features/admin/adBanner/hooks/useAdBanner";

export default function AdBanner() {
  const {
    data: banner,
    isLoading,
  } = useAdBanner();

  if (isLoading) {
    return null;
  }

  if (
    !banner ||
    !banner.isActive
  ) {
    return null;
  }

  const desktopImageUrl =
    banner.desktopImageUrl ||
    banner.imageUrl ||
    "";

  const mobileImageUrl =
    banner.mobileImageUrl ||
    desktopImageUrl;

  if (!desktopImageUrl) {
    return null;
  }

  const bannerContent = (
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
          banner.altText ||
          "Swachha promotional banner"
        }
        loading="lazy"
        draggable={false}
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          maxWidth: "100%",
          border: 0,
          borderRadius: 0,
          objectFit: "contain",
          userSelect: "none",
        }}
      />
    </Box>
  );

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        backgroundColor: "#F1F9ED",
        lineHeight: 0,
      }}
    >
      {banner.href ? (
        <Box
          component="a"
          href={banner.href}
          sx={{
            display: "block",
            width: "100%",
            textDecoration: "none",
            lineHeight: 0,
            WebkitTapHighlightColor:
              "transparent",
          }}
        >
          {bannerContent}
        </Box>
      ) : (
        bannerContent
      )}
    </Box>
  );
}