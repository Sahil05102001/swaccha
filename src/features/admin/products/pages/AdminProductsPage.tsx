import { useState } from "react";

import { Button, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import AddProductDialog from "../components/AddProductDialog";
import ProductTable from "../components/ProductTable";
import { useProducts } from "../hooks/useProducts";

export default function AdminProductsPage() {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Same query as the table, so this does not cause an extra read.
  const { refetch, isFetching } = useProducts();

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        subtitle="Manage your store products."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add product
            </Button>
          </Stack>
        }
      />

      <SectionCard>
        <ProductTable />
      </SectionCard>

      <AddProductDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </PageContainer>
  );
}