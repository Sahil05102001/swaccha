import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import {
  loginSchema,
  type LoginFormData,
} from "../schemas/loginSchema";
import { loginUser } from "../services/authService";

import { db } from "@/firebase/firestore";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await loginUser(
        data.email,
        data.password
      );

      const snapshot = await getDoc(
        doc(db, "users", user.uid)
      );

      const profile = snapshot.data();

      alert("Login successful!");

      if (profile?.role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      const redirectPath =
        (location.state as { from?: { pathname: string } })
          ?.from?.pathname ?? "/";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 8,
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent
          sx={{
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
            }}
          >
            Login
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            Welcome back to Swachha Store.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}