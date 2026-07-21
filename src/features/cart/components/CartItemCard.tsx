import {
    Card,
    CardContent,
    CardMedia,
    Stack,
    Typography,
} from "@mui/material";
import type { CartItem } from "../types/cart";
import QuantityControl from "./QuantityControl";
import {
    useDeleteCart,
    useUpdateCart,
} from "../hooks/useCart";
import AppButton from "@/components/ui/AppButton";

interface CartItemCardProps {
    item: CartItem;
}

export default function CartItemCard({
    item,
}: CartItemCardProps) {
    const updateCart = useUpdateCart();
    const deleteCart = useDeleteCart();
    const handleIncrease = () => {
        updateCart.mutate({
            id: item.id,
            quantity: item.quantity + 1,
        });
    };

    const handleDecrease = () => {
        if (item.quantity === 1) {
            deleteCart.mutate(item.id);
            return;
        }

        updateCart.mutate({
            id: item.id,
            quantity: item.quantity - 1,
        });
    };
    return (
        <Card>
            <Stack direction="row">
                <CardMedia
                    component="img"
                    image={item.product.images[0]}
                    alt={item.product.name}
                    sx={{
                        width: 140,
                        height: 140,
                        objectFit: "cover",
                    }}
                />

                <CardContent sx={{ flex: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                    >
                        {item.product.name}
                    </Typography>

                    <Typography color="text.secondary">
                        {item.product.brand}
                    </Typography>

                    <Typography
                        color="primary"
                        sx={{
                            mt: 2,
                            fontWeight: 700,
                        }}
                    >
                        ₹{item.product.price}
                    </Typography>

                    <Stack
                        direction="row"
                        sx={{
                            mt: 2,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <QuantityControl
                            quantity={item.quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />

                        <AppButton
                            color="error"
                            variant="outlined"
                            onClick={() => deleteCart.mutate(item.id)}
                        >
                            Remove
                        </AppButton>
                    </Stack>
                </CardContent>
            </Stack>
        </Card>
    );
}