import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";

import { useSalesByCategory } from "../hooks/useSalesByCategory";

export default function SalesByCategoryCard() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useSalesByCategory();

    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <Stack
                        sx={{
                            alignItems: "center",
                            justifyContent: "center",
                            py: 4,
                        }}
                    >
                        <CircularProgress />
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (isError || !data) {
        return (
            <Alert severity="error">
                {String(error ?? "Failed to load category sales.")}
            </Alert>
        );
    }

    const maxRevenue =
        data.length > 0
            ? Math.max(...data.map((item) => item.totalRevenue))
            : 1;

    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Sales by Category
                </Typography>

                {data.length === 0 ? (
                    <Typography color="text.secondary">
                        No category sales available.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {data.map((category) => (
                            <ListItem
                                key={category.category}
                                disableGutters
                                sx={{
                                    display: "block",
                                    py: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 0.5,
                                    }}
                                >
                                    <ListItemText
                                        primary={category.category}
                                        secondary={`${category.totalSold} units sold`}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        ₹{category.totalRevenue.toLocaleString("en-IN")}
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        maxRevenue === 0
                                            ? 0
                                            : (category.totalRevenue /
                                                  maxRevenue) *
                                              100
                                    }
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}