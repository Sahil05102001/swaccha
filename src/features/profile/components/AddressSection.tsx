import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import AddressCard from "./AddressCard";

import type { Address } from "../types/address";

interface AddressSectionProps {
  addresses: Address[];
  isLoading: boolean;
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (address: Address) => void;
  onSetDefaultAddress: (id: string) => void;
}

// How many addresses are visible before "Show all".
const VISIBLE_COUNT_DESKTOP = 2;
const VISIBLE_COUNT_MOBILE = 1;

const COLORS = {
  blue: "#00D9FF",
  black: "#000000",
  white: "#FFFFFF",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

export default function AddressSection({
  addresses,
  isLoading,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: AddressSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const previousCount = useRef<number | null>(null);

  // Phones (below 600px) show one address first, larger screens show two.
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const visibleCount = isMobile ? VISIBLE_COUNT_MOBILE : VISIBLE_COUNT_DESKTOP;

  // Default address first, the rest keep their order (newest first).
  const sortedAddresses = useMemo(
    () =>
      [...addresses].sort(
        (a, b) => Number(b.isDefault) - Number(a.isDefault)
      ),
    [addresses]
  );

  // When a new address is added, expand the list so it is visible.
  useEffect(() => {
    if (isLoading) return;

    if (
      previousCount.current !== null &&
      addresses.length > previousCount.current
    ) {
      setExpanded(true);
    }

    previousCount.current = addresses.length;
  }, [addresses.length, isLoading]);

  if (isLoading) {
    return (
      <Stack sx={{ alignItems: "center", py: 4 }}>
        <CircularProgress size={28} sx={{ color: COLORS.blue }} />
      </Stack>
    );
  }

  const hiddenCount = Math.max(0, sortedAddresses.length - visibleCount);
  const visibleAddresses = expanded
    ? sortedAddresses
    : sortedAddresses.slice(0, visibleCount);

  return (
    <Stack component="section" spacing={{ xs: 2, sm: 2.5 }}>
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.05rem", sm: "1.25rem" },
            letterSpacing: "-0.01em",
            color: COLORS.text,
          }}
        >
          My Addresses
          {addresses.length > 0 && (
            <Typography
              component="span"
              sx={{
                ml: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                color: COLORS.muted,
              }}
            >
              ({addresses.length})
            </Typography>
          )}
        </Typography>

        <Button
          variant="contained"
          disableRipple
          disableElevation
          startIcon={<AddIcon />}
          onClick={onAddAddress}
          sx={{
            flexShrink: 0,
            px: { xs: 2, sm: 3 },
            py: 1.2,
            borderRadius: 999,
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "none",
            transition: "none",
            bgcolor: COLORS.black,
            color: COLORS.white,
            "& .MuiButton-startIcon": { color: COLORS.blue },
            "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
            "&:focus-visible": {
              outline: `2px solid ${COLORS.blue}`,
              outlineOffset: 2,
            },
          }}
        >
          Add Address
        </Button>
      </Stack>

      {/* List or empty state */}
      {addresses.length === 0 ? (
        <Box
          sx={{
            py: 4,
            px: 2,
            textAlign: "center",
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: 600, fontSize: "0.95rem", color: COLORS.text }}
          >
            No saved addresses yet
          </Typography>
          <Typography
            sx={{ mt: 0.5, fontSize: "0.85rem", color: COLORS.muted }}
          >
            Add an address to speed up checkout.
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
              // Cards in the same row get the same height.
              "& > *": { minWidth: 0 },
              "& .MuiCard-root": { height: "100%" },
            }}
          >
            {visibleAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={onEditAddress}
                onDelete={() => onDeleteAddress(address)}
                onSetDefault={onSetDefaultAddress}
              />
            ))}
          </Box>

          {hiddenCount > 0 && (
            <Button
              fullWidth
              disableRipple
              variant="outlined"
              aria-expanded={expanded}
              onClick={() => setExpanded((current) => !current)}
              endIcon={
                expanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />
              }
              sx={{
                py: 1,
                borderRadius: 999,
                fontWeight: 600,
                textTransform: "none",
                color: COLORS.text,
                borderColor: COLORS.border,
                transition: "none",
                "&:hover": {
                  borderColor: COLORS.text,
                  bgcolor: COLORS.white,
                },
                "&:focus-visible": {
                  outline: `2px solid ${COLORS.blue}`,
                  outlineOffset: 2,
                },
              }}
            >
              {expanded
                ? "Show less"
                : `Show all ${sortedAddresses.length} addresses`}
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}