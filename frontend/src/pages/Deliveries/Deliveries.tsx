import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function Deliveries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedDel, setSelectedDel] = useState<any | null>(null);
  const [updateForm, setUpdateForm] = useState({ status: "SHIPPED" });

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setDeliveries(res.data || []);
    } catch (err) {
      console.error("Failed to load delivery orders:", err);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (row: any) => {
    setSelectedDel(row);
    setUpdateForm({ status: row.status });
    setOpenUpdate(true);
  };

  const handleSaveUpdate = async () => {
    if (!selectedDel) return;
    try {
      await api.put(`/orders/${selectedDel.id}/status`, { status: updateForm.status });
      setOpenUpdate(false);
      loadDeliveries();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update delivery status");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_number", headerName: "Order #", width: 150 },
    { field: "company_id", headerName: "Company ID", width: 120 },
    { field: "employee_id", headerName: "Employee ID", width: 120 },
    {
      field: "total_amount",
      headerName: "Order Total",
      width: 120,
      valueFormatter: (val) => `$${Number(val).toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Fulfillment Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          icon={<LocalShippingIcon fontSize="small" />}
          label={params.value}
          color={params.value === "DELIVERED" ? "success" : params.value === "SHIPPED" ? "info" : params.value === "PROCESSING" ? "warning" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    { field: "order_date", headerName: "Order Date", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(params.row)}>
          Update
        </Button>
      ),
    },
  ];

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch = (d.order_number || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Shipment & Delivery Tracking Portal
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Real-time courier updates, tracking numbers, and delivery confirmation logs.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search order number..."
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
          label="Fulfillment Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="PROCESSING">PROCESSING</MenuItem>
          <MenuItem value="APPROVED">APPROVED</MenuItem>
          <MenuItem value="SHIPPED">SHIPPED</MenuItem>
          <MenuItem value="DELIVERED">DELIVERED</MenuItem>
        </TextField>
      </Paper>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={filteredDeliveries} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>

      {/* Update Shipment Modal */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Update Shipment Details</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Fulfillment Status"
            value={updateForm.status}
            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
            fullWidth
          >
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="PROCESSING">PROCESSING</MenuItem>
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="SHIPPED">SHIPPED</MenuItem>
            <MenuItem value="DELIVERED">DELIVERED</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUpdate} sx={{ bgcolor: "#6366F1" }}>
            Save Status Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
