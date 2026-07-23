import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

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
  if (isLoading) {
    return (
      <Stack
        sx={{
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
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
          startIcon={<AddIcon />}
          onClick={onAddAddress}
        >
          Add Address
        </Button>
      </Stack>

      {addresses.length === 0 ? (
        <Typography color="text.secondary">
          You haven't added any addresses yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={onEditAddress}
              onDelete={() =>
                onDeleteAddress(address)
              }
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}