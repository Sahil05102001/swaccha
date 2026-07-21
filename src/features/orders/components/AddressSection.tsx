import Typography from "@mui/material/Typography";

import CheckoutAddressList from "@/features/profile/components/CheckoutAddressList";

interface AddressSectionProps {
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
}

export default function AddressSection({
  selectedAddressId,
  onSelectAddress,
}: AddressSectionProps) {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Delivery Address
      </Typography>

      <CheckoutAddressList
        selectedAddressId={selectedAddressId}
        onSelect={onSelectAddress}
      />
    </>
  );
}