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
import { useSnackbar } from "../../../contexts/SnackbarContext";

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

    const { showSnackbar } = useSnackbar();

    const isSubmitting =
        addAddressMutation.isPending ||
        updateAddressMutation.isPending;

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (isSubmitting) return;

                if (reason === "backdropClick") return;

                onClose();
            }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {isEditing ? "Edit Address" : "Add Address"}
            </DialogTitle>

            <DialogContent>
                <AddressForm
                    defaultValues={address ?? undefined}
                    isSubmitting={isSubmitting}
                    isEditing={isEditing}
                    onSubmit={(data) => {
                        if (isEditing && address) {
                            updateAddressMutation.mutate(
                                {
                                    id: address.id,
                                    data,
                                },
                                {
                                    onSuccess: () => {
                                        showSnackbar(
                                            "Address updated successfully.",
                                            "success"
                                        );
                                        onClose();
                                    },
                                    onError: (error: any) => {
                                        showSnackbar(
                                            error.message,
                                            "error"
                                        );
                                    },
                                }
                            );
                        } else {
                            addAddressMutation.mutate(data, {
                                onSuccess: () => {
                                    showSnackbar(
                                        "Address added successfully.",
                                        "success"
                                    );
                                    onClose();
                                },
                                onError: (error: any) => {
                                    showSnackbar(
                                        error.message,
                                        "error"
                                    );
                                },
                            });
                        }
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}