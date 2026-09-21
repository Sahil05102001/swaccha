import { Box, Typography } from "@mui/material";

interface PromoMarqueeProps {
  text: string;
}

export default function PromoMarquee({
  text,
}: PromoMarqueeProps) {
  const messages = text
    .split(",")
    .map((message) => message.trim())
    .filter(Boolean);

  const repeatedMessages = Array.from(
    { length: 4 },
    () => messages,
  ).flat();

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
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "0.8rem",
                sm: "0.85rem",
                md: "0.95rem",
              },
              letterSpacing: 0.3,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {message}
          </Typography>

          {/* Consistent separator after EVERY message */}
          <Typography
            component="span"
            sx={{
              mx: {
                xs: 4,
                sm: 6,
                md: 9,
              },
              fontWeight: 700,
              opacity: 0.85,
              flexShrink: 0,
            }}
          >
            •
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          animation: "promoMarquee 30s linear infinite",
          willChange: "transform",

          "@keyframes promoMarquee": {
            from: {
              transform: "translateX(0)",
            },
            to: {
              transform: "translateX(-50%)",
            },
          },
        }}
      >
        {/* First complete track */}
        {renderSequence("first")}

        {/* Second identical track */}
        {renderSequence("second")}
      </Box>
    </Box>
  );
}