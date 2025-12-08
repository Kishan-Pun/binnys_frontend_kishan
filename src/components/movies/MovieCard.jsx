import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const CARD_HEIGHT = 420; // ✅ SAME HEIGHT FOR ALL CARDS
const IMAGE_HEIGHT = 240; // ✅ SAME IMAGE HEIGHT

const MovieCard = ({ movie }) => {
  const {
    title,
    description,
    rating,
    releaseDate,
    duration,
    genre,
    posterUrl,
  } = movie;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <Card
      sx={{
        height: CARD_HEIGHT, // ✅ HARD LOCK
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.35)",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,64,175,0.95))",
        color: "white",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.7)",
        },
      }}
    >
      <CardActionArea
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ✅ FIXED IMAGE HEIGHT */}
        <Box
          sx={{
            height: IMAGE_HEIGHT,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {posterUrl ? (
            <CardMedia
              component="img"
              image={posterUrl}
              alt={title}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                background:
                  "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.4), rgba(15,23,42,1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {title}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ✅ FIXED CONTENT AREA */}
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          {/* TITLE + META */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
              mb={1}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {title}
                </Typography>

                {year && (
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(148,163,184,0.9)" }}
                  >
                    {year} • {duration || "-"} min
                  </Typography>
                )}
              </Box>

              {typeof rating === "number" && (
                <Chip
                  icon={<StarIcon sx={{ fontSize: 18 }} />}
                  label={rating.toFixed(1)}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(251,191,36,0.18)",
                    color: "#fde68a",
                    border: "1px solid rgba(251,191,36,0.6)",
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>

            {/* ✅ FIXED DESCRIPTION HEIGHT */}
            <Typography
              variant="body2"
              sx={{
                color: "rgba(226,232,240,0.9)",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 54,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {description || "No description available."}
            </Typography>
          </Box>

          {/* ✅ FIXED GENRE SPACE */}
          <Box sx={{ minHeight: 30 }}>
            {Array.isArray(genre) && genre.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {genre.slice(0, 3).map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(15,23,42,0.8)",
                      color: "rgba(226,232,240,0.95)",
                      border: "1px solid rgba(148,163,184,0.5)",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
