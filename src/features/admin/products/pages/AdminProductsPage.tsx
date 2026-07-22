import { useState } from "react";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import ProductToolbar from "../components/ProductToolbar";
import ProductTable from "../components/ProductTable";
import AddProductDialog from "../components/AddProductDialog";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [status, setStatus] = useState("");

  const [openAddDialog, setOpenAddDialog] =
    useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        subtitle="Manage your store products."
      />

      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        onAddProduct={() => setOpenAddDialog(true)}
      />

      <ProductTable />

      <AddProductDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </PageContainer>
  );
}