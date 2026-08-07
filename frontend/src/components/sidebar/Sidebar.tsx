import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CategoryIcon from "@mui/icons-material/Category";
import CampaignIcon from "@mui/icons-material/Campaign";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 250;

const menus = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Companies", icon: <BusinessIcon />, path: "/companies" },
  { text: "Employees", icon: <PeopleIcon />, path: "/employees" },
  { text: "Vendors", icon: <LocalShippingIcon />, path: "/vendors" },
  { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
  { text: "Gifts", icon: <CardGiftcardIcon />, path: "/gifts" },
  { text: "Campaigns", icon: <CampaignIcon />, path: "/campaigns" },
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/orders" },
  { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar>
        <h2>🎁 Corporate</h2>
      </Toolbar>

      <List>
        {menus.map((menu) => (
          <ListItemButton
            key={menu.text}
            component={Link}
            to={menu.path}
            selected={location.pathname === menu.path}
          >
            <ListItemIcon>{menu.icon}</ListItemIcon>

            <ListItemText primary={menu.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}