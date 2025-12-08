import React from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          background:
            "radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 55%), rgba(15,23,42,0.96)",
          border: "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.9)"
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: "rgb(248,250,252)"
          }}
        >
          Welcome back
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "rgba(148,163,184,0.9)"
          }}
        >
          Sign in to manage movies or explore the catalog.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 20, color: "rgba(148,163,184,0.9)" }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ fontSize: 20, color: "rgba(148,163,184,0.9)" }} />
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(56,189,248,0.95))",
              boxShadow: "0 16px 35px rgba(37,99,235,0.8)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(59,130,246,1), rgba(8,145,178,1))",
                boxShadow: "0 18px 40px rgba(37,99,235,1)"
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
