import { useState } from "react";

import { Button, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import AddCategoryDialog from "../components/AddCategoryDialog";
import CategoryTable from "../components/CategoryTable";

export default function CategoriesPage() {
    const [addOpen, setAddOpen] =
        useState(false);

    return (
        <PageContainer>
            <PageHeader
                title="Categories"
                subtitle="Manage product categories"
            />

            <SectionCard>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "flex-end",
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            setAddOpen(true)
                        }
                    >
                        Add Category
                    </Button>
                </Stack>

                <CategoryTable />
            </SectionCard>

            <AddCategoryDialog
                open={addOpen}
                onClose={() =>
                    setAddOpen(false)
                }
            />
        </PageContainer>
    );
}