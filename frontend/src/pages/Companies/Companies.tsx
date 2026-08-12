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
  Grid,
  Chip,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../../api/company";
import { useAuth } from "../../context/AuthContext";

const INK = "#1B1730";
const INK_SOFT = "#6B6785";
const SURFACE = "#FFFFFF";
const PAGE_BG = "linear-gradient(180deg, #F6F5FB 0%, #ECEAF6 100%)";
const PRIMARY = "#4C3A8C";
const GOLD = "#C9982F";
const GREEN = "#2F8F5B";
const CORAL = "#E1604A";
const BLUE = "#3E7CB1";

const AVATAR_COLORS = [PRIMARY, GOLD, GREEN, CORAL, BLUE];

const FONT_DISPLAY = "'Sora', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

function initialsAvatarColor(name: string) {
  if (!name) return PRIMARY;
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export default function Companies() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logo: "",
    gst_number: "",
    admin_email: "",
    admin_password: "",
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editing && selectedId) {
        await updateCompany(selectedId, form);
      } else {
        await createCompany({
          ...form,
          admin_email: form.admin_email || form.email,
          admin_password: form.admin_password || "company123",
        });
      }

      setOpen(false);
      setEditing(false);
      setSelectedId(null);

      setForm({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        logo: "",
        gst_number: "",
        admin_email: "",
        admin_password: "",
      });

      loadCompanies();
    } catch (err) {
      console.log(err);
      alert("Unable to save company");
    }
  };

  const handleEdit = (company: any) => {
    setEditing(true);
    setSelectedId(company.id);

    setForm({
      name: company.name || "",
      email: company.email || "",
      phone: company.phone || "",
      website: company.website || "",
      address: company.address || "",
      logo: company.logo || "",
      gst_number: company.gst_number || "",
      admin_email: company.email || "",
      admin_password: "",
    });

    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this company?")) return;
    await deleteCompany(id);
    loadCompanies();
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "name",
      headerName: "Company Name",
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={1.5} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: FONT_DISPLAY,
              bgcolor: `${initialsAvatarColor(params.value)}1A`,
              color: initialsAvatarColor(params.value),
            }}
          >
            {(params.value || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500, color: INK }}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Company Admin Email",
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <EmailOutlinedIcon sx={{ fontSize: 16, color: INK_SOFT }} />
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: INK_SOFT }}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.9,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <PhoneOutlinedIcon sx={{ fontSize: 16, color: INK_SOFT }} />
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: INK_SOFT }}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <PlaceOutlinedIcon sx={{ fontSize: 16, color: INK_SOFT }} />
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: INK_SOFT }}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          {isSuperAdmin && (
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const ownCompany = rows.length > 0 ? rows[0] : null;

  return (
    <Box sx={{ minHeight: "100vh", background: PAGE_BG, p: { xs: 2, sm: 4 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Stack spacing={1.5} sx={{ flexDirection: "row", alignItems: "center", mb: 0.5 }}>
            <ApartmentOutlinedIcon sx={{ color: PRIMARY, fontSize: 28 }} />
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 28,
                color: INK,
                letterSpacing: "-0.02em",
              }}
            >
              {isSuperAdmin ? "Companies Registry" : "Company Profile"}
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 14, color: INK_SOFT }}>
            {isSuperAdmin
              ? "Add client organizations and set up Company Admin login credentials"
              : "Your organization's official profile, address, and contact details"}
          </Typography>
        </Box>

        {isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(false);
              setSelectedId(null);
              setForm({
                name: "",
                email: "",
                phone: "",
                website: "",
                address: "",
                logo: "",
                gst_number: "",
                admin_email: "",
                admin_password: "",
              });
              setOpen(true);
            }}
            sx={{
              backgroundColor: PRIMARY,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              boxShadow: "0 4px 14px rgba(76, 58, 140, 0.28)",
              "&:hover": {
                backgroundColor: "#3E2F70",
              },
            }}
          >
            Add Company
          </Button>
        )}
      </Box>

      {/* Multi-Tenant Display Scoping */}
      {isSuperAdmin ? (
        <Paper
          elevation={0}
          sx={{
            height: 600,
            borderRadius: "18px",
            border: "1px solid #E7E4F2",
            boxShadow: "0 2px 14px rgba(27, 23, 48, 0.05)",
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            sx={{
              border: "none",
              fontFamily: FONT_BODY,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#F6F5FB",
                borderBottom: "1px solid #E7E4F2",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: INK_SOFT,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #F1EFF8",
              },
            }}
          />
        </Paper>
      ) : ownCompany ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "20px",
            border: "1px solid #E7E4F2",
            boxShadow: "0 4px 20px rgba(27, 23, 48, 0.06)",
            background: SURFACE,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  fontSize: 26,
                  fontWeight: 800,
                  bgcolor: PRIMARY,
                  boxShadow: "0 6px 16px rgba(76, 58, 140, 0.3)",
                }}
              >
                {ownCompany.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: INK }}>
                  {ownCompany.name}
                </Typography>
                <Chip label="Active Company Account" color="success" size="small" sx={{ mt: 0.5, fontWeight: 600 }} />
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEdit(ownCompany)}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
            >
              Edit Company Profile
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <EmailOutlinedIcon sx={{ color: PRIMARY }} />
                <Box>
                  <Typography variant="caption" sx={{ color: INK_SOFT, display: "block" }}>Corporate Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: INK }}>{ownCompany.email}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <PhoneOutlinedIcon sx={{ color: PRIMARY }} />
                <Box>
                  <Typography variant="caption" sx={{ color: INK_SOFT, display: "block" }}>Contact Phone</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: INK }}>{ownCompany.phone}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <LanguageIcon sx={{ color: PRIMARY }} />
                <Box>
                  <Typography variant="caption" sx={{ color: INK_SOFT, display: "block" }}>Official Website</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: INK }}>{ownCompany.website || "N/A"}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <ReceiptIcon sx={{ color: PRIMARY }} />
                <Box>
                  <Typography variant="caption" sx={{ color: INK_SOFT, display: "block" }}>GST Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: INK }}>{ownCompany.gst_number || "N/A"}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mt: 1 }}>
                <PlaceOutlinedIcon sx={{ color: PRIMARY, mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: INK_SOFT, display: "block" }}>Headquarters Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: INK }}>{ownCompany.address}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
          <Typography color="text.secondary">No company profile found.</Typography>
        </Paper>
      )}

      {/* Edit / Add Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: INK }}>
          {editing ? "Edit Company Details" : "Add New Company & Set Admin Credentials"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {!editing && (
            <Alert severity="info" icon={<LockOutlinedIcon />}>
              The email and password entered below will become the <strong>Company Admin login credentials</strong>!
            </Alert>
          )}

          <TextField label="Company Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          <TextField label="Company / Admin Login Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
          
          {!editing && (
            <TextField
              label="Set Admin Login Password"
              name="admin_password"
              type="password"
              value={form.admin_password}
              onChange={handleChange}
              placeholder="e.g. acme123"
              fullWidth
              required
            />
          )}

          <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} fullWidth />
          <TextField label="Website URL" name="website" value={form.website} onChange={handleChange} fullWidth />
          <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
          <TextField label="Logo URL" name="logo" value={form.logo} onChange={handleChange} fullWidth />
          <TextField label="GST Number" name="gst_number" value={form.gst_number} onChange={handleChange} fullWidth />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: PRIMARY, textTransform: "none", fontWeight: 600 }}>
            {editing ? "Update Profile" : "Save Company & Create Admin Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}