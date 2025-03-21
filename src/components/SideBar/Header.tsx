import {
  Box,
  Button,
  IconButton
} from "@mui/material";
import React from "react";
import LogoSVG from "@/../public/icons/logo.svg";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";

function Header() {
  return (
    <Box sx={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
     
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Image src={LogoSVG} alt="Logo" />
        <IconButton>
          <SearchIcon sx={{ color: "gray" }} />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        fullWidth
        
        sx={{
          backgroundColor: "#242424",
          color: "white",
          textTransform: "none",
          fontWeight: "bold",
          marginTop: "12px",
          "&:hover": { backgroundColor: "#333" },
          padding: "10px 26px",
        }}
      >
        + New Note
      </Button>
    </Box>
  );
}

export default Header;
