import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function Approvals() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/campaigns");
      setApprovals(res.data || []);
    } catch (err) {
      console.error("Failed to load approvals:", err);
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/campaigns/${id}`, { status: "ACTIVE" });
      loadApprovals();
    } catch (err: any) {
      alert("Failed to approve campaign");
    }
  };

  const handleRejectClick = (req: any) => {
    setSelectedReq(req);
    setRejectionComment("");
    setOpenModal(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedReq) return;
    try {
      await api.put(`/campaigns/${selectedReq.id}`, { status: "COMPLETED" });
      setOpenModal(false);
      loadApprovals();
    } catch (err: any) {
      alert("Failed to update campaign status");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Campaign Title", flex: 1.4 },
    { field: "budget", headerName: "Requested Budget", width: 150, valueFormatter: (value) => `$${Number(value).toLocaleString()}` },
    { field: "start_date", headerName: "Start Date", width: 130 },
    { field: "end_date", headerName: "End Date", width: 130 },
    {
      field: "status",
      headerName: "Approval Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ACTIVE" ? "success" : params.value === "COMPLETED" ? "error" : "warning"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        params.row.status === "PLANNED" || params.row.status === "DRAFT" ? (
          <Stack spacing={1} direction="row" sx={{ alignItems: "center", height: "100%" }}>
            <Button size="small" variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleApprove(params.row.id)}>
              Approve
            </Button>
            <Button size="small" variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => handleRejectClick(params.row)}>
              Reject
            </Button>
          </Stack>
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>Processed</Typography>
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
        <DataGrid rows={approvals} columns={columns} loading={loading} sx={{ border: "none" }} />
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
