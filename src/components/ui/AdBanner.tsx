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

  if (!banner) {
    return null;
  }

  if (!banner.isActive) {
    return null;
  }

  if (!banner.imageUrl) {
    return null;
  }

  const bannerContent = (
    <Box
      component="img"
      src={banner.imageUrl}
      alt={banner.altText || "Advertisement"}
      sx={{
        display: "block",
        width: "100%",
        height: "auto",
      }}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#fff",
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
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