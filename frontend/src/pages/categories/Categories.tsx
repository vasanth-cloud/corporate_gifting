import { useEffect, useState } from "react";
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
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  getGiftCategories,
  createGiftCategory,
  updateGiftCategory,
  deleteGiftCategory,
} from "../../api/giftCategory";

const EMPTY_FORM = {
  name: "",
  description: "",
};

export default function Categories() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getGiftCategories();
      setRows(data);
    } catch (err) {
      console.log(err);
    }
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
        await updateGiftCategory(selectedId, form);
      } else {
        await createGiftCategory(form);
      }

      setOpen(false);
      setEditing(false);
      setSelectedId(null);
      setForm(EMPTY_FORM);
      loadCategories();
    } catch (err) {
      console.log(err);
      alert("Unable to save category");
    }
  };

  const handleEdit = (row: any) => {
    setEditing(true);
    setSelectedId(row.id);
    setForm({
      name: row.name,
      description: row.description || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteGiftCategory(id);
    loadCategories();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Category Name",
      flex: 1,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#6366F1",
            }}
          >
            <CategoryIcon fontSize="small" />
          </Avatar>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gift Categories
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
          sx={{ bgcolor: "#6366F1" }}
        >
          Add Category
        </Button>
      </Box>

      <Paper sx={{ height: 600 }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[10]} />
      </Paper>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(false);
          setSelectedId(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
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

          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#6366F1" }}>
            {editing ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}