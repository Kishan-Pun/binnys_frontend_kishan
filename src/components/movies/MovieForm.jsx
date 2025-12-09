import React, { useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";

const castMemberSchema = z.object({
  name: z.string().min(1, "Actor name is required"),
  characterName: z.string().min(1, "Character name is required"),
  imageUrl: z
    .string()
    .url("Actor image URL must be a valid URL")
    .optional()
    .or(z.literal("")),
});

const crewMemberSchema = z.object({
  role: z.string().min(1, "Crew role is required"),
  name: z.string().min(1, "Crew name is required"),
});

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .max(1000, "Description too long")
    .optional()
    .or(z.literal("")),
  rating: z
    .coerce
    .number({
      invalid_type_error: "Rating must be a number",
    })
    .min(0, "Rating must be at least 0")
    .max(10, "Rating cannot exceed 10"),
  duration: z
    .coerce
    .number({
      invalid_type_error: "Duration must be a number",
    })
    .positive("Duration must be positive"),
  releaseDate: z.string().min(1, "Release date is required"),
  posterUrl: z
    .string()
    .url("Poster URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  genres: z.string().optional().or(z.literal("")),

  // ✅ new fields
  cast: z.array(castMemberSchema).optional(),
  crew: z.array(crewMemberSchema).optional(),
  trailerUrl: z
    .string()
    .url("Trailer URL must be a valid URL")
    .optional()
    .or(z.literal("")),
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
      cast: [],
      crew: [],
      trailerUrl: "",
    };
  }

  return {
    title: movie.title || "",
    description: movie.description || "",
    rating: movie.rating ?? "",
    duration: movie.duration ?? "",
    releaseDate: movie.releaseDate
      ? movie.releaseDate.slice(0, 10) 
      : "",
    posterUrl: movie.posterUrl || "",
    genres: Array.isArray(movie.genre)
      ? movie.genre.join(", ")
      : "",

    cast: Array.isArray(movie.cast)
      ? movie.cast.map((c) => ({
          name: c.name || "",
          characterName: c.characterName || "",
          imageUrl: c.imageUrl || "",
        }))
      : [],

    crew: Array.isArray(movie.crew)
      ? movie.crew.map((c) => ({
          role: c.role || "",
          name: c.name || "",
        }))
      : [],

    trailerUrl: movie.trailerUrl || "",
  };
};

