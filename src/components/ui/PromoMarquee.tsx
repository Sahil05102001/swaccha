import { Box, Typography } from "@mui/material";

interface PromoMarqueeProps {
  text: string;
  variant?: "announcement" | "benefits";
}

export default function PromoMarquee({
  text,
  variant = "announcement",
}: PromoMarqueeProps) {
  const messages = text
    .split(/[•,]/)
    .map((message) => message.trim())
    .filter(Boolean);

  const repeatedMessages = Array.from(
    { length: 4 },
    () => messages,
  ).flat();

  const isBenefits = variant === "benefits";

  const renderSequence = (prefix: string) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {repeatedMessages.map((message, index) => (
        <Box
          key={`${prefix}-${index}`}
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {isBenefits && (
            <Box
              sx={{
                width: {
                  xs: 6,
                  sm: 7,
                },
                height: {
                  xs: 6,
                  sm: 7,
                },
                flexShrink: 0,
                borderRadius: "50%",
                backgroundColor: "#00F0FF",
              }}
            />
          )}

          <Typography
            component="span"
            sx={{
              ml: isBenefits
                ? {
                    xs: 1.15,
                    sm: 1.4,
                  }
                : 0,

              fontWeight: isBenefits ? 500 : 700,

              fontSize: {
                xs: isBenefits
                  ? "0.7rem"
                  : "0.76rem",
                sm: isBenefits
                  ? "0.78rem"
                  : "0.84rem",
                md: isBenefits
                  ? "0.86rem"
                  : "0.92rem",
              },

              letterSpacing: isBenefits
                ? "0.01em"
                : "0.02em",

              lineHeight: 1.2,
              whiteSpace: "nowrap",

              color: isBenefits
                ? "#FFFFFF"
                : "#111111",
            }}
          >
            {message}
          </Typography>

          {isBenefits ? (
            <Box
              sx={{
                width: {
                  xs: 38,
                  sm: 55,
                  md: 75,
                },
                flexShrink: 0,
              }}
            />
          ) : (
            <Box
              component="span"
              sx={{
                mx: {
                  xs: 2.5,
                  sm: 3.5,
                  md: 5,
                },
                color: "#111111",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.9rem",
                },
                fontWeight: 800,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              •
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",

        backgroundColor: isBenefits
          ? "#000000"
          : "#00F0FF",

        color: isBenefits
          ? "#FFFFFF"
          : "#111111",

        borderTop: isBenefits
          ? "1px solid rgba(255,255,255,0.08)"
          : "none",

        borderBottom: isBenefits
          ? "1px solid rgba(255,255,255,0.08)"
          : "none",

        py: {
          xs: isBenefits ? 1.05 : 0.9,
          sm: isBenefits ? 1.15 : 1,
          md: isBenefits ? 1.25 : 1.05,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",

          animation: isBenefits
            ? "promoBenefitsMarquee 32s linear infinite"
            : "promoAnnouncementMarquee 28s linear infinite",

          willChange: "transform",

          "@keyframes promoAnnouncementMarquee": {
            from: {
              transform: "translateX(0)",
            },
            to: {
              transform: "translateX(-50%)",
            },
          },

          "@keyframes promoBenefitsMarquee": {
            from: {
              transform: "translateX(0)",
            },
            to: {
              transform: "translateX(-50%)",
            },
          },

          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      >
        {renderSequence("first")}
        {renderSequence("second")}
      </Box>
    </Box>
  );
}