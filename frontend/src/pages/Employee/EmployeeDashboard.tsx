import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Avatar, Chip, Stack } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const userName = user?.full_name || "Employee";

  const [myGifts, setMyGifts] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const vRes = await api.get("/vouchers");
      setMyGifts(vRes.data || []);
    } catch (err) {
      setMyGifts([]);
    }

    try {
      const oRes = await api.get("/orders");
      setMyOrders(oRes.data || []);
    } catch (err) {
      setMyOrders([]);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          color: "#FFF",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Welcome back, {userName}! 🎁
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              You have {myGifts.length} active corporate reward voucher(s) ready to redeem.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/claim-gift"
            variant="contained"
            startIcon={<ConfirmationNumberIcon />}
            sx={{ bgcolor: "#FFF", color: "#4F46E5", fontWeight: 700, px: 3, py: 1.2, borderRadius: 3, "&:hover": { bgcolor: "#F1F5F9" } }}
          >
            Claim Reward Voucher
          </Button>
        </Box>
      </Paper>

      {/* Available Rewards */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        My Available Gift Rewards
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {myGifts.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <Typography color="text.secondary">No active reward vouchers assigned yet.</Typography>
            </Paper>
          </Grid>
        ) : (
          myGifts.map((g, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Voucher Rewards</Typography>
                    <Chip label={`Value: $${g.amount}`} color="success" size="small" sx={{ fontWeight: 700 }} />
                  </Box>

                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    Voucher Code: <strong>{g.code}</strong> • Recipient: {g.recipient_name || g.recipient_email}
                  </Typography>

                  <Button
                    component={Link}
                    to="/claim-gift"
                    variant="outlined"
                    fullWidth
                    sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}
                  >
                    Redeem Gift Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Recent Orders */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        My Recent Reward Orders
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        {myOrders.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>No claimed orders yet.</Typography>
        ) : (
          myOrders.map((ord, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: idx < myOrders.length - 1 ? 2 : 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5" }}>
                  <CardGiftcardIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Order #{ord.order_number}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Total: ${ord.total_amount} • Date: {ord.order_date}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ flexDirection: "row", alignItems: "center" }}>
                <Chip icon={<LocalShippingIcon fontSize="small" />} label={ord.status} color="info" size="small" sx={{ fontWeight: 600 }} />
                <Button component={Link} to="/employee/orders" variant="text" size="small">
                  Track Delivery
                </Button>
              </Stack>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
