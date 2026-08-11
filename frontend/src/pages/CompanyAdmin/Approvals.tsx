import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function Approvals() {
  const [approvals, setApprovals] = useState<any[]>([
    { id: 1, type: "CAMPAIGN", title: "Diwali Employee Celebration 2026", requested_by: "Acme HR Manager", date: "2026-08-01", budget: 50000, status: "APPROVED", comments: "Budget approved for corporate drive" },
    { id: 2, type: "CAMPAIGN", title: "Sales Innovation Incentives", requested_by: "Acme HR Manager", date: "2026-08-05", budget: 20000, status: "PENDING", comments: "Awaiting Company Admin review" },
    { id: 3, type: "CAMPAIGN", title: "Custom Over-Budget Request", requested_by: "Acme HR Manager", date: "2026-08-06", budget: 85000, status: "REJECTED", comments: "Exceeds department allocated budget cap" },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");

  const handleApprove = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: "APPROVED", comments: "Approved by Company Admin" } : a));
  };

  const handleRejectClick = (req: any) => {
    setSelectedReq(req);
    setRejectionComment("");
    setOpenModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedReq) return;
    setApprovals(approvals.map(a => a.id === selectedReq.id ? { ...a, status: "REJECTED", comments: rejectionComment || "Rejected by Company Admin" } : a));
    setOpenModal(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Campaign Title", flex: 1.4 },
    {
      field: "requested_by",
      headerName: "Requested By",
      flex: 1,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "#6366F1", fontSize: 12 }}>{(params.value || "H").charAt(0)}</Avatar>
          <Typography sx={{ fontSize: 13.5 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    { field: "budget", headerName: "Requested Budget", width: 150, valueFormatter: (value) => `$${Number(value).toLocaleString()}` },
    {
      field: "status",
      headerName: "Approval Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "APPROVED" ? "success" : params.value === "REJECTED" ? "error" : "warning"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    { field: "comments", headerName: "Comments / Rejection Reason", flex: 1.2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        params.row.status === "PENDING" ? (
          <Stack spacing={1} direction="row" sx={{ alignItems: "center", height: "100%" }}>
            <Button size="small" variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleApprove(params.row.id)}>
              Approve
            </Button>
            <Button size="small" variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => handleRejectClick(params.row)}>
              Reject
            </Button>
          </Stack>
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>Completed</Typography>
        )
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Campaign & Budget Approvals Queue
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Review, approve, or reject gifting drives submitted by HR Managers.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={approvals} columns={columns} sx={{ border: "none" }} />
      </Paper>

      {/* Reject Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Reject Campaign Request</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>Please state the rejection reason for the HR team.</Alert>
          <TextField
            label="Rejection Reason / Comments"
            multiline
            rows={3}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject}>
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
