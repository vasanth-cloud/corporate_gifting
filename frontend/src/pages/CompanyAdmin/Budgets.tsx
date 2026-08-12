import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SavingsIcon from "@mui/icons-material/Savings";
import api from "../../services/api";

export default function Budgets() {
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/campaigns");
      setCampaignBudgets(res.data || []);
    } catch (err) {
      console.error("Failed to load campaign budgets:", err);
      setCampaignBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = campaignBudgets.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Company Budget & Expenditure Management
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Monitor campaign allocations, spending caps, and remaining unallocated funds.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>TOTAL ALLOCATED BUDGET</Typography>
                <AccountBalanceWalletIcon sx={{ color: "#6366F1" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#6366F1" }}>
                ${totalAllocated.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>ACTIVE CAMPAIGNS</Typography>
                <TrendingUpIcon sx={{ color: "#3B82F6" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#3B82F6" }}>
                {campaignBudgets.length} Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>FULFILLMENT SPEND</Typography>
                <CheckCircleOutlinedIcon sx={{ color: "#22C55E" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#22C55E" }}>
                $0.00
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>REMAINING BUDGET</Typography>
                <SavingsIcon sx={{ color: "#EAB308" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#EAB308" }}>
                ${totalAllocated.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Campaign Budget Breakdowns */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Campaign Budget Breakdown
        </Typography>

        {campaignBudgets.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
            No active campaigns found. Create campaigns to allocate gifting budgets.
          </Typography>
        ) : (
          campaignBudgets.map((item, idx) => (
            <Box key={idx} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{item.title}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Dates: {item.start_date} to {item.end_date}
                  </Typography>
                </Box>
                <Chip label={item.status} color={item.status === "ACTIVE" ? "success" : "default"} size="small" sx={{ fontWeight: 600 }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "text.secondary", mb: 1 }}>
                <span>Allocated Budget: ${Number(item.budget).toLocaleString()}</span>
                <span>0% Used</span>
              </Box>
              <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4, bgcolor: "#E2E8F0" }} />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
