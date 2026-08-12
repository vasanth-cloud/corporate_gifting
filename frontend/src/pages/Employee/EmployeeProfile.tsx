import { useEffect, useState } from "react";
import { Box, Typography, Paper, Avatar, Grid, Chip, CircularProgress } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [empProfile, setEmpProfile] = useState<any>(null);
  const [companyName, setCompanyName] = useState<string>("SNS iHub");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [empRes, compRes] = await Promise.all([
        api.get("/employees").catch(() => ({ data: [] })),
        api.get("/companies").catch(() => ({ data: [] })),
      ]);

      const employees = Array.isArray(empRes.data) ? empRes.data : [];
      const companies = Array.isArray(compRes.data) ? compRes.data : [];

      const currentEmp = employees.find((e: any) => e.work_email === user?.email) || employees[0];
      if (currentEmp) {
        setEmpProfile(currentEmp);
        const comp = companies.find((c: any) => c.id === currentEmp.company_id);
        if (comp) setCompanyName(comp.name);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const fullName = user?.full_name || (empProfile ? `${empProfile.first_name} ${empProfile.last_name}` : "Employee");
  const designation = empProfile?.designation || "Corporate Employee";
  const email = user?.email || empProfile?.work_email || "N/A";
  const phone = user?.phone || empProfile?.phone || "N/A";
  const empCode = empProfile?.employee_code || "EMP-1001";

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          My Employee Profile
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Your verified corporate employee account details and organization assignment.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: "#6366F1", fontSize: 30, fontWeight: 700 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {fullName}
            </Typography>
            <Chip label={designation} color="primary" size="small" sx={{ mt: 0.5, fontWeight: 600 }} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EmailIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Work Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{email}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PhoneIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Phone Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{phone}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BusinessIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Company Organization</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{companyName}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BadgeIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Employee Code</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{empCode}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
