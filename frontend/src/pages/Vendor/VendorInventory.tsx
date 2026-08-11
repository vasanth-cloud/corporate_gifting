import React, { useState } from "react";
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function VendorInventory() {
  const [items, setItems] = useState([
    { id: 1, name: "Premium Noise-Canceling Headphones", sku: "GIFT-TECH-01", stock: 100, reserved: 12, available: 88, status: "IN_STOCK" },
    { id: 2, name: "Smart Health Fitness Watch", sku: "GIFT-WATCH-02", stock: 80, reserved: 5, available: 75, status: "IN_STOCK" },
    { id: 3, name: "Luxury Italian Leather Journal Set", sku: "GIFT-LUX-03", stock: 150, reserved: 20, available: 130, status: "IN_STOCK" },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [newStock, setNewStock] = useState("");

  const handleUpdateClick = (row: any) => {
    setSelectedItem(row);
    setNewStock(String(row.stock));
    setOpenModal(true);
  };

  const handleSaveStock = () => {
    if (!selectedItem) return;
    const qty = parseInt(newStock, 10) || 0;
    setItems(items.map(i => i.id === selectedItem.id ? { ...i, stock: qty, available: qty - i.reserved } : i));
    setOpenModal(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Product Name", flex: 1.2 },
    { field: "sku", headerName: "SKU", width: 140 },
    { field: "stock", headerName: "Total Stock", width: 120 },
    { field: "reserved", headerName: "Reserved", width: 120 },
    { field: "available", headerName: "Available Stock", width: 130 },
    {
      field: "status",
      headerName: "Stock Status",
      width: 130,
      renderCell: () => <Chip label="IN STOCK" color="success" size="small" sx={{ fontWeight: 600 }} />,
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
          Monitor total stock, reserved items for active campaigns, and available units.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={items} columns={columns} sx={{ border: "none" }} />
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
