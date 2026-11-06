import { useCallback, useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Alert,
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import {
  DELIVERY_RADIUS_KM,
  distanceKm,
  isInsideDeliveryArea,
  SHOP_LOCATION,
  type PinValue,
} from "../utils/deliveryArea";

interface LocationPickerProps {
  initial: { latitude: number; longitude: number } | null;
  onConfirm: (value: PinValue) => void;
  onClose: () => void;
}

const COLORS = {
  blue: "#00D9FF",
  white: "#FFFFFF",
  black: "#000000",
  text: "#212121",
  muted: "#757575",
  border: "#E0E0E0",
};

export default function LocationPicker({
  initial,
  onConfirm,
  onClose,
}: LocationPickerProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const gpsPointRef = useRef<{ lat: number; lng: number } | null>(null);

  // The pin is always the centre of the map.
  const [center, setCenter] = useState(initial ?? SHOP_LOCATION);
  // Confirm stays disabled until the customer has actually chosen a spot.
  const [touched, setTouched] = useState(Boolean(initial));
  const [accuracy, setAccuracy] = useState<number | undefined>();
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const locate = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!window.isSecureContext) {
      setNotice(
        "Location only works on a secure (https) connection. Move the map to your doorstep instead."
      );
      return;
    }

    if (!("geolocation" in navigator)) {
      setNotice(
        "This device doesn't support location. Move the map to your doorstep instead."
      );
      return;
    }

    setLocating(true);
    setNotice(null);

    const onOk = (position: GeolocationPosition) => {
      const m = mapRef.current;
      if (!m) return;

      const { latitude, longitude, accuracy: acc } = position.coords;

      circleRef.current?.remove();
      circleRef.current = null;
      gpsPointRef.current = { lat: latitude, lng: longitude };

      m.setView([latitude, longitude], acc > 500 ? 15 : 17, {
        animate: false,
      });

      if (acc < 5000) {
        circleRef.current = L.circle([latitude, longitude], {
          radius: acc,
          color: COLORS.blue,
          weight: 1,
          fillOpacity: 0.1,
          interactive: false,
        }).addTo(m);
      }

      setCenter({ latitude, longitude });
      setAccuracy(acc);
      setTouched(true);
      setLocating(false);
    };

    const fail = (code: number) => {
      setLocating(false);

      if (code === 1) {
        setNotice(
          "Location permission is blocked. Tap the lock icon next to the web address, allow Location, and try again. You can also move the map to your doorstep."
        );
      } else if (code === 2) {
        setNotice(
          "Couldn't find your location. Turn on your phone's Location (GPS) and try again, or move the map to your doorstep."
        );
      } else {
        setNotice(
          "Finding your location took too long. Try again, or move the map to your doorstep."
        );
      }
    };

    // First try precise GPS; if that fails for a reason other than a denied
    // permission, retry once with the faster network-based location.
    const request = (high: boolean) =>
      navigator.geolocation.getCurrentPosition(
        onOk,
        (err) => {
          if (high && err.code !== err.PERMISSION_DENIED) {
            request(false);
            return;
          }
          fail(err.code);
        },
        {
          enableHighAccuracy: high,
          timeout: high ? 8000 : 10000,
          maximumAge: high ? 0 : 60000,
        }
      );

    request(true);
  }, []);

  useEffect(() => {
    if (!el) return;

    const start = initial ?? SHOP_LOCATION;

    const map = L.map(el, {
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
    }).setView([start.latitude, start.longitude], initial ? 17 : 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Outline of the delivery area.
    L.circle([SHOP_LOCATION.latitude, SHOP_LOCATION.longitude], {
      radius: DELIVERY_RADIUS_KM * 1000,
      color: COLORS.muted,
      weight: 1,
      dashArray: "6 6",
      fill: false,
      interactive: false,
    }).addTo(map);

    const syncCenter = () => {
      const c = map.getCenter();
      setCenter({ latitude: c.lat, longitude: c.lng });

      // Moving away from the GPS spot means the pin is now placed by hand.
      const g = gpsPointRef.current;
      if (g && distanceKm(g.lat, g.lng, c.lat, c.lng) * 1000 > 25) {
        circleRef.current?.remove();
        circleRef.current = null;
        gpsPointRef.current = null;
        setAccuracy(undefined);
      }
    };

    map.on("moveend", syncCenter);
    map.on("dragend", () => setTouched(true));
    map.on("click", (e: L.LeafletMouseEvent) => {
      map.panTo(e.latlng, { animate: false });
      setTouched(true);
    });

    mapRef.current = map;

    if (!initial) locate();

    // The dialog may still be sizing itself on first paint.
    const timer = window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      circleRef.current = null;
      gpsPointRef.current = null;
    };
    // Runs once per map element; `initial` is only the starting value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el]);

  const inside = isInsideDeliveryArea(center.latitude, center.longitude);

  const handleConfirm = () => {
    if (!touched || !inside) return;

    onConfirm({
      latitude: Number(center.latitude.toFixed(6)),
      longitude: Number(center.longitude.toFixed(6)),
      ...(accuracy !== undefined
        ? { locationAccuracy: Math.round(accuracy) }
        : {}),
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            borderRadius: fullScreen ? 0 : 3,
            boxShadow: "none",
            border: fullScreen ? "none" : `1px solid ${COLORS.border}`,
            backgroundImage: "none",
          },
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: "1.05rem", color: COLORS.text }}
          >
            Pin delivery location
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: COLORS.muted }}>
            Move the map so the pin sits on your exact doorstep.
          </Typography>
        </Box>

        <IconButton
          aria-label="Close"
          onClick={onClose}
          edge="end"
          size="small"
          disableRipple
          sx={{ color: COLORS.muted }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Map with a fixed pin in the centre */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: { xs: 320, sm: 400 },
        }}
      >
        <Box
          ref={setEl}
          sx={{ position: "absolute", inset: 0, zIndex: 0 }}
        />

        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 24,
            height: 24,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            bgcolor: COLORS.black,
            border: `3px solid ${COLORS.blue}`,
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </Box>

      {/* Footer */}
      <Stack spacing={1.5} sx={{ p: { xs: 2, sm: 2.5 } }}>
        {notice && (
          <Alert
            severity="info"
            variant="outlined"
            sx={{ borderRadius: 2, fontSize: "0.8rem" }}
          >
            {notice}
          </Alert>
        )}

        {!inside && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ borderRadius: 2, fontSize: "0.8rem" }}
          >
            This spot is outside our {DELIVERY_RADIUS_KM} km delivery area
            around Nagpur. Move the map until the pin is inside the dashed
            circle.
          </Alert>
        )}

        {inside && accuracy !== undefined && accuracy > 100 && (
          <Alert
            severity="info"
            variant="outlined"
            sx={{ borderRadius: 2, fontSize: "0.8rem" }}
          >
            Your device's location is only accurate to about{" "}
            {Math.round(accuracy)} m. Move the map to your doorstep.
          </Alert>
        )}

        <Typography sx={{ fontSize: "0.75rem", color: COLORS.muted }}>
          {touched
            ? "Pin the address you're ordering to, not where you are right now."
            : "Move the map or use your current location to choose a spot."}
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            type="button"
            fullWidth
            disableRipple
            variant="outlined"
            startIcon={<MyLocationIcon />}
            onClick={locate}
            disabled={locating}
            sx={{
              py: 1.2,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",
              color: COLORS.text,
              borderColor: COLORS.border,
              boxShadow: "none",
              "&:hover": { borderColor: COLORS.text, bgcolor: "transparent" },
            }}
          >
            {locating ? "Finding you..." : "Use my current location"}
          </Button>

          <Button
            type="button"
            fullWidth
            disableRipple
            disableElevation
            variant="contained"
            disabled={!touched || !inside}
            onClick={handleConfirm}
            sx={{
              py: 1.2,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              transition: "none",
              bgcolor: COLORS.black,
              color: COLORS.white,
              "&:hover": { bgcolor: COLORS.text, boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: COLORS.border, color: COLORS.muted },
            }}
          >
            Confirm location
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}