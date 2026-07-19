import {
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

interface EmptyAddressStateProps {
    onAddAddress: () => void;
}

export default function EmptyAddressState({
    onAddAddress,
}: EmptyAddressStateProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                py: 6,
                px: 3,
            }}
        >
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <LocationOnOutlinedIcon
                    sx={{
                        fontSize: 64,
                        color: "text.secondary",
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    No addresses yet
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 400,
                    }}
                >
                    Add your first delivery address to make checkout faster
                    and easier.
                </Typography>

                <Button
                    variant="contained"
                    onClick={onAddAddress}
                >
                    Add Your First Address
                </Button>
            </Stack>
        </Paper>
    );
}