import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addressSchema,
  type AddressFormData,
} from "../schemas/addressSchema";

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
}

export default function AddressForm({
  onSubmit,
}: AddressFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "Home",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="label"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Address Type"
              fullWidth
              error={!!errors.label}
              helperText={errors.label?.message}
            >
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name"
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile Number"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="addressLine1"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address Line 1"
              fullWidth
              error={!!errors.addressLine1}
              helperText={errors.addressLine1?.message}
            />
          )}
        />

        <Controller
          name="addressLine2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address Line 2 (Optional)"
              fullWidth
            />
          )}
        />

        <Controller
          name="landmark"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Landmark (Optional)"
              fullWidth
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="City"
              fullWidth
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          )}
        />

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="State"
              fullWidth
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          )}
        />

        <Controller
          name="pincode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Pincode"
              fullWidth
              error={!!errors.pincode}
              helperText={errors.pincode?.message}
            />
          )}
        />

        <Button
          variant="contained"
          type="submit"
          size="large"
        >
          Save Address
        </Button>
      </Stack>
    </form>
  );
}