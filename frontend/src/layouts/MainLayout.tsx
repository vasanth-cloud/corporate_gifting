import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";

const drawerWidth = 260;

const menus = [
  {
    section: "MAIN",
    items: [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/",
      },
    ],
  },

  {
    section: "MASTER DATA",
    items: [
      {
        text: "Companies",
        icon: <BusinessIcon />,
        path: "/companies",
      },
      {
        text: "Employees",
        icon: <PeopleIcon />,
        path: "/employees",
      },
      {
        text: "Vendors",
        icon: <StoreIcon />,
        path: "/vendors",
      },
      {
        text: "Gifts Catalog",
        icon: <InventoryIcon />,
        path: "/gifts",
      },
      {
        text: "Categories",
        icon: <CategoryIcon />,
        path: "/categories",
      },
    ],
  },

  {
    section: "OPERATIONS",
    items: [
      {
        text: "Campaigns",
        icon: <CampaignIcon />,
        path: "/campaigns",
      },
      {
        text: "Orders",
        icon: <ShoppingCartIcon />,
        path: "/orders",
      },
      {
        text: "Employee Claim Portal",
        icon: <ConfirmationNumberIcon />,
        path: "/claim-gift",
      },
    ],
  },

  {
    section: "ANALYTICS",
    items: [
      {
        text: "Reports & Export",
        icon: <AssessmentIcon />,
        path: "/reports",
      },
    ],
  },
];

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "A";
  const userName = user?.full_name || "Admin User";
  const userRole = user?.role ? user.role.replace("_", " ") : "SUPER ADMIN";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            borderRight: "1px solid #1E293B",
            boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Toolbar
          sx={{
            py: 3,
            px: 2,
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              }}
            >
              <CardGiftcardIcon />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.3, color: "#F8FAFC" }}>
                GiftCorp
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
                Corporate Gifting
              </Typography>
            </Box>
          </Box>
        </Toolbar>

        <Divider sx={{ borderColor: "#1E293B" }} />

        <Box sx={{ overflowY: "auto", flexGrow: 1, py: 2 }}>
          {menus.map((group) => (
            <Box key={group.section} sx={{ mb: 2 }}>
              <Typography
                sx={{
                  px: 3,
                  pb: 1,
                  fontSize: 10,
                  color: "#64748B",
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {group.section}
              </Typography>

              <List disablePadding>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItemButton
                      key={item.text}
                      component={Link}
                      to={item.path}
                      selected={isActive}
                      sx={{
                        mx: 1.5,
                        mb: 0.5,
                        borderRadius: 2,
                        py: 1,
                        transition: "all 0.2s ease",
                        color: isActive ? "#FFFFFF" : "#94A3B8",
                        bgcolor: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                        borderLeft: isActive ? "4px solid #6366F1" : "4px solid transparent",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.06)",
                          color: "#F8FAFC",
                        },
                        "&.Mui-selected": {
                          bgcolor: "rgba(99, 102, 241, 0.2)",
                          color: "#FFFFFF",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "#818CF8" : "#64748B",
                          minWidth: 38,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.text}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: 13.5,
                              fontWeight: isActive ? 600 : 500,
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* Main Content Container */}
      <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)` }}>
        {/* Top Navbar */}
        <AppBar
          elevation={0}
          position="sticky"
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
            backdropFilter: "blur(8px)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                {menus.flatMap(m => m.items).find(i => i.path === location.pathname)?.text || "Corporate Platform"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton size="medium" onClick={toggleTheme} sx={{ color: "text.secondary" }}>
                  {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              <IconButton size="medium" sx={{ color: "text.secondary" }}>
                <Badge badgeContent={3} color="primary">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>

              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  p: 0.5,
                  px: 1.5,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#6366F1",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {userInitial}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                    {userName}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", textTransform: "capitalize" }}>
                    {userRole}
                  </Typography>
                </Box>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: { mt: 1, borderRadius: 2, minWidth: 160 }
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: "#EF4444" }}>
                  <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "#EF4444" }} /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Body */}
        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}