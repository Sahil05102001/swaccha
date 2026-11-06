import {
  lazy,
  Suspense,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import type { Address } from "../types/address";
import {
  DELIVERY_CITY,
  DELIVERY_RADIUS_KM,
  DELIVERY_STATE,
  isInsideDeliveryArea,
  type PinValue,
} from "../utils/deliveryArea";

// Leaflet is only downloaded when the customer opens the map.
const LocationPicker = lazy(() => import("./LocationPicker"));

interface AddressFormProps {
  initialValues?: Partial<Address>;
  onSubmit: (values: Omit<Address, "id" | "createdAt" | "updatedAt">) => void;
  loading?: boolean;
}

type FormData = {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type TextField_ = Exclude<keyof FormData, "isDefault">;
type Errors = Partial<Record<TextField_, string>>;

const COLORS = {
  blue: "#00D9FF",
  blueText: "#0891B2",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
  radio: "#B0B0B0",
  error: "#D32F2F",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: COLORS.white,
    "& fieldset": { borderColor: COLORS.border, transition: "none" },
    "&:hover fieldset": { borderColor: COLORS.muted },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue, borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: COLORS.muted, transition: "none" },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.text },
  "& .MuiInputLabel-root .MuiFormLabel-asterisk": { color: COLORS.text },
  "& .MuiInputBase-input": { color: COLORS.text },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: COLORS.muted,
  },
};

