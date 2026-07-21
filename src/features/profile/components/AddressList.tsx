import { Stack } from "@mui/material";

import AddressCard from "./AddressCard";

import {
    useAddresses,
    useDeleteAddress,
    useSetDefaultAddress,
} from "../hooks/useAddresses";

import type { Address } from "../types/address";

interface AddressListProps {
    onEdit: (address: Address) => void;
}

export default function AddressList({
    onEdit,
}: AddressListProps) {
    const { data: addresses = [] } = useAddresses();

    const deleteAddress = useDeleteAddress();
    const setDefaultAddress = useSetDefaultAddress();

    return (
        <Stack spacing={2}>
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={onEdit}
                    onDelete={(id) => {
                        const confirmed = window.confirm(
                            "Are you sure you want to delete this address?"
                        );

                        if (!confirmed) return;

                        deleteAddress.mutate(id);
                    }}
                    onSetDefault={(id) => {
                        setDefaultAddress.mutate(id);
                    }}
                />
            ))}
        </Stack>
    );
}