import React from "react";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function VendorProfile() {
  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Vendor Merchant Profile
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Supplier company registration, GST tax credentials, and fulfillment contact info.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <StoreIcon sx={{ fontSize: 44, color: "#6366F1" }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Global Tech Supplies Inc</Typography>
            <Chip label="Verified Supplier Partner" color="success" size="small" sx={{ mt: 0.5, fontWeight: 600 }} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EmailIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Vendor Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>vendor@globalsupplies.com</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PhoneIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Contact Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>+1-555-0199</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ReceiptIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>GST Identification #</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>27AAACG9900K1Z9</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PlaceIcon sx={{ color: "#6366F1" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Fulfillment Warehouse</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Warehouse #4, Silicon Logistics Park</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
