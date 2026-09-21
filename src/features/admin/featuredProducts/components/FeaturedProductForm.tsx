import { useEffect, useState } from "react";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    FormControlLabel,
} from "@mui/material";

import type { Product } from "@/features/products/types/product";

import type {
    FeaturedProduct,
    FeaturedProductFormData,
} from "../types/featuredProduct";

interface FeaturedProductFormProps {
    products: Product[];
    featuredProduct?: FeaturedProduct | null;
    usedProductIds: string[];
    onSubmit: (data: FeaturedProductFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function FeaturedProductForm({
    products,
    featuredProduct,
    usedProductIds,
    onSubmit,
    onCancel,
    loading = false,
}: FeaturedProductFormProps) {
    const [form, setForm] =
        useState<FeaturedProductFormData>({
            productId: "",
            displayOrder: 1,
            isActive: true,
        });

    useEffect(() => {
        if (featuredProduct) {
            setForm({
                productId: featuredProduct.productId,
                displayOrder:
                    featuredProduct.displayOrder,
                isActive: featuredProduct.isActive,
            });
        } else {
            setForm({
                productId: "",
                displayOrder: 1,
                isActive: true,
            });
        }
    }, [featuredProduct]);

    const availableProducts = products.filter(
        (product) =>
            product.isActive &&
            (!usedProductIds.includes(product.id) ||
                product.id === form.productId)
    );

    const updateField = <
        K extends keyof FeaturedProductFormData
    >(
        field: K,
        value: FeaturedProductFormData[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        if (!form.productId) {
            return;
        }

        onSubmit(form);
    };

    return (
        <Stack spacing={2.5}>
            <FormControl fullWidth>
                <InputLabel>
                    Select Product
                </InputLabel>

                <Select
                    value={form.productId}
                    label="Select Product"
                    onChange={(e) =>
                        updateField(
                            "productId",
                            e.target.value
                        )
                    }
                >
                    {availableProducts.map(
                        (product) => (
                            <MenuItem
                                key={product.id}
                                value={product.id}
                            >
                                {product.name}
                            </MenuItem>
                        )
                    )}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={form.displayOrder}
                onChange={(e) =>
                    updateField(
                        "displayOrder",
                        Number(e.target.value)
                    )
                }
                slotProps={{
                    htmlInput: {
                        min: 1,
                        max: 5,
                    },
                }}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={form.isActive}
                        onChange={(e) =>
                            updateField(
                                "isActive",
                                e.target.checked
                            )
                        }
                    />
                }
                label="Show on homepage"
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !form.productId
                    }
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    {loading
                        ? "Saving..."
                        : featuredProduct
                            ? "Update"
                            : "Add Product"}
                </Button>
            </Box>
        </Stack>
    );
}