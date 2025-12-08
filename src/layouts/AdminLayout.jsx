import React from "react";
import { Container, Box, Typography, Divider } from "@mui/material";
import Navbar from "../components/layout/Navbar.jsx";

const AdminLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #1d4ed8 0, #020617 45%, #020617 100%)"
      }}
    >
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            borderRadius: 4,
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 3, sm: 4 },
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.92))",
            boxShadow: "0 22px 50px rgba(15, 23, 42, 0.9)"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "rgb(248,250,252)"
            }}
          >
            Admin Panel
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(148,163,184,0.9)", mb: 2 }}
          >
            Manage movie records, add new entries, and update existing data.
          </Typography>

          <Divider
            sx={{
              mb: 3,
              borderColor: "rgba(51,65,85,0.8)"
            }}
          />

          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLayout;
