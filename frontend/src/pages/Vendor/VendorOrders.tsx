import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip, Button, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendorOrders();
  }, []);

  const loadVendorOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load vendor orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await api.put(`/orders/${id}/status`, { status: "PROCESSING" });
      loadVendorOrders();
    } catch (err: any) {
      alert("Failed to accept order");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_number", headerName: "Order #", width: 150 },
    { field: "company_id", headerName: "Company ID", width: 120 },
    { field: "employee_id", headerName: "Employee ID", width: 120 },
    { field: "total_amount", headerName: "Total Value", width: 120, valueFormatter: (val) => `$${Number(val).toFixed(2)}` },
    {
      field: "status",
      headerName: "Fulfillment Status",
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === "APPROVED" || params.value === "SHIPPED" ? "success" : "warning"} size="small" sx={{ fontWeight: 600 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        params.row.status === "PENDING" ? (
          <Button size="small" variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleAccept(params.row.id)}>
            Accept Order
          </Button>
        ) : (
          <Chip label="Accepted" color="success" variant="outlined" size="small" />
        )
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Vendor Assigned Orders Queue
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Accept corporate gift orders, prepare packaging, and queue items for shipping dispatch.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={orders} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
