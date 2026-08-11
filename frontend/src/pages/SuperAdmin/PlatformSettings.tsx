import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Switch, FormControlLabel, Alert, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function PlatformSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platform_name: "Corporate Gifting Enterprise",
    support_email: "support@giftingplatform.com",
    auto_approve_orders: false,
    require_company_approval: true,
    currency_symbol: "$",
    max_voucher_days: 90,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Platform Settings & Configurations
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Configure global platform parameters, approval policies, and currency settings.
        </Typography>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 3 }}>Platform settings updated successfully!</Alert>}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <form onSubmit={handleSave}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>General Settings</Typography>
          <TextField
            fullWidth
            label="Platform Name"
            value={settings.platform_name}
            onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Support Email Address"
            type="email"
            value={settings.support_email}
            onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
            sx={{ mb: 2.5 }}
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Policy & Approvals</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.require_company_approval}
                onChange={(e) => setSettings({ ...settings, require_company_approval: e.target.checked })}
              />
            }
            label="Require Company Admin approval for HR Manager campaigns"
            sx={{ mb: 2, display: "block" }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.auto_approve_orders}
                onChange={(e) => setSettings({ ...settings, auto_approve_orders: e.target.checked })}
              />
            }
            label="Auto-approve gift voucher redemptions"
            sx={{ mb: 2, display: "block" }}
          />

          <Divider sx={{ my: 3 }} />

          <Button type="submit" variant="contained" sx={{ bgcolor: "#6366F1", px: 4, py: 1.2, borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
            Save Platform Settings
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
