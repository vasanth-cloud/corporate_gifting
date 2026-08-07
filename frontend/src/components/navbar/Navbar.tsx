import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        ml: "250px",
        width: "calc(100% - 250px)",
      }}
    >
      <Toolbar>
        <Typography variant="h6">
          Corporate Gifting Platform
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography sx={{ mr: 3 }}>
          {user?.name}
        </Typography>

        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}