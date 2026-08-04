import {
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import type { BusinessHour } from "../types/contact";

interface BusinessHoursEditorProps {
    businessHours: BusinessHour[];
    onChange: (businessHours: BusinessHour[]) => void;
}

export default function BusinessHoursEditor({
    businessHours,
    onChange,
}: BusinessHoursEditorProps) {
    function updateHour(
        index: number,
        changes: Partial<BusinessHour>,
    ) {
        const updatedHours = businessHours.map(
            (hour, currentIndex) =>
                currentIndex === index
                    ? {
                        ...hour,
                        ...changes,
                    }
                    : hour,
        );

        onChange(updatedHours);
    }

    return (
        <>
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                }}
            >
                Business Hours
            </Typography>

            <Grid
                container
                spacing={2}
            >
                {businessHours.map((hour, index) => (
                    <Grid
                        key={hour.id}
                        size={{ xs: 12 }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                            }}
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    alignItems: "center",
                                }}
                            >
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        {hour.day}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 6, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        type="time"
                                        label="Opening"
                                        value={hour.openingTime}
                                        disabled={hour.isClosed}
                                        onChange={(event) =>
                                            updateHour(index, {
                                                openingTime: event.target.value,
                                            })
                                        }
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 6, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        type="time"
                                        label="Closing"
                                        value={hour.closingTime}
                                        disabled={hour.isClosed}
                                        onChange={(event) =>
                                            updateHour(index, {
                                                closingTime: event.target.value,
                                            })
                                        }
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={hour.isClosed}
                                                onChange={(event) =>
                                                    updateHour(index, {
                                                        isClosed:
                                                            event.target.checked,
                                                    })
                                                }
                                            />
                                        }
                                        label="Closed"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}