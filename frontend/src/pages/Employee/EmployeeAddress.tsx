import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, TextField, Button, Alert, Grid } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeAddress() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const storageKey = `emp_address_${user?.id || "default"}`;

  const [address, setAddress] = useState({
    full_name: user?.full_name || "Sarah Jenkins",
    phone: "8248161233",
    address_line_1: "100 Innovation Way, Tech Park",
    address_line_2: "Apt 4B",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    country: "India",
  });

  useEffect(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        setAddress(JSON.parse(cached));
      } catch (err) {
        console.error(err);
      }
    }
  }, [storageKey]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(address));
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          My Delivery Shipping Address
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Maintain your private home delivery address for corporate gift shipments.
        </Typography>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 3 }}>Shipping address saved successfully!</Alert>}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Recipient Full Name"
                value={address.full_name}
                onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={address.address_line_1}
                onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 2 (Optional)"
                value={address.address_line_2}
                onChange={(e) => setAddress({ ...address, address_line_2: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Pincode / Postal Code"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "#6366F1", px: 4, py: 1.2, borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}
              >
                Save Delivery Address
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
