import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useProducts } from "@/features/admin/products/hooks/useProducts";
import AdminSelect from "@/features/admin/components/AdminSelect";
import {
  useCreateLightningDeal,
  useDeleteLightningDeal,
  useLightningDeals,
  useLightningDealsSettings,
  useSaveLightningDealsSettings,
  useUpdateLightningDeal,
} from "../hooks/useLightningDeals";
import {
  DEFAULT_LIGHTNING_SETTINGS,
  type LightningDealsSettings,
} from "../types/lightningDeal";


const MAX_DEALS = 5;


const pad = (n: number) => String(n).padStart(2, "0");


function toLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}


export default function AdminLightningDealsPage() {
  const { showSnackbar } = useSnackbar();


  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: deals = [], isLoading: dealsLoading } = useLightningDeals();
  const { data: savedSettings, isLoading: settingsLoading } =
    useLightningDealsSettings();


  const createMutation = useCreateLightningDeal();
  const updateMutation = useUpdateLightningDeal();
  const deleteMutation = useDeleteLightningDeal();
  const saveSettings = useSaveLightningDealsSettings();


  const [settings, setSettings] = useState<LightningDealsSettings>(
    DEFAULT_LIGHTNING_SETTINGS,
  );
  const [endInput, setEndInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(1);


  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
      setEndInput(toLocalInput(savedSettings.endsAt));
    }
  }, [savedSettings]);


  const sortedDeals = useMemo(
    () => [...deals].sort((a, b) => a.sortOrder - b.sortOrder),
    [deals],
  );


  const activeCount = sortedDeals.filter((deal) => deal.isActive).length;
  const usedIds = new Set(deals.map((deal) => deal.productId));


  const availableProducts = products.filter(
    (product) => product.isActive && !usedIds.has(product.id),
  );


  const getProduct = (id: string) => products.find((p) => p.id === id);


  const handleSaveSettings = async () => {
    let endsAt = "";


    if (endInput) {
      const date = new Date(endInput);


      if (Number.isNaN(date.getTime())) {
        showSnackbar("Please enter a valid end date and time.", "error");
        return;
      }


      if (date.getTime() <= Date.now()) {
        showSnackbar("The end time must be in the future.", "warning");
        return;
      }


      endsAt = date.toISOString();
    }


    if (!settings.title.trim()) {
      showSnackbar("Please enter a section title.", "error");
      return;
    }


    try {
      await saveSettings.mutateAsync({
        ...settings,
        title: settings.title.trim(),
        subtitle: settings.subtitle.trim(),
        endsAt,
      });
      showSnackbar("Lightning Deals settings saved.", "success");
    } catch {
      showSnackbar("Could not save settings. Please try again.", "error");
    }
  };


  const handleAdd = async () => {
    if (!selectedProduct) return;


    try {
      await createMutation.mutateAsync({
        productId: selectedProduct,
        sortOrder: selectedOrder,
        isActive: true,
      });
      setSelectedProduct("");
      setSelectedOrder(1);
      showSnackbar("Deal added.", "success");
    } catch {
      showSnackbar("Could not add the deal.", "error");
    }
  };


  const handleToggle = async (id: string, isActive: boolean) => {
    const item = deals.find((deal) => deal.id === id);
    if (!item) return;


    if (isActive && activeCount >= MAX_DEALS) {
      showSnackbar(`Only ${MAX_DEALS} deals can be active at once.`, "warning");
      return;
    }


    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          productId: item.productId,
          sortOrder: item.sortOrder,
          isActive,
        },
      });
    } catch {
      showSnackbar("Could not update the deal.", "error");
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showSnackbar("Deal removed.", "success");
    } catch {
      showSnackbar("Could not remove the deal.", "error");
    }
  };


  if (productsLoading || dealsLoading || settingsLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Lightning Deals"
          subtitle="Combo offers shown on the homepage."
        />
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }


  return (
    <PageContainer>
      <PageHeader
        title="Lightning Deals"
        subtitle="Choose the combo products shown in the Lightning Deals section, and set when the offer ends."
      />


      <Stack spacing={3}>
        {/* Section settings */}
        <SectionCard
          title="Section settings"
          subtitle="The section is hidden automatically when it is switched off, has no deals, or the end time has passed."
        >
          <Stack spacing={2.5}>
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <Switch
                checked={settings.isEnabled}
                onChange={(event) =>
                  setSettings({ ...settings, isEnabled: event.target.checked })
                }
              />
              <Typography>Show this section on the homepage</Typography>
            </Stack>


            <TextField
              label="Section title"
              value={settings.title}
              onChange={(event) =>
                setSettings({ ...settings, title: event.target.value })
              }
              slotProps={{ htmlInput: { maxLength: 60 } }}
              fullWidth
            />


            <TextField
              label="Subtitle (optional)"
              value={settings.subtitle}
              onChange={(event) =>
                setSettings({ ...settings, subtitle: event.target.value })
              }
              slotProps={{ htmlInput: { maxLength: 120 } }}
              fullWidth
            />


            <TextField
              label="Offer ends at (optional)"
              type="datetime-local"
              value={endInput}
              onChange={(event) => setEndInput(event.target.value)}
              helperText="Shows a countdown. Leave empty to show the deals with no timer."
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />


            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={saveSettings.isPending}
              >
                {saveSettings.isPending ? "Saving..." : "Save settings"}
              </Button>


              {endInput && (
                <Button variant="outlined" onClick={() => setEndInput("")}>
                  Clear end time
                </Button>
              )}
            </Stack>
          </Stack>
        </SectionCard>


        {/* Add deal */}
        <SectionCard
          title="Add a deal"
          subtitle={`${activeCount} of ${MAX_DEALS} active deals in use.`}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "stretch", sm: "center" } }}
          >
            <AdminSelect
              fullWidth
              label="Product"
              value={selectedProduct}
              onChange={(event) => setSelectedProduct(event.target.value)}
            >
              <MenuItem value="">Select product</MenuItem>


              {availableProducts.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </AdminSelect>


            <AdminSelect
              label="Position"
              value={selectedOrder}
              onChange={(event) =>
                setSelectedOrder(Number(event.target.value))
              }
              sx={{ minWidth: 130 }}
            >
              {[1, 2, 3, 4, 5].map((position) => (
                <MenuItem key={position} value={position}>
                  {position}
                </MenuItem>
              ))}
            </AdminSelect>


            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={
                !selectedProduct ||
                createMutation.isPending ||
                activeCount >= MAX_DEALS
              }
              sx={{ minWidth: 120, height: 56 }}
            >
              {createMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </Stack>


          {activeCount >= MAX_DEALS && (
            <Typography
              sx={{ mt: 2, color: "text.secondary", fontSize: "0.9rem" }}
            >
              You already have {MAX_DEALS} active deals. Remove or switch one
              off before adding another.
            </Typography>
          )}
        </SectionCard>


        {/* Current deals */}
        <SectionCard title="Current deals">
          {sortedDeals.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 3, textAlign: "center" }}
            >
              No deals added yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {sortedDeals.map((deal) => {
                const product = getProduct(deal.productId);


                return (
                  <Stack
                    key={deal.id}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      alignItems: { xs: "stretch", sm: "center" },
                      pb: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {deal.sortOrder}
                    </Box>


                    <Box
                      component="img"
                      src={product?.images?.[0] || "/placeholder-product.png"}
                      alt={product?.name ?? "Product"}
                      loading="lazy"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        objectFit: "cover",
                        bgcolor: "#f5f5f5",
                      }}
                    />


                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {product?.name ?? "Product no longer exists"}
                      </Typography>
                      {product && (
                        <Typography color="text.secondary">
                          ₹{product.price.toLocaleString("en-IN")}
                        </Typography>
                      )}
                      {product && !product.isActive && (
                        <Typography color="warning.main" variant="body2">
                          This product is inactive and is hidden from the
                          homepage.
                        </Typography>
                      )}
                    </Box>


                    <Stack direction="row" sx={{ alignItems: "center" }}>
                      <Typography variant="body2">Active</Typography>
                      <Switch
                        checked={deal.isActive}
                        onChange={(event) =>
                          handleToggle(deal.id, event.target.checked)
                        }
                      />
                    </Stack>


                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(deal.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Remove
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </SectionCard>
      </Stack>
    </PageContainer>
  );
}