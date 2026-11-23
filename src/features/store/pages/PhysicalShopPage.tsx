// D:\Projects\swaccha\src\features\store\pages\PhysicalShopPage.tsx

import type { ReactNode } from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsIcon from "@mui/icons-material/Directions";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const accent = "#00BFD6";
const accentDark = "#087F8C";
const ink = "#17252B";
const muted = "#64747A";
const border = "#E5ECEE";
const softBackground = "#F7FAFA";

// ---- Store details (edit here) ----
const BRAND_NAME = "Swachha";
const STORE_NAME = "Swachh Sansar";

// Put your 2 shop photos in the /public/images folder and set the paths here,
// e.g. "/images/store-front.jpg". Leave src empty to show a placeholder.
const SHOP_IMAGES = [
    {
        src: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1793291295/store_front_z7ikzy.webp",
        alt: "Swachh Sansar store front",
    },
    {
        src: "https://res.cloudinary.com/xxjcpz3y/image/upload/v1793291296/store_inside_b9duyq.webp",
        alt: "Inside Swachh Sansar store",
    },
];

const ADDRESS_LINES = [
    "Shop No. 5, Yashwant Tower,",
    "Ayachit Rd, near Durga Mandir,",
    "Mahal, Nagpur,",
    "Maharashtra 440032",
];

const OPEN_HOUR = 9; // 9 AM
const CLOSE_HOUR = 21; // 9 PM
const HOURS_LABEL = "9:00 AM – 9:00 PM";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const LATITUDE = 21.1462605;
const LONGITUDE = 79.1125179;

