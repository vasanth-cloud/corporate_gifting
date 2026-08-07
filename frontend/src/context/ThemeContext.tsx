import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem("theme_mode") as ThemeMode) || "light"
  );

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme_mode", next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#6366F1" },
          secondary: { main: "#8B5CF6" },
          background: {
            default: mode === "dark" ? "#0F172A" : "#F8FAFC",
            paper: mode === "dark" ? "#1E293B" : "#FFFFFF",
          },
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => useContext(ThemeContext);
