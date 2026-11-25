import { useEffect, useState } from "react";
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
import { keyframes } from "@mui/material/styles";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  browserPopupRedirectResolver,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { registerUser } from "../services/authService";
import { mergeGuestCartIntoFirestore } from "@/features/cart/services/cartService";
import { createUserProfile } from "@/features/profile/services/profileService";
import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { describeAuthError } from "../utils/authErrors";
import { useQueryClient } from "@tanstack/react-query";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { getPasswordStrength } from "../utils/passwordRules";

type RegisterLocationState = {
  from?: string | { pathname?: string };
};

const COLORS = {
  blue: "#00D9FF",
  navCyan: "#00F0FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  weak: "#DC2626",
  fair: "#F59E0B",
  good: "#10B981",
  goodText: "#047857",
};

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${COLORS.blue}`,
    outlineOffset: 2,
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "#FAFAFA",
    transition: "box-shadow 0.2s, background-color 0.2s",
    "& fieldset": { borderColor: COLORS.border, transition: "none" },
    "&.Mui-focused": {
      bgcolor: COLORS.white,
      boxShadow: "0 0 0 4px rgba(0,217,255,0.15)",
    },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue, borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: COLORS.muted, transition: "none" },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.text },
  "& .MuiInputBase-input": { color: COLORS.text },
};

const rise = keyframes`
  0%   { transform: translate(0, 0); opacity: 0; }
  10%  { opacity: 0.9; }
  50%  { transform: translate(14px, -260px); }
  100% { transform: translate(-10px, -620px); opacity: 0; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const bubbles = [
  { size: 14, left: "8%", duration: 9, delay: 0 },
  { size: 26, left: "22%", duration: 12, delay: 2 },
  { size: 10, left: "38%", duration: 8, delay: 4 },
  { size: 34, left: "55%", duration: 14, delay: 1 },
  { size: 16, left: "70%", duration: 10, delay: 3 },
  { size: 22, left: "84%", duration: 11, delay: 5 },
  { size: 12, left: "46%", duration: 9, delay: 6 },
  { size: 28, left: "92%", duration: 13, delay: 7 },
];

// Soft bubbles floating up. Purely decorative.
function Bubbles({ count = bubbles.length }: { count?: number }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {bubbles.slice(0, count).map((bubble, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            bottom: -80,
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            borderRadius: "50%",
            border: "1px solid rgba(0,240,255,0.5)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(0,240,255,0.08) 60%, transparent)",
            animation: `${rise} ${bubble.duration}s ease-in infinite`,
            animationDelay: `${bubble.delay}s`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              bottom: `${20 + index * 8}%`,
              opacity: 0.6,
            },
          }}
        />
      ))}
    </Box>
  );
}

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

function VisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        disableRipple
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={onToggle}
        onMouseDown={(e) => e.preventDefault()}
        sx={{ color: COLORS.muted, ...focusRing }}
      >
        {visible ? (
          <VisibilityOffOutlinedIcon fontSize="small" />
        ) : (
          <VisibilityOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </InputAdornment>
  );
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <InputAdornment position="start">
      <Box sx={{ display: "flex", color: COLORS.muted }}>{children}</Box>
    </InputAdornment>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Loads Google's sign-in helper while the person types, so the popup
  // opens instantly and is not blocked by the browser.
  useEffect(() => {
    void getRedirectResult(auth, browserPopupRedirectResolver).catch(
      () => undefined,
    );
  }, []);

  const { showSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") ?? "";
  const emailValue = watch("email") ?? "";
  const nameValue = watch("fullName") ?? "";

  const strength = getPasswordStrength(passwordValue, {
    email: emailValue,
    fullName: nameValue,
  });

  const strengthColors = {
    none: COLORS.border,
    weak: COLORS.weak,
    fair: COLORS.fair,
    good: COLORS.good,
    strong: COLORS.good,
  } as const;

  const strengthColor = strengthColors[strength.level];

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const locationState = location.state as RegisterLocationState | null;

  const requestedPath =
    typeof locationState?.from === "string"
      ? locationState.from
      : locationState?.from?.pathname;

  // Only allow internal app paths.
  const redirectPath =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.fullName, data.email, data.password);

      const user = auth.currentUser;

      await mergeGuestCartIntoFirestore();

      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ["cart", user.uid],
        });
      }

      navigate(redirectPath, { replace: true });
    } catch (error: unknown) {
      const { message, severity } = describeAuthError(
        error,
        "Could not create your account. Please try again.",
      );
      showSnackbar(message, severity);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver,
      );
      const { user } = result;

      const profileRef = doc(db, "users", user.uid);
      let snapshot = await getDoc(profileRef);

      // First-time Google sign-in: create the same profile email sign-ups get.
      if (!snapshot.exists()) {
        await createUserProfile(
          user.uid,
          user.displayName ?? "",
          user.email ?? "",
        );

        snapshot = await getDoc(profileRef);
      }

      const profile = snapshot.data();

      if (profile?.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      await mergeGuestCartIntoFirestore();

      await queryClient.invalidateQueries({
        queryKey: ["cart", user.uid],
      });

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
        bgcolor: "#F6FAFB",
        backgroundImage:
          "radial-gradient(circle at 12% 8%, rgba(0,240,255,0.16) 0%, rgba(0,240,255,0) 38%), radial-gradient(circle at 92% 92%, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0) 40%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: 440, md: 980 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
          borderRadius: 4,
          bgcolor: COLORS.white,
          backgroundImage: "none",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.12)",
          overflow: "hidden",
          animation: `${fadeUp} 0.5s ease-out both`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        {/* Mobile banner (phones and small tablets) */}
        <Box
          sx={{
            position: "relative",
            display: { xs: "block", md: "none" },
            px: 3,
            pt: 3.5,
            pb: 3,
            bgcolor: COLORS.black,
            color: COLORS.white,
            overflow: "hidden",
            backgroundImage:
              "radial-gradient(circle at 100% 0%, rgba(0,240,255,0.28) 0%, rgba(0,240,255,0) 60%)",
          }}
        >
          <Bubbles count={5} />

          <Box sx={{ position: "relative" }}>
            <Typography
              sx={{
                color: COLORS.navCyan,
                fontWeight: 700,
                fontSize: "1.5rem",
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              SWACHHA
            </Typography>

            <Typography
              component="h2"
              sx={{
                mt: 2,
                fontWeight: 800,
                fontSize: "1.6rem",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Join Swachha
              <Box component="span" sx={{ color: COLORS.navCyan }}>
                .
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Create your account in under a minute.
            </Typography>
          </Box>
        </Box>

        {/* Brand panel (desktop / tablet landscape) */}
        <Box
          sx={{
            position: "relative",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 5,
            bgcolor: COLORS.black,
            color: COLORS.white,
            overflow: "hidden",
            backgroundImage:
              "radial-gradient(circle at 100% 0%, rgba(0,240,255,0.26) 0%, rgba(0,240,255,0) 55%), radial-gradient(circle at 0% 100%, rgba(0,240,255,0.12) 0%, rgba(0,240,255,0) 50%)",
          }}
        >
          <Bubbles />

          <Typography
            sx={{
              position: "relative",
              color: COLORS.navCyan,
              fontWeight: 700,
              fontSize: "2.2rem",
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            SWACHHA
          </Typography>

          <Box sx={{ position: "relative" }}>
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: "2.5rem",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Join the
              <br />
              clean{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #00F0FF, #7CF7FF)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                side.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 340,
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              Create an account to shop faster and keep everything in one
              place.
            </Typography>
          </Box>

          <Typography
            sx={{
              position: "relative",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
            }}
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
            minWidth: 0,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.6rem", sm: "1.9rem" },
              letterSpacing: "-0.02em",
              color: COLORS.text,
            }}
          >
            Create account
          </Typography>

          <Typography
            sx={{ mt: 0.75, fontSize: "0.9rem", color: COLORS.muted }}
          >
            It only takes a minute to get started.
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 3.5,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Google sign-up */}
            <Button
              type="button"
              fullWidth
              variant="outlined"
              disableRipple
              disabled={googleLoading || isSubmitting}
              onClick={handleGoogleSignUp}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.35,
                borderRadius: 999,
                borderColor: COLORS.border,
                color: COLORS.text,
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "none",
                boxShadow: "none",
                transition: "transform 0.15s, border-color 0.15s",
                "&:hover": {
                  borderColor: COLORS.text,
                  bgcolor: COLORS.white,
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  borderColor: COLORS.border,
                  color: COLORS.muted,
                },
                ...focusRing,
              }}
            >
              {googleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </Button>

            {/* Divider */}
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: COLORS.border }} />

              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  color: COLORS.muted,
                  whiteSpace: "nowrap",
                }}
              >
                OR SIGN UP WITH EMAIL
              </Typography>

              <Box sx={{ flex: 1, height: "1px", bgcolor: COLORS.border }} />
            </Stack>

            <TextField
              label="Full name"
              autoComplete="name"
              fullWidth
              sx={fieldSx}
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <FieldIcon>
                      <PersonOutlinedIcon fontSize="small" />
                    </FieldIcon>
                  ),
                },
              }}
            />

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              sx={fieldSx}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <FieldIcon>
                      <EmailOutlinedIcon fontSize="small" />
                    </FieldIcon>
                  ),
                },
              }}
            />

            <Box>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                fullWidth
                sx={fieldSx}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <FieldIcon>
                        <LockOutlinedIcon fontSize="small" />
                      </FieldIcon>
                    ),
                    endAdornment: (
                      <VisibilityToggle
                        visible={showPassword}
                        onToggle={() => setShowPassword((prev) => !prev)}
                      />
                    ),
                  },
                }}
              />

              {/* Password strength and requirements */}
              <Box sx={{ mt: 1.25 }} aria-live="polite">
                {passwordValue ? (
                  <>
                    <Stack direction="row" spacing={0.75}>
                      {[1, 2, 3, 4].map((segment) => (
                        <Box
                          key={segment}
                          sx={{
                            flex: 1,
                            height: 4,
                            borderRadius: 999,
                            bgcolor:
                              segment <= strength.score
                                ? strengthColor
                                : COLORS.border,
                            transition: "background-color 0.2s",
                          }}
                        />
                      ))}
                    </Stack>

                    <Typography
                      sx={{ mt: 0.5, fontSize: "0.75rem", color: COLORS.muted }}
                    >
                      Password strength:{" "}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color:
                            strength.level === "good" ||
                            strength.level === "strong"
                              ? COLORS.goodText
                              : strengthColor,
                        }}
                      >
                        {strength.label}
                      </Box>
                      {!strength.ok && " · meet every requirement to continue"}
                    </Typography>

                    <Box
                      component="ul"
                      sx={{
                        listStyle: "none",
                        p: 0,
                        m: 0,
                        mt: 1,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 0.5,
                      }}
                    >
                      {strength.checks.map((check) => (
                        <Box
                          component="li"
                          key={check.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontSize: "0.75rem",
                            color: check.met ? COLORS.goodText : COLORS.muted,
                          }}
                        >
                          {check.met ? (
                            <CheckCircleRoundedIcon
                              sx={{ fontSize: 16, color: COLORS.good }}
                            />
                          ) : (
                            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
                          )}
                          {check.label}
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Typography sx={{ fontSize: "0.75rem", color: COLORS.muted }}>
                    Use 10+ characters with upper and lower case letters, a
                    number and a symbol.
                  </Typography>
                )}
              </Box>
            </Box>

            <TextField
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              sx={fieldSx}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <FieldIcon>
                      <LockOutlinedIcon fontSize="small" />
                    </FieldIcon>
                  ),
                  endAdornment: (
                    <VisibilityToggle
                      visible={showConfirm}
                      onToggle={() => setShowConfirm((prev) => !prev)}
                    />
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              disableRipple
              disableElevation
              variant="contained"
              disabled={isSubmitting || googleLoading || !strength.ok}
              endIcon={
                isSubmitting ? undefined : (
                  <ArrowForwardRoundedIcon
                    sx={{ transition: "transform 0.2s" }}
                  />
                )
              }
              sx={{
                py: 1.55,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.98rem",
                textTransform: "none",
                boxShadow: "none",
                bgcolor: COLORS.black,
                color: COLORS.white,
                transition:
                  "transform 0.15s, box-shadow 0.2s, background-color 0.2s",
                "& .MuiButton-endIcon": { color: COLORS.navCyan },
                "&.Mui-disabled": {
                  bgcolor: COLORS.border,
                  color: COLORS.muted,
                },
                ...focusRing,
              }}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.muted,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 14 }} />
              <Typography sx={{ fontSize: "0.75rem" }}>
                Your details are encrypted and secure
              </Typography>
            </Stack>
          </Box>

          {/* Login */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: `1px solid ${COLORS.border}`,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.875rem", color: COLORS.muted }}>
              Already have an account?{" "}
              <MuiLink
                component={Link}
                to="/login"
                state={location.state}
                underline="hover"
                sx={{
                  fontWeight: 700,
                  color: COLORS.text,
                  ...focusRing,
                }}
              >
                Log in
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}