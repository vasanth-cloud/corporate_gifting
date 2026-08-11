import React from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Avatar, Chip, Stack } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const userName = user?.full_name || "Employee";

  const myGifts = [
    { title: "Diwali Employee Celebration 2026", voucher: "GC-REWARD", value: "$250.00", status: "AVAILABLE", deadline: "2026-10-15" },
  ];

  const myOrders = [
    { order_no: "VOUCH-88A12B", gift: "Wireless Noise-Canceling Headphones", date: "2026-08-07", status: "PROCESSING", tracking: "DEL-102938" },
  ];

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
              You have 1 active corporate reward voucher ready to redeem.
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
        {myGifts.map((g, idx) => (
          <Grid key={idx} size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{g.title}</Typography>
                  <Chip label={`Value: ${g.value}`} color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                  Voucher Code: <strong>{g.voucher}</strong> • Valid until {g.deadline}
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
        ))}
      </Grid>

      {/* Recent Orders */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        My Recent Reward Orders
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        {myOrders.map((ord, idx) => (
          <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5" }}>
                <CardGiftcardIcon />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{ord.gift}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Order #{ord.order_no} • {ord.date}
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
        ))}
      </Paper>
    </Box>
  );
}
