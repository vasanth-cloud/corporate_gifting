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
import { useAuth } from "../../context/AuthContext";

export default function Deliveries() {
  const { user } = useAuth();
  const isVendor = user?.role === "VENDOR";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [deliveries, setDeliveries] = useState<any[]>([
    { id: 1, order_number: "ORD-GOOG-881", recipient: "Sundar Pichai", address: "1600 Amphitheatre Pkwy, CA", carrier: "FedEx Express", tracking_no: "FX-998822", status: "SHIPPED", est_delivery: "2026-08-15" },
    { id: 2, order_number: "ORD-TSLA-992", recipient: "Elon Musk", address: "1 Tesla Road, Austin, TX", carrier: "DHL Worldwide", tracking_no: "DHL-441100", status: "PROCESSING", est_delivery: "2026-08-18" },
    { id: 3, order_number: "ORD-INFY-103", recipient: "Salil Parekh", address: "Electronics City, Bangalore", carrier: "BlueDart Express", tracking_no: "BD-774411", status: "DELIVERED", est_delivery: "2026-08-07" },
    { id: 4, order_number: "VOUCH-88A12B", recipient: "Sarah Jenkins", address: "Bangalore, India", carrier: "Delhivery Express", tracking_no: "DEL-102938", status: "PACKED", est_delivery: "2026-08-14" },
  ]);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedDel, setSelectedDel] = useState<any | null>(null);
  const [updateForm, setUpdateForm] = useState({ carrier: "", tracking_no: "", status: "SHIPPED" });

  const handleEditClick = (row: any) => {
    setSelectedDel(row);
    setUpdateForm({ carrier: row.carrier, tracking_no: row.tracking_no, status: row.status });
    setOpenUpdate(true);
  };

  const handleSaveUpdate = () => {
    if (!selectedDel) return;
    setDeliveries(deliveries.map(d => d.id === selectedDel.id ? { ...d, ...updateForm } : d));
    setOpenUpdate(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_number", headerName: "Order #", width: 140 },
    { field: "recipient", headerName: "Recipient Name", flex: 1 },
    { field: "address", headerName: "Delivery Address", flex: 1.3 },
    { field: "carrier", headerName: "Courier Partner", width: 140 },
    { field: "tracking_no", headerName: "Tracking #", width: 140 },
    {
      field: "status",
      headerName: "Fulfillment Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          icon={<LocalShippingIcon fontSize="small" />}
          label={params.value}
          color={params.value === "DELIVERED" ? "success" : params.value === "SHIPPED" ? "info" : params.value === "PACKED" ? "warning" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    { field: "est_delivery", headerName: "Est. Delivery Date", width: 140 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(params.row)}>
          Update
        </Button>
      ),
    },
  ];

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch = d.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || d.recipient.toLowerCase().includes(searchTerm.toLowerCase());
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
          placeholder="Search order # or recipient..."
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
          <MenuItem value="PROCESSING">Processing</MenuItem>
          <MenuItem value="PACKED">Packed</MenuItem>
          <MenuItem value="SHIPPED">Shipped</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
        </TextField>
      </Paper>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={filteredDeliveries} columns={columns} sx={{ border: "none" }} />
      </Paper>

      {/* Update Shipment Modal */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Update Shipment Details</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Courier Partner"
            value={updateForm.carrier}
            onChange={(e) => setUpdateForm({ ...updateForm, carrier: e.target.value })}
            fullWidth
          />
          <TextField
            label="Tracking Number"
            value={updateForm.tracking_no}
            onChange={(e) => setUpdateForm({ ...updateForm, tracking_no: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Fulfillment Status"
            value={updateForm.status}
            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
            fullWidth
          >
            <MenuItem value="PROCESSING">PROCESSING</MenuItem>
            <MenuItem value="PACKED">PACKED</MenuItem>
            <MenuItem value="SHIPPED">SHIPPED</MenuItem>
            <MenuItem value="DELIVERED">DELIVERED</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUpdate} sx={{ bgcolor: "#6366F1" }}>
            Save Tracking Info
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