const MovieForm = ({ initialData, onSubmit, onCancel, submitLabel = "Save" }) => {
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

  const {
    fields: castFields,
    append: appendCast,
    remove: removeCast,
  } = useFieldArray({
    control,
    name: "cast",
  });

  const {
    fields: crewFields,
    append: appendCrew,
    remove: removeCrew,
  } = useFieldArray({
    control,
    name: "crew",
  });

  // Reset when initialData changes (for edit mode)
  useEffect(() => {
    reset(mapInitialToFormValues(initialData));
  }, [initialData, reset]);

  const handleFormSubmit = async (values) => {
    const genreArray = values.genres
      ? values.genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : [];

    const castPayload = Array.isArray(values.cast)
      ? values.cast
          .filter((c) => c.name || c.characterName || c.imageUrl)
          .map((c) => ({
            name: c.name,
            characterName: c.characterName,
            imageUrl: c.imageUrl || undefined,
          }))
      : [];

    const crewPayload = Array.isArray(values.crew)
      ? values.crew.filter((c) => c.role || c.name)
      : [];

    const payload = {
      title: values.title,
      description: values.description || undefined,
      rating: Number(values.rating),
      duration: Number(values.duration),
      releaseDate: values.releaseDate,
      posterUrl: values.posterUrl || undefined,
      genre: genreArray,
      cast: castPayload.length ? castPayload : undefined,
      crew: crewPayload.length ? crewPayload : undefined,
      trailerUrl: values.trailerUrl || undefined,
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
        {/* Basic info */}
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
            label="Duration (minutes)"
            fullWidth
            size="small"
            type="number"
            inputProps={{ step: "0.1", min: 0 }}
            {...register("duration")}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />
        </Stack>

        {/* Release date + Poster URL */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Release date"
                views={["year", "month", "day"]}
                openTo="year"
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (!date || Number.isNaN(date.getTime())) {
                    field.onChange("");
                  } else {
                    const isoString = date.toISOString().slice(0, 10);
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
            )}
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

        {/* Genres */}
        <Box>
          <TextField
            label="Genres (comma separated)"
            fullWidth
            size="small"
            placeholder="e.g. Drama, Thriller, Sci-Fi"
            {...register("genres")}
            error={!!errors.genres}
            helperText={
              errors.genres?.message ||
              "Separate multiple genres with commas."
            }
          />
        </Box>

        {/* Trailer URL */}
        <Box>
          <TextField
            label="Trailer URL (YouTube etc.)"
            fullWidth
            size="small"
            {...register("trailerUrl")}
            error={!!errors.trailerUrl}
            helperText={errors.trailerUrl?.message}
          />
        </Box>

        <Divider sx={{ borderColor: "rgba(148,163,184,0.4)" }} />

        {/* Cast section */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(226,232,240,0.95)", fontWeight: 600 }}
            >
              Cast
            </Typography>
            <Button
              type="button"
              size="small"
              onClick={() =>
                appendCast({ name: "", characterName: "", imageUrl: "" })
              }
              sx={{ textTransform: "none", borderRadius: 999 }}
              variant="outlined"
            >
              Add cast member
            </Button>
          </Stack>

          {castFields.length === 0 && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(148,163,184,0.9)" }}
            >
              No cast added yet. Click &quot;Add cast member&quot; to add
              actors.
            </Typography>
          )}

          <Stack spacing={1.5} mt={1}>
            {castFields.map((field, index) => (
              <Stack
                key={field.id}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems="flex-start"
              >
                <TextField
                  label="Actor name"
                  size="small"
                  fullWidth
                  {...register(`cast.${index}.name`)}
                  error={!!errors.cast?.[index]?.name}
                  helperText={errors.cast?.[index]?.name?.message}
                />
                <TextField
                  label="Character name"
                  size="small"
                  fullWidth
                  {...register(`cast.${index}.characterName`)}
                  error={!!errors.cast?.[index]?.characterName}
                  helperText={
                    errors.cast?.[index]?.characterName?.message
                  }
                />
                <TextField
                  label="Image URL"
                  size="small"
                  fullWidth
                  {...register(`cast.${index}.imageUrl`)}
                  error={!!errors.cast?.[index]?.imageUrl}
                  helperText={errors.cast?.[index]?.imageUrl?.message}
                />
                <IconButton
                  type="button"
                  onClick={() => removeCast(index)}
                  sx={{ mt: { xs: 0, sm: 0.5 } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(148,163,184,0.4)" }} />

        {/* Crew section */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(226,232,240,0.95)", fontWeight: 600 }}
            >
              Crew
            </Typography>
            <Button
              type="button"
              size="small"
              onClick={() => appendCrew({ role: "", name: "" })}
              sx={{ textTransform: "none", borderRadius: 999 }}
              variant="outlined"
            >
              Add crew member
            </Button>
          </Stack>

          {crewFields.length === 0 && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(148,163,184,0.9)" }}
            >
              No crew added yet. Add director/writer etc.
            </Typography>
          )}

          <Stack spacing={1.5} mt={1}>
            {crewFields.map((field, index) => (
              <Stack
                key={field.id}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems="flex-start"
              >
                <TextField
                  label="Role (e.g. Director)"
                  size="small"
                  fullWidth
                  {...register(`crew.${index}.role`)}
                  error={!!errors.crew?.[index]?.role}
                  helperText={errors.crew?.[index]?.role?.message}
                />
                <TextField
                  label="Name"
                  size="small"
                  fullWidth
                  {...register(`crew.${index}.name`)}
                  error={!!errors.crew?.[index]?.name}
                  helperText={errors.crew?.[index]?.name?.message}
                />
                <IconButton
                  type="button"
                  onClick={() => removeCrew(index)}
                  sx={{ mt: { xs: 0, sm: 0.5 } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Buttons */}
        <Box sx={{ pt: 1, display: "flex", gap: 2 }}>
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

          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              color: "rgba(148,163,184,1)",
              borderColor: "rgba(148,163,184,0.6)",
              "&:hover": {
                borderColor: "rgba(148,163,184,1)",
                backgroundColor: "rgba(148,163,184,0.08)",
              },
            }}
          >
            Cancel
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "rgba(148,163,184,0.85)" }}
        >
          Note: Movie data may be processed asynchronously through the queue on
          the backend.
        </Typography>
      </Stack>
    </Box>
  );
};

export default MovieForm;
