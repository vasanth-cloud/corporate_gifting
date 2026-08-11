import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function AuditLogs() {
  const auditLogs = [
    { id: 1, action: "USER_LOGIN", user: "admin@corporate.com", role: "SUPER_ADMIN", entity: "AuthSession", ip: "127.0.0.1", timestamp: "2026-08-11 22:00:15" },
    { id: 2, action: "CREATE_CAMPAIGN", user: "companyadmin@google.com", role: "COMPANY_ADMIN", entity: "Campaign #1", ip: "127.0.0.1", timestamp: "2026-08-11 21:45:00" },
    { id: 3, action: "CLAIM_VOUCHER", user: "sarah.jenkins@acmetech.com", role: "EMPLOYEE", entity: "Voucher GC-REWARD", ip: "127.0.0.1", timestamp: "2026-08-11 18:50:00" },
    { id: 4, action: "PAYMENT_CHECKOUT", user: "admin@corporate.com", role: "SUPER_ADMIN", entity: "Order ORD-TSLA-992", ip: "127.0.0.1", timestamp: "2026-08-11 17:30:10" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "action",
      headerName: "Action Performed",
      flex: 1.2,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
      ),
    },
    { field: "user", headerName: "User Identity", flex: 1.2 },
    { field: "role", headerName: "Role", width: 140 },
    { field: "entity", headerName: "Target Entity", flex: 1 },
    { field: "ip", headerName: "IP Address", width: 120 },
    { field: "timestamp", headerName: "Timestamp", width: 170 },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          System Audit Logs & Security Trail
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Super Admin immutable audit records for user actions, campaign approvals, and financial transactions.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={auditLogs} columns={columns} sx={{ border: "none" }} />
      </Paper>
    </Box>
  );
}
