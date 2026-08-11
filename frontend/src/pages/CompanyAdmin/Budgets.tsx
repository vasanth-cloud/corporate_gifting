import React from "react";
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

export default function Budgets() {
  const budgetSummary = {
    total_annual_budget: 100000.0,
    allocated: 65000.0,
    spent: 34500.0,
    remaining: 35000.0,
  };

  const campaignBudgets = [
    { title: "Diwali Employee Celebration 2026", department: "Company Wide", allocated: 50000, spent: 24500, status: "ACTIVE" },
    { title: "Engineering Innovation Awards", department: "Engineering", allocated: 30000, spent: 10000, status: "ACTIVE" },
    { title: "Sales Performance Rewards", department: "Sales", allocated: 20000, spent: 0, status: "PLANNED" },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Company Budget & Expenditure Management
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Monitor annual gifting budgets, campaign allocations, department caps, and remaining funds.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>TOTAL ANNUAL BUDGET</Typography>
                <AccountBalanceWalletIcon sx={{ color: "#6366F1" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#6366F1" }}>
                ${budgetSummary.total_annual_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>ALLOCATED TO CAMPAIGNS</Typography>
                <TrendingUpIcon sx={{ color: "#3B82F6" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#3B82F6" }}>
                ${budgetSummary.allocated.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>SPENT (ORDER FULFILLMENTS)</Typography>
                <CheckCircleOutlinedIcon sx={{ color: "#22C55E" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#22C55E" }}>
                ${budgetSummary.spent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>REMAINING UNALLOCATED</Typography>
                <SavingsIcon sx={{ color: "#EAB308" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#EAB308" }}>
                ${budgetSummary.remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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

        {campaignBudgets.map((item, idx) => {
          const percentSpent = Math.round((item.spent / item.allocated) * 100);
          return (
            <Box key={idx} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{item.title}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Department: {item.department}</Typography>
                </Box>
                <Chip label={item.status} color={item.status === "ACTIVE" ? "success" : "default"} size="small" sx={{ fontWeight: 600 }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "text.secondary", mb: 1 }}>
                <span>Spent: ${item.spent.toLocaleString()} / Allocated: ${item.allocated.toLocaleString()}</span>
                <span>{percentSpent}% Used</span>
              </Box>
              <LinearProgress variant="determinate" value={percentSpent} sx={{ height: 8, borderRadius: 4, bgcolor: "#E2E8F0" }} />
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}
