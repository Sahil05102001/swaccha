import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    fontSize: 28,
                                }}
                            >
                                {user.displayName?.charAt(0).toUpperCase() ?? "U"}
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700 }}
                                >
                                    My Profile
                                </Typography>

                                <Typography color="text.secondary">
                                    Welcome back!
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider />

                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Full Name
                            </Typography>

                            <Typography variant="h6">
                                {user.displayName || "Not Set"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Email
                            </Typography>

                            <Typography variant="h6">
                                {user.email}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Email Verification
                            </Typography>

                            <Chip
                                label={
                                    user.emailVerified
                                        ? "Verified"
                                        : "Not Verified"
                                }
                                color={
                                    user.emailVerified
                                        ? "success"
                                        : "warning"
                                }
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                User ID
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    wordBreak: "break-all",
                                }}
                            >
                                {user.uid}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}