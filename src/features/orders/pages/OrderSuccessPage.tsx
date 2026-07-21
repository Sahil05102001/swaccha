import {
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
    const navigate = useNavigate();

    return (
        <Stack
            sx={{
                minHeight: "80vh",
                px: 2,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 600,
                    width: "100%",
                    p: 5,
                    borderRadius: 3,
                    textAlign: "center",
                }}
            >
                <Stack
                    spacing={3}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <CheckCircleRoundedIcon
                        color="success"
                        sx={{
                            fontSize: 90,
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Order Placed Successfully!
                    </Typography>

                    <Typography color="text.secondary">
                        Thank you for shopping with Swachha.
                        <br />
                        Your order has been placed successfully and will be processed shortly.
                    </Typography>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        sx={{
                            width: "100%",
                            mt: 2,
                        }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/products")}
                        >
                            Continue Shopping
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate("/orders")}
                        >
                            View My Orders
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}