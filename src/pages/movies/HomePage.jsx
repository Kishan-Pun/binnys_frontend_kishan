import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Skeleton,
} from "@mui/material";
import MovieCard from "../../components/movies/MovieCard.jsx";
import PaginationControls from "../../components/common/PaginationControls.jsx";
import movieApi from "../../api/movieApi.js";

const PAGE_SIZE = 12;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);

  const fetchMovies = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await movieApi.getMovies({
        page: pageNumber,
        limit: PAGE_SIZE,
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

  const sortedMovies = useMemo(() => {
    if (!movies) return [];
    if (sortBy === "default") return movies;

    const copy = [...movies];

    copy.sort((a, b) => {
      let av, bv;

      switch (sortBy) {
        case "title":
          av = a.title || "";
          bv = b.title || "";
          return sortOrder === "asc"
            ? av.localeCompare(bv)
            : bv.localeCompare(av);

        case "rating":
          av = typeof a.rating === "number" ? a.rating : 0;
          bv = typeof b.rating === "number" ? b.rating : 0;
          return sortOrder === "asc" ? av - bv : bv - av;

        case "releaseDate":
          av = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          bv = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return sortOrder === "asc" ? av - bv : bv - av;

        case "duration":
          av = typeof a.duration === "number" ? a.duration : 0;
          bv = typeof b.duration === "number" ? b.duration : 0;
          return sortOrder === "asc" ? av - bv : bv - av;

        default:
          return 0;
      }
    });

    return copy;
  }, [movies, sortBy, sortOrder]);

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
              Top Movies
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(148, 163, 184, 0.9)" }}
            >
              Browse movies with ratings, year, and duration. Use sorting and
              pagination to explore the collection.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <FormControl
              size="small"
              fullWidth
              sx={{
                minWidth: { sm: 170 },
                backgroundColor: "#020617",
                borderRadius: 2,
              }}
            >
              <InputLabel
                id="sort-by-label"
                sx={{ color: "rgba(148,163,184,0.9)" }}
              >
                Sort by
              </InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: "rgb(226,232,240)",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.6)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.9)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(148,163,184,0.9)",
                  },
                }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="releaseDate">Release date</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                backgroundColor: "#020617",
                borderRadius: 2,
              }}
            >
              <InputLabel
                id="order-label"
                sx={{ color: "rgba(148,163,184,0.9)" }}
              >
                Order
              </InputLabel>
              <Select
                labelId="order-label"
                value={sortOrder}
                label="Order"
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{
                  color: "rgb(226,232,240)",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.6)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.9)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(148,163,184,0.9)",
                  },
                }}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {error && (
          <Typography variant="body2" sx={{ color: "#fca5a5", mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Skeleton
                    variant="rounded"
                    height={320}
                    sx={{ borderRadius: 3, bgcolor: "rgba(15,23,42,0.9)" }}
                  />
                </Grid>
              ))
            : sortedMovies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
        </Grid>

        <PaginationControls
          page={page}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
