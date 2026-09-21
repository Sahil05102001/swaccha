import {
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import ProductCard from "@/components/product/ProductCard";
import {
    useGlobalProductStickerSettings,
    useOfferZoneProducts,
} from "@/features/admin/offerzone/hooks/useOfferZone";

import type { Product } from "../types/product";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({
    products,
}: ProductGridProps) {
    const {
        data: offerZoneProducts = [],
        isLoading: isOfferZoneLoading,
    } = useOfferZoneProducts();

    const {
        data: globalStickerSettings,
        isLoading: isStickerSettingsLoading,
    } = useGlobalProductStickerSettings();

    if (products.length === 0) {
        return (
            <Typography>
                No products available.
            </Typography>
        );
    }

    if (
        isOfferZoneLoading ||
        isStickerSettingsLoading
    ) {
        return (
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid
                        key={product.id}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                            lg: 3,
                        }}
                    >
                        <CircularProgress />
                    </Grid>
                ))}
            </Grid>
        );
    }

    const offerZoneProductMap = new Map(
        offerZoneProducts.map(
            (offerZoneProduct) => [
                offerZoneProduct.productId,
                offerZoneProduct,
            ]
        )
    );

    return (
        <Grid container spacing={3}>
            {products.map((product) => {
                const offerZoneProduct =
                    offerZoneProductMap.get(
                        product.id
                    );

                const promotionalSticker =
                    offerZoneProduct
                        ? offerZoneProduct.promotionalSticker
                        : globalStickerSettings?.promotionalSticker;

                const rotatingSticker =
                    globalStickerSettings?.rotatingSticker;

                return (
                    <Grid
                        key={product.id}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                            lg: 3,
                        }}
                    >
                        <ProductCard
                            product={product}
                            showProductStickers
                            promotionalSticker={
                                promotionalSticker
                            }
                            rotatingSticker={
                                rotatingSticker
                            }
                            isOfferZoneProduct={
                                Boolean(
                                    offerZoneProduct
                                )
                            }
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}