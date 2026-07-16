import { Container, Typography } from "@mui/material";

export default function LoginPage() {
    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                }}
            >
                Login
            </Typography>
        </Container>
    );
}