import {
    Alert,
    CircularProgress,
    Stack,
} from "@mui/material";
import OrderCard from "../components/OrderCard";
import { useOrders } from "../hooks/useOrders";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/common/PageContainer";

export default function OrdersPage() {
    const {
        data: orders = [],
        isLoading,
        isError,
    } = useOrders();

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Stack
                sx={{
                    minHeight: "60vh",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Stack>
        );
    }

    if (isError) {
        return (
            <Stack
                sx={{
                    py: 4,
                    px: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >
                <Alert severity="error">
                    Failed to load your orders.
                </Alert>
            </Stack>
        );
    }

    return (
       <PageContainer>
            <PageHeader
                title="My Orders"
                subtitle="View and track all your orders."
            />

            {orders.length === 0 ? (
                <EmptyState
                    title="No Orders Yet"
                    description="You haven't placed any orders yet. Start shopping to see your orders here."
                    icon={
                        <ShoppingBagOutlinedIcon
                            sx={{
                                fontSize: 72,
                                color: "text.disabled",
                            }}
                        />
                    }
                    action={
                        <Button
                            variant="contained"
                            onClick={() => navigate("/products")}
                        >
                            Browse Products
                        </Button>
                    }
                />
            ) : (
                <Stack spacing={2}>
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                        />
                    ))}
                </Stack>
            )}
        </PageContainer>
    );
}