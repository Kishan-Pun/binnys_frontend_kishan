import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/users/UserForm.jsx";
import userApi from "../../api/userApi.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await userApi.getUserById(id);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Failed to load user";
      showSnackbar(msg, "error");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      await userApi.updateUser(id, payload);
      showSnackbar("User updated successfully", "success");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Failed to update user";
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
        {loading ? (
          <Skeleton
            variant="rounded"
            height={200}
            sx={{ borderRadius: 3, bgcolor: "rgba(15,23,42,0.9)" }}
          />
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.7,
                color: "rgb(248, 250, 252)",
                mb: 0.5,
              }}
            >
              Edit User
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(148, 163, 184, 0.9)", mb: 3 }}
            >
              Update user details and role.
            </Typography>

            {user && (
              <UserForm
                mode="edit"
                initialData={user}
                onSubmit={handleUpdate}
                onCancel={() => navigate("/admin/users")}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default EditUserPage;
