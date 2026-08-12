import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function EmployeeOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_number", headerName: "Order Number", width: 150 },
    { field: "total_amount", headerName: "Total Amount", width: 130, valueFormatter: (val) => `$${Number(val).toFixed(2)}` },
    { field: "order_date", headerName: "Order Date", width: 130 },
    {
      field: "status",
      headerName: "Fulfillment Status",
      width: 150,
      renderCell: (params) => (
        <Chip icon={<LocalShippingIcon fontSize="small" />} label={params.value} color="info" size="small" sx={{ fontWeight: 600 }} />
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          My Claimed Reward Orders
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Track delivery status, courier partners, and tracking numbers for your reward gifts.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={orders} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
