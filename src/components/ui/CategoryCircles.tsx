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

const iconMap: Record<
  string,
  React.ElementType
> = {
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
  const IconComponent =
    iconMap[icon] ?? CategoryIcon;

  return (
    <IconComponent
      sx={{
        width: "55%",
        height: "55%",
        color: accentColor,
      }}
    />
  );
}

export default function CategoryCircles({
  categories,
  accentColor = "#2E7D32",
  backgroundColor = "#F3FAF1",
}: CategoryCirclesProps) {
  const activeCategories = categories
    .filter((category) => category.isActive)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    );

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: backgroundColor,
        py: {
          xs: 2.5,
          sm: 3,
          md: 3.5,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",

          gap: {
            xs: 2.5,
            sm: 3.5,
            md: 4.5,
          },

          px: {
            xs: 2,
            sm: 3,
            md: 5,
          },

          scrollbarWidth: "none",

          msOverflowStyle: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {activeCategories.map(
          (category) => {
            return (
              <Box
                key={category.id}
                component="a"
                href={category.href}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                  flexShrink: 0,

                  textDecoration:
                    "none",

                  width: {
                    xs: 76,
                    sm: 92,
                    md: 112,
                  },

                  cursor: "pointer",
                }}
              >
                <Box
                  className="category-circle"
                  sx={{
                    width: {
                      xs: 64,
                      sm: 80,
                      md: 100,
                    },

                    height: {
                      xs: 64,
                      sm: 80,
                      md: 100,
                    },

                    borderRadius: "50%",

                    border: `2.5px solid ${accentColor}`,

                    p: "3px",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                      "center",

                    overflow: "hidden",

                    bgcolor: "#fff",

                    transition:
                      "transform 0.2s ease",
                  }}
                >
                  {category.imageUrl ? (
                    <Box
                      component="img"
                      src={
                        category.imageUrl
                      }
                      alt={
                        category.label
                      }
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit:
                          "cover",
                        borderRadius:
                          "50%",
                        display:
                          "block",
                      }}
                    />
                  ) : (
                    <DefaultIcon
                      icon={
                        category.icon
                      }
                      accentColor={
                        accentColor
                      }
                    />
                  )}
                </Box>

                <Typography
                  sx={{
                    mt: {
                      xs: 1,
                      sm: 1.25,
                      md: 1.5,
                    },

                    fontWeight: 700,

                    fontSize: {
                      xs: "0.72rem",
                      sm: "0.8rem",
                      md: "0.9rem",
                    },

                    lineHeight: 1.25,

                    textAlign: "center",

                    color: "#1A1A1A",
                  }}
                >
                  {category.label}
                </Typography>
              </Box>
            );
          },
        )}
      </Box>
    </Box>
  );
}