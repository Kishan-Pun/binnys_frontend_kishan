import React from "react";
import { Box, Pagination, Typography } from "@mui/material";

const PaginationControls = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <Box
      sx={{
        mt: 4,
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2
      }}
    >
      <Typography variant="body2" sx={{ color: "rgba(148, 163, 184, 0.9)" }}>
        Page {page} of {totalPages}
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onChange(value)}
        shape="rounded"
        color="primary"
      />
    </Box>
  );
};

export default PaginationControls;