const MAP_EMBED_URL = `https://www.google.com/maps?q=${LATITUDE},${LONGITUDE}&z=17&output=embed`;
const MAP_SHARE_URL = "https://maps.app.goo.gl/Hs2kUq1aoJYpU6zi9";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LATITUDE},${LONGITUDE}`;
// -----------------------------------

function getStoreStatus() {
    const now = new Date();

    const hour = Number(
        new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            hourCycle: "h23",
        }).format(now),
    );

    const today = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
    }).format(now);

    return {
        isOpen: hour >= OPEN_HOUR && hour < CLOSE_HOUR,
        today,
    };
}

function CardShell({
    icon,
    label,
    children,
}: {
    icon: ReactNode;
    label: string;
    children: ReactNode;
}) {
    return (
        <Box
            sx={{
                p: { xs: 2.5, md: 3.5 },
                border: `1px solid ${border}`,
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
            }}
        >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        color: accentDark,
                        backgroundColor: "rgba(0, 191, 214, 0.1)",
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    variant="overline"
                    sx={{
                        color: accentDark,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        lineHeight: 1.6,
                    }}
                >
                    {label}
                </Typography>
            </Stack>

            {children}
        </Box>
    );
}

function ShopImage({ src, alt }: { src: string; alt: string }) {
    return (
        <Box
            sx={{
                overflow: "hidden",
                borderRadius: 3,
                border: `1px solid ${border}`,
                backgroundColor: softBackground,
                lineHeight: 0,
            }}
        >
            {src ? (
                <Box
                    component="img"
                    src={src}
                    alt={alt}
                    loading="lazy"
                    sx={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                    }}
                />
            ) : (
                <Stack
                    spacing={1}
                    sx={{
                        aspectRatio: "4 / 5",
                        alignItems: "center",
                        justifyContent: "center",
                        color: accentDark,
                        lineHeight: 1.5,
                        background: `linear-gradient(135deg, ${softBackground} 0%, rgba(0, 191, 214, 0.1) 100%)`,
                    }}
                >
                    <StorefrontOutlinedIcon sx={{ fontSize: 48 }} />

                    <Typography sx={{ color: muted, fontWeight: 600, fontSize: "0.95rem" }}>
                        Store photo coming soon
                    </Typography>
                </Stack>
            )}
        </Box>
    );
}

export default function PhysicalShopPage() {
    const { isOpen, today } = getStoreStatus();

    return (
        <Container
            maxWidth="lg"
            sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 3.5, md: 5 } }}
        >
            <Stack spacing={{ xs: 4, md: 6 }}>
                {/* Hero */}
                <Box
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: { xs: 2, md: 3 },
                        border: `1px solid ${border}`,
                        px: { xs: 3, sm: 5, md: 8 },
                        py: { xs: 5, md: 8 },
                        textAlign: "center",
                        background: `linear-gradient(135deg, #FFFFFF 0%, ${softBackground} 55%, rgba(0, 191, 214, 0.12) 100%)`,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: -90,
                            right: -90,
                            width: 260,
                            height: 260,
                            borderRadius: "50%",
                            backgroundColor: "rgba(0, 191, 214, 0.1)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: -70,
                            left: -70,
                            width: 190,
                            height: 190,
                            borderRadius: "50%",
                            border: "2px solid rgba(0, 191, 214, 0.25)",
                        }}
                    />

                    <Stack spacing={2} sx={{ position: "relative", alignItems: "center" }}>
                        <Typography
                            variant="overline"
                            sx={{ color: accentDark, fontWeight: 700, letterSpacing: 2 }}
                        >
                            VISIT OUR STORE
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                color: ink,
                                fontWeight: 750,
                                letterSpacing: "-0.035em",
                                lineHeight: 1.15,
                                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.8rem" },
                            }}
                        >
                            {STORE_NAME}
                        </Typography>

                        <Typography
                            sx={{
                                color: muted,
                                fontSize: { xs: "0.98rem", md: "1.05rem" },
                                lineHeight: 1.8,
                            }}
                        >
                            The physical store of {BRAND_NAME}, in the heart of Mahal, Nagpur.
                        </Typography>

                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 0.75,
                                borderRadius: 999,
                                border: `1px solid ${border}`,
                                backgroundColor: "#FFFFFF",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: "50%",
                                    backgroundColor: isOpen ? "#2E9E5B" : "#B8C4C8",
                                }}
                            />
                            <Typography
                                sx={{ color: ink, fontWeight: 600, fontSize: "0.9rem" }}
                            >
                                {isOpen ? "Open now" : "Closed now"}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Shop images */}
                <Box>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                        <Typography
                            variant="overline"
                            sx={{ color: accentDark, fontWeight: 700, letterSpacing: 1.5 }}
                        >
                            A LOOK INSIDE
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{
                                color: ink,
                                fontWeight: 750,
                                letterSpacing: "-0.035em",
                                fontSize: { xs: "1.8rem", md: "2.3rem" },
                            }}
                        >
                            Our store
                        </Typography>
                    </Stack>

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {SHOP_IMAGES.map((image, index) => (
                            <Grid key={`${index}-${image.alt}`} size={{ xs: 12, md: 6 }}>
                                <ShopImage src={image.src} alt={image.alt} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Details + map */}
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={{ xs: 2, md: 3 }}>
                            <CardShell icon={<PlaceOutlinedIcon />} label="ADDRESS">
                                <Typography
                                    component="div"
                                    sx={{
                                        color: ink,
                                        fontWeight: 600,
                                        fontSize: { xs: "1rem", md: "1.08rem" },
                                        lineHeight: 1.8,
                                    }}
                                >
                                    <Box component="span" sx={{ display: "block", fontWeight: 750 }}>
                                        {STORE_NAME}
                                    </Box>

                                    {ADDRESS_LINES.map((line) => (
                                        <Box key={line} component="span" sx={{ display: "block" }}>
                                            {line}
                                        </Box>
                                    ))}
                                </Typography>

                                <Button
                                    component="a"
                                    href={DIRECTIONS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    startIcon={<DirectionsIcon />}
                                    disableElevation
                                    sx={{
                                        mt: 3,
                                        px: 3,
                                        py: 1.1,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        backgroundColor: accent,
                                        color: ink,
                                        "&:hover": { backgroundColor: "#00A9BE" },
                                    }}
                                >
                                    Get Directions
                                </Button>
                            </CardShell>

                            <CardShell icon={<AccessTimeIcon />} label="OPENING HOURS">
                                <Stack divider={<Box sx={{ borderTop: `1px solid ${border}` }} />}>
                                    {DAYS.map((day) => {
                                        const isToday = day === today;

                                        return (
                                            <Stack
                                                key={day}
                                                direction="row"
                                                sx={{
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 1.1,
                                                    borderRadius: 1.5,
                                                    backgroundColor: isToday
                                                        ? "rgba(0, 191, 214, 0.08)"
                                                        : "transparent",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: isToday ? accentDark : ink,
                                                        fontWeight: isToday ? 700 : 500,
                                                    }}
                                                >
                                                    {day}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: isToday ? accentDark : muted,
                                                        fontWeight: isToday ? 700 : 500,
                                                    }}
                                                >
                                                    {HOURS_LABEL}
                                                </Typography>
                                            </Stack>
                                        );
                                    })}
                                </Stack>
                            </CardShell>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                border: `1px solid ${border}`,
                                borderRadius: 3,
                                backgroundColor: "#FFFFFF",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    minHeight: { xs: 320, md: 480 },
                                    backgroundColor: softBackground,
                                }}
                            >
                                <iframe
                                    title={`${STORE_NAME} location on Google Maps`}
                                    src={MAP_EMBED_URL}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, display: "block", minHeight: "inherit" }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </Box>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{
                                    p: 2.5,
                                    borderTop: `1px solid ${border}`,
                                    alignItems: { sm: "center" },
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography sx={{ color: muted, fontSize: "0.95rem" }}>
                                    Find us near Durga Mandir, Mahal.
                                </Typography>

                                <Button
                                    component="a"
                                    href={MAP_SHARE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="outlined"
                                    endIcon={<OpenInNewIcon />}
                                    sx={{
                                        px: 2.5,
                                        borderRadius: 2,
                                        borderColor: accent,
                                        color: accentDark,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        "&:hover": {
                                            borderColor: "#00A9BE",
                                            backgroundColor: "rgba(0, 191, 214, 0.05)",
                                        },
                                    }}
                                >
                                    Open in Google Maps
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
}