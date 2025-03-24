import React from "react";
import { Box, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

function NoNote() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "900px",
        color: "white",
        paddingX: "50px",
        paddingY: "16px",
        height: "100vh",
      }}
    >
      <DescriptionOutlinedIcon sx={{ fontSize: 60, mb: 2, color: "gray" }} />

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Select a note to view
      </Typography>

      <Typography variant="body2" color="gray">
        Choose a note from the list on the left to view its contents, <br />
        or create a new note to add to your collection.
      </Typography>
    </Box>
  );
}

export default NoNote;
