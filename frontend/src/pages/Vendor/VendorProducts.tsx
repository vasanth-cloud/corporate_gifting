import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function VendorProducts() {
  const products = [
    { id: 1, name: "Premium Noise-Canceling Headphones", sku: "GIFT-TECH-01", brand: "AudioPro", price: "$199.99", stock: 100, status: "ACTIVE" },
    { id: 2, name: "Smart Health Fitness Watch", sku: "GIFT-WATCH-02", brand: "FitPulse", price: "$149.50", stock: 80, status: "ACTIVE" },
    { id: 3, name: "Luxury Italian Leather Journal Set", sku: "GIFT-LUX-03", brand: "Artisan", price: "$49.99", stock: 150, status: "ACTIVE" },
    { id: 4, name: "Gourmet Coffee & Tumbler Set", sku: "GIFT-FOOD-04", brand: "RoastCo", price: "$39.99", stock: 200, status: "ACTIVE" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Supplied Product Name", flex: 1.2 },
    { field: "sku", headerName: "SKU Code", width: 150 },
    { field: "brand", headerName: "Brand", width: 130 },
    { field: "price", headerName: "Unit Price", width: 120 },
    { field: "stock", headerName: "In Stock", width: 110 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: () => <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 600 }} />,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Supplied Gift Products Catalog
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Gift items supplied by your vendor account for corporate gifting campaigns.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={products} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
