import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import CategoryIcon from "@mui/icons-material/Category";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BusinessIcon from "@mui/icons-material/Business";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SpaIcon from "@mui/icons-material/Spa";

import type { CategoryCircle } from "@/features/admin/categoryCircles/types/categoryCircle";

interface CategoryCirclesProps {
  categories: CategoryCircle[];
  accentColor?: string;
  backgroundColor?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Category: CategoryIcon,
  CleaningServices: CleaningServicesIcon,
  LocalLaundryService: LocalLaundryServiceIcon,
  ShoppingBag: ShoppingBagIcon,
  LocalOffer: LocalOfferIcon,
  Business: BusinessIcon,
  Kitchen: KitchenIcon,
  LocalFlorist: LocalFloristIcon,
  Inventory2: Inventory2Icon,
  Spa: SpaIcon,
};

function DefaultIcon({
  icon,
  accentColor,
}: {
  icon: string;
  accentColor: string;
}) {
  const IconComponent = iconMap[icon] ?? CategoryIcon;

  return (
    <IconComponent sx={{ width: "48%", height: "48%", color: accentColor }} />
  );
}

export default function CategoryCircles({
  categories,
  accentColor = "#00F0FF",
  backgroundColor = "#F5F7FA",
}: CategoryCirclesProps) {
  const activeCategories = categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 10);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      aria-label="Shop by category"
      sx={{
        width: "100%",
        backgroundColor,
        overflow: "hidden",
        py: { xs: 2.8, sm: 3.5, md: 3, lg: 3.5 },
      }}
    >
      <Box
        sx={{
          "--gap": { xs: "22px", sm: "32px", md: "8px", lg: "12px" },

          display: "flex",
          justifyContent: { md: "center" },
          alignItems: "flex-start",
          gap: "var(--gap)",

          // Phones / tablets: scroll sideways when the row is too wide.
          overflowX: { xs: "auto", md: "hidden" },
          overflowY: "hidden",

          px: { xs: 2, sm: 3, md: 2, lg: 3 },

          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },

          // Centres the row when it fits, scrolls normally when it doesn't.
          "& > :first-of-type": { ml: { xs: "auto", md: 0 } },
          "& > :last-of-type": { mr: { xs: "auto", md: 0 } },
        }}
      >
        {activeCategories.map((category) => {
          const isInternal = category.href?.startsWith("/");

          return (
            <Box
              key={category.id}
              {...(isInternal
                ? { component: Link, to: category.href }
                : { component: "a", href: category.href })}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                // Every item keeps the width it would have in a full row of 10.
                flex: {
                  xs: "0 0 82px",
                  sm: "0 0 105px",
                  md: "0 0 calc((100% - 9 * var(--gap)) / 10)",
                },
                width: { xs: 82, sm: 105 },
                minWidth: 0,

                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                "&:hover": { textDecoration: "none" },
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 72,
                    sm: 88,
                    md: "min(7.2vw, 92px)",
                    lg: "min(7.2vw, 104px)",
                  },
                  maxWidth: "100%",
                  aspectRatio: "1 / 1",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "50%",
                  border: `2px solid ${accentColor}`,
                  backgroundColor: "#FFFFFF",
                  padding: "2px",
                }}
              >
                {category.imageUrl ? (
                  <Box
                    component="img"
                    src={category.imageUrl}
                    alt={category.label}
                    loading="lazy"
                    decoding="async"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <DefaultIcon
                    icon={category.icon}
                    accentColor={accentColor}
                  />
                )}
              </Box>

              <Typography
                component="span"
                sx={{
                  width: "100%",
                  mt: { xs: 1, sm: 1.25, md: 1.2 },
                  color: "#111111",
                  fontSize: {
                    xs: "0.76rem",
                    sm: "0.92rem",
                    md: "0.78rem",
                    lg: "0.88rem",
                  },
                  fontWeight: 600,
                  lineHeight: 1.15,
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                  overflowWrap: "anywhere",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {category.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}