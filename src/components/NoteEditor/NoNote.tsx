import React from "react";
import { Box, Typography } from "@mui/material";
import BigDocIcon from "@/../public/icons/bigDoc.svg";
import Image from "next/image";

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
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",   
      }}>
        <Image src={BigDocIcon} alt="Big Doc Icon"/>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Select a note to view
        </Typography>

        <Typography variant="body2" color="gray" align="center">
          Choose a note from the list on the left to view its contents, <br />
          or create a new note to add to your collection.
        </Typography>
      </Box>
    </Box>
  );
}

export default NoNote;
