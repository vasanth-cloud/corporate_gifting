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
import SettingsIcon from "@mui/icons-material/Settings";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { Link, useLocation, Outlet } from "react-router-dom";

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
        text: "Products",
        icon: <InventoryIcon />,
        path: "/products",
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
    ],
  },

  {
    section: "ANALYTICS",
    items: [
      {
        text: "Reports",
        icon: <AssessmentIcon />,
        path: "/reports",
      },
    ],
  },

  {
    section: "SYSTEM",
    items: [
      {
        text: "Settings",
        icon: <SettingsIcon />,
        path: "/settings",
      },
    ],
  },
];

export default function MainLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F7FB" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#1B1730",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        <Toolbar
          sx={{
            py: 3,
            justifyContent: "center",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 65,
                height: 65,
                bgcolor: "#6C63FF",
                mb: 1,
              }}
            >
              <CardGiftcardIcon fontSize="large" />
            </Avatar>

            <Typography
              fontWeight="bold"
              fontSize={20}
            >
              Corporate
            </Typography>

            <Typography
              fontSize={13}
              color="#BFBFD4"
            >
              Gifting Platform
            </Typography>
          </Box>
        </Toolbar>

        <Divider sx={{ bgcolor: "#3D365F" }} />

        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            mt: 2,
          }}
        >
          {menus.map((group) => (
            <Box key={group.section}>
              <Typography
                sx={{
                  px: 3,
                  pt: 2,
                  pb: 1,
                  fontSize: 11,
                  color: "#8F8BAF",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {group.section}
              </Typography>

              <List disablePadding>
                {group.items.map((item) => (
                  <ListItemButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      mx: 1.5,
                      mb: 0.5,
                      borderRadius: 2,

                      "&.Mui-selected": {
                        bgcolor: "#6C63FF",
                      },

                      "&.Mui-selected:hover": {
                        bgcolor: "#6C63FF",
                      },

                      "&:hover": {
                        bgcolor: "#302B52",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "#fff",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: 14,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <AppBar
          elevation={0}
          position="sticky"
          sx={{
            bgcolor: "#fff",
            color: "#222",
            borderBottom: "1px solid #ECECEC",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontSize={22}
              fontWeight={700}
            >
              Corporate Gifting Platform
            </Typography>

            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "#6C63FF",
                }}
              >
                A
              </Avatar>

              <Box ml={2}>
                <Typography fontWeight={600}>
                  Admin
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Super Admin
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box p={4}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}