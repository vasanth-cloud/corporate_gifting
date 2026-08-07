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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  getGifts,
  createGift,
  updateGift,
  deleteGift,
} from "../../api/gift";

const EMPTY_FORM = {
  name: "",
  description: "",
};

export default function Gifts() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      const data = await getGifts();
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
        await updateGift(selectedId, form);
      } else {
        await createGift(form);
      }

      setOpen(false);
      setEditing(false);
      setSelectedId(null);
      setForm(EMPTY_FORM);
      loadGifts();
    } catch (err) {
      console.log(err);
      alert("Unable to save gift");
    }
  };

  const handleEdit = (row: any) => {
    setEditing(true);
    setSelectedId(row.id);
    setForm({
      name: row.name,
      description: row.description,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this gift?")) return;
    await deleteGift(id);
    loadGifts();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Gift Name",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" height="100%">
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#4C3A8C",
            }}
          >
            <CardGiftcardIcon fontSize="small" />
          </Avatar>
          <Typography sx={{ fontSize: 14 }}>{params.value}</Typography>
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
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Gifts
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
          Add Gift
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
        <DialogTitle>{editing ? "Edit Gift" : "Add Gift"}</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Gift Name"
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
            rows={4}
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