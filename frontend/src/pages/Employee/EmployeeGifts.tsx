import React from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { Link } from "react-router-dom";

export default function EmployeeGifts() {
  const availableGifts = [
    { title: "Diwali Celebration Reward 2026", code: "GC-REWARD", value: "$250.00", deadline: "2026-10-15", status: "READY TO CLAIM" },
  ];

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
        {availableGifts.map((g, idx) => (
          <Grid key={idx} size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{g.title}</Typography>
                  <Chip label={g.status} color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                  Claim Code: <strong>{g.code}</strong> • Allowance: <strong>{g.value}</strong>
                </Typography>
                <Button component={Link} to="/claim-gift" variant="contained" fullWidth sx={{ bgcolor: "#6366F1", textTransform: "none", fontWeight: 600, py: 1 }}>
                  Select Gift & Confirm Shipping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
