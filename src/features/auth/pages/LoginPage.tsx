import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    loginSchema,
    type LoginFormData,
} from "../schemas/loginSchema";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        try {
            await loginUser(data.email, data.password);

            alert("Login successful!");

            navigate("/");
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