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
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { getMe } from "../../api/auth";

export default function HrManagers() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "hr123",
  });

  useEffect(() => {
    loadHrManagers();
  }, []);

  const loadHrManagers = async () => {
    setLoading(true);
    try {
      // Demo HR Manager list scoped to company
      const mockHR = [
        { id: 1, full_name: "Acme HR Manager", email: "hr@acmetech.com", phone: "+1-555-0144", role: "HR_MANAGER", is_active: true },
        { id: 2, full_name: "Google HR Lead", email: "hr@google.com", phone: "+1-650-253-1111", role: "HR_MANAGER", is_active: true },
      ];
      setManagers(mockHR);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHR = () => {
    if (!form.full_name || !form.email) return;
    const newHR = {
      id: Date.now(),
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      role: "HR_MANAGER",
      is_active: true,
    };
    setManagers([newHR, ...managers]);
    setOpen(false);
    setForm({ full_name: "", email: "", phone: "", password: "hr123" });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
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
          <Typography sx={{ fontSize: 13.5 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: () => (
        <Chip label="Active HR" color="success" size="small" sx={{ fontWeight: 600 }} />
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
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
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
