import { useMemo, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import { useProducts } from "@/features/admin/products/hooks/useProducts";

import {
    useBestSellers,
    useCreateBestSeller,
    useDeleteBestSeller,
    useUpdateBestSeller,
} from "../hooks/useBestSellers";

export default function AdminBestSellersPage() {
    const {
        data: products = [],
        isLoading: productsLoading,
    } = useProducts();

    const {
        data: bestSellers = [],
        isLoading: bestSellersLoading,
    } = useBestSellers();

    const createMutation =
        useCreateBestSeller();

    const updateMutation =
        useUpdateBestSeller();

    const deleteMutation =
        useDeleteBestSeller();

    const [selectedProduct, setSelectedProduct] =
        useState("");

    const [selectedOrder, setSelectedOrder] =
        useState(1);

    const activeBestSellers = useMemo(
        () =>
            bestSellers
                .filter((item) => item.isActive)
                .sort(
                    (a, b) =>
                        a.sortOrder - b.sortOrder
                ),
        [bestSellers]
    );

    const usedProductIds = new Set(
        bestSellers.map(
            (item) => item.productId
        )
    );

    const availableProducts =
        products.filter(
            (product) =>
                product.isActive &&
                !usedProductIds.has(product.id)
        );

    const handleAdd = async () => {
        if (!selectedProduct) {
            return;
        }

        await createMutation.mutateAsync({
            productId: selectedProduct,
            sortOrder: selectedOrder,
            isActive: true,
        });

        setSelectedProduct("");
        setSelectedOrder(1);
    };

    const handleDelete = async (
        id: string
    ) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleToggle = async (
        id: string,
        isActive: boolean
    ) => {
        const item = bestSellers.find(
            (seller) => seller.id === id
        );

        if (!item) {
            return;
        }

        await updateMutation.mutateAsync({
            id,
            data: {
                productId: item.productId,
                sortOrder: item.sortOrder,
                isActive,
            },
        });
    };

    const getProduct = (
        productId: string
    ) =>
        products.find(
            (product) =>
                product.id === productId
        );

    const isLoading =
        productsLoading ||
        bestSellersLoading;

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader
                    title="Best Sellers"
                    subtitle="Manage the products displayed in your Best Sellers section."
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 8,
                    }}
                >
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Best Sellers"
                subtitle="Choose and manage the products displayed in the Best Sellers section."
            />

            {/* Add Best Seller */}
            <Card
                sx={{
                    mb: 4,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Add Best Seller
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },
                        }}
                    >
                        <FormControl
                            fullWidth
                            sx={{
                                minWidth: {
                                    sm: 280,
                                },
                            }}
                        >
                            <InputLabel>
                                Product
                            </InputLabel>

                            <Select
                                value={selectedProduct}
                                label="Product"
                                onChange={(event) =>
                                    setSelectedProduct(
                                        event.target.value
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

                        <FormControl
                            sx={{
                                minWidth: 130,
                            }}
                        >
                            <InputLabel>
                                Position
                            </InputLabel>

                            <Select
                                value={selectedOrder}
                                label="Position"
                                onChange={(event) =>
                                    setSelectedOrder(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            >
                                {[1, 2, 3, 4, 5].map(
                                    (position) => (
                                        <MenuItem
                                            key={position}
                                            value={position}
                                        >
                                            {position}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleAdd}
                            disabled={
                                !selectedProduct ||
                                createMutation.isPending ||
                                activeBestSellers.length >= 5
                            }
                            sx={{
                                minWidth: 120,
                                height: 56,
                            }}
                        >
                            {createMutation.isPending
                                ? "Adding..."
                                : "Add"}
                        </Button>
                    </Stack>

                    {activeBestSellers.length >=
                        5 && (
                            <Typography
                                sx={{
                                    mt: 2,
                                    color: "text.secondary",
                                    fontSize: "0.9rem",
                                }}
                            >
                                You already have 5 active Best
                                Sellers. Remove one before adding
                                another.
                            </Typography>
                        )}
                </CardContent>
            </Card>

            {/* Current Best Sellers */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                }}
            >
                Current Best Sellers
            </Typography>

            {activeBestSellers.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography
                            color="text.secondary"
                            sx={{
                                py: 4,
                                textAlign: "center",
                            }}
                        >
                            No Best Sellers have been added
                            yet.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {activeBestSellers.map(
                        (seller) => {
                            const product =
                                getProduct(
                                    seller.productId
                                );

                            if (!product) {
                                return null;
                            }

                            return (
                                <Card
                                    key={seller.id}
                                >
                                    <CardContent>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={2}
                                            sx={{
                                                alignItems: {
                                                    xs: "stretch",
                                                    sm: "center",
                                                },
                                            }}
                                        >
                                            {/* Position */}
                                            <Box
                                                sx={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: "50%",
                                                    bgcolor:
                                                        "primary.main",
                                                    color:
                                                        "primary.contrastText",
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    fontWeight: 700,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {seller.sortOrder}
                                            </Box>

                                            {/* Image */}
                                            <Box
                                                component="img"
                                                src={
                                                    product.images?.[0] ||
                                                    "/placeholder-product.png"
                                                }
                                                alt={
                                                    product.name
                                                }
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 2,
                                                    objectFit:
                                                        "cover",
                                                    bgcolor:
                                                        "#f5f5f5",
                                                }}
                                            />

                                            {/* Product */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {product.name}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    ₹
                                                    {product.price.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </Typography>
                                            </Box>

                                            {/* Active */}
                                            <Stack
                                                direction="row"
                                                sx={{
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                >
                                                    Active
                                                </Typography>

                                                <Switch
                                                    checked={
                                                        seller.isActive
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleToggle(
                                                            seller.id,
                                                            event.target
                                                                .checked
                                                        )
                                                    }
                                                />
                                            </Stack>

                                            {/* Delete */}
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                startIcon={
                                                    <DeleteIcon />
                                                }
                                                onClick={() =>
                                                    handleDelete(
                                                        seller.id
                                                    )
                                                }
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        }
                    )}
                </Stack>
            )}
        </PageContainer>
    );
}