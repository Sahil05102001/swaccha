import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import { useDeleteAddress } from "../hooks/useAddresses";
import type { Address } from "../types/address";
import { useSnackbar } from "../../../contexts/SnackbarContext";

interface DeleteAddressDialogProps {
    open: boolean;
    address: Address | null;
    onClose: () => void;
}

export default function DeleteAddressDialog({
    open,
    address,
    onClose,
}: DeleteAddressDialogProps) {
    const deleteAddressMutation = useDeleteAddress();
    const { showSnackbar } = useSnackbar();

    const handleDelete = () => {
        if (!address) return;

        deleteAddressMutation.mutate(address.id, {
            onSuccess: () => {
                showSnackbar("Address deleted successfully.", "success");
                onClose();
            },
            onError: (error: any) => {
                showSnackbar(error.message, "error");
            },
        });
    };

    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (deleteAddressMutation.isPending) return;

                if (reason === "backdropClick") return;

                onClose();
            }}
        >
            <DialogTitle>
                Delete Address
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this address?
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={deleteAddressMutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={deleteAddressMutation.isPending}
                >
                    {deleteAddressMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}