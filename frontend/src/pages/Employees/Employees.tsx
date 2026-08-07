import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employee";
import { getCompanies } from "../../api/company";

const EMPTY_FORM = {
  employee_code: "",
  first_name: "",
  last_name: "",
  work_email: "",
  personal_email: "",
  phone: "",
  department: "",
  designation: "",
  joining_date: "",
  date_of_birth: "",
  profile_image: "",
  company_id: 1,
};

export default function Employees() {
  const [rows, setRows] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Bulk CSV state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState("");

  useEffect(() => {
    loadEmployees();
    loadCompanies();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setRows(data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "company_id" ? Number(value) : value,
    });
  };

  const openAddDialog = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEditDialog = (row: any) => {
    setEditingId(row.id);
    setForm({
      employee_code: row.employee_code || "",
      first_name: row.first_name || "",
      last_name: row.last_name || "",
      work_email: row.work_email || "",
      personal_email: row.personal_email || "",
      phone: row.phone || "",
      department: row.department || "",
      designation: row.designation || "",
      joining_date: row.joining_date || "",
      date_of_birth: row.date_of_birth || "",
      profile_image: row.profile_image || "",
      company_id: row.company_id || 1,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
      } else {
        await createEmployee(form);
      }

      setOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      loadEmployees();
    } catch (e) {
      console.log(e);
      alert(editingId ? "Unable to update employee" : "Unable to create employee");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (e) {
      console.log(e);
      alert("Unable to delete employee");
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) return;
    setUploading(true);
    setBulkMessage("");
    setBulkError("");

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/employees/bulk-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBulkMessage(res.data.message);
      loadEmployees();
    } catch (err: any) {
      setBulkError(err.response?.data?.detail || "Failed to import CSV.");
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,employee_code,first_name,last_name,work_email,department,designation,company_id\nEMP-2001,John,Doe,john.doe@acme.com,Engineering,Developer,1\nEMP-2002,Jane,Smith,jane.smith@acme.com,HR,Manager,1";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: GridColDef[] = [
    {
      field: "employee_code",
      headerName: "Code",
      width: 120,
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "work_email",
      headerName: "Work Email",
      flex: 1.5,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "company_name",
      headerName: "Company",
      flex: 1.3,
      valueGetter: (_, row) => {
        const company = companies.find((c) => c.id === row.company_id);
        return company ? company.name : "";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => openEditDialog(params.row)}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Employees
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => setBulkOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Bulk CSV Upload
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
            Add Employee
          </Button>
        </Box>
      </Box>

      <Paper sx={{ height: 600 }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[10]} />
      </Paper>

      {/* Bulk CSV Modal */}
      <Dialog open={bulkOpen} onClose={() => setBulkOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Bulk Employee Import (CSV)</DialogTitle>
        <DialogContent dividers>
          {bulkMessage && <Alert severity="success" sx={{ mb: 2 }}>{bulkMessage}</Alert>}
          {bulkError && <Alert severity="error" sx={{ mb: 2 }}>{bulkError}</Alert>}

          <Typography variant="body2" sx={{ mb: 2, color: "#64748B" }}>
            Upload a CSV file containing employee records. Required columns: <code>first_name</code>, <code>work_email</code>.
          </Typography>

          <Button
            variant="text"
            startIcon={<DownloadIcon />}
            onClick={downloadSampleCSV}
            sx={{ mb: 3, textTransform: "none" }}
          >
            Download Sample CSV Template
          </Button>

          <Box sx={{ border: "2px dashed #CBD5E1", p: 4, borderRadius: 3, textAlign: "center" }}>
            <input
              type="file"
              accept=".csv"
              id="csv-input"
              style={{ display: "none" }}
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="csv-input">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                Choose CSV File
              </Button>
            </label>
            {csvFile && (
              <Typography variant="subtitle2" sx={{ mt: 2, color: "#6366F1", fontWeight: 600 }}>
                Selected: {csvFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBulkOpen(false)}>Close</Button>
          <Button
            variant="contained"
            disabled={!csvFile || uploading}
            onClick={handleBulkUpload}
            sx={{ bgcolor: "#6366F1" }}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload & Process"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Employee" : "Add Employee"}</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Employee Code"
            name="employee_code"
            value={form.employee_code}
            onChange={handleChange}
          />

          <TextField
            label="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />

          <TextField
            label="Work Email"
            name="work_email"
            value={form.work_email}
            onChange={handleChange}
          />

          <TextField
            label="Personal Email"
            name="personal_email"
            value={form.personal_email}
            onChange={handleChange}
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <TextField
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
          />

          <TextField
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
          />

          <TextField
            type="date"
            name="joining_date"
            label="Joining Date"
            value={form.joining_date}
            onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            type="date"
            name="date_of_birth"
            label="Date of Birth"
            value={form.date_of_birth}
            onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Profile Image"
            name="profile_image"
            value={form.profile_image}
            onChange={handleChange}
          />

          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select
              name="company_id"
              value={form.company_id}
              label="Company"
              onChange={handleChange}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}