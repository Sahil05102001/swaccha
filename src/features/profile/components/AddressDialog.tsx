import {
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import AddressForm from "./AddressForm";

import {
    useAddAddress,
    useUpdateAddress,
} from "../hooks/useAddresses";

import type { Address } from "../types/address";


interface AddressDialogProps {
    open: boolean;
    onClose: () => void;
    address?: Address | null;
}

export default function AddressDialog({
    open,
    onClose,
    address,
}: AddressDialogProps) {
    const isEditing = !!address;
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();



    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {isEditing ? "Edit Address" : "Add Address"}
            </DialogTitle>

            <DialogContent>
                <AddressForm
                    defaultValues={address ?? undefined}
                    onSubmit={(data) => {
                        if (isEditing && address) {
                            updateAddressMutation.mutate(
                                {
                                    id: address.id,
                                    data,
                                },
                                {
                                    onSuccess: () => {
                                        alert("Address updated successfully.");
                                        onClose();
                                    },
                                    onError: (error: any) => {
                                        alert(error.message);
                                    },
                                }
                            );
                        } else {
                            addAddressMutation.mutate(data, {
                                onSuccess: () => {
                                    alert("Address added successfully.");
                                    onClose();
                                },
                                onError: (error: any) => {
                                    alert(error.message);
                                },
                            });
                        }
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}