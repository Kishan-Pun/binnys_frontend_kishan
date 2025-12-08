import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MovieForm from "../../components/movies/MovieForm.jsx";
import movieApi from "../../api/movieApi.js";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

const AddMoviePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleCreate = async (payload) => {
    try {
      const res = await movieApi.createMovie(payload);

      showSnackbar(
        res.data?.message || "Movie created (queued for processing).",
        "success"
      );

      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to create movie";
      showSnackbar(msg, "error");
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "rgb(248,250,252)",
          mb: 0.5,
        }}
      >
        Add new movie
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "rgba(148,163,184,0.9)", mb: 2.5 }}
      >
        Fill in the details below to add a new movie to the catalog.
      </Typography>

      <MovieForm
        initialData={null}
        onSubmit={handleCreate}
        submitLabel="Create movie"
        onCancel={() => navigate("/admin/movies")}
      />
    </Box>
  );
};

export default AddMoviePage;
