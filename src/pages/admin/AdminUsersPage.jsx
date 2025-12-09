import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Stack,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext.jsx";
import userApi from "../../api/userApi.js";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userApi.getUsers();
      setUsers(res.data?.users || res.data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!userToDelete) return;
    try {
      setDeletingId(userToDelete._id);
      await userApi.deleteUser(userToDelete._id);

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));

      showSnackbar(
        `User "${
          userToDelete.name || userToDelete.email
        }" deleted successfully`,
        "success"
      );
      closeDeleteDialog();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to delete user";
      showSnackbar(msg, "error");
      setDeletingId(null);
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.7,
                color: "rgb(248, 250, 252)",
                mb: 0.5,
              }}
            >
              Users
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(148, 163, 184, 0.9)" }}
            >
              Manage application users and their roles. Only superadmins can
              access this page.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/admin/users/new")}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(56,189,248,0.95))",
              boxShadow: "0 16px 30px rgba(37,99,235,0.8)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(59,130,246,1), rgba(8,145,178,1))",
                boxShadow: "0 18px 35px rgba(37,99,235,1)",
              },
            }}
          >
            Create User
          </Button>
        </Stack>
        {error && (
          <Typography variant="body2" sx={{ color: "#fca5a5", mb: 2 }}>
            {error}
          </Typography>
        )}

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "rgba(15,23,42,0.92)",
            borderRadius: 3,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "rgba(148,163,184,0.9)" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "rgba(148,163,184,0.9)" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "rgba(148,163,184,0.9)" }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "rgba(148,163,184,0.9)" }}>
                  Created
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "rgba(148,163,184,0.9)" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={5}>
                        <Skeleton
                          variant="rectangular"
                          height={36}
                          sx={{ bgcolor: "rgba(15,23,42,0.9)" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell sx={{ color: "rgba(226,232,240,0.95)" }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(226,232,240,0.8)" }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            backgroundColor:
                              user.role === "superadmin"
                                ? "rgba(96,165,250,0.2)"
                                : user.role === "admin"
                                ? "rgba(52,211,153,0.2)"
                                : "rgba(148,163,184,0.2)",
                            color:
                              user.role === "superadmin"
                                ? "rgb(129, 199, 255)"
                                : user.role === "admin"
                                ? "rgb(52,211,153)"
                                : "rgba(226,232,240,0.9)",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "rgba(148,163,184,0.9)" }}>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          sx={{ color: "rgba(148,163,184,0.9)" }}
                          onClick={() =>
                            navigate(`/admin/users/${user._id}/edit`)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#f97373" }}
                          disabled={user.role === "superadmin"}
                          onClick={() => openDeleteDialog(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

              {!loading && users.length === 0 && !error && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ color: "rgba(148,163,184,0.9)", py: 3 }}
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Delete user</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete?.name || userToDelete?.email || "this user"}
              </strong>
              ? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button
              color="error"
              onClick={handleDeleteConfirmed}
              disabled={!!deletingId}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminUsersPage;
