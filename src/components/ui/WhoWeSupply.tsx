
import {
    Box,
    Container,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { useStoreSettings } from "@/features/admin/hooks/useStoreSettings";

const supplyTypes = [
    {
        title: "Hotels & Resorts",
        subtitle: "Housekeeping essentials for guest spaces",
        description:
            "Cleaning supplies for hospitality and accommodation facilities.",
        imageUrl: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1792984386/hotels_arvaiq.webp",
        Icon: HotelRoundedIcon,
    },
    {
        title: "Offices & Institutions",
        subtitle: "For productive, hygienic spaces",
        description:
            "Housekeeping essentials for offices, schools and colleges.",
        imageUrl: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1792984381/offices_wnfcp9.webp",
        Icon: BusinessRoundedIcon,
    },
    {
        title: "Hospitals & Clinics",
        subtitle: "Facility cleaning essentials",
        description:
            "Cleaning supplies for healthcare facilities and common areas.",
        imageUrl: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1792984389/hospitals_swuvei.webp",
        Icon: LocalHospitalRoundedIcon,
    },
    {
        title: "Restaurants & Cafés",
        subtitle: "For kitchens and dining spaces",
        description:
            "Everyday cleaning essentials for food-service environments.",
        imageUrl: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1792984380/restaurants_r5fasl.webp",
        Icon: RestaurantRoundedIcon,
    },
    {
        title: "Individual Customers",
        subtitle: "A cleaner home, every day",
        description:
            "Practical housekeeping products for everyday household needs.",
        imageUrl: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1792984384/individuals_sz6ybu.webp",
        Icon: HomeRoundedIcon,
    },
];

export default function WhoWeSupply() {
    const theme = useTheme();

    const { data: settings, isLoading: settingsLoading } =
        useStoreSettings();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const prefersReducedMotion = useMediaQuery(
        "(prefers-reduced-motion: reduce)",
    );

    const visibleCount = isMobile ? 1 : isTablet ? 2 : 4;

    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const maxIndex = Math.max(
        0,
        supplyTypes.length - visibleCount,
    );

    const goTo = useCallback(
        (index: number) => {
            const nextIndex = Math.min(
                maxIndex,
                Math.max(0, index),
            );

            setActiveIndex(nextIndex);

            const track = trackRef.current;
            if (!track) return;

            const card = track.children.item(
                nextIndex,
            ) as HTMLElement | null;

            if (!card) return;

            track.scrollTo({
                left: card.offsetLeft - track.offsetLeft,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        },
        [maxIndex, prefersReducedMotion],
    );

    useEffect(() => {
        setActiveIndex(0);

        trackRef.current?.scrollTo({
            left: 0,
            behavior: "auto",
        });
    }, [visibleCount]);

    useEffect(() => {
        if (paused || prefersReducedMotion || maxIndex === 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => {
                const next = current >= maxIndex ? 0 : current + 1;

                const track = trackRef.current;
                const card = track?.children.item(
                    next,
                ) as HTMLElement | null;

                if (track && card) {
                    track.scrollTo({
                        left: card.offsetLeft - track.offsetLeft,
                        behavior: prefersReducedMotion ? "auto" : "smooth",
                    });
                }

                return next;
            });
        }, 3000);

        return () => window.clearInterval(timer);
    }, [paused, prefersReducedMotion, maxIndex]);

    const handleScroll = () => {
        const track = trackRef.current;
        if (!track) return;

        const firstCard = track.children.item(0) as HTMLElement | null;
        if (!firstCard) return;

        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = Number.parseFloat(
            window.getComputedStyle(track).columnGap || "0",
        );

        if (cardWidth + gap <= 0) return;

        const index = Math.round(
            track.scrollLeft / (cardWidth + gap),
        );

        setActiveIndex(Math.min(maxIndex, Math.max(0, index)));
    };

    // Wait for settings to load so the section doesn't flash
    // before an inactive setting is read from Firestore.
    if (settingsLoading) {
        return null;
    }

    // Default to visible for existing stores without this field.
    if (settings?.whoWeSupplyActive === false) {
        return null;
    }

    return (
        <Box
            component="section"
            aria-labelledby="who-we-supply-heading"
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
                        md: 4,
                        lg: 5,
                    },
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        maxWidth: 760,
                        mx: "auto",
                        mb: {
                            xs: 3,
                            sm: 4,
                            md: 4.5,
                        },
                    }}
                >
                    <Typography
                        component="p"
                        sx={{
                            color: "#008C99",
                            fontSize: "0.90rem",
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            mb: 1.5,
                        }}
                    >
                        For Every Space
                    </Typography>

                    <Typography
                        id="who-we-supply-heading"
                        component="h2"
                        sx={{
                            color: "#111111",
                            fontSize: {
                                xs: "2rem",
                                sm: "2.3rem",
                                md: "2.65rem",
                                lg: "2.9rem",
                            },
                            fontWeight: 700,
                            lineHeight: 1.08,
                            letterSpacing: "-0.045em",
                            mb: 1.5,
                        }}
                    >
                        Who We Supply
                    </Typography>

                    <Typography
                        sx={{
                            color: "#626B72",
                            fontSize: {
                                xs: "0.88rem",
                                sm: "0.95rem",
                                md: "1rem",
                            },
                            lineHeight: 1.7,
                            maxWidth: 620,
                            mx: "auto",
                        }}
                    >
                        From professional facilities to individual homes,
                        discover housekeeping essentials for every kind of space.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mb: 1.5,
                    }}
                >
                    <IconButton
                        aria-label="Previous customer category"
                        onClick={() =>
                            goTo(activeIndex <= 0 ? maxIndex : activeIndex - 1)
                        }
                        disableRipple
                        disableTouchRipple
                        sx={{
                            width: 40,
                            height: 40,
                            color: "#111111",
                            border: "1px solid #D8E2E5",
                            backgroundColor: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#D8E2E5",
                            },
                            "&:active": {
                                backgroundColor: "#FFFFFF",
                                transform: "none",
                            },
                        }}
                    >
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 17 }} />
                    </IconButton>

                    <IconButton
                        aria-label="Next customer category"
                        onClick={() =>
                            goTo(activeIndex >= maxIndex ? 0 : activeIndex + 1)
                        }
                        disableRipple
                        disableTouchRipple
                        sx={{
                            width: 40,
                            height: 40,
                            color: "#111111",
                            border: "1px solid #D8E2E5",
                            backgroundColor: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#D8E2E5",
                            },
                            "&:active": {
                                backgroundColor: "#FFFFFF",
                                transform: "none",
                            },
                        }}
                    >
                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                </Box>

                <Box
                    ref={trackRef}
                    onScroll={handleScroll}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocusCapture={() => setPaused(true)}
                    onBlurCapture={(event) => {
                        if (
                            !event.currentTarget.contains(
                                event.relatedTarget as Node | null,
                            )
                        ) {
                            setPaused(false);
                        }
                    }}
                    onTouchStart={() => setPaused(true)}
                    onTouchEnd={() => setPaused(false)}
                    sx={{
                        display: "flex",
                        gap: {
                            xs: 1.5,
                            sm: 2,
                            md: 2.5,
                        },
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollSnapType: "x mandatory",
                        scrollBehavior: prefersReducedMotion ? "auto" : "smooth",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    {supplyTypes.map(
                        ({ title, subtitle, description, imageUrl, Icon }) => (
                            <Box
                                key={title}
                                sx={{
                                    flex: `0 0 calc((100% - ${(visibleCount - 1) *
                                        (isMobile ? 12 : isTablet ? 16 : 20)
                                        }px) / ${visibleCount})`,
                                    minWidth: 0,
                                    scrollSnapAlign: "start",
                                    display: "flex",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                        minHeight: {
                                            xs: 340,
                                            sm: 360,
                                            md: 380,
                                        },
                                        overflow: "hidden",
                                        border: "1px solid #E1E8EB",
                                        borderRadius: "16px",
                                        backgroundColor: "#FFFFFF",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            aspectRatio: "3 / 2",
                                            flexShrink: 0,
                                            overflow: "hidden",
                                            backgroundColor: "#E8FBFC",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={
                                                imageUrl.startsWith("https://")
                                                    ? imageUrl
                                                    : undefined
                                            }
                                            alt={title}
                                            loading="lazy"
                                            sx={{
                                                display: "block",
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                objectPosition: "center",
                                            }}
                                            onError={(event) => {
                                                event.currentTarget.style.visibility = "hidden";
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                background:
                                                    "linear-gradient(180deg, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.42) 100%)",
                                                pointerEvents: "none",
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                position: "absolute",
                                                left: 14,
                                                bottom: 14,
                                                width: 42,
                                                height: 42,
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "12px",
                                                color: "#007F89",
                                                backgroundColor: "#FFFFFF",
                                                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 24 }} />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            flex: 1,
                                            p: {
                                                xs: 2,
                                                sm: 2.5,
                                                md: 3,
                                            },
                                        }}
                                    >
                                        <Typography
                                            component="h3"
                                            sx={{
                                                color: "#111111",
                                                fontSize: {
                                                    xs: "1.08rem",
                                                    sm: "1.12rem",
                                                    md: "1.18rem",
                                                },
                                                fontWeight: 700,
                                                lineHeight: 1.3,
                                                letterSpacing: "-0.025em",
                                                mb: 1,
                                            }}
                                        >
                                            {title}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#007F89",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                lineHeight: 1.5,
                                                mb: 1.2,
                                            }}
                                        >
                                            {subtitle}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#667078",
                                                fontSize: "0.82rem",
                                                lineHeight: 1.65,
                                            }}
                                        >
                                            {description}
                                        </Typography>

                                        <Box sx={{ mt: "auto", pt: 2.5 }}>
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 3,
                                                    borderRadius: 999,
                                                    backgroundColor: "#00C8D4",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ),
                    )}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.8,
                        mt: 3,
                    }}
                >
                    {Array.from({ length: maxIndex + 1 }, (_, index) => (
                        <Box
                            key={index}
                            component="button"
                            type="button"
                            aria-label={`Go to carousel position ${index + 1}`}
                            aria-current={activeIndex === index ? "true" : undefined}
                            onClick={() => goTo(index)}
                            sx={{
                                width: activeIndex === index ? 24 : 7,
                                height: 7,
                                p: 0,
                                border: 0,
                                borderRadius: 999,
                                cursor: "pointer",
                                backgroundColor:
                                    activeIndex === index ? "#00BFCB" : "#D5E0E3",
                                transition: "width 200ms ease, background-color 200ms ease",
                            }}
                        />
                    ))}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        gap: 2,
                        mt: {
                            xs: 4,
                            md: 5,
                        },
                        p: {
                            xs: 2.5,
                            sm: 3,
                            md: 3.5,
                        },
                        borderRadius: "16px",
                        backgroundColor: "#071B1D",
                        color: "#FFFFFF",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "1.05rem",
                                    sm: "1.2rem",
                                },
                                fontWeight: 700,
                                mb: 0.7,
                            }}
                        >
                            Need housekeeping supplies?
                        </Typography>

                        <Typography
                            sx={{
                                color: "#B8D0D2",
                                fontSize: "0.85rem",
                                lineHeight: 1.6,
                            }}
                        >
                            Contact Swachha for product and bulk-order enquiries.
                        </Typography>
                    </Box>

                    <Box
                        component="a"
                        href="https://wa.me/918766911307?text=Hello%20Swachha%2C%20I%20would%20like%20to%20enquire%20about%20housekeeping%20products."
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            flexShrink: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 44,
                            px: 2.5,
                            borderRadius: 999,
                            border: "1px solid #00D5E2",
                            color: "#071B1D",
                            backgroundColor: "#00D5E2",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "background-color 180ms ease",
                        }}
                    >
                        Enquire on WhatsApp
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
