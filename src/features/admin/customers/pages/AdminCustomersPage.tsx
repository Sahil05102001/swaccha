import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

import { useCustomers } from "../hooks/useCustomers";

export default function AdminCustomersPage() {
  const navigate = useNavigate();

  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useCustomers();

  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.email
          .toLowerCase()
          .includes(query)
      );
    });
  }, [customers, search]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 240,
    },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "admin"
              ? "secondary"
              : "primary"
          }
          size="small"
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={
            params.value
              ? "Active"
              : "Inactive"
          }
          color={
            params.value
              ? "success"
              : "error"
          }
          size="small"
        />
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 170,
      valueGetter: (_, row) => row.phone || "-",
    },
    {
      field: "createdAt",
      headerName: "Joined",
      width: 170,
      valueGetter: (_, row) =>
        row.createdAt
          ? row.createdAt.toDate().toLocaleDateString()
          : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          onClick={() =>
            navigate(`/admin/customers/${params.row.uid}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Customers
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          label="Search customers"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </Paper>

      <Paper
        sx={{
          height: 650,
        }}
      >
        <DataGrid
          rows={filteredCustomers}
          columns={columns}
          getRowId={(row) => row.uid}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}