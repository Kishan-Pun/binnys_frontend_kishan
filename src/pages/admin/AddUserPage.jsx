import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/users/UserForm.jsx";
import userApi from "../../api/userApi.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const AddUserPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleCreate = async (payload) => {
    try {
      const res = await userApi.createUser(payload);
      showSnackbar(
        res.data?.message || "User created successfully",
        "success"
      );
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Failed to create user";
      showSnackbar(msg, "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        py: 3,
        px: { xs: 0, sm: 1 },
        background: "transparent",
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 3, sm: 4 },
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.92))",
          boxShadow: "0 22px 50px rgba(15, 23, 42, 0.9)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.7,
            color: "rgb(248, 250, 252)",
            mb: 0.5,
          }}
        >
          Create User
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(148, 163, 184, 0.9)", mb: 3 }}
        >
          Create a new user and assign a role.
        </Typography>

        <UserForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => navigate("/admin/users")}
        />
      </Box>
    </Box>
  );
};

export default AddUserPage;
