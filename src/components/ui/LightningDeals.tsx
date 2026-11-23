import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ProductShelf from "@/components/ui/ProductShelf";
import { useProducts } from "@/features/products/hooks/useProducts";
import {
  useLightningDeals,
  useLightningDealsSettings,
} from "@/features/admin/lightningDeals/hooks/useLightningDeals";


const pad = (value: number) => String(value).padStart(2, "0");


function Countdown({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState(() => Date.now());


  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);


  const total = Math.max(0, Math.floor((endsAt - now) / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;


  const parts = [
    ...(days > 0 ? [{ value: String(days), label: "d" }] : []),
    { value: pad(hours), label: "h" },
    { value: pad(minutes), label: "m" },
    { value: pad(seconds), label: "s" },
  ];


  return (
    <Box
      role="timer"
      aria-label="Time left for lightning deals"
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <FlashOnIcon sx={{ color: "#B45309", fontSize: 22 }} />


      <Typography
        component="span"
        sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#111111" }}
      >
        Ends in
      </Typography>


      {parts.map((part) => (
        <Box
          key={part.label}
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 0.25,
            px: 1,
            py: 0.5,
            borderRadius: "6px",
            backgroundColor: "#111111",
            color: "#00DDEB",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1 }}
          >
            {part.value}
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: "0.65rem", lineHeight: 1 }}
          >
            {part.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}


export default function LightningDeals() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: deals = [], isLoading: dealsLoading } = useLightningDeals();
  const { data: settings, isLoading: settingsLoading } =
    useLightningDealsSettings();


  const endsAt = settings?.endsAt ? new Date(settings.endsAt).getTime() : 0;


  // Re-check once a second so the section disappears the moment time is up.
  const [, force] = useState(0);
  useEffect(() => {
    if (!endsAt) return;
    const id = window.setInterval(() => force((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);


  const loading = productsLoading || dealsLoading || settingsLoading;


  if (!loading && settings && !settings.isEnabled) return null;
  if (!loading && endsAt && endsAt <= Date.now()) return null;


  const dealProducts = deals
    .filter((deal) => deal.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((deal) => products.find((product) => product.id === deal.productId))
    .filter(
      (product): product is NonNullable<typeof product> =>
        Boolean(product && product.isActive),
    );


  return (
    <ProductShelf
      title={settings?.title || "Lightning Deals on Combos"}
      subtitle={settings?.subtitle}
      headerExtra={endsAt ? <Countdown endsAt={endsAt} /> : undefined}
      products={dealProducts}
      badge="deal"
      isLoading={loading}
      reserveHeader
      background="#FFFFFF"
    />
  );
}