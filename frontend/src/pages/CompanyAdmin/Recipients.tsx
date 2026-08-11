import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function Recipients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const recipientData = [
    { id: 1, employee: "Sundar Pichai", email: "sundar@google.com", campaign: "Google Annual Founder Rewards", gift: "Noise-Canceling Headphones", selection_status: "SELECTED", address_status: "CONFIRMED", order_status: "SHIPPED" },
    { id: 2, employee: "Marissa Mayer", email: "marissa@google.com", campaign: "Google Annual Founder Rewards", gift: "Smart Health Fitness Watch", selection_status: "SELECTED", address_status: "CONFIRMED", order_status: "PROCESSING" },
    { id: 3, employee: "Elon Musk", email: "elon@tesla.com", campaign: "Tesla Innovation Excellence Awards", gift: "Smart Health Fitness Watch", selection_status: "SELECTED", address_status: "CONFIRMED", order_status: "APPROVED" },
    { id: 4, employee: "Gwynne Shotwell", email: "gwynne@tesla.com", campaign: "Tesla Innovation Excellence Awards", gift: "Pending Choice", selection_status: "PENDING", address_status: "PENDING", order_status: "PENDING" },
    { id: 5, employee: "Sarah Jenkins", email: "sarah.jenkins@acmetech.com", campaign: "Diwali Employee Celebration", gift: "Leather Journal Set", selection_status: "SELECTED", address_status: "CONFIRMED", order_status: "DELIVERED" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "employee",
      headerName: "Employee Recipient",
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={1.5} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#6366F1", fontSize: 13, fontWeight: 700 }}>
            {(params.value || "E").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{params.value}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>{params.row.email}</Typography>
          </Box>
        </Stack>
      ),
    },
    { field: "campaign", headerName: "Campaign", flex: 1.2 },
    { field: "gift", headerName: "Selected Gift", flex: 1.2 },
    {
      field: "selection_status",
      headerName: "Gift Choice",
      width: 140,
      renderCell: (params) => (
        <Chip
          icon={params.value === "SELECTED" ? <CheckCircleIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
          label={params.value}
          color={params.value === "SELECTED" ? "success" : "warning"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "address_status",
      headerName: "Address Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "CONFIRMED" ? "primary" : "default"}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "order_status",
      headerName: "Delivery Order",
      width: 140,
      renderCell: (params) => (
        <Chip
          icon={<LocalShippingIcon fontSize="small" />}
          label={params.value}
          color={params.value === "DELIVERED" ? "success" : params.value === "SHIPPED" ? "info" : "secondary"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const filteredRecipients = recipientData.filter((r) => {
    const matchesSearch = r.employee.toLowerCase().includes(searchTerm.toLowerCase()) || r.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.selection_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Campaign Recipients & Fulfillment Status
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Track gift selections, address confirmations, and shipping dispatch status for employees.
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search by employee or campaign..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 300 }}
        />

        <TextField
          select
          size="small"
          label="Gift Choice Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="SELECTED">Selected</MenuItem>
          <MenuItem value="PENDING">Pending Choice</MenuItem>
        </TextField>
      </Paper>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={filteredRecipients} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
