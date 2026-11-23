import {
    alpha,
    createTheme,
    type Shadows,
    type Theme,
} from "@mui/material/styles";


const INK = "#18181B";
const TEXT = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const FIELD_BORDER = "#D1D5DB";
const PAGE_BG = "#F5F6F8";


type Semantic = "error" | "success" | "warning" | "info";
type ThemeArg = { theme: Theme };


// Coloured outlined buttons keep their own border colour on hover.
const keepBorder =
    (color: Semantic) =>
        ({ theme }: { theme: Theme }) => ({
            "&:hover": { borderColor: alpha(theme.palette[color].main, 0.5) },
        });


/** Admin-only theme. It is applied on top of the store theme, inside AdminLayout. */
export const adminTheme = (outer: Theme): Theme =>
    createTheme(outer, {
        palette: {
            primary: {
                main: INK,
                light: "#3F3F46",
                dark: INK,
                contrastText: "#FFFFFF",
            },
            secondary: {
                main: "#4B5563",
                light: "#6B7280",
                dark: "#4B5563",
                contrastText: "#FFFFFF",
            },
            // Same colours as the store theme; "dark" equals "main" so a hovered
            // contained button does not change colour.
            // Darker than the store red/orange so text on them is readable (WCAG AA).
            error: {
                main: "#B91C1C",
                dark: "#B91C1C",
                contrastText: "#FFFFFF",
            },
            success: {
                main: outer.palette.success.main,
                dark: outer.palette.success.main,
            },
            warning: {
                main: "#B45309",
                dark: "#B45309",
                contrastText: "#FFFFFF",
            },
            info: {
                main: outer.palette.info.main,
                dark: outer.palette.info.main,
            },
            text: { primary: TEXT, secondary: MUTED },
            divider: BORDER,
            background: { default: PAGE_BG, paper: "#FFFFFF" },
            // No hover or press tint anywhere.
            action: {
                hover: "transparent",
                hoverOpacity: 0,
                focus: "transparent",
                focusOpacity: 0,
            },
        },


        shape: { borderRadius: 8 },


        // No shadows.
        shadows: Array(25).fill("none") as Shadows,


        // No animations or transitions.
        transitions: {
            duration: {
                shortest: 0,
                shorter: 0,
                short: 0,
                standard: 0,
                complex: 0,
                enteringScreen: 0,
                leavingScreen: 0,
            },
            create: () => "none",
        },


        components: {
            MuiCircularProgress: {
                styleOverrides: { colorPrimary: { color: INK } },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    colorPrimary: { backgroundColor: "#E4E4E7" },
                    barColorPrimary: { backgroundColor: INK },
                },
            },


            MuiButtonBase: {
                defaultProps: { disableRipple: true },
                styleOverrides: {
                    root: {
                        // Keyboard users still see where they are.
                        "&.Mui-focusVisible": {
                            outline: `2px solid ${INK}`,
                            outlineOffset: 2,
                        },
                    },
                },
            },


            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        minHeight: 40,
                        padding: "8px 16px",
                        borderRadius: 8,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                        transition: "none",
                        "@media (max-width:600px)": {
                            minHeight: 40,
                            padding: "8px 14px",
                        },
                    },
                    sizeSmall: { minHeight: 32, padding: "4px 12px" },
                    outlinedPrimary: {
                        borderColor: FIELD_BORDER,
                        "&:hover": { borderColor: FIELD_BORDER },
                    },
                    outlinedSecondary: {
                        borderColor: FIELD_BORDER,
                        "&:hover": { borderColor: FIELD_BORDER },
                    },
                    outlinedError: keepBorder("error"),
                    outlinedSuccess: keepBorder("success"),
                    outlinedWarning: keepBorder("warning"),
                    outlinedInfo: keepBorder("info"),
                },
            },


            MuiIconButton: {
                styleOverrides: { root: { borderRadius: 8, transition: "none" } },
            },


            // The store theme turns the focused label green.
            MuiInputLabel: {
                styleOverrides: {
                    root: ({ theme }: ThemeArg) => ({
                        color: theme.palette.text.secondary,
                        "&.Mui-focused:not(.Mui-error)": {
                            color: theme.palette.text.primary,
                        },
                    }),
                },
            },


            MuiPaper: {
                defaultProps: { elevation: 0 },
                styleOverrides: { root: { backgroundImage: "none" } },
            },


            MuiCard: {
                styleOverrides: {
                    root: ({ theme }: ThemeArg) => ({
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 12,
                    }),
                },
            },


            // Windows and menus get a border in place of a shadow.
            MuiDialog: {
                styleOverrides: {
                    paper: ({ theme }: ThemeArg) => ({
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 12,
                    }),
                },
            },
            MuiPopover: {
                styleOverrides: {
                    paper: ({ theme }: ThemeArg) => ({
                        border: `1px solid ${theme.palette.divider}`,
                    }),
                },
            },
            MuiDialogTitle: {
                styleOverrides: { root: { fontWeight: 700 } },
            },


            MuiTableCell: {
                styleOverrides: {
                    root: ({ theme }: ThemeArg) => ({
                        borderColor: theme.palette.divider,
                    }),
                    head: ({ theme }: ThemeArg) => ({
                        backgroundColor: "#F9FAFB",
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                    }),
                },
            },


            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }: ThemeArg) => ({
                        borderRadius: 8,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: FIELD_BORDER,
                        },
                        "&:not(.Mui-error):not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline":
                            { borderColor: FIELD_BORDER },
                        "&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 1,
                        },
                    }),
                },
            },


            MuiLink: { defaultProps: { underline: "always" } },


            MuiChip: {
                styleOverrides: { root: { fontWeight: 600 } },
            },
        },
    });