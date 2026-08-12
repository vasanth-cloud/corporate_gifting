import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function HrManagers() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    loadHrManagers();
  }, []);

  const loadHrManagers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const hrOnly = (res.data || []).filter((u: any) => u.role === "HR_MANAGER");
      setManagers(hrOnly);
    } catch (err) {
      console.error(err);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHR = async () => {
    if (!form.full_name || !form.email || !form.password) {
      alert("Please enter full name, email, and temporary password.");
      return;
    }
    try {
      await api.post("/users", {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "HR_MANAGER",
      });
      setOpen(false);
      setForm({ full_name: "", email: "", phone: "", password: "" });
      loadHrManagers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create HR Manager");
    }
  };

  const columns: GridColDef[] = [
    { field: "sno", headerName: "S.No", width: 80, renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1 },
    {
      field: "full_name",
      headerName: "HR Manager Name",
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={1.5} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#6366F1", fontSize: 13, fontWeight: 700 }}>
            {(params.value || "H").charAt(0).toUpperCase()}
          </Avatar>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Work Email",
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <EmailOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 13.5 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <PhoneOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 13.5 }}>{params.value || "N/A"}</Typography>
        </Stack>
      ),
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value ? "Active HR" : "Inactive"} color={params.value ? "success" : "default"} size="small" sx={{ fontWeight: 600 }} />
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            HR Managers Directory
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Assign and manage HR team members responsible for company gifting campaigns.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: "#6366F1", borderRadius: 2.5, px: 2.5, py: 1, textTransform: "none", fontWeight: 600 }}
        >
          Create HR Manager
        </Button>
      </Box>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={managers} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>

      {/* Add HR Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Create HR Manager Account</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Work Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Temporary Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddHR} sx={{ bgcolor: "#6366F1" }}>
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
