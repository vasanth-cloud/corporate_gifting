import { AuthProvider } from "./context/AuthContext";
import { CustomThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <AppRoutes />
      </CustomThemeProvider>
    </AuthProvider>
  );
}