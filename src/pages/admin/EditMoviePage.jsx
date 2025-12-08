import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MovieForm from "../../components/movies/MovieForm.jsx";
import movieApi from "../../api/movieApi.js";

const EditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const res = await movieApi.getMovieById(id);
      setMovie(res.data);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to load movie");
      navigate("/admin/movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      await movieApi.updateMovie(id, payload);
      alert("Movie updated successfully");
      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update movie");
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "rgb(248,250,252)",
          mb: 0.5
        }}
      >
        Edit movie
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "rgba(148,163,184,0.9)", mb: 2.5 }}
      >
        Update the movie details and save the changes.
      </Typography>

      {loading && (
        <Skeleton
          variant="rounded"
          height={260}
          sx={{ bgcolor: "rgba(15,23,42,0.9)", borderRadius: 3 }}
        />
      )}

      {!loading && movie && (
        <MovieForm
          initialData={movie}
          onSubmit={handleUpdate}
          submitLabel="Update movie"
        />
      )}
    </Box>
  );
};

export default EditMoviePage;
