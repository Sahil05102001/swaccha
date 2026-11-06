import {
  Box,
  Typography,
} from "@mui/material";

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
    <IconComponent
      sx={{
        width: "48%",
        height: "48%",
        color: accentColor,
      }}
    />
  );
}

export default function CategoryCircles({
  categories,
  accentColor = "#00F0FF",
  backgroundColor = "#F5F7FA",
}: CategoryCirclesProps) {
  const activeCategories = categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  console.log("[CategoryCircles] Diagnostics:", {
    totalCategories: categories.length,
    activeCategories: activeCategories.length,
    categories: categories.map((category) => ({
      id: category.id,
      label: category.label,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    })),
  });

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        backgroundColor,
        overflow: "hidden",
        py: {
          xs: 2.8,
          sm: 3.5,
          md: 3,
          lg: 3.5,
        },
      }}
    >
      <Box
        sx={{
          // Mobile: preserve the existing horizontal scrolling layout.
          // Desktop: display all 10 categories in one row.
          display: {
            xs: "flex",
            sm: "flex",
            md: "grid",
          },

          gridTemplateColumns: {
            md: "repeat(10, minmax(0, 1fr))",
          },

          alignItems: "start",

          overflowX: {
            xs: "auto",
            sm: "auto",
            md: "hidden",
          },

          overflowY: "hidden",

          px: {
            xs: 2,
            sm: 3,
            md: 2,
            lg: 3,
          },

          gap: {
            xs: 2.8,
            sm: 4,
            md: 1,
            lg: 1.5,
          },

          scrollbarWidth: "none",
          msOverflowStyle: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {activeCategories.map((category) => (
          <Box
            key={category.id}
            component="a"
            href={category.href}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",

              // Keep fixed widths on mobile; let the desktop grid
              // determine each category's width.
              flexShrink: {
                xs: 0,
                sm: 0,
                md: 1,
              },

              width: {
                xs: 82,
                sm: 105,
                md: "100%",
              },

              minWidth: 0,

              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",

              WebkitTapHighlightColor: "transparent",

              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            {/* Category Image */}
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
                height: "auto",

                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                overflow: "hidden",
                borderRadius: "50%",

                border: `2px solid ${accentColor}`,
                backgroundColor: "#FFFFFF",
                padding: "2px",

                boxShadow: "none",
                transform: "none",
                transition: "none",

                "&:hover": {
                  transform: "none",
                  boxShadow: "none",
                },
              }}
            >
              {category.imageUrl ? (
                <Box
                  component="img"
                  src={category.imageUrl}
                  alt={category.label}
                  loading="lazy"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    transform: "none",
                    transition: "none",
                  }}
                />
              ) : (
                <DefaultIcon
                  icon={category.icon}
                  accentColor={accentColor}
                />
              )}
            </Box>

            {/* Category Name */}
            <Typography
              component="span"
              sx={{
                width: "100%",
                mt: {
                  xs: 1,
                  sm: 1.25,
                  md: 1.2,
                },

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
        ))}
      </Box>
    </Box>
  );
}