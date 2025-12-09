import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user;
  const isAdminOrSuperadmin =
    user && (user.role === "admin" || user.role === "superadmin");
  const isSuperadmin = user && user.role === "superadmin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (active) => ({
    textTransform: "none",
    borderRadius: 999,
    px: 2.2,
    py: 0.6,
    fontSize: 14,
    ...(active
      ? {
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(56,189,248,0.9))",
          color: "#0b1120",
          boxShadow: "0 10px 25px rgba(59,130,246,0.5)",
        }
      : {
          color: "rgba(226,232,240,0.9)",
        }),
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(18px)",
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))",
        borderBottom: "1px solid rgba(148,163,184,0.25)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        {/* Left: logo + title */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            mr: 3,
          }}
        >
          <IconButton
            size="small"
            sx={{
              mr: 1,
              background:
                "radial-gradient(circle at 30% 30%, #3b82f6, #1d4ed8)",
              color: "#e5e7eb",
              boxShadow: "0 8px 18px rgba(37,99,235,0.7)",
              "&:hover": {
                boxShadow: "0 10px 25px rgba(37,99,235,0.9)",
              },
            }}
          >
            <MovieIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1, letterSpacing: 0.5 }}
            >
              Binnys Movies
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(148,163,184,0.9)" }}
            >
              IMDb-style MERN App
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right: nav buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          {/* Public */}
          <Button
            component={RouterLink}
            to="/"
            variant={isActive("/") ? "contained" : "text"}
            sx={linkStyle(isActive("/"))}
          >
            Home
          </Button>

          <Button
            component={RouterLink}
            to="/search"
            variant={isActive("/search") ? "contained" : "text"}
            sx={linkStyle(isActive("/search"))}
          >
            Search
          </Button>

          {/* Admin + Superadmin: Movies */}
          {isAdminOrSuperadmin && (
            <Button
              component={RouterLink}
              to="/admin/movies"
              variant={
                isActive("/admin/movies") ? "contained" : "outlined"
              }
              sx={linkStyle(isActive("/admin/movies"))}
            >
              Admin Movies
            </Button>
          )}

          {/* Superadmin only: Users */}
          {isSuperadmin && (
            <Button
              component={RouterLink}
              to="/admin/users"
              variant={
                isActive("/admin/users") ? "contained" : "outlined"
              }
              sx={linkStyle(isActive("/admin/users"))}
            >
              Users
            </Button>
          )}

          {/* Auth buttons */}
          {!isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/login"
              variant={isActive("/login") ? "contained" : "outlined"}
              sx={{
                ...linkStyle(isActive("/login")),
                borderColor: "rgba(148,163,184,0.7)",
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                ...linkStyle(false),
                borderColor: "rgba(248,113,113,0.7)",
                color: "rgba(252,165,165,0.95)",
                "&:hover": {
                  borderColor: "rgba(248,113,113,1)",
                  backgroundColor: "rgba(248,113,113,0.1)",
                },
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
