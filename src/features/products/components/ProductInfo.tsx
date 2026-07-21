import { Stack, Typography } from "@mui/material";
import type { Product } from "../types/product";
import ProductHeader from "./ProductHeader";
import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import ProductActions from "./ProductActions";

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({
    product,
}: ProductInfoProps) {
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        addToCart.mutate(
            {
                productId: product.id,
                quantity: 1,
                product,
            },
            {
                onSuccess: () => {
                    console.log("Added successfully");
                },
                onError: (error) => {
                    console.error("Add to cart failed:", error);
                },
            }
        );
    };
    return (
        <Stack spacing={3}>
            <ProductHeader product={product} />

            <ProductPrice
                price={product.price}
                mrp={product.mrp}
                discount={product.discount}
            />

            <ProductStock stock={product.stock} />

            <Typography color="text.secondary">
                {product.description}
            </Typography>

            <ProductActions
                onAddToCart={handleAddToCart}
            />
        </Stack>
    );
}