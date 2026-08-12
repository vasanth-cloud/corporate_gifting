import { useEffect, useState } from "react";
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
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function Addresses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [addressData, setAddressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      // Fetch orders/vouchers or employee shipping address records
      const res = await api.get("/orders").catch(() => ({ data: [] }));
      const orderList = Array.isArray(res.data) ? res.data : [];
      
      const list = orderList.map((order: any) => ({
        id: order.id,
        employee_name: order.employee_name || "Employee",
        email: order.employee_email || "N/A",
        address_line1: order.shipping_address || "Address Pending Confirmation",
        city: order.city || "—",
        state: order.state || "—",
        pincode: order.pincode || "—",
        status: order.shipping_address ? "CONFIRMED" : "PENDING",
      }));

      setAddressData(list);
    } catch (err) {
      console.error("Failed to load addresses:", err);
      setAddressData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
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
    {
      field: "address_line1",
      headerName: "Delivery Address",
      flex: 2,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <HomeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 13 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    { field: "city", headerName: "City", flex: 0.8 },
    { field: "state", headerName: "State", flex: 0.8 },
    { field: "pincode", headerName: "Pincode", flex: 0.8 },
    {
      field: "status",
      headerName: "Confirmation Status",
      width: 170,
      renderCell: (params) => (
        <Chip
          icon={params.value === "CONFIRMED" ? <CheckCircleIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
          label={params.value === "CONFIRMED" ? "CONFIRMED" : "PENDING ADDRESS"}
          color={params.value === "CONFIRMED" ? "success" : "warning"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const filteredAddresses = addressData.filter((a) => {
    const matchesSearch = (a.employee_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Employee Shipping Addresses
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          View and track recipient home shipping address confirmations for gift deliveries.
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by employee name..."
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
          label="Address Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="CONFIRMED">Confirmed</MenuItem>
          <MenuItem value="PENDING">Pending Address</MenuItem>
        </TextField>
      </Paper>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={filteredAddresses} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
