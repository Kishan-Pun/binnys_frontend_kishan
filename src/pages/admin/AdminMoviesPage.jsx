import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Paper,
  Skeleton,
  Button,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import movieApi from "../../api/movieApi.js";
import PaginationControls from "../../components/common/PaginationControls.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchMovies = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await movieApi.getMovies({
        page: pageNumber,
        limit: PAGE_SIZE
      });

      const { movies, page, totalPages } = res.data;

      setMovies(movies || []);
      setPage(page || 1);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEdit = (id) => {
    navigate(`/admin/movies/${id}/edit`);
  };

  const openDeleteDialog = (movie) => {
    setMovieToDelete(movie);
    setConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setConfirmOpen(false);
    setMovieToDelete(null);
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      setDeletingId(movieToDelete._id);
      await movieApi.deleteMovie(movieToDelete._id);

      // Remove from current list without refetch OR refetch
      setMovies((prev) => prev.filter((m) => m._id !== movieToDelete._id));

      // If page becomes empty after delete and not the first page, go back a page
      if (movies.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }

      closeDeleteDialog();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to delete movie");
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  const skeletonRows = Array.from({ length: 5 });

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "rgb(248,250,252)",
              mb: 0.5
            }}
          >
            Movies
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(148,163,184,0.9)" }}
          >
            View, edit, or delete movies from the catalog.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            fontWeight: 600,
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(56,189,248,0.95))",
            boxShadow: "0 14px 30px rgba(37,99,235,0.8)",
            "&:hover": {
              background:
                "linear-gradient(135deg, rgba(59,130,246,1), rgba(8,145,178,1))",
              boxShadow: "0 16px 35px rgba(37,99,235,1)"
            }
          }}
          onClick={() => navigate("/admin/movies/new")}
        >
          Add Movie
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
          backgroundColor: "rgba(15,23,42,0.98)",
          borderRadius: 3,
          boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
          border: "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "rgba(148,163,184,0.9)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottomColor: "rgba(51,65,85,0.9)"
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  color: "rgba(148,163,184,0.9)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottomColor: "rgba(51,65,85,0.9)"
                }}
              >
                Rating
              </TableCell>
              <TableCell
                sx={{
                  color: "rgba(148,163,184,0.9)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottomColor: "rgba(51,65,85,0.9)"
                }}
              >
                Release date
              </TableCell>
              <TableCell
                sx={{
                  color: "rgba(148,163,184,0.9)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottomColor: "rgba(51,65,85,0.9)"
                }}
              >
                Duration
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "rgba(148,163,184,0.9)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  borderBottomColor: "rgba(51,65,85,0.9)"
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? skeletonRows.map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={5}>
                      <Skeleton
                        variant="rounded"
                        height={36}
                        sx={{ bgcolor: "rgba(15,23,42,0.9)" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              : movies.map((movie) => (
                  <TableRow
                    key={movie._id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { borderBottom: 0 }
                    }}
                  >
                    <TableCell
                      sx={{
                        maxWidth: 260,
                        color: "rgb(226,232,240)",
                        fontWeight: 500
                      }}
                    >
                      {movie.title}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(226,232,240,0.9)" }}>
                      {typeof movie.rating === "number"
                        ? movie.rating.toFixed(1)
                        : "-"}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(226,232,240,0.9)" }}>
                      {formatDate(movie.releaseDate)}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(226,232,240,0.9)" }}>
                      {typeof movie.duration === "number"
                        ? `${movie.duration} min`
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(movie._id)}
                            sx={{
                              color: "rgba(59,130,246,0.9)",
                              "&:hover": {
                                backgroundColor: "rgba(37,99,235,0.15)"
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(movie)}
                            sx={{
                              color: "rgba(248,113,113,0.9)",
                              "&:hover": {
                                backgroundColor: "rgba(248,113,113,0.15)"
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

            {!loading && movies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: "rgba(148,163,184,0.9)"
                  }}
                >
                  No movies found. Try adding a new movie.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onChange={handlePageChange}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete movie"
        message={
          movieToDelete
            ? `Are you sure you want to delete "${movieToDelete.title}"? This action cannot be undone.`
            : ""
        }
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={!!deletingId}
      />
    </Box>
  );
};

export default AdminMoviesPage;
