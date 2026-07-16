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
    registerSchema,
    type RegisterFormData,
} from "../schemas/registerSchema";

import { registerUser } from "../services/authService";

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (
        data: RegisterFormData
    ) => {
        try {
            const user = await registerUser(
                data.fullName,
                data.email,
                data.password
            );

            console.log("Registered User:", user);

            alert("Account created successfully!");
        } catch (error: any) {
            console.error(error);

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
                        Create Account
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            textAlign: "center",
                            mb: 4,
                        }}
                    >
                        Join Swachha Store today.
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
                            label="Full Name"
                            fullWidth
                            {...register("fullName")}
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                        />

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

                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Create Account
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}