import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import type { Address } from "../types/address";

interface AddressCardProps {
    address: Address;
    onEdit?: (address: Address) => void;
    onDelete?: (address: Address) => void;
}

export default function AddressCard({
    address,
    onEdit,
    onDelete,
}: AddressCardProps) {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Chip
                            label={address.label}
                            color="primary"
                            size="small"
                        />

                        {address.isDefault && (
                            <Chip
                                label="Default"
                                color="success"
                                size="small"
                            />
                        )}
                    </Stack>

                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600 }}
                        >
                            {address.fullName}
                        </Typography>

                        <Typography color="text.secondary">
                            {address.phone}
                        </Typography>
                    </Box>

                    <Typography>
                        {address.addressLine1}
                    </Typography>

                    {address.addressLine2 && (
                        <Typography>
                            {address.addressLine2}
                        </Typography>
                    )}

                    {address.landmark && (
                        <Typography>
                            Landmark: {address.landmark}
                        </Typography>
                    )}

                    <Typography>
                        {address.city}, {address.state}
                    </Typography>

                    <Typography>
                        {address.pincode}
                    </Typography>

                    <Typography>
                        {address.country}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={() => onEdit?.(address)}
                        >
                            Edit
                        </Button>

                        <Button
                            color="error"
                            onClick={() => onDelete?.(address)}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}