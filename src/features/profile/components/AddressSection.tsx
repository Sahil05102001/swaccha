import { Box, Button, Stack, Typography } from "@mui/material";

import AddressCard from "./AddressCard";

import type { Address } from "../types/address";

interface AddressSectionProps {
    addresses: Address[];
    isLoading: boolean;
    onAddAddress: () => void;
    onEditAddress: (address: Address) => void;
    onDeleteAddress: (address: Address) => void;
}

export default function AddressSection({
    addresses,
    isLoading,
    onAddAddress,
    onEditAddress,
    onDeleteAddress,
}: AddressSectionProps) {
    return (
        <Box sx={{ mt: 5 }}>
            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    My Addresses
                </Typography>

                <Button
                    variant="contained"
                    onClick={onAddAddress}
                >
                    + Add Address
                </Button>
            </Stack>

            {isLoading && (
                <Typography>
                    Loading addresses...
                </Typography>
            )}

            {!isLoading && addresses.length === 0 && (
                <Typography color="text.secondary">
                    You haven't added any addresses yet.
                </Typography>
            )}

            <Stack spacing={2}>
                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={onEditAddress}
                        onDelete={onDeleteAddress}
                    />
                ))}
            </Stack>
        </Box>
    );
}