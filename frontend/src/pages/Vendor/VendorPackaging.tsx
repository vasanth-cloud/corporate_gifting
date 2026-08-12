import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function VendorPackaging() {
  const [packagingOrders, setPackagingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackaging();
  }, []);

  const loadPackaging = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setPackagingOrders(res.data || []);
    } catch (err) {
      setPackagingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_number", headerName: "Order #", width: 150 },
    { field: "company_id", headerName: "Company ID", width: 120 },
    { field: "order_date", headerName: "Order Date", width: 130 },
    {
      field: "status",
      headerName: "Packaging Status",
      width: 160,
      renderCell: (params) => (
        <Chip icon={<CardGiftcardIcon fontSize="small" />} label={params.value} color="warning" size="small" sx={{ fontWeight: 600 }} />
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Custom Branding & Packaging Station
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Inspect corporate logo engravings, custom gift wrapping, and personalized note inserts.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={packagingOrders} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
