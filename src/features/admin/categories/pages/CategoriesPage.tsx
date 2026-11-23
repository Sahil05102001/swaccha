import { useState } from "react";

import { Button, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import AddCategoryDialog from "../components/AddCategoryDialog";
import CategoryTable from "../components/CategoryTable";
import { useCategories } from "../hooks/useCategories";

export default function CategoriesPage() {
  const [addOpen, setAddOpen] = useState(false);

  // Same query as the table, so this does not cause an extra read.
  const { refetch, isFetching } = useCategories();

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        subtitle="Manage product categories"
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
              onClick={() => setAddOpen(true)}
            >
              Add category
            </Button>
          </Stack>
        }
      />

      <SectionCard>
        <CategoryTable />
      </SectionCard>

      <AddCategoryDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </PageContainer>
  );
}