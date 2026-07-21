import { Radio, Stack } from "@mui/material";

import AddressCard from "./AddressCard";

import { useAddresses } from "../hooks/useAddresses";

interface CheckoutAddressListProps {
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void;
}

export default function CheckoutAddressList({
  selectedAddressId,
  onSelect,
}: CheckoutAddressListProps) {
  const { data: addresses = [] } = useAddresses();

  return (
    <Stack spacing={2}>
      {addresses.map((address) => (
        <Stack
          key={address.id}
          direction="row"
          spacing={2}
          sx={{
            alignItems: "flex-start",
          }}
        >
          <Radio
            checked={selectedAddressId === address.id}
            onChange={() => onSelect(address.id)}
          />

          <Stack sx={{ flex: 1 }}>
            <AddressCard address={address} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}