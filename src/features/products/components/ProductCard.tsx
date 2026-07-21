import {
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import type { Product } from "../types/product";
import AppCard from "@/components/ui/AppCard";
import { useNavigate } from "react-router-dom";
import AppButton from "@/components/ui/AppButton";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({
    product,
}: ProductCardProps) {
    const navigate = useNavigate();
    return (
        <AppCard
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardMedia
                component="img"
                height="220"
                image={product.images[0]}
                alt={product.name}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Stack
                    direction="row"
                    sx={{
                        mb: 1,
                        justifyContent: "space-between",
                    }}
                >
                    <Chip
                        label={`${product.discount}% OFF`}
                        color="success"
                        size="small"
                    />

                    <Chip
                        label={product.category}
                        size="small"
                    />
                </Stack>

                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                >
                    {product.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        mb: 2,
                    }}
                >
                    {product.description}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                    >
                        ₹{product.price}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            textDecoration: "line-through",
                        }}
                        color="text.secondary"
                    >
                        ₹{product.mrp}
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions>
                <AppButton
                    fullWidth
                    onClick={() => navigate(`/products/${product.id}`)}
                >
                    View Details
                </AppButton>
            </CardActions>
        </AppCard>
    );
}