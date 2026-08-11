import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function EmployeeOrders() {
  const myOrders = [
    { id: 1, order_number: "VOUCH-88A12B", gift_name: "Premium Noise-Canceling Headphones", date: "2026-08-07", amount: "$199.99", status: "PROCESSING", tracking_no: "DEL-102938", courier: "Delhivery" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_number", headerName: "Order Number", width: 150 },
    { field: "gift_name", headerName: "Claimed Reward Gift", flex: 1.2 },
    { field: "amount", headerName: "Value", width: 110 },
    { field: "date", headerName: "Claim Date", width: 130 },
    {
      field: "status",
      headerName: "Fulfillment Status",
      width: 140,
      renderCell: (params) => (
        <Chip icon={<LocalShippingIcon fontSize="small" />} label={params.value} color="info" size="small" sx={{ fontWeight: 600 }} />
      ),
    },
    { field: "courier", headerName: "Courier", width: 130 },
    { field: "tracking_no", headerName: "Tracking #", width: 140 },
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
        <DataGrid rows={myOrders} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
