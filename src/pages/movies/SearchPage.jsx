import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ use same Grid as HomePage
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MovieCard from "../../components/movies/MovieCard.jsx";
import PaginationControls from "../../components/common/PaginationControls.jsx";
import movieApi from "../../api/movieApi.js";

const PAGE_SIZE = 12;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (q, pageNumber = 1) => {
    if (!q.trim()) {
      setMovies([]);
      setTotalPages(1);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await movieApi.searchMovies({
        q,
        page: pageNumber,
        limit: PAGE_SIZE,
      });

      const { movies, page, totalPages } = res.data;

      setMovies(movies || []);
      setPage(page || 1);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submittedQuery) {
      fetchSearchResults(submittedQuery, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    setSubmittedQuery(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    setSubmittedQuery("");
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setError(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
        {/* Header + Search bar */}
        <Stack spacing={2} mb={3}>
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
              Search Movies
            </Typography>
            {/* <Typography
              variant="body2"
              sx={{ color: "rgba(148, 163, 184, 0.9)" }}
            >
              Search by title or description. Results are fetched from the
              backend with pagination.
            </Typography> */}
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", maxWidth: 520 }}
          >
            <TextField
              fullWidth
              placeholder="Search by movie title or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "#020617",
                  color: "rgb(226,232,240)",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.6)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.9)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(148,163,184,0.9)" }} />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      sx={{ color: "rgba(148,163,184,0.9)" }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>
        </Stack>

        {error && (
          <Typography variant="body2" sx={{ color: "#fca5a5", mb: 2 }}>
            {error}
          </Typography>
        )}

        {!submittedQuery && !loading && (
          <Typography
            variant="body2"
            sx={{ color: "rgba(148,163,184,0.9)", mb: 3 }}
          >
            Start by typing a movie name (e.g. &quot;Inception&quot;,
            &quot;Godfather&quot;) and press Enter to search.
          </Typography>
        )}

        {/* ✅ Same Grid pattern as HomePage */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <Grid
                  key={idx}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <Skeleton
                    variant="rounded"
                    height={320}
                    sx={{ borderRadius: 3, bgcolor: "rgba(15,23,42,0.9)" }}
                  />
                </Grid>
              ))
            : movies.map((movie) => (
                <Grid
                  key={movie._id}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  sx={{ display: "flex" }} // stretch card like HomePage
                >
                  <MovieCard movie={movie} />
                </Grid>
              ))}
        </Grid>

        {submittedQuery && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
