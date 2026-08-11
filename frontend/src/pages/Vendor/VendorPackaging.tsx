import React from "react";
import { Box, Typography, Paper, Chip, Button } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function VendorPackaging() {
  const packagingOrders = [
    { id: 1, order_no: "VOUCH-88A12B", company: "Acme Tech Corp", logo: "Acme Logo Engraved", message: "Congratulations on your performance!", packaging_type: "Custom Ribbon Box", status: "PACKED" },
    { id: 2, order_no: "ORD-GOOG-881", company: "Google LLC", logo: "Google Founder Badge", message: "Thank you for leading innovation!", packaging_type: "Executive Hard Box", status: "READY FOR DISPATCH" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "order_no", headerName: "Order #", width: 140 },
    { field: "company", headerName: "Client Company", flex: 1 },
    { field: "logo", headerName: "Custom Branding Logo", flex: 1 },
    { field: "message", headerName: "Personalized Message Note", flex: 1.2 },
    { field: "packaging_type", headerName: "Packaging Type", flex: 1 },
    {
      field: "status",
      headerName: "Packaging Status",
      width: 150,
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
        <DataGrid rows={packagingOrders} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
