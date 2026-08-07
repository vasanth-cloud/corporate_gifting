import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
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
  LinearProgress,
  Paper,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CampaignIcon from "@mui/icons-material/Campaign";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";

import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from "../../api/campaign";
import type { Campaign } from "../../api/campaign";
import { getCompanies } from "../../api/company";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [saving, setSaving] = useState(false);

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    budget: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "DRAFT" as "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED",
    company_id: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [campRes, compRes] = await Promise.all([
        getCampaigns().catch(() => []),
        getCompanies().catch(() => []),
      ]);
      setCampaigns(Array.isArray(campRes) ? campRes : []);
      setCompanies(Array.isArray(compRes) ? compRes : []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (camp?: Campaign) => {
    if (camp) {
      setEditingCampaign(camp);
      setFormValues({
        title: camp.title,
        description: camp.description || "",
        budget: String(camp.budget),
        start_date: String(camp.start_date),
        end_date: String(camp.end_date),
        status: camp.status || "DRAFT",
        company_id: String(camp.company_id),
      });
    } else {
      setEditingCampaign(null);
      setFormValues({
        title: "",
        description: "",
        budget: "5000",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "DRAFT",
        company_id: companies.length > 0 ? String(companies[0].id) : "1",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseModal = () => {
    setDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Campaign = {
      title: formValues.title,
      description: formValues.description,
      budget: parseFloat(formValues.budget) || 0,
      start_date: formValues.start_date,
      end_date: formValues.end_date,
      status: formValues.status,
      company_id: parseInt(formValues.company_id, 10) || 1,
    };

    try {
      if (editingCampaign && editingCampaign.id) {
        await updateCampaign(editingCampaign.id, payload);
      } else {
        await createCampaign(payload);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving campaign.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete campaign.");
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "COMPLETED":
        return "info";
      case "CANCELLED":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
            Gifting Campaigns
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Create and track corporate gifting drives, budget allocation, and duration schedules.
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
          Create Campaign
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #E2E8F0",
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search campaign title..."
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
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: { xs: "100%", sm: 180 } }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </TextField>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredCampaigns.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px dashed #CBD5E1" }}>
          <CampaignIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
          <Typography variant="h6" sx={{ color: "#64748B" }}>
            No gifting campaigns found
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Click "Create Campaign" to launch a new corporate gifting program.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCampaigns.map((camp) => {
            const comp = companies.find((c) => c.id === camp.company_id);
            return (
              <Grid key={camp.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip
                        label={camp.status}
                        size="small"
                        color={getStatusColor(camp.status) as any}
                        sx={{ fontWeight: 700, fontSize: 11 }}
                      />
                      <Box>
                        <IconButton size="small" onClick={() => handleOpenModal(camp)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => camp.id && handleDelete(camp.id)} sx={{ color: "#EF4444" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}>
                      {camp.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#64748B", mb: 2.5, height: 40, overflow: "hidden" }}>
                      {camp.description || "No description provided."}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <BusinessIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                      <Typography sx={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                        {comp ? comp.name : `Company #${camp.company_id}`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <CalendarTodayIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                      <Typography sx={{ fontSize: 13, color: "#475569" }}>
                        {camp.start_date} to {camp.end_date}
                      </Typography>
                    </Box>

                    <Box sx={{ borderTop: "1px solid #F1F5F9", pt: 2, mt: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
                          Budget Allocated
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#6366F1" }}>
                          ${Number(camp.budget).toLocaleString()}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={camp.status === "COMPLETED" ? 100 : camp.status === "ACTIVE" ? 65 : 20}
                        sx={{ mt: 1, borderRadius: 2, height: 6, bgcolor: "#EEF2FF", "& .MuiLinearProgress-bar": { bgcolor: "#6366F1" } }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingCampaign ? "Edit Campaign" : "Create Gifting Campaign"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Campaign Title"
                  required
                  value={formValues.title}
                  onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  select
                  fullWidth
                  label="Target Company"
                  value={formValues.company_id}
                  onChange={(e) => setFormValues({ ...formValues, company_id: e.target.value })}
                >
                  {companies.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Budget ($)"
                  type="number"
                  required
                  value={formValues.budget}
                  onChange={(e) => setFormValues({ ...formValues, budget: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formValues.status}
                  onChange={(e) => setFormValues({ ...formValues, status: e.target.value as any })}
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formValues.start_date}
                  onChange={(e) => setFormValues({ ...formValues, start_date: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formValues.end_date}
                  onChange={(e) => setFormValues({ ...formValues, end_date: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Campaign Description"
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseModal} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={saving} sx={{ bgcolor: "#6366F1" }}>
              {saving ? <CircularProgress size={24} color="inherit" /> : editingCampaign ? "Update Campaign" : "Save Campaign"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
