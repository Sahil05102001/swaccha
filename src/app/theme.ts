import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2E7D32",
      light: "#66BB6A",
      dark: "#1B5E20",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#43A047",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F8FAF8",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },

    success: {
      main: "#43A047",
    },

    error: {
      main: "#D32F2F",
    },

    warning: {
      main: "#F9A825",
    },
  },

  typography: {
    fontFamily: `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,

    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },

    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },

    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },

    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },

    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },

    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
          fontWeight: 600,
          boxShadow: "none",

          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
  },
});

export default theme;