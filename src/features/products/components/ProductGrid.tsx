import { Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({
    products,
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <Typography>
                No products available.
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {products.map((product) => (
                <Grid
                    key={product.id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                >
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>
    );
}