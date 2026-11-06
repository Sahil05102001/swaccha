import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    // Swachha primary — deep emerald
    primary: {
      main: "#005B41",
      light: "#287D65",
      dark: "#003F2D",
      contrastText: "#FFFFFF",
    },

    // Editorial blue accent
    secondary: {
      main: "#002FA7",
      light: "#3156C0",
      dark: "#001F70",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#087A58",
      light: "#45A487",
      dark: "#04543D",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#D8893E",
      light: "#E7AD76",
      dark: "#A96125",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#C94F4F",
      light: "#DE8181",
      dark: "#9E3737",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#4169A1",
      light: "#7190BB",
      dark: "#2A4B7A",
      contrastText: "#FFFFFF",
    },

    // Frosted Pearl canvas
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },

    // Midnight Onyx
    text: {
      primary: "#1A1A1A",
      secondary: "#656A70",
      disabled: "#A4A8AC",
    },

    divider: "#E5E7E9",
  },

  typography: {
    // Editorial heading + geometric body.
    // Falls back gracefully when the fonts are not installed.
    fontFamily:
      '"Manrope", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    h1: {
      fontFamily:
        '"Syne", "Manrope", "Inter", system-ui, sans-serif',
      fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
      lineHeight: 0.98,
      fontWeight: 800,
      letterSpacing: "-0.055em",
    },

    h2: {
      fontFamily:
        '"Syne", "Manrope", "Inter", system-ui, sans-serif',
      fontSize: "clamp(2.1rem, 4.5vw, 4rem)",
      lineHeight: 1.02,
      fontWeight: 800,
      letterSpacing: "-0.045em",
    },

    h3: {
      fontFamily:
        '"Syne", "Manrope", "Inter", system-ui, sans-serif',
      fontSize: "clamp(1.7rem, 3vw, 2.7rem)",
      lineHeight: 1.08,
      fontWeight: 800,
      letterSpacing: "-0.035em",
    },

    h4: {
      fontFamily:
        '"Syne", "Manrope", "Inter", system-ui, sans-serif',
      fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
      lineHeight: 1.15,
      fontWeight: 750,
      letterSpacing: "-0.025em",
    },

    h5: {
      fontFamily: '"Syne", "Manrope", sans-serif',
      fontSize: "1.25rem",
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },

    h6: {
      fontFamily: '"Manrope", "Inter", sans-serif',
      fontSize: "1rem",
      lineHeight: 1.4,
      fontWeight: 700,
    },

    body1: {
      fontFamily:
        '"Manrope", "Inter", system-ui, sans-serif',
      fontSize: "1rem",
      lineHeight: 1.7,
      fontWeight: 400,
    },

    body2: {
      fontFamily:
        '"Manrope", "Inter", system-ui, sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },

    button: {
      fontFamily:
        '"Manrope", "Inter", system-ui, sans-serif',
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "-0.005em",
    },
  },

  shape: {
    borderRadius: 16,
  },

  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          backgroundColor: "#F8F9FA",
        },

        body: {
          margin: 0,
          width: "100%",
          maxWidth: "100%",
          // overflowX: "hidden",
          overflowX: "clip",
          backgroundColor: "#F8F9FA",
          color: "#1A1A1A",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },

        "#root": {
          width: "100%",
          maxWidth: "100%",
          // overflowX: "hidden",
          overflowX: "clip",
        },

        "*": {
          boxSizing: "border-box",
        },

        a: {
          color: "inherit",
          textDecoration: "none",
        },

        "button, input, textarea, select": {
          fontFamily: "inherit",
        },

        img: {
          maxWidth: "100%",
        },

        "::selection": {
          backgroundColor: "rgba(0, 240, 255, 0.25)",
          color: "#003F2D",
        },

        // Lightweight glass utility.
        ".swachha-glass": {
          backgroundColor: "rgba(255, 255, 255, 0.68)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.72)",
          boxShadow: "0 12px 40px rgba(26, 26, 26, 0.07)",
        },

        // Ambient liquid background.
        ".swachha-liquid": {
          position: "relative",
          overflow: "hidden",
        },

        ".swachha-liquid::before": {
          content: '""',
          position: "absolute",
          width: "420px",
          height: "420px",
          top: "-180px",
          right: "-120px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 91, 65, 0.12) 0%, rgba(0, 91, 65, 0) 70%)",
          pointerEvents: "none",
        },

        ".swachha-liquid::after": {
          content: '""',
          position: "absolute",
          width: "360px",
          height: "360px",
          bottom: "-180px",
          left: "-120px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 47, 167, 0.08) 0%, rgba(0, 47, 167, 0) 70%)",
          pointerEvents: "none",
        },
      },
    },

    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },

      styleOverrides: {
        root: {
          width: "100%",
          maxWidth: "100%",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 46,
          borderRadius: 12,
          padding: "11px 20px",
          fontWeight: 700,
          boxShadow: "none",

          transition:
            "background-color 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",

          "&:hover": {
            boxShadow: "none",
          },

          "&.Mui-disabled": {
            opacity: 0.5,
          },

          "@media (max-width:600px)": {
            minHeight: 44,
            padding: "10px 16px",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,

          transition:
            "background-color 180ms ease, color 180ms ease",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          backgroundImage: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 30px rgba(26, 26, 26, 0.055)",
          overflow: "hidden",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: "none",
        },

        outlined: {
          borderColor: "#E3E5E7",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "rgba(255, 255, 255, 0.82)",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DDE1E4",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8AA39A",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#005B41",
            borderWidth: 2,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#656A70",

          "&.Mui-focused": {
            color: "#005B41",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          minWidth: 18,
          height: 18,
          padding: "0 5px",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E3E5E7",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 9,
          fontSize: "0.75rem",
          backgroundColor: "#1A1A1A",
        },
      },
    },
  },
});

export default theme;