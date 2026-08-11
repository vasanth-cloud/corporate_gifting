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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ChecklistIcon from "@mui/icons-material/Checklist";

import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";

const drawerWidth = 260;

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

  const userRole = user?.role || "SUPER_ADMIN";
  const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "A";
  const userName = user?.full_name || "Platform User";

  // Exact PRD 5-Panel Tree Structure
  const getMenusByRole = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return [
          {
            section: "SUPER ADMIN PANEL",
            items: [
              { text: "Dashboard", icon: <DashboardIcon />, path: "/super-admin/dashboard" },
              { text: "Companies", icon: <BusinessIcon />, path: "/super-admin/companies" },
              { text: "Users", icon: <PeopleIcon />, path: "/super-admin/users" },
              { text: "Vendors", icon: <StoreIcon />, path: "/super-admin/vendors" },
              { text: "Catalog & Products", icon: <InventoryIcon />, path: "/super-admin/products" },
              { text: "Categories", icon: <CategoryIcon />, path: "/super-admin/categories" },
              { text: "Campaigns", icon: <CampaignIcon />, path: "/super-admin/campaigns" },
              { text: "All Orders", icon: <ShoppingCartIcon />, path: "/super-admin/orders" },
              { text: "Deliveries", icon: <LocalShippingIcon />, path: "/super-admin/deliveries" },
              { text: "Payments", icon: <ReceiptIcon />, path: "/super-admin/payments" },
              { text: "Reports", icon: <AssessmentIcon />, path: "/super-admin/reports" },
              { text: "Audit Logs", icon: <VerifiedUserIcon />, path: "/super-admin/audit-logs" },
              { text: "Platform Settings", icon: <SettingsIcon />, path: "/super-admin/settings" },
            ],
          },
        ];

      case "COMPANY_ADMIN":
        return [
          {
            section: "COMPANY ADMIN PANEL",
            items: [
              { text: "Dashboard", icon: <DashboardIcon />, path: "/company/dashboard" },
              { text: "Company Profile", icon: <BusinessIcon />, path: "/companies" },
              { text: "HR Managers", icon: <PeopleIcon />, path: "/company/hr-managers" },
              { text: "Employees", icon: <PeopleIcon />, path: "/company/employees" },
              { text: "Gift Catalog", icon: <InventoryIcon />, path: "/gifts" },
              { text: "Campaigns", icon: <CampaignIcon />, path: "/company/campaigns" },
              { text: "Recipients", icon: <ChecklistIcon />, path: "/company/recipients" },
              { text: "Budgets", icon: <AccountBalanceWalletIcon />, path: "/company/budgets" },
              { text: "Approvals", icon: <VerifiedUserIcon />, path: "/company/approvals" },
              { text: "Orders", icon: <ShoppingCartIcon />, path: "/company/orders" },
              { text: "Deliveries", icon: <LocalShippingIcon />, path: "/company/deliveries" },
              { text: "Company Reports", icon: <AssessmentIcon />, path: "/company/reports" },
            ],
          },
        ];

      case "HR_MANAGER":
        return [
          {
            section: "HR MANAGER PANEL",
            items: [
              { text: "Dashboard", icon: <DashboardIcon />, path: "/hr/dashboard" },
              { text: "Employees", icon: <PeopleIcon />, path: "/hr/employees" },
              { text: "Campaigns", icon: <CampaignIcon />, path: "/hr/campaigns" },
              { text: "Recipients", icon: <ChecklistIcon />, path: "/hr/recipients" },
              { text: "Addresses", icon: <HomeIcon />, path: "/hr/addresses" },
              { text: "Gift Catalog", icon: <InventoryIcon />, path: "/gifts" },
              { text: "Orders", icon: <ShoppingCartIcon />, path: "/hr/orders" },
              { text: "Deliveries", icon: <LocalShippingIcon />, path: "/hr/deliveries" },
              { text: "HR Reports", icon: <AssessmentIcon />, path: "/reports" },
            ],
          },
        ];

      case "EMPLOYEE":
        return [
          {
            section: "EMPLOYEE PANEL",
            items: [
              { text: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
              { text: "My Gifts", icon: <InventoryIcon />, path: "/employee/gifts" },
              { text: "Gift Selection", icon: <ConfirmationNumberIcon />, path: "/claim-gift" },
              { text: "My Address", icon: <HomeIcon />, path: "/employee/address" },
              { text: "My Orders", icon: <ShoppingCartIcon />, path: "/employee/orders" },
              { text: "Delivery Tracking", icon: <LocalShippingIcon />, path: "/employee/tracking" },
              { text: "My Profile", icon: <AccountCircleIcon />, path: "/employee/profile" },
            ],
          },
        ];

      case "VENDOR":
        return [
          {
            section: "VENDOR PANEL",
            items: [
              { text: "Dashboard", icon: <DashboardIcon />, path: "/vendor/dashboard" },
              { text: "Products", icon: <InventoryIcon />, path: "/vendor/products" },
              { text: "Inventory", icon: <StoreIcon />, path: "/vendor/inventory" },
              { text: "Assigned Orders", icon: <ShoppingCartIcon />, path: "/vendor/orders" },
              { text: "Packaging", icon: <CardGiftcardIcon />, path: "/vendor/packaging" },
              { text: "Shipping", icon: <LocalShippingIcon />, path: "/vendor/shipping" },
              { text: "Delivery Updates", icon: <LocalShippingIcon />, path: "/vendor/deliveries" },
              { text: "Vendor Reports", icon: <AssessmentIcon />, path: "/vendor/reports" },
              { text: "Vendor Profile", icon: <BusinessIcon />, path: "/vendor/profile" },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const menus = getMenusByRole();

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
              <Typography sx={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
                {userRole.replace("_", " ")}
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
                {menus.flatMap(m => m.items).find(i => i.path === location.pathname)?.text || "Enterprise Gifting Platform"}
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
                    {userRole.replace("_", " ")}
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