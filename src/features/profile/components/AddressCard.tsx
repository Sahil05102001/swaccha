import {
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
    onDelete?: (id: string) => void;
    onEdit?: (address: Address) => void;
    onSetDefault?: (id: string) => void;
}

export default function AddressCard({
    address,
    onDelete,
    onEdit,
    onSetDefault,
}: AddressCardProps) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {address.fullName}
                        </Typography>

                        {address.isDefault && (
                            <Chip
                                label="Default"
                                color="primary"
                                size="small"
                            />
                        )}
                    </Stack>

                    <Typography>{address.phoneNumber}</Typography>

                    <Typography color="text.secondary">
                        {address.addressLine1}
                    </Typography>

                    {address.addressLine2 && (
                        <Typography color="text.secondary">
                            {address.addressLine2}
                        </Typography>
                    )}

                    <Typography color="text.secondary">
                        {address.city}, {address.state}
                    </Typography>

                    <Typography color="text.secondary">
                        {address.postalCode}, {address.country}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        {!address.isDefault && (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => onSetDefault?.(address.id)}
                            >
                                Set as Default
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onEdit?.(address)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => onDelete?.(address.id)}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}