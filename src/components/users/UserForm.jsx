import React, { useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

const updateUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
});

const mapInitialToFormValues = (user) => {
  if (!user) {
    return {
      name: "",
      email: "",
      role: "user",
      password: "",
    };
  }

  return {
    name: user.name || "",
    email: user.email || "",
    role: user.role === "admin" || user.role === "user" ? user.role : "user",
    password: "",
  };
};

const UserForm = ({ mode = "create", initialData, onSubmit, onCancel }) => {
  const isCreate = mode === "create";
  const schema = isCreate ? createUserSchema : updateUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: mapInitialToFormValues(initialData),
  });

  useEffect(() => {
    reset(mapInitialToFormValues(initialData));
  }, [initialData, reset]);

  const handleFormSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
    };

    if (isCreate) {
      payload.password = values.password;
    } else if (values.password) {
      payload.password = values.password;
    }

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
          label="Name"
          fullWidth
          size="small"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          fullWidth
          size="small"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          select
          label="Role"
          fullWidth
          size="small"
          defaultValue="user"
          {...register("role")}
          error={!!errors.role}
          helperText={errors.role?.message}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>

          {/* If you want to allow creating superadmins too (optional): */}
          {/* <MenuItem value="superadmin">Superadmin</MenuItem> */}
        </TextField>

        {isCreate && (
          <TextField
            label="Password"
            fullWidth
            size="small"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}

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
            {isSubmitting
              ? isCreate
                ? "Creating..."
                : "Saving..."
              : isCreate
              ? "Create User"
              : "Save Changes"}
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

        {isCreate && (
          <Typography
            variant="caption"
            sx={{ color: "rgba(148,163,184,0.85)" }}
          >
            The user will be able to log in using this email and password.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default UserForm;
