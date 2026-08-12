import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import LockResetIcon from "@mui/icons-material/LockReset";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../../services/api";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "COMPANY_ADMIN",
    password: "",
    phone: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.full_name || !newUser.email || !newUser.password) {
      alert("Please fill in full name, email, and password.");
      return;
    }
    try {
      await api.post("/users", newUser);
      setOpenModal(false);
      setNewUser({ full_name: "", email: "", role: "COMPANY_ADMIN", password: "", phone: "" });
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create user");
    }
  };

  const columns: GridColDef[] = [
    { field: "sno", headerName: "S.No", width: 80, renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1 },
    {
      field: "full_name",
      headerName: "Full Name",
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={1.5} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#6366F1", fontSize: 13, fontWeight: 700 }}>
            {(params.value || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{params.value}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>{params.row.email}</Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "role",
      headerName: "System Role",
      width: 170,
      renderCell: (params) => (
        <Chip
          icon={<PersonIcon fontSize="small" />}
          label={(params.value || "").replace("_", " ")}
          color={params.value === "SUPER_ADMIN" ? "secondary" : params.value === "COMPANY_ADMIN" ? "primary" : params.value === "HR_MANAGER" ? "info" : params.value === "VENDOR" ? "warning" : "default"}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: "company_id",
      headerName: "Tenant ID",
      width: 120,
      valueGetter: (value) => value ? `Company #${value}` : "Global Platform",
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value ? "ACTIVE" : "INACTIVE"} color={params.value ? "success" : "default"} size="small" sx={{ fontWeight: 600 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: () => (
        <Button size="small" startIcon={<LockResetIcon />} onClick={() => alert("Password reset notification sent!")}>
          Reset
        </Button>
      ),
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Platform Users & Role Permissions
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Super Admin global control over user accounts, roles, and tenant assignments.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)} sx={{ bgcolor: "#6366F1", borderRadius: 2.5, px: 2.5, py: 1, textTransform: "none", fontWeight: 600 }}>
          Create New User
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search by name or email..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 300 }}
        />

        <TextField
          select
          size="small"
          label="Filter by Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="ALL">All System Roles</MenuItem>
          <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
          <MenuItem value="COMPANY_ADMIN">Company Admin</MenuItem>
          <MenuItem value="HR_MANAGER">HR Manager</MenuItem>
          <MenuItem value="EMPLOYEE">Employee</MenuItem>
          <MenuItem value="VENDOR">Vendor</MenuItem>
        </TextField>
      </Paper>

      <Paper elevation={0} sx={{ height: 500, borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <DataGrid rows={filteredUsers} columns={columns} loading={loading} sx={{ border: "none" }} />
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Full Name" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} fullWidth required />
          <TextField label="Email Address" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} fullWidth required />
          <TextField label="Phone Number" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} fullWidth />
          <TextField select label="Role Permission" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} fullWidth>
            <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
            <MenuItem value="COMPANY_ADMIN">COMPANY_ADMIN</MenuItem>
            <MenuItem value="HR_MANAGER">HR_MANAGER</MenuItem>
            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
            <MenuItem value="VENDOR">VENDOR</MenuItem>
          </TextField>
          <TextField label="Login Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} fullWidth required />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser} sx={{ bgcolor: "#6366F1" }}>Save User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
