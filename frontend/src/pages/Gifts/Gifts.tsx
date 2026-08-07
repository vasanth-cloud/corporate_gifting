import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { getGifts, createGift, updateGift, deleteGift } from "../../api/gift";
import { getGiftCategories } from "../../api/giftCategory";
import { uploadFile } from "../../api/upload";

export interface GiftItem {
  id: number;
  name: string;
  sku: string;
  description?: string;
  brand?: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id: number;
  is_active: boolean;
}

export default function Gifts() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formValues, setFormValues] = useState({
    name: "",
    sku: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [giftsRes, catRes] = await Promise.all([
        getGifts().catch(() => []),
        getGiftCategories().catch(() => []),
      ]);
      setGifts(Array.isArray(giftsRes) ? giftsRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch gifts data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (gift?: GiftItem) => {
    if (gift) {
      setEditingGift(gift);
      setFormValues({
        name: gift.name,
        sku: gift.sku,
        description: gift.description || "",
        brand: gift.brand || "",
        price: String(gift.price),
        stock: String(gift.stock),
        image_url: gift.image_url || "",
        category_id: String(gift.category_id),
      });
    } else {
      setEditingGift(null);
      setFormValues({
        name: "",
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        description: "",
        brand: "",
        price: "",
        stock: "10",
        image_url: "",
        category_id: categories.length > 0 ? String(categories[0].id) : "1",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseModal = () => {
    setDialogOpen(false);
    setEditingGift(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadFile("gift", file);
      setFormValues((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: formValues.name,
      sku: formValues.sku,
      description: formValues.description,
      brand: formValues.brand,
      price: parseFloat(formValues.price) || 0,
      stock: parseInt(formValues.stock, 10) || 0,
      image_url: formValues.image_url,
      category_id: parseInt(formValues.category_id, 10) || 1,
    };

    try {
      if (editingGift) {
        await updateGift(editingGift.id, payload);
      } else {
        await createGift(payload);
      }
      handleCloseModal();
      loadData();
    } catch (err: any) {
      console.error(err);
      alert("Error saving gift. Please check backend inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this gift item?")) return;
    try {
      await deleteGift(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete gift.");
    }
  };

  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch =
      gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gift.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gift.brand && gift.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || String(gift.category_id) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Page Title & Main Action Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
            Gifts & Rewards Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Manage your corporate gifting inventory, pricing, and category mapping.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{
            bgcolor: "#6366F1",
            borderRadius: 2.5,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          Add New Gift
        </Button>
      </Box>

      {/* Filter Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", flexGrow: 1 }}>
          <TextField
            placeholder="Search by name, SKU, or brand..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: "100%", sm: 280 } }}
          />

          <TextField
            select
            size="small"
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ width: { xs: "100%", sm: 180 } }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
        >
          <ToggleButton value="grid">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="table">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredGifts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px dashed #CBD5E1" }}>
          <CardGiftcardIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
          <Typography variant="h6" sx={{ color: "#64748B" }}>
            No gift items found
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2 }}>
            Try adjusting your search filters or click "Add New Gift" to add your first product.
          </Typography>
        </Paper>
      ) : viewMode === "grid" ? (
        /* Grid Layout */
        <Grid container spacing={3}>
          {filteredGifts.map((gift) => (
            <Grid key={gift.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  transition: "all 0.2s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                    borderColor: "#CBD5E1",
                  },
                }}
              >
                <Box sx={{ position: "relative", pt: "60%", bgcolor: "#F1F5F9" }}>
                  {gift.image_url ? (
                    <CardMedia
                      component="img"
                      image={
                        gift.image_url.startsWith("http")
                          ? gift.image_url
                          : `http://127.0.0.1:8000${gift.image_url}`
                      }
                      alt={gift.name}
                      sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardGiftcardIcon sx={{ fontSize: 48, color: "#CBD5E1" }} />
                    </Box>
                  )}
                  <Chip
                    label={gift.stock > 0 ? `In Stock (${gift.stock})` : "Out of Stock"}
                    size="small"
                    color={gift.stock > 0 ? "success" : "error"}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
                    SKU: {gift.sku} {gift.brand ? `• ${gift.brand}` : ""}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }} noWrap title={gift.name}>
                    {gift.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", mb: 2, height: 40, overflow: "hidden" }}>
                    {gift.description || "No description provided."}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #F1F5F9" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#6366F1" }}>
                      ${Number(gift.price).toFixed(2)}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit Gift">
                        <IconButton size="small" onClick={() => handleOpenModal(gift)} sx={{ color: "#64748B" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Gift">
                        <IconButton size="small" onClick={() => handleDelete(gift.id)} sx={{ color: "#EF4444" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Table Layout */
        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Gift Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SKU / Brand</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock Level</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGifts.map((gift) => (
                <TableRow key={gift.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: "#F1F5F9",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {gift.image_url ? (
                          <img
                            src={
                              gift.image_url.startsWith("http")
                                ? gift.image_url
                                : `http://127.0.0.1:8000${gift.image_url}`
                            }
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <CardGiftcardIcon sx={{ color: "#94A3B8" }} />
                        )}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#0F172A" }}>{gift.name}</Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>{gift.description?.slice(0, 40)}...</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{gift.sku}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748B" }}>{gift.brand || "—"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: "#6366F1" }}>${Number(gift.price).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${gift.stock} in stock`}
                      size="small"
                      color={gift.stock > 0 ? "success" : "error"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenModal(gift)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(gift.id)} sx={{ color: "#EF4444" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingGift ? "Edit Gift Item" : "Add New Gift Item"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Gift Name"
                  required
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="SKU Code"
                  required
                  value={formValues.sku}
                  onChange={(e) => setFormValues({ ...formValues, sku: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Brand Name"
                  value={formValues.brand}
                  onChange={(e) => setFormValues({ ...formValues, brand: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  required
                  value={formValues.price}
                  onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Stock Inventory"
                  type="number"
                  required
                  value={formValues.stock}
                  onChange={(e) => setFormValues({ ...formValues, stock: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={formValues.category_id}
                  onChange={(e) => setFormValues({ ...formValues, category_id: e.target.value })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Product Image
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={uploadingImage ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    disabled={uploadingImage}
                  >
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Button>
                  <TextField
                    size="small"
                    placeholder="Or enter Image URL"
                    value={formValues.image_url}
                    onChange={(e) => setFormValues({ ...formValues, image_url: e.target.value })}
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseModal} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={saving || uploadingImage} sx={{ bgcolor: "#6366F1" }}>
              {saving ? <CircularProgress size={24} color="inherit" /> : editingGift ? "Save Changes" : "Create Gift"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
