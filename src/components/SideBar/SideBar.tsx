import { Box, Typography } from "@mui/material";
import React from "react";
import Header from "./Header";
import FoldersList from "./FoldersList";
import RecentsList from "./RecentsList";
import MoreSection from "./MoreSection";

function SideBar() {

  return (
    <Box
      sx={{
        backgroundColor: "#181818",
        color: "white",
        width: "320px",
        height: "100vh",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Header />
      <Typography
        variant="subtitle2"
        sx={{ padding: "0px 16px", color: "white", marginTop: "20px" }}
      >
        Recents
      </Typography>
      <RecentsList />
      <Typography
        variant="subtitle2"
        sx={{ padding: "0px 16px", marginTop: "20px", color: "white" }}
      >
        Folders
      </Typography>
      <FoldersList />
      <MoreSection />
    </Box>
  );
}

export default SideBar;
