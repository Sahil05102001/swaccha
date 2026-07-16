import { Container, Typography } from "@mui/material";

export default function ForgotPasswordPage() {
    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                }}
            >
                Forgot Password
            </Typography>
        </Container>
    );
}