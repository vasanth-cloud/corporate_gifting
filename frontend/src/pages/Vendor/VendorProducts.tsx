import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function VendorProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gifts");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Supplied Product Name", flex: 1.2 },
    { field: "sku", headerName: "SKU Code", width: 150 },
    { field: "brand", headerName: "Brand", width: 130 },
    { field: "price", headerName: "Unit Price", width: 120, valueFormatter: (val) => `$${Number(val).toFixed(2)}` },
    { field: "stock", headerName: "In Stock", width: 110 },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value ? "ACTIVE" : "INACTIVE"} color={params.value ? "success" : "default"} size="small" sx={{ fontWeight: 600 }} />
      ),
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
        <DataGrid rows={products} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
