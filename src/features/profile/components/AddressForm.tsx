import { useState } from "react";

import {
  Box,
  Stack,
  TextField,
} from "@mui/material";

import AppButton from "@/components/ui/AppButton";

import type { Address } from "../types/address";

interface AddressFormProps {
  initialValues?: Partial<Address>;
  onSubmit: (
    values: Omit<
      Address,
      "id" | "createdAt" | "updatedAt"
    >
  ) => void;
  loading?: boolean;
}

export default function AddressForm({
  initialValues,
  onSubmit,
  loading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialValues?.fullName ?? "",
    phoneNumber: initialValues?.phoneNumber ?? "",
    addressLine1: initialValues?.addressLine1 ?? "",
    addressLine2: initialValues?.addressLine2 ?? "",
    city: initialValues?.city ?? "",
    state: initialValues?.state ?? "",
    postalCode: initialValues?.postalCode ?? "",
    country: initialValues?.country ?? "India",
    isDefault: initialValues?.isDefault ?? false,
  });

  const handleChange =
    (field: keyof typeof formData) =>
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Box component="form">
      <Stack spacing={2}>
        <TextField
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange("fullName")}
          fullWidth
        />

        <TextField
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange("phoneNumber")}
          fullWidth
        />

        <TextField
          label="Address Line 1"
          value={formData.addressLine1}
          onChange={handleChange("addressLine1")}
          fullWidth
        />

        <TextField
          label="Address Line 2"
          value={formData.addressLine2}
          onChange={handleChange("addressLine2")}
          fullWidth
        />

        <TextField
          label="City"
          value={formData.city}
          onChange={handleChange("city")}
          fullWidth
        />

        <TextField
          label="State"
          value={formData.state}
          onChange={handleChange("state")}
          fullWidth
        />

        <TextField
          label="Postal Code"
          value={formData.postalCode}
          onChange={handleChange("postalCode")}
          fullWidth
        />

        <TextField
          label="Country"
          value={formData.country}
          onChange={handleChange("country")}
          fullWidth
        />

        <AppButton
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </AppButton>
      </Stack>
    </Box>
  );
}