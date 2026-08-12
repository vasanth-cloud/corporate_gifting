import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function VendorDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      const oRes = await api.get("/orders");
      setOrders(oRes.data || []);
    } catch (err) {
      setOrders([]);
    }

    try {
      const gRes = await api.get("/gifts");
      setGifts(gRes.data || []);
    } catch (err) {
      setGifts([]);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Vendor Fulfillment & Inventory Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Supplier portal for order processing, packaging customization, and stock management.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>ASSIGNED ORDERS</Typography>
                <ShoppingCartIcon sx={{ color: "#6366F1" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#6366F1" }}>{orders.length} Active</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>SUPPLIED PRODUCTS</Typography>
                <InventoryIcon sx={{ color: "#EAB308" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#EAB308" }}>{gifts.length} Items</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>SHIPPED DISPATCHES</Typography>
                <LocalShippingIcon sx={{ color: "#3B82F6" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#3B82F6" }}>
                {orders.filter(o => o.status === "SHIPPED").length} Shipped
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>DELIVERED RATE</Typography>
                <CheckCircleIcon sx={{ color: "#22C55E" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#22C55E" }}>
                {orders.length > 0 ? "100%" : "0%"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
            <Button component={Link} to="/vendor/orders" variant="contained" fullWidth sx={{ mb: 1.5, bgcolor: "#6366F1", textTransform: "none", fontWeight: 600 }}>
              Process Assigned Orders
            </Button>
            <Button component={Link} to="/vendor/inventory" variant="outlined" fullWidth sx={{ textTransform: "none", fontWeight: 600 }}>
              Manage Stock Inventory
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Inventory Alerts</Typography>
            {gifts.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 1 }}>No products listed yet.</Typography>
            ) : (
              gifts.slice(0, 3).map((g, idx) => (
                <Box key={idx} sx={{ p: 1.5, mb: 1, bgcolor: "action.hover", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.name} (SKU: {g.sku})</Typography>
                  <Chip label={`Stock: ${g.stock}`} color="success" size="small" />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
