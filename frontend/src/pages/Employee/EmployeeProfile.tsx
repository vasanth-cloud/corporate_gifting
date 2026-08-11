import React from "react";
import { Box, Typography, Paper, Avatar, Grid, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeProfile() {
  const { user } = useAuth();

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
            {(user?.full_name || "S").charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {user?.full_name || "Sarah Jenkins"}
            </Typography>
            <Chip label="Senior Software Engineer" color="primary" size="small" sx={{ mt: 0.5, fontWeight: 600 }} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EmailIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Work Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.email || "sarah.jenkins@acmetech.com"}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PhoneIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Phone Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.phone || "+1-555-0188"}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BusinessIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Company Organization</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Acme Technology Corp</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BadgeIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Employee ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>EMP-1001</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
