import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { loginUser } from "../services/authService";
import { createUserProfile } from "@/features/profile/services/profileService";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

import { useSnackbar } from "@/contexts/SnackbarContext";
import { describeAuthError } from "../utils/authErrors";

type LoginLocationState = {
  from?: string | { pathname?: string };
};

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: COLORS.white,
    "& fieldset": { borderColor: COLORS.border, transition: "none" },
    "&:hover fieldset": { borderColor: COLORS.muted },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue, borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: COLORS.muted, transition: "none" },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.text },
  "& .MuiInputBase-input": { color: COLORS.text },
};

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LoginLocationState | null;

  const requestedPath =
    typeof locationState?.from === "string"
      ? locationState.from
      : locationState?.from?.pathname;

  // Only allow internal app paths.
  const redirectPath =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/";

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await loginUser(data.email, data.password);

      const snapshot = await getDoc(doc(db, "users", user.uid));
      const profile = snapshot.data();

      if (profile?.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch (error: unknown) {
      const { message, severity } = describeAuthError(
        error,
        "Login failed. Please try again.",
      );
      showSnackbar(message, severity);
    }
  };


  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const userRef = doc(db, "users", googleUser.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await createUserProfile(
          googleUser.uid,
          googleUser.displayName?.trim() || "Customer",
          googleUser.email || ""
        );
      }

      // Read the profile after ensuring it exists.
      const profileSnapshot = await getDoc(userRef);
      const profile = profileSnapshot.data();

      if (!profile) {
        throw new Error(
          "Your account profile could not be loaded. Please try again."
        );
      }

      if (profile.isActive === false) {
        await auth.signOut();
        showSnackbar(
          "Your account is inactive. Please contact support.",
          "warning"
        );
        return;
      }

      if (profile.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch (error: unknown) {
      const { message, severity } = describeAuthError(
        error,
        "Google sign-in failed. Please try again.",
      );
      showSnackbar(message, severity);
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 6 },
        bgcolor: COLORS.white,
      }}
    >
      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: 440, md: 960 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          borderRadius: 3,
          borderColor: COLORS.border,
          bgcolor: COLORS.white,
          backgroundImage: "none",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        {/* Brand panel (desktop / tablet landscape only) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 5,
            bgcolor: COLORS.black,
            color: COLORS.white,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: COLORS.blue,
              }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "-0.01em",
              }}
            >
              Swachha
            </Typography>
          </Stack>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: "2rem",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
              <Box component="span" sx={{ color: COLORS.blue }}>
                .
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 320,
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Sign in to track your orders, manage your wishlist and check out
              faster.
            </Typography>
          </Box>

          <Typography
            sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
          >
            © {new Date().getFullYear()} Swachha Store
          </Typography>
        </Box>

        {/* Form panel */}
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Mobile brand mark */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "flex", md: "none" },
              mb: 3,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: COLORS.blue,
              }}
            />
            <Typography
              sx={{ fontWeight: 700, fontSize: "1.1rem", color: COLORS.text }}
            >
              Swachha
            </Typography>
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              letterSpacing: "-0.01em",
              color: COLORS.text,
            }}
          >
            Log in
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: COLORS.muted }}>
            Enter your details to access your account.
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Google sign-in */}
            <Button
              type="button"
              fullWidth
              variant="outlined"
              disabled={googleLoading || isSubmitting}
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.3,
                borderRadius: 999,
                borderColor: COLORS.border,
                color: COLORS.text,
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  borderColor: COLORS.muted,
                  bgcolor: "#F8F8F8",
                },
                "&.Mui-disabled": {
                  borderColor: COLORS.border,
                  color: COLORS.muted,
                },
              }}
            >
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            {/* Divider */}
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: COLORS.border }} />

              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: COLORS.muted,
                  whiteSpace: "nowrap",
                }}
              >
                OR CONTINUE WITH EMAIL
              </Typography>

              <Box sx={{ flex: 1, height: "1px", bgcolor: COLORS.border }} />
            </Stack>

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              sx={fieldSx}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Box>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                fullWidth
                sx={fieldSx}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          disableRipple
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          sx={{ color: COLORS.muted }}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ mt: 1, textAlign: "right" }}>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  underline="hover"
                  sx={{
                    fontSize: "0.825rem",
                    fontWeight: 500,
                    color: COLORS.text,
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              disableRipple
              disableElevation
              variant="contained"
              disabled={isSubmitting || googleLoading}
              sx={{
                py: 1.4,
                borderRadius: 999,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: "none",
                transition: "none",
                bgcolor: COLORS.black,
                color: COLORS.white,
                "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
                "&.Mui-disabled": {
                  bgcolor: COLORS.border,
                  color: COLORS.muted,
                },
              }}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </Box>

          {/* Register */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: `1px solid ${COLORS.border}`,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.875rem", color: COLORS.muted }}>
              New to Swachha?{" "}
              <MuiLink
                component={Link}
                to="/register"
                state={location.state}
                underline="hover"
                sx={{ fontWeight: 600, color: COLORS.text }}
              >
                Create an account
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}