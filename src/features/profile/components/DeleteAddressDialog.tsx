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

    const handleDelete = () => {
        if (!address) return;

        deleteAddressMutation.mutate(address.id, {
            onSuccess: () => {
                alert("Address deleted successfully.");
                onClose();
            },
            onError: (error: any) => {
                alert(error.message);
            },
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={deleteAddressMutation.isPending}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}