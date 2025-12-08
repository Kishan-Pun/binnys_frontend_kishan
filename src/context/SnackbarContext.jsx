import React, {
  createContext,
  useCallback,
  useContext,
  useState
} from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

const SnackbarContext = createContext(null);

const SlideFromRight = (props) => {
  // direction="left" means it ENTERS from the right side
  return <Slide {...props} direction="left" />;
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    message: "",
    severity: "success" // "success" | "error"
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbarState({ message, severity });
    setOpen(true);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const { message, severity } = snackbarState;

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={4500} // 4.5 sec
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideFromRight}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          icon={false}
          sx={{
            minWidth: 260,
            borderRadius: 2,
            boxShadow: "0 12px 30px rgba(15,23,42,0.9)",
            fontWeight: 500,
            letterSpacing: 0.2,
            backgroundColor:
              severity === "success"
                ? "rgb(22,163,74)"       // ✅ green
                : "rgb(37,99,235)",      // ✅ blue
            color: "#e5e7eb"
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return ctx;
};
