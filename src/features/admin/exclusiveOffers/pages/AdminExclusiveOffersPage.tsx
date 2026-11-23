import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";
import { useSnackbar } from "@/contexts/SnackbarContext";

import {
  useExclusiveOffers,
  useSaveExclusiveOffers,
} from "../hooks/useExclusiveOffers";

import {
  DEFAULT_EXCLUSIVE_OFFERS,
  type ExclusiveOffersSettings,
} from "../types/exclusiveOffers";

const MAX_OFFERS = 8;

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export default function AdminExclusiveOffersPage() {
  const { showSnackbar } = useSnackbar();

  const { data, isLoading } = useExclusiveOffers();
  const save = useSaveExclusiveOffers();

  const [form, setForm] = useState<ExclusiveOffersSettings>(
    DEFAULT_EXCLUSIVE_OFFERS,
  );

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const updateOffer = (
    id: string,
    field: "title" | "description",
    value: string,
  ) =>
    setForm((current) => ({
      ...current,
      offers: current.offers.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer,
      ),
    }));

  const addOffer = () =>
    setForm((current) => ({
      ...current,
      offers: [
        ...current.offers,
        { id: newId(), title: "", description: "" },
      ],
    }));

  const removeOffer = (id: string) =>
    setForm((current) => ({
      ...current,
      offers: current.offers.filter((offer) => offer.id !== id),
    }));

  const handleSave = async () => {
    const offers = form.offers
      .map((offer) => ({
        ...offer,
        title: offer.title.trim(),
        description: offer.description.trim(),
      }))
      .filter((offer) => offer.title || offer.description);

    if (offers.some((offer) => !offer.title)) {
      showSnackbar("Every offer needs a title.", "error");
      return;
    }

    if (form.isEnabled && offers.length === 0) {
      showSnackbar(
        "Add at least one offer, or switch the section off.",
        "warning",
      );
      return;
    }

    try {
      await save.mutateAsync({
        isEnabled: form.isEnabled,
        heading: form.heading.trim() || "Exclusive Offers",
        offers,
      });
      showSnackbar("Exclusive offers saved.", "success");
    } catch {
      showSnackbar("Could not save. Please try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Exclusive Offers"
          subtitle="Offers shown on every product details page."
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
        title="Exclusive Offers"
        subtitle="Offers you write here are shown on every product details page. Switch the section off to hide it."
      />

      <Stack spacing={3}>
        <SectionCard title="Section settings">
          <Stack spacing={2.5}>
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <Switch
                checked={form.isEnabled}
                onChange={(event) =>
                  setForm({ ...form, isEnabled: event.target.checked })
                }
              />
              <Typography>
                Show this section on product details pages
              </Typography>
            </Stack>

            <TextField
              label="Section heading"
              value={form.heading}
              onChange={(event) =>
                setForm({ ...form, heading: event.target.value })
              }
              slotProps={{ htmlInput: { maxLength: 50 } }}
              fullWidth
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="Offers"
          subtitle={`${form.offers.length} of ${MAX_OFFERS} offers added.`}
          action={
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addOffer}
              disabled={form.offers.length >= MAX_OFFERS}
            >
              Add offer
            </Button>
          }
        >
          {form.offers.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 3, textAlign: "center" }}
            >
              No offers yet. Click "Add offer" to write one.
            </Typography>
          ) : (
            <Stack spacing={2.5}>
              {form.offers.map((offer, index) => (
                <Stack
                  key={offer.id}
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                    <TextField
                      label={`Offer ${index + 1} title`}
                      placeholder="e.g. Free delivery on bulk orders"
                      value={offer.title}
                      onChange={(event) =>
                        updateOffer(offer.id, "title", event.target.value)
                      }
                      slotProps={{ htmlInput: { maxLength: 70 } }}
                      fullWidth
                    />

                    <TextField
                      label="Details (optional)"
                      placeholder="e.g. On orders above ₹2,000 within Nagpur"
                      value={offer.description}
                      onChange={(event) =>
                        updateOffer(
                          offer.id,
                          "description",
                          event.target.value,
                        )
                      }
                      slotProps={{ htmlInput: { maxLength: 160 } }}
                      fullWidth
                    />
                  </Stack>

                  <IconButton
                    aria-label={`Remove offer ${index + 1}`}
                    color="error"
                    onClick={() => removeOffer(offer.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </SectionCard>

        <Box>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={save.isPending}
          >
            {save.isPending ? "Saving..." : "Save changes"}
          </Button>
        </Box>
      </Stack>
    </PageContainer>
  );
}