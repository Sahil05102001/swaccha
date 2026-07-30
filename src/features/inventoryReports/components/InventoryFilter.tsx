import {
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";

import type {
    InventoryReportFilters,
} from "../services/inventoryReportService";

interface Props {
    value: InventoryReportFilters;
    categories: string[];
    onChange: (
        value: InventoryReportFilters
    ) => void;
}

export default function InventoryFilter({
    value,
    categories,
    onChange,
}: Props) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Search Products"
                            placeholder="Name, SKU or Category"
                            value={value.search ?? ""}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    search:
                                        event.target
                                            .value,
                                })
                            }
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 3,
                        }}
                    >
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            value={
                                value.category ?? ""
                            }
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    category:
                                        event.target
                                            .value,
                                })
                            }
                        >
                            <MenuItem value="">
                                All Categories
                            </MenuItem>

                            {categories.map(
                                (category) => (
                                    <MenuItem
                                        key={category}
                                        value={
                                            category
                                        }
                                    >
                                        {category}
                                    </MenuItem>
                                )
                            )}
                        </TextField>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 3,
                        }}
                    >
                        <TextField
                            select
                            fullWidth
                            label="Stock Status"
                            value={
                                value.stockStatus ??
                                ""
                            }
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    stockStatus:
                                        event.target
                                            .value,
                                })
                            }
                        >
                            <MenuItem value="">
                                All Status
                            </MenuItem>

                            <MenuItem value="In Stock">
                                In Stock
                            </MenuItem>

                            <MenuItem value="Low Stock">
                                Low Stock
                            </MenuItem>

                            <MenuItem value="Out Of Stock">
                                Out of Stock
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 2,
                        }}
                    >
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                height: "56px",
                            }}
                            onClick={() =>
                                onChange({})
                            }
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}