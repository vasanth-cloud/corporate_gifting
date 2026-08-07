import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Step,
  Stepper,
  StepLabel,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { validateVoucher, claimVoucher } from "../../api/voucher";
import { getGifts } from "../../api/gift";

const steps = ["Enter Claim Code", "Select Reward Gift", "Delivery Details", "Confirmed"];

export default function ClaimGift() {
  const [activeStep, setActiveStep] = useState(0);
  const [code, setCode] = useState("");
  const [voucherData, setVoucherData] = useState<any>(null);
  const [gifts, setGifts] = useState<any[]>([]);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    if (activeStep === 1) {
      loadGifts();
    }
  }, [activeStep]);

  const loadGifts = async () => {
    try {
      const data = await getGifts();
      setGifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await validateVoucher(code);
      setVoucherData(res);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid voucher code.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedGift || !shippingAddress || !phone) {
      setError("Please complete all delivery fields and select a gift.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await claimVoucher({
        code: voucherData.code,
        gift_id: selectedGift.id,
        shipping_address: shippingAddress,
        phone,
      });
      setSuccessResult(res);
      setActiveStep(3);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to claim voucher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          maxWidth: 900,
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.98)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <CardGiftcardIcon sx={{ fontSize: 56, color: "#6366F1", mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A" }}>
            Corporate Reward Redemption
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Enter your employee voucher code to claim your corporate gift reward.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Step 0: Enter Code */}
        {activeStep === 0 && (
          <form onSubmit={handleValidateCode}>
            <Box sx={{ maxWidth: 450, mx: "auto", textAlign: "center" }}>
              <TextField
                fullWidth
                label="Enter 8-Digit Claim Code"
                placeholder="e.g. GC-A1B2C3"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !code}
                sx={{ py: 1.5, bgcolor: "#6366F1", fontWeight: 700 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
              </Button>
            </Box>
          </form>
        )}

        {/* Step 1: Select Gift */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Hello {voucherData?.recipient_name || "Employee"}! Select your gift (Max Value: ${voucherData?.amount}):
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {gifts
                .filter((g) => g.price <= (voucherData?.amount || 0))
                .map((gift) => (
                  <Grid key={gift.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      onClick={() => setSelectedGift(gift)}
                      sx={{
                        border: selectedGift?.id === gift.id ? "3px solid #6366F1" : "1px solid #E2E8F0",
                        borderRadius: 3,
                        cursor: "pointer",
                        boxShadow: selectedGift?.id === gift.id ? "0 8px 20px rgba(99, 102, 241, 0.2)" : "none",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={gift.image_url || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500"}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {gift.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6366F1", fontWeight: 800 }}>
                          ${gift.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Button
              variant="contained"
              fullWidth
              disabled={!selectedGift}
              onClick={() => setActiveStep(2)}
              sx={{ bgcolor: "#6366F1", py: 1.5, fontWeight: 700 }}
            >
              Continue to Shipping
            </Button>
          </Box>
        )}

        {/* Step 2: Shipping Form */}
        {activeStep === 2 && (
          <Box sx={{ maxWidth: 500, mx: "auto" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Enter Shipping Address for "{selectedGift?.name}":
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contact Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleClaim}
              disabled={loading}
              sx={{ bgcolor: "#6366F1", py: 1.5, fontWeight: 700 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm & Dispatch Gift"}
            </Button>
          </Box>
        )}

        {/* Step 3: Success Confirmation */}
        {activeStep === 3 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: "#22C55E", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
              Gift Claimed Successfully!
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748B", mb: 2 }}>
              Order Code: <strong>{successResult?.order_number}</strong>
            </Typography>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "#6366F1", bgcolor: "#EEF2FF", px: 3, py: 1, borderRadius: 3 }}>
              <LocalShippingIcon /> Your gift is being prepared for shipping.
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
