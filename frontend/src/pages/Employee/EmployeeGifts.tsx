import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function EmployeeGifts() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vouchers");
      setVouchers(res.data || []);
    } catch (err) {
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          My Assigned Corporate Gifts & Vouchers
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          View rewards assigned to you by your employer and claim your favorite gift within budget.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {vouchers.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Typography color="text.secondary">No assigned vouchers found.</Typography>
            </Paper>
          </Grid>
        ) : (
          vouchers.map((g, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Corporate Voucher</Typography>
                    <Chip label={g.is_redeemed ? "REDEEMED" : "AVAILABLE"} color={g.is_redeemed ? "default" : "success"} size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    Claim Code: <strong>{g.code}</strong> • Value: <strong>${g.amount}</strong>
                  </Typography>
                  <Button component={Link} to="/claim-gift" variant="contained" disabled={g.is_redeemed} fullWidth sx={{ bgcolor: "#6366F1", textTransform: "none", fontWeight: 600, py: 1 }}>
                    {g.is_redeemed ? "Voucher Already Claimed" : "Select Gift & Confirm Shipping"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
