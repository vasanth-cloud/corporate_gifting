import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../api/vendor";

const EMPTY_FORM = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  gst_number: "",
  website: "",
  address: "",
};

export default function Vendors() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    const data = await getVendors();
    setRows(data);
  };

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editing && selectedId) {
        await updateVendor(selectedId, form);
      } else {
        await createVendor(form);
      }

      setOpen(false);
      setEditing(false);
      setSelectedId(null);

      setForm({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        gst_number: "",
        website: "",
        address: "",
      });

      loadVendors();
    } catch (err) {
      console.log(err);
      alert("Unable to save vendor");
    }
  };

  const handleEdit = (vendor: any) => {
    setEditing(true);
    setSelectedId(vendor.id);

    setForm({
      company_name: vendor.company_name,
      contact_person: vendor.contact_person,
      email: vendor.email,
      phone: vendor.phone,
      gst_number: vendor.gst_number,
      website: vendor.website,
      address: vendor.address,
    });

    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this vendor?")) return;
    await deleteVendor(id);
    loadVendors();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "company_name",
      headerName: "Company",
      flex: 1.2,
    },
    {
      field: "contact_person",
      headerName: "Contact Person",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "gst_number",
      headerName: "GST",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Vendors
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(false);
            setSelectedId(null);
            setForm(EMPTY_FORM);
            setOpen(true);
          }}
        >
          Add Vendor
        </Button>
      </Box>

      <Paper sx={{ height: 600 }}>
        <DataGrid rows={rows} columns={columns} />
      </Paper>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(false);
          setSelectedId(null);
        }}
        fullWidth
      >
        <DialogTitle>{editing ? "Edit Vendor" : "Add Vendor"}</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Company Name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
          />

          <TextField
            label="Contact Person"
            name="contact_person"
            value={form.contact_person}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <TextField
            label="GST Number"
            name="gst_number"
            value={form.gst_number}
            onChange={handleChange}
          />

          <TextField
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
          />

          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditing(false);
              setSelectedId(null);
            }}
          >
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            {editing ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}