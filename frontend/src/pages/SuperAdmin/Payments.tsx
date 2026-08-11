import React from "react";
import { Box, Typography, Paper, Chip, Grid, Card, CardContent } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function Payments() {
  const payments = [
    { id: 1, txn_id: "TXN-99882211", order_no: "ORD-GOOG-881", company: "Google LLC", amount: 199.99, gateway: "Stripe Card", status: "SUCCESS", date: "2026-08-05" },
    { id: 2, txn_id: "TXN-44110099", order_no: "ORD-TSLA-992", company: "Tesla Motors Inc", amount: 149.50, gateway: "Razorpay UPI", status: "SUCCESS", date: "2026-08-06" },
    { id: 3, txn_id: "TXN-77441122", order_no: "ORD-INFY-103", company: "Infosys Limited", amount: 49.99, gateway: "Corporate NetBanking", status: "SUCCESS", date: "2026-08-07" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "txn_id", headerName: "Transaction ID", flex: 1 },
    { field: "order_no", headerName: "Order #", width: 140 },
    { field: "company", headerName: "Company Tenant", flex: 1 },
    { field: "amount", headerName: "Amount", width: 120, valueFormatter: (val) => `$${Number(val).toFixed(2)}` },
    { field: "gateway", headerName: "Payment Method", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: () => <Chip icon={<CheckCircleIcon fontSize="small" />} label="SUCCESS" color="success" size="small" sx={{ fontWeight: 700 }} />,
    },
    { field: "date", headerName: "Transaction Date", width: 130 },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Payment Gateway Settlements & Audit
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Super Admin global view of corporate payment gateway checkouts, receipts, and settlements.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>TOTAL SETTLED VOLUME</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#22C55E", mt: 0.5 }}>$399.48</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>SUCCESSFUL TRANSACTIONS</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#6366F1", mt: 0.5 }}>3 Settled</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>GATEWAY SUCCESS RATE</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#3B82F6", mt: 0.5 }}>100.0%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ height: 450, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={payments} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
