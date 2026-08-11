import React, { useState } from "react";
import { Box, Typography, Paper, Chip, Button, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function VendorOrders() {
  const [orders, setOrders] = useState([
    { id: 1, order_no: "ORD-GOOG-881", company: "Google LLC", product: "Noise-Canceling Headphones", qty: 1, recipient: "Sundar Pichai", address: "Mountain View, CA", status: "PROCESSING" },
    { id: 2, order_no: "ORD-TSLA-992", company: "Tesla Motors Inc", product: "Smart Fitness Watch", qty: 1, recipient: "Elon Musk", address: "Austin, TX", status: "PROCESSING" },
    { id: 3, order_no: "VOUCH-88A12B", company: "Acme Technology Corp", product: "Noise-Canceling Headphones", qty: 1, recipient: "Sarah Jenkins", address: "Bangalore, India", status: "PACKED" },
  ]);

  const handleAccept = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "PACKED" } : o));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_no", headerName: "Order #", width: 140 },
    { field: "company", headerName: "Client Company", flex: 1 },
    { field: "product", headerName: "Product Item", flex: 1.2 },
    { field: "recipient", headerName: "Recipient Name", flex: 1 },
    { field: "address", headerName: "Shipping Address", flex: 1.2 },
    {
      field: "status",
      headerName: "Fulfillment Status",
      width: 140,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === "PACKED" ? "warning" : "info"} size="small" sx={{ fontWeight: 600 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        params.row.status === "PROCESSING" ? (
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
        <DataGrid rows={orders} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
