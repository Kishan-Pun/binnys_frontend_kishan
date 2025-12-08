import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#020617",
      paper: "rgba(15,23,42,0.96)"
    },
    primary: {
      main: "#3b82f6"
    },
    secondary: {
      main: "#f97316"
    },
    text: {
      primary: "#e5e7eb",
      secondary: "rgba(148,163,184,0.9)"
    }
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif"
    ].join(","),
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 18
  }
});

export default theme;
