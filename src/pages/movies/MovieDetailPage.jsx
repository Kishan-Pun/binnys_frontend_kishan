import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Skeleton,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import { useParams } from "react-router-dom";
import movieApi from "../../api/movieApi.js";
import { formatDuration } from "../../utils/formatDuration.js";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await movieApi.getMovieById(id);
      setMovie(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load movie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Skeleton
          variant="rounded"
          height={320}
          sx={{ borderRadius: 4, bgcolor: "rgba(15,23,42,0.9)" }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography sx={{ color: "#fca5a5" }}>{error}</Typography>
      </Box>
    );
  }

  if (!movie) return null;

  const {
    title,
    description,
    rating,
    duration,
    releaseDate,
    posterUrl,
    genre,
    cast,
    crew,
    trailerUrl,
  } = movie;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const formattedReleaseDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

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
        {/* Top hero section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          mb={4}
        >
          {/* Poster */}
          <Box
            sx={{
              width: { xs: "100%", md: 260 },
              flexShrink: 0,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
            }}
          >
            {posterUrl ? (
              <Box
                component="img"
                src={posterUrl}
                alt={title}
                sx={{
                  width: "100%",
                  height: "100%",
                  maxHeight: 380,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.5), rgba(15,23,42,1))",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  p: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "rgba(248,250,252,0.95)" }}
                >
                  {title}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.7,
                color: "rgb(248, 250, 252)",
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
              {year && (
                <Typography sx={{ color: "rgba(148,163,184,0.9)" }}>
                  {year}
                </Typography>
              )}
              {duration && (
                <Typography sx={{ color: "rgba(148,163,184,0.9)" }}>
                  • {formatDuration(duration)}
                </Typography>
              )}
              {formattedReleaseDate && (
                <Typography sx={{ color: "rgba(148,163,184,0.9)" }}>
                  • {formattedReleaseDate}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              {typeof rating === "number" && (
                <Chip
                  icon={<StarIcon sx={{ fontSize: 20 }} />}
                  label={`${rating.toFixed(1)} / 10`}
                  sx={{
                    backgroundColor: "rgba(251,191,36,0.18)",
                    color: "#fde68a",
                    border: "1px solid rgba(251,191,36,0.6)",
                    fontWeight: 600,
                  }}
                />
              )}

              {Array.isArray(genre) &&
                genre.slice(0, 4).map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(15,23,42,0.9)",
                      color: "rgba(226,232,240,0.95)",
                      borderColor: "rgba(148,163,184,0.5)",
                      borderWidth: 1,
                      borderStyle: "solid",
                    }}
                  />
                ))}
            </Stack>

            {description && (
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(226,232,240,0.95)",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            )}

            {trailerUrl && (
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  sx={{
                    borderRadius: "999px",
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(56,189,248,0.95))",
                    boxShadow: "0 16px 35px rgba(37,99,235,0.8)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,1), rgba(8,145,178,1))",
                    },
                  }}
                  component="a"
                  href={trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PlayArrowIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(148,163,184,0.9)" }}
                >
                  Watch trailer
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>

        {/* Cast section */}
        {Array.isArray(cast) && cast.length > 0 && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(248,250,252,0.95)",
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              Cast
            </Typography>
            <Box
              sx={{
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(148,163,184,0.7)",
                  borderRadius: 999,
                },
              }}
            >
              <Stack direction="row" spacing={2}>
                {cast.map((c) => (
                  <Box
                    key={`${c.name}-${c.characterName}`}
                    sx={{
                      minWidth: 140,
                      maxWidth: 160,
                      backgroundColor: "rgba(15,23,42,0.95)",
                      borderRadius: 3,
                      p: 2,
                      boxShadow: "0 12px 30px rgba(15,23,42,0.9)",
                    }}
                  >
                    <Stack
                      spacing={1}
                      alignItems="center"
                      textAlign="center"
                    >
                      <Avatar
                        src={c.imageUrl || undefined}
                        alt={c.name}
                        sx={{
                          width: 72,
                          height: 72,
                          mb: 0.5,
                          bgcolor: "rgba(30,64,175,0.8)",
                        }}
                      >
                        {c.name?.[0] || "?"}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "rgba(248,250,252,0.95)",
                          fontWeight: 600,
                        }}
                      >
                        {c.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(148,163,184,0.9)" }}
                      >
                        as {c.characterName}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Crew section */}
        {Array.isArray(crew) && crew.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(248,250,252,0.95)",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Crew
            </Typography>
            <Stack spacing={0.5}>
              {crew.map((c, idx) => (
                <Typography
                  key={`${c.role}-${c.name}-${idx}`}
                  variant="body2"
                  sx={{ color: "rgba(148,163,184,0.95)" }}
                >
                  <strong>{c.role}:</strong> {c.name}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MovieDetailPage;
