import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Box
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MovieCard = ({ movie }) => {
  const {
    title,
    description,
    rating,
    releaseDate,
    duration,
    genre,
    posterUrl
  } = movie;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.35)",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,64,175,0.95))",
        color: "white",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.7)"
        }
      }}
    >
      <CardActionArea sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}>
        {posterUrl && (
          <CardMedia
            component="img"
            image={posterUrl}
            alt={title}
            sx={{
              height: 260,
              objectFit: "cover",
              filter: "brightness(0.9)",
              borderBottom: "1px solid rgba(148, 163, 184, 0.3)"
            }}
          />
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} mb={1}>
            <Box sx={{ mr: 1 }}>
              <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: 700, letterSpacing: 0.3 }}
                title={title}
              >
                {title}
              </Typography>
              {year && (
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(148, 163, 184, 0.9)", mt: 0.2 }}
                >
                  {year}
                  {duration ? ` • ${duration} min` : ""}
                </Typography>
              )}
            </Box>

            {typeof rating === "number" && (
              <Chip
                icon={<StarIcon sx={{ fontSize: 18 }} />}
                label={rating.toFixed(1)}
                size="small"
                sx={{
                  backgroundColor: "rgba(251, 191, 36, 0.18)",
                  color: "#fde68a",
                  border: "1px solid rgba(251, 191, 36, 0.6)",
                  fontWeight: 600
                }}
              />
            )}
          </Stack>

          {description && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(226, 232, 240, 0.9)",
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {description}
            </Typography>
          )}

          {Array.isArray(genre) && genre.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {genre.slice(0, 3).map((g) => (
                <Chip
                  key={g}
                  label={g}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                    color: "rgba(226, 232, 240, 0.95)",
                    borderColor: "rgba(148, 163, 184, 0.5)",
                    borderWidth: 1,
                    borderStyle: "solid"
                  }}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
