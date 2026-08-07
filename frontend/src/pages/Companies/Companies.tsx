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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../../api/company";

// ---- Design tokens -----------------------------------
const INK = "#1B1730";
const INK_SOFT = "#6B6785";
const SURFACE = "#FFFFFF";
const PAGE_BG = "linear-gradient(180deg, #F6F5FB 0%, #ECEAF6 100%)";
const PRIMARY = "#4C3A8C"; // royal violet
const GOLD = "#C9982F";
const GREEN = "#2F8F5B";
const CORAL = "#E1604A";
const BLUE = "#3E7CB1";

const AVATAR_COLORS = [PRIMARY, GOLD, GREEN, CORAL, BLUE];

const FONT_DISPLAY = "'Sora', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

function usePageFonts() {
  useEffect(() => {
    const id = "app-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function initialsAvatarColor(name: string) {
  if (!name) return PRIMARY;
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export default function Companies() {
  usePageFonts();

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
        await createCompany(form);
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
      name: company.name,
      email: company.email,
      phone: company.phone,
      website: company.website,
      address: company.address,
      logo: company.logo,
      gst_number: company.gst_number,
    });

    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this company?")) return;
    await deleteCompany(id);
    loadCompanies();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Company",
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
      headerName: "Email",
      flex: 1,
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
      flex: 0.8,
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
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: PAGE_BG }}>
      <Box sx={{ p: 4 }}>
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
              <ApartmentOutlinedIcon sx={{ color: PRIMARY, fontSize: 26 }} />
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: 28,
                  color: INK,
                  letterSpacing: "-0.02em",
                }}
              >
                Companies
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 14, color: INK_SOFT }}>
              Every organization ordering gifts for their team, in one place
            </Typography>
          </Box>

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
                boxShadow: "0 6px 18px rgba(76, 58, 140, 0.34)",
              },
            }}
          >
            Add Company
          </Button>
        </Box>

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
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#FAF9FD",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #E7E4F2",
                backgroundColor: "#FAF9FD",
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                outline: "none",
              },
            }}
          />
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: INK }}>
            {editing ? "Edit Company" : "Add Company"}
          </DialogTitle>

          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Company Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Logo URL"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="GST Number"
              name="gst_number"
              value={form.gst_number}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => {
                setOpen(false);
                setEditing(false);
                setSelectedId(null);
              }}
              sx={{ textTransform: "none", fontFamily: FONT_BODY }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: PRIMARY,
                textTransform: "none",
                fontFamily: FONT_BODY,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#3E2F70" },
              }}
            >
              {editing ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}