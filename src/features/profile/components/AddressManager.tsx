import { useState } from "react";

import {
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import AppButton from "@/components/ui/AppButton";
import AddressDialog from "./AddressDialog";
import AddressList from "./AddressList";
import { useAddAddress } from "../hooks/useAddresses";
import { useUpdateAddress } from "../hooks/useAddresses";
import type { Address } from "../types/address";

export default function AddressManager() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const addAddress = useAddAddress();
    const [editingAddress, setEditingAddress] =
        useState<Address | null>(null);
    const updateAddress = useUpdateAddress();

    return (
        <>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            My Addresses
                        </Typography>

                        <AppButton
                            onClick={() => {
                                setEditingAddress(null);
                                setDialogOpen(true);
                            }}
                        >
                            Add New Address
                        </AppButton>
                    </Stack>
                </CardContent>
            </Card>

            <AddressList
                onEdit={(address) => {
                    setEditingAddress(address);
                    setDialogOpen(true);
                }}
            />

            <AddressDialog
                open={dialogOpen}
                title={
                    editingAddress
                        ? "Edit Address"
                        : "Add Address"
                }
                initialValues={editingAddress ?? undefined}
                loading={addAddress.isPending}
                onClose={() => setDialogOpen(false)}
                onSubmit={(values) => {
                    if (editingAddress) {
                        updateAddress.mutate(
                            {
                                id: editingAddress.id,
                                address: values,
                            },
                            {
                                onSuccess: () => {
                                    setDialogOpen(false);
                                    setEditingAddress(null);
                                },
                            }
                        );
                    } else {
                        addAddress.mutate(values, {
                            onSuccess: () => {
                                setDialogOpen(false);
                            },
                        });
                    }
                }}
            />
        </>
    );
}