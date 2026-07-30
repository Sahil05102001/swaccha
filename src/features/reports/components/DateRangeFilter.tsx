import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";

export interface DateRangeFilterValue {
    startDate?: Date;
    endDate?: Date;
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
}

interface Props {
    value: DateRangeFilterValue;
    onChange: (value: DateRangeFilterValue) => void;
}

export default function DateRangeFilter({
    value,
    onChange,
}: Props) {
    function setToday() {
        const today = new Date();

        const startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const endDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
            999
        );

        onChange({
            ...value,
            startDate,
            endDate,
        });
    }

    function setLast7Days() {
        const endDate = new Date();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        onChange({
            ...value,
            startDate,
            endDate,
        });
    }

    function setLast30Days() {
        const endDate = new Date();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);

        onChange({
            ...value,
            startDate,
            endDate,
        });
    }

    function setThisMonth() {
        const today = new Date();

        const startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        onChange({
            ...value,
            startDate,
            endDate: new Date(),
        });
    }

    function formatDate(date?: Date) {
        if (!date) {
            return "";
        }

        return date.toISOString().split("T")[0];
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <Grid size={{ xs: 12 }}>
                        <ButtonGroup
                            fullWidth
                            variant="outlined"
                        >
                            <Button onClick={setToday}>
                                Today
                            </Button>

                            <Button onClick={setLast7Days}>
                                Last 7 Days
                            </Button>

                            <Button onClick={setLast30Days}>
                                Last 30 Days
                            </Button>

                            <Button onClick={setThisMonth}>
                                This Month
                            </Button>

                            <Button
                                onClick={() =>
                                    onChange({})
                                }
                            >
                                All Time
                            </Button>
                        </ButtonGroup>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Search Orders"
                            placeholder="Order ID, Customer or Email"
                            value={value.search ?? ""}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    search:
                                        event.target.value,
                                })
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Order Status"
                            value={
                                value.orderStatus ?? ""
                            }
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    orderStatus:
                                        event.target.value,
                                })
                            }
                        >
                            <MenuItem value="">
                                All
                            </MenuItem>
                            <MenuItem value="pending">
                                Pending
                            </MenuItem>
                            <MenuItem value="confirmed">
                                Confirmed
                            </MenuItem>
                            <MenuItem value="shipped">
                                Shipped
                            </MenuItem>
                            <MenuItem value="delivered">
                                Delivered
                            </MenuItem>
                            <MenuItem value="cancelled">
                                Cancelled
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Payment Status"
                            value={
                                value.paymentStatus ??
                                ""
                            }
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    paymentStatus:
                                        event.target.value,
                                })
                            }
                        >
                            <MenuItem value="">
                                All
                            </MenuItem>
                            <MenuItem value="pending">
                                Pending
                            </MenuItem>
                            <MenuItem value="paid">
                                Paid
                            </MenuItem>
                            <MenuItem value="failed">
                                Failed
                            </MenuItem>
                            <MenuItem value="refunded">
                                Refunded
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            value={formatDate(
                                value.startDate
                            )}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    startDate: event.target
                                        .value
                                        ? new Date(
                                              event.target.value
                                          )
                                        : undefined,
                                })
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            value={formatDate(
                                value.endDate
                            )}
                            onChange={(event) =>
                                onChange({
                                    ...value,
                                    endDate: event.target
                                        .value
                                        ? new Date(
                                              event.target.value
                                          )
                                        : undefined,
                                })
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}