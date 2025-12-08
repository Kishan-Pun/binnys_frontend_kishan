import React, { useEffect } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Frontend Zod schema (matches backend rules loosely)
const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .max(1000, "Description too long")
    .optional()
    .or(z.literal("")),
  rating: z.coerce
    .number({
      invalid_type_error: "Rating must be a number",
    })
    .min(0, "Rating must be at least 0")
    .max(10, "Rating cannot exceed 10"),
  duration: z.coerce
    .number({
      invalid_type_error: "Duration must be a number",
    })
    .positive("Duration must be positive"),
  releaseDate: z.string().min(1, "Release date is required"),
  posterUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  genres: z.string().optional().or(z.literal("")),
});

const mapInitialToFormValues = (movie) => {
  if (!movie) {
    return {
      title: "",
      description: "",
      rating: "",
      duration: "",
      releaseDate: "",
      posterUrl: "",
      genres: "",
    };
  }

  return {
    title: movie.title || "",
    description: movie.description || "",
    rating: movie.rating ?? "",
    duration: movie.duration ?? "",
    releaseDate: movie.releaseDate
      ? movie.releaseDate.slice(0, 10) // ensure yyyy-mm-dd for <input type="date">
      : "",
    posterUrl: movie.posterUrl || "",
    genres: Array.isArray(movie.genre) ? movie.genre.join(", ") : "",
  };
};

const MovieForm = ({ initialData, onSubmit, submitLabel = "Save" }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: mapInitialToFormValues(initialData),
  });

  // When initialData changes (Edit mode), update form values
  useEffect(() => {
    reset(mapInitialToFormValues(initialData));
  }, [initialData, reset]);

  const handleFormSubmit = async (values) => {
    // Convert genres string -> array
    const genreArray = values.genres
      ? values.genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: values.title,
      description: values.description || undefined,
      rating: Number(values.rating),
      duration: Number(values.duration),
      releaseDate: values.releaseDate,
      posterUrl: values.posterUrl || undefined,
      genre: genreArray,
    };

    await onSubmit(payload);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      <Stack spacing={2.5}>
        <TextField
          label="Title"
          fullWidth
          size="small"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Rating (0 - 10)"
            fullWidth
            size="small"
            type="number"
            inputProps={{ step: "0.1", min: 0, max: 10 }}
            {...register("rating")}
            error={!!errors.rating}
            helperText={errors.rating?.message}
          />

          <TextField
            label="Duration (min)"
            fullWidth
            size="small"
            type="number"
            inputProps={{ step: "0.1", min: 1 }}
            {...register("duration", { valueAsNumber: true })}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => {
              const currentValue = field.value; // string like "2024-12-08" or ""

              return (
                <DatePicker
                  label="Release date"
                  value={currentValue ? new Date(currentValue) : null}
                  onChange={(date) => {
                    if (!date || Number.isNaN(date.getTime())) {
                      field.onChange("");
                    } else {
                      const isoString = date.toISOString().slice(0, 10); // "yyyy-mm-dd"
                      field.onChange(isoString);
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.releaseDate,
                      helperText: errors.releaseDate?.message,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#020617",
                          color: "rgb(226,232,240)",
                        },
                      },
                    },
                  }}
                />
              );
            }}
          />

          <TextField
            label="Poster URL"
            fullWidth
            size="small"
            {...register("posterUrl")}
            error={!!errors.posterUrl}
            helperText={errors.posterUrl?.message}
          />
        </Stack>

        <Box>
          <TextField
            label="Genres (comma separated)"
            fullWidth
            size="small"
            placeholder="e.g. Drama, Thriller, Sci-Fi"
            {...register("genres")}
            error={!!errors.genres}
            helperText={
              errors.genres?.message || "Separate multiple genres with commas."
            }
          />
        </Box>

        <Box sx={{ pt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(56,189,248,0.95))",
              boxShadow: "0 16px 35px rgba(37,99,235,0.8)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(59,130,246,1), rgba(8,145,178,1))",
                boxShadow: "0 18px 40px rgba(37,99,235,1)",
              },
            }}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </Box>

        <Typography variant="caption" sx={{ color: "rgba(148,163,184,0.85)" }}>
          Note: Movie data will be stored via the backend API. Some inserts may
          be processed asynchronously through the queue.
        </Typography>
      </Stack>
    </Box>
  );
};

export default MovieForm;
