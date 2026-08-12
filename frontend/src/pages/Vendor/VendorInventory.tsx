import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function VendorInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [newStock, setNewStock] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gifts");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (row: any) => {
    setSelectedItem(row);
    setNewStock(String(row.stock || 0));
    setOpenModal(true);
  };

  const handleSaveStock = async () => {
    if (!selectedItem) return;
    const qty = parseInt(newStock, 10) || 0;
    try {
      await api.put(`/gifts/${selectedItem.id}`, { stock: qty });
      setOpenModal(false);
      loadInventory();
    } catch (err: any) {
      alert("Failed to update stock");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Product Name", flex: 1.2 },
    { field: "sku", headerName: "SKU", width: 140 },
    { field: "stock", headerName: "Available Stock", width: 140 },
    {
      field: "is_active",
      headerName: "Stock Status",
      width: 130,
      renderCell: (params) => (
        <Chip label={params.row.stock > 0 ? "IN STOCK" : "OUT OF STOCK"} color={params.row.stock > 0 ? "success" : "error"} size="small" sx={{ fontWeight: 600 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" onClick={() => handleUpdateClick(params.row)}>
          Adjust Stock
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Stock Inventory & Availability Control
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Monitor available units and update product inventory levels.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={items} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Adjust Inventory Stock</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Total Stock Quantity"
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStock} sx={{ bgcolor: "#6366F1" }}>
            Save Inventory
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