// Any-language letters, marks (for Devanagari etc.), spaces, . ' -
const NAME_PATTERN = /^\p{L}[\p{L}\p{M} .'-]*$/u;

// Keep digits only. A pasted "+91 98765 43210" (12 digits starting with 91)
// becomes the 10-digit number; anything longer is cut to 10.
function cleanPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

function validateField(field: TextField_, raw: string): string {
  const value = raw.trim();

  switch (field) {
    case "fullName":
      if (!value) return "Full name is required";
      if (value.length < 2) return "Enter at least 2 characters";
      if (!NAME_PATTERN.test(value)) return "Enter a valid name";
      return "";

    case "phoneNumber":
      if (!value) return "Phone number is required";
      if (!/^[6-9]\d{9}$/.test(value)) {
        return "Enter a valid 10-digit mobile number";
      }
      return "";

    case "addressLine1":
      if (!value) return "Address is required";
      if (value.length < 5) return "Enter a more complete address";
      return "";

    case "city":
      if (!value) return "City is required";
      return "";

    case "state":
      if (!value) return "State is required";
      return "";

    case "postalCode":
      if (!value) return "Postal code is required";
      if (!/^[1-9]\d{5}$/.test(value)) return "Enter a valid 6-digit pincode";
      return "";

    default:
      return "";
  }
}

const REQUIRED_FIELDS: TextField_[] = [
  "fullName",
  "phoneNumber",
  "addressLine1",
  "postalCode",
];

export default function AddressForm({
  initialValues,
  onSubmit,
  loading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: initialValues?.fullName ?? "",
    phoneNumber: cleanPhone(initialValues?.phoneNumber ?? ""),
    addressLine1: initialValues?.addressLine1 ?? "",
    addressLine2: initialValues?.addressLine2 ?? "",
    city: DELIVERY_CITY,
    state: DELIVERY_STATE,
    postalCode: initialValues?.postalCode ?? "",
    country: "India",
    isDefault: initialValues?.isDefault ?? false,
  });

  const [pin, setPin] = useState<PinValue | null>(
    typeof initialValues?.latitude === "number" &&
      typeof initialValues?.longitude === "number"
      ? {
        latitude: initialValues.latitude,
        longitude: initialValues.longitude,
        ...(typeof initialValues.locationAccuracy === "number"
          ? { locationAccuracy: initialValues.locationAccuracy }
          : {}),
      }
      : null
  );
  const [pinError, setPinError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

  const handleChange =
    (field: TextField_) => (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      if (field === "phoneNumber") value = cleanPhone(value);
      if (field === "postalCode") value = value.replace(/\D/g, "").slice(0, 6);

      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear the error while the user is fixing the field.
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleBlur = (field: TextField_) => () => {
    if (!REQUIRED_FIELDS.includes(field)) return;
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const nextErrors: Errors = {};
    for (const field of REQUIRED_FIELDS) {
      const message = validateField(field, formData[field]);
      if (message) nextErrors[field] = message;
    }

    setErrors(nextErrors);

    let nextPinError = "";
    if (!pin) {
      nextPinError = "Pin your delivery location on the map";
    } else if (!isInsideDeliveryArea(pin.latitude, pin.longitude)) {
      nextPinError = `This pin is outside our ${DELIVERY_RADIUS_KM} km delivery area`;
    }
    setPinError(nextPinError);

    if (Object.keys(nextErrors).length > 0 || nextPinError || !pin) return;

    onSubmit({
      ...formData,
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber,
      addressLine1: formData.addressLine1.trim(),
      addressLine2: formData.addressLine2.trim(),
      city: DELIVERY_CITY,
      state: DELIVERY_STATE,
      postalCode: formData.postalCode.trim(),
      latitude: pin.latitude,
      longitude: pin.longitude,
      // Left out when empty: Firestore rejects undefined values.
      ...(pin.locationAccuracy !== undefined
        ? { locationAccuracy: pin.locationAccuracy }
        : {}),
    });
  };

  return (
    <>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            required
            label="Full name"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName}
            fullWidth
            sx={fieldSx}
          />

          <TextField
            required
            label="Phone number"
            type="tel"
            autoComplete="tel-national"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={
              errors.phoneNumber || "We'll use this for delivery updates"
            }
            fullWidth
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              },
              // No maxLength: cleanPhone caps at 10 and handles pasted +91 numbers
              htmlInput: { inputMode: "numeric" },
            }}
          />

          <TextField
            required
            label="Address line 1"
            autoComplete="address-line1"
            placeholder="House no., building, street"
            value={formData.addressLine1}
            onChange={handleChange("addressLine1")}
            onBlur={handleBlur("addressLine1")}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
            fullWidth
            sx={fieldSx}
          />

          <TextField
            label="Address line 2 (optional)"
            autoComplete="address-line2"
            placeholder="Area, landmark"
            value={formData.addressLine2}
            onChange={handleChange("addressLine2")}
            fullWidth
            sx={fieldSx}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <TextField
              label="City"
              value={DELIVERY_CITY}
              fullWidth
              disabled
              sx={fieldSx}
            />

            <TextField
              label="State"
              value={DELIVERY_STATE}
              fullWidth
              disabled
              sx={fieldSx}
            />

            <TextField
              required
              label="Postal code"
              autoComplete="postal-code"
              value={formData.postalCode}
              onChange={handleChange("postalCode")}
              onBlur={handleBlur("postalCode")}
              error={!!errors.postalCode}
              helperText={errors.postalCode}
              fullWidth
              sx={fieldSx}
              slotProps={{
                // No maxLength: the handler strips non-digits and caps at 6
                htmlInput: { inputMode: "numeric" },
              }}
            />

            <TextField
              label="Country"
              value={formData.country}
              fullWidth
              disabled
              sx={fieldSx}
            />
          </Box>

          {/* Delivery pin (required) */}
          <Box>
            <Box
              sx={{
                p: 1.5,
                border: `1px solid ${pinError ? COLORS.error : COLORS.border}`,
                borderRadius: 2,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", minWidth: 0 }}
                >
                  <PlaceOutlinedIcon
                    sx={{
                      fontSize: 20,
                      color: pin ? COLORS.blueText : COLORS.muted,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: COLORS.text,
                      }}
                    >
                      {pin ? "Location pinned" : "Delivery location *"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.75rem", color: COLORS.muted }}
                    >
                      {pin
                        ? `${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}`
                        : "Helps our delivery partner find you"}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  type="button"
                  disableRipple
                  variant="outlined"
                  onClick={() => setPickerOpen(true)}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 999,
                    px: 2.5,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textTransform: "none",
                    color: COLORS.text,
                    borderColor: COLORS.border,
                    "&:hover": {
                      borderColor: COLORS.text,
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {pin ? "Change on map" : "Pin on map"}
                </Button>
              </Stack>
            </Box>

            {pinError && (
              <Typography
                sx={{ mt: 0.5, ml: 1.75, fontSize: "0.75rem", color: COLORS.error }}
              >
                {pinError}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }))
                }
                disableRipple
                sx={{
                  color: COLORS.radio,
                  "&.Mui-checked": { color: COLORS.blue },
                }}
              />
            }
            label="Set as my default address"
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                color: COLORS.text,
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            disableRipple
            disableElevation
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.4,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "none",
              transition: "none",
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
              "&.Mui-disabled": {
                bgcolor: COLORS.border,
                color: COLORS.muted,
              },
            }}
          >
            {loading ? "Saving..." : "Save address"}
          </Button>
        </Stack>
      </Box>

      {/* Outside the <form> so nothing in the map can submit it. */}
      {pickerOpen && (
        <Suspense fallback={null}>
          <LocationPicker
            initial={
              pin
                ? { latitude: pin.latitude, longitude: pin.longitude }
                : null
            }
            onClose={() => setPickerOpen(false)}
            onConfirm={(value) => {
              setPin(value);
              setPinError("");
              setPickerOpen(false);
            }}
          />
        </Suspense>
      )}
    </>
  );
}