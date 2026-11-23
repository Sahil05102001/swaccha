import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Button,
  Chip,
  InputAdornment,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionCard from "@/components/common/SectionCard";

import { useCustomersPage } from "../hooks/useCustomers";

const PAGE_SIZE = 10;

export default function AdminCustomersPage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // Wait for the admin to stop typing before asking Firestore.
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const query = useCustomersPage(search);
  const customers = query.data?.pages.flatMap((p) => p.customers) ?? [];

  const lastPage = Math.max(0, Math.ceil(customers.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, lastPage);

  const visible = customers.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  // Back to the first page when the search changes.
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Keep one page loaded ahead, so "next" always has rows to show.
  useEffect(() => {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      (currentPage + 2) * PAGE_SIZE > customers.length
    ) {
      void query.fetchNextPage();
    }
  }, [
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
    currentPage,
    customers.length,
  ]);

  return (
    <PageContainer>
      <PageHeader
        title="Customers"
        subtitle="Newest customers first. Search by the start of an email address."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void query.refetch()}
            disabled={query.isRefetching}
          >
            {query.isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      <SectionCard>
        <Stack spacing={2}>
          <TextField
            size="small"
            placeholder="Search by email, e.g. rahul@"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {query.isError ? (
            <Alert severity="error">
              Failed to load customers.{" "}
              {(query.error as Error | null)?.message ?? ""}
            </Alert>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Role
                    </TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                      Joined
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {query.isLoading ? (
                    [0, 1, 2, 3, 4].map((row) => (
                      <TableRow key={row}>
                        {[0, 1, 2, 3, 4, 5].map((cell) => (
                          <TableCell
                            key={cell}
                            sx={
                              cell === 2
                                ? { display: { xs: "none", sm: "table-cell" } }
                                : cell === 4
                                  ? { display: { xs: "none", md: "table-cell" } }
                                  : undefined
                            }
                          >
                            <Skeleton />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          {search
                            ? "No customers match this search."
                            : "No customers yet."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visible.map((customer) => (
                      <TableRow key={customer.uid}>
                        <TableCell>{customer.name || "-"}</TableCell>

                        <TableCell sx={{ wordBreak: "break-all", minWidth: 160 }}>
                          {customer.email}
                        </TableCell>

                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={customer.role}
                            color={customer.role === "admin" ? "secondary" : "default"}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={customer.isActive ? "Active" : "Inactive"}
                            color={customer.isActive ? "success" : "error"}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            display: { xs: "none", md: "table-cell" },
                          }}
                        >
                          {customer.createdAt
                            ? customer.createdAt.toDate().toLocaleDateString("en-IN")
                            : "-"}
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/admin/customers/${customer.uid}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {customers.length > PAGE_SIZE && (
            <TablePagination
              component="div"
              count={customers.length}
              page={currentPage}
              onPageChange={(_, next) => setPage(next)}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} of ${count}${query.hasNextPage ? "+" : ""}`
              }
            />
          )}
        </Stack>
      </SectionCard>
    </PageContainer>
  );
}