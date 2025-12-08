import React from "react";
import { Container, Box } from "@mui/material";
import Navbar from "../components/layout/Navbar.jsx";

const PublicLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#020617",
      }}
    >
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PublicLayout;
