import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginUser, registerUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let loggedUser = null;
      if (tab === 0) {
        // Login
        const res = await loginUser(email, password);
        loggedUser = await login(res.access_token);
      } else {
        // Register
        await registerUser({
          full_name: fullName,
          email,
          phone,
          password,
        });
        setSuccess("Account registered successfully! Logging you in...");
        const res = await loginUser(email, password);
        loggedUser = await login(res.access_token);
      }

      // Role-Based Panel Redirection
      switch (loggedUser?.role) {
        case "SUPER_ADMIN":
          navigate("/super-admin/dashboard");
          break;
        case "COMPANY_ADMIN":
          navigate("/company/dashboard");
          break;
        case "HR_MANAGER":
          navigate("/hr/dashboard");
          break;
        case "EMPLOYEE":
          navigate("/employee/dashboard");
          break;
        case "VENDOR":
          navigate("/vendor/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const detail = err?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("admin@corporate.com");
    setPassword("admin123");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Blur Spheres */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 4,
          color: "#F8FAFC",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
                boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)",
              }}
            >
              <CardGiftcardIcon sx={{ fontSize: 32, color: "#FFF" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#F8FAFC", letterSpacing: -0.5 }}>
              Corporate Gifting
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Enterprise Rewards & Gifting Portal
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, val) => {
              setTab(val);
              setError("");
              setSuccess("");
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              "& .MuiTab-root": {
                color: "#94A3B8",
                fontWeight: 600,
                textTransform: "none",
                fontSize: 15,
                "&.Mui-selected": { color: "#818CF8" },
              },
              "& .MuiTabs-indicator": { backgroundColor: "#818CF8", height: 3 },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="dense"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon sx={{ color: "#64748B" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={inputStyles}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  margin="dense"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={inputStyles}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="dense"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#64748B" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={inputStyles}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="dense"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#64748B" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#64748B" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={inputStyles}
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tab === 0 ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Quick fill helper for demo */}
          {tab === 0 && (
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 1 }}>
                Demo Admin Autofill:
              </Typography>
              <Chip
                label="Fill Demo Admin Credentials"
                onClick={handleDemoFill}
                size="small"
                clickable
                sx={{
                  bgcolor: "rgba(99,102,241,0.15)",
                  color: "#A5B4FC",
                  border: "1px solid rgba(99,102,241,0.3)",
                  "&:hover": { bgcolor: "rgba(99,102,241,0.25)" },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

const inputStyles = {
  mb: 1.5,
  "& .MuiOutlinedInput-root": {
    color: "#F8FAFC",
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#818CF8",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#94A3B8",
    "&.Mui-focused": {
      color: "#818CF8",
    },
  },
};