import {
    Container,
} from "@mui/material";

import { Navigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@/features/auth/AuthContext";
import {
    sendVerificationEmail,
    updateDisplayName,
} from "@/features/auth/services/authService";

import {
    useAddresses,
} from "../hooks/useAddresses";
import ProfileInfoCard from "../components/ProfileInfoCard";
import AddressSection from "../components/AddressSection";
import AddressDialog from "../components/AddressDialog";
import type { Address } from "../types/address";
import DeleteAddressDialog from "../components/DeleteAddressDialog";

export default function ProfilePage() {
    const {
        user,
        loading,
        refreshUser,
    } = useAuth();

    const [name, setName] = useState(user?.displayName ?? "");
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [deleteAddress, setDeleteAddress] = useState<Address | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        data: addresses,
        isLoading,
    } = useAddresses();


    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleVerifyEmail = async () => {
        try {
            await sendVerificationEmail();
            alert("Verification email sent. Please check your inbox.");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateDisplayName(name);

            await refreshUser();

            alert("Profile updated successfully.");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleRefreshStatus = async () => {
        try {
            await refreshUser();
            alert("Verification status updated.");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <ProfileInfoCard
                user={user}
                name={name}
                setName={setName}
                onSaveProfile={handleSaveProfile}
                onVerifyEmail={handleVerifyEmail}
                onRefreshStatus={handleRefreshStatus}
            />

            <AddressSection
                addresses={addresses ?? []}
                isLoading={isLoading}
                onAddAddress={() => {
                    setSelectedAddress(null);
                    setAddressDialogOpen(true);
                }}
                onEditAddress={(address) => {
                    setSelectedAddress(address);
                    setAddressDialogOpen(true);
                }}
                onDeleteAddress={(address) => {
                    setDeleteAddress(address);
                    setDeleteDialogOpen(true);
                }}
            />

            <AddressDialog
                open={addressDialogOpen}
                address={selectedAddress}
                onClose={() => {
                    setAddressDialogOpen(false);
                    setSelectedAddress(null);
                }}
            />

            <DeleteAddressDialog
                open={deleteDialogOpen}
                address={deleteAddress}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeleteAddress(null);
                }}
            />
        </Container>
    );
}